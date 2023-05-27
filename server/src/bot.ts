import TelegramBot from 'node-telegram-bot-api';
import { nanoid } from 'nanoid';
import { MessengerBot, StickersetParams } from './types/messenger-bot';
import { __, setLocale } from './i18n/index.js';

/**
 * Telegram messenger bot
 */
export class Bot implements MessengerBot {
  private readonly telegramBot: TelegramBot;

  /**
   * Constructs the instance
   */
  constructor() {
    const token = process.env.TG_API_TOKEN || '';
    const webAppUrl = process.env.WEB_APP_URL || '';

    /* Create a bot that uses 'polling' to fetch new updates */
    this.telegramBot = new TelegramBot(token, { polling: true });

    /* Handle "/start" message */
    this.telegramBot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const lang = msg.from?.language_code;

      if (lang !== undefined) {
        setLocale(lang);
      }

      /* Send back the button to open web app */
      this.telegramBot.sendMessage(chatId, __('prompt'), {
        reply_markup: {
          inline_keyboard: [
            [ {
              text: __('button_text'),
              web_app: {
                url: webAppUrl,
              },
            } ],
          ],
        },
      });
    });
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
}


