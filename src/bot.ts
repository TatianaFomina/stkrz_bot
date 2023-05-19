import TelegramBot from 'node-telegram-bot-api';
import { nanoid } from 'nanoid';
import { MessengerBot, StickersetParams } from './types/messenger-bot';

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

      /* Send back the button to open web app */
      this.telegramBot.sendMessage(chatId, 'Tap button below', {
        reply_markup: {
          inline_keyboard: [
            [ {
              text: 'Open',
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

    const isCreated = await this.telegramBot.createNewStickerSet(params.userId, actualName, params.title, params.pngSticker, params.emojis);

    if (!isCreated) {
      throw new Error('Error creating a stickerset');
    }

    const stickerset = await this.telegramBot.getStickerSet(actualName);
    const firstStickerId = stickerset.stickers[0].file_id;

    this.telegramBot.answerWebAppQuery(params.queryId, {
      type: 'sticker',
      sticker_file_id: firstStickerId,
      id: nanoid(),
    });
  }
}


