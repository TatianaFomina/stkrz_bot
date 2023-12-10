import TelegramBot from 'node-telegram-bot-api';
import { nanoid } from 'nanoid';
import { MessengerBot, SingleStickerParams, StickersetParams } from './types/messenger-bot';
import { __, setLocale } from './i18n/index.js';
import { ERROR_MESSAGE_FORBIDDEN, ERROR_QUERY } from '../../common/const.js';

/**
 * Telegram messenger bot
 */
export class Bot implements MessengerBot {
  /**
   * Telegram bot instance
   */
  private readonly telegramBot: TelegramBot;

  /**
   * URL where web app is hosted
   */
  private readonly webAppUrl = process.env.WEB_APP_URL || '';

  /**
   * Telegram API access token
   */
  private readonly token = process.env.TG_API_TOKEN || '';

  /**
   * True if bot is running in test environment
   */
  private readonly isTest = process.env.DEV === 'true';

  /**
   * Constructs the instance
   */
  constructor() {
    /* Create a bot that uses 'polling' to fetch new updates */
    this.telegramBot = new TelegramBot(this.token, {
      polling: true,
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      /* @ts-ignore */
      testEnvironment: this.isTest,
    });

    /* Handle text message */
    this.telegramBot.onText(/.*/, this.handleTextMessage.bind(this));

    /* Handle inline mode queries */
    this.telegramBot.on('inline_query', this.handleInlineQuery.bind(this));
  }

  /**
   * Creates stickerset with specified params
   *
   * @param params - stickerset params
   */
  public async createStickerset(params: StickersetParams): Promise<void> {
    const botName = process.env.BOT_NAME || '';
    const actualName = params.name + `_by_${botName}`;
    const actualTitle = params.title + ` :: @${botName}`;
    const initialSticker = params.stickers[0];

    const isCreated = await this.telegramBot.createNewStickerSet(params.userId, actualName, actualTitle, initialSticker.image, initialSticker.emojis);

    if (!isCreated) {
      throw new Error('Error creating a stickerset');
    }

    if (params.stickers.length > 1) {
      for (let i = 1; i < params.stickers.length; i++) {
        const sticker = params.stickers[i];

        await this.telegramBot.addStickerToSet(params.userId, actualName, sticker.image, sticker.emojis, 'png_sticker');
      }
    }

    const stickerset = await this.telegramBot.getStickerSet(actualName);

    const firstStickerId = stickerset.stickers[0].file_id;

    this.telegramBot.answerWebAppQuery(params.queryId, {
      type: 'sticker',
      sticker_file_id: firstStickerId,
      id: nanoid(),
    });
  }

  /**
   * Returns true if stickerset with specified name exists.
   * Otherwise returns false
   *
   * @param name - stickerset short name
   */
  public async checkStickersetExists(name: string): Promise<boolean> {
    try {
      const botName = process.env.BOT_NAME || '';
      const actualName = name + `_by_${botName}`;

      const stickerset = await this.telegramBot.getStickerSet(actualName);

      return stickerset !== undefined;
    } catch (e) {
      return false;
    }
  }

  /**
   * Creates single sticker.
   * Returns id of created sticker
   *
   * @param params - sticker params
   */
  public async createSingleSticker(params: SingleStickerParams): Promise<string | undefined> {
    try {
      const message = await this.telegramBot.sendSticker(params.userId, params.image, { disable_notification: true });

      await this.telegramBot.deleteMessage(message.chat.id, message.message_id);

      return message.sticker?.file_id;
    } catch (e) {
      const errorCode = (e as any).response.body.error_code;

      if (errorCode === 403) {
        throw new Error(ERROR_MESSAGE_FORBIDDEN);
      }

      return undefined;
    }
  }

  /**
   * Displays inline button that suggests to enable the bot
   *
   * @param queryId - query id
   */
  private async suggestToEnableBot(queryId: string): Promise<void> {
    await this.telegramBot.answerInlineQuery(queryId, [], {
      is_personal: true,
      cache_time: 0,
      /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      button: JSON.stringify({
        text: __('enable_bot_message'),
        start_parameter: 'start',
      }),
    });
  }


  /**
   * Handles telegram text message
   *
   * @param msg - message data
   */
  private handleTextMessage(msg: TelegramBot.Message): void {
    const chatId = msg.chat.id;
    const lang = msg.from?.language_code;

    if (lang !== undefined) {
      setLocale(lang);
    }

    /* Send back the button to open web app */
    this.telegramBot.sendMessage(chatId, __('prompt'), {
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [ {
            text: __('button_text'),
            web_app: {
              url: this.webAppUrl,
            },
          } ],
        ],
      },
    });
  }

  /**
   * Handles telegram inline mode queries.
   * If inline query contains sticker id, displays corresponding sticker in query results.
   * Otherwise shows button to open web app.
   *
   * @param query - inline query data
   */
  private async handleInlineQuery(query: TelegramBot.InlineQuery): Promise<void> {
    try {
      /* Check for not started bot error */
      if (query.query === ERROR_QUERY) {
        await this.suggestToEnableBot(query.id);

        return;
      }

      /* Check for sticker file id */
      if (query.query.startsWith('id:')) {
        const stickerId = query.query.substring(3, query.query.length);

        await this.showStickerInInlineQueryResults(query.id, stickerId);

        return;
      }

      this.openWebappFromInlineQuery(query);
    } catch (e) {
      console.error('Error handling inline query', query);
    }
  }

  /**
   * Shows sticker with specified id in inline query results list
   *
   * @param queryId - query id
   * @param stickerId - id of the sticker to show
   */
  private async showStickerInInlineQueryResults(queryId: string, stickerId: string): Promise<void> {
    try {
      await this.telegramBot.answerInlineQuery(queryId, [
        {
          id: nanoid(),
          type: 'sticker',
          sticker_file_id: stickerId,
        },
      ], {
        is_personal: true,
        cache_time: 0,
      });
    } catch (e) {
      await this.telegramBot.answerInlineQuery(queryId, [], {});

      console.error(e);
    }
  }

  /**
   * Displays button that allows to open web app
   *
   * @param query - inline query
   */
  private async openWebappFromInlineQuery(query: TelegramBot.InlineQuery): Promise<void> {
    try {
      const url = `${this.webAppUrl}?inline_query_id=${query.id}&inline_query_text=${encodeURIComponent(query.query)}&user_id=${query.from.id}`;

      await this.telegramBot.answerInlineQuery(query.id, [], {
        is_personal: true,
        cache_time: 0,
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        button: JSON.stringify({
          text: __('create_sticker'),
          web_app: {
            url,
          },
        }),
      });
    } catch (e) {
      await this.telegramBot.answerInlineQuery(query.id, [], {});

      console.error('Error sending open button to the chat, query:', query);
    }
  }
}


