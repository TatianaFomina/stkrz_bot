import TelegramBot from 'node-telegram-bot-api';
import { EventEmitter } from 'node:events';
import { nanoid } from 'nanoid';

let chatIdGlobal = -1;

/**
 * Initializes telegram bot
 *
 * @param eventBus - common event bus used to transfer messages
 */
export function init(eventBus: EventEmitter): void {
  const token = process.env.TG_API_TOKEN || '';
  const webAppUrl = process.env.WEB_APP_URL || '';

  /* Create a bot that uses 'polling' to fetch new updates */
  const bot = new TelegramBot(token, { polling: true });

  /* Matches "/start" */
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    chatIdGlobal = chatId;

    /* Send back the button to open web app */
    bot.sendMessage(chatId, 'Tap button below', {
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

  eventBus.on('image-received', async (data) => {
    const imageUrl = process.env.HOST_URL + '/' + data.path;

    /* Send image to chat */
    bot.answerWebAppQuery(data.queryId, {
      type: 'photo',
      id: nanoid(),
      photo_file_id: nanoid(),
      photo_url: imageUrl,
      thumb_url: imageUrl,
    });

    console.log(data.userId);

    // bot.createNewStickerSet(data.userId);
    // bot.addStickerToSet()
    // bot.uploadStickerFile()

    // bot.answerInlineQuery('dd', 'dfdf', )

    // bot.answerWebAppQuery('dd', {
    //   type: 'sticker'
    // })
  });

  eventBus.on('create-stickerset', async data => {
    console.log(data);
    const name = data.name + '_by_stkrz_bot';

    await bot.createNewStickerSet(data.userId, name, data.title, data.image, data.emojis);
    // bot.sendSticker()
    const response = await bot.getStickerSet(name);
    const fileId = response.stickers[0].file_id;

    bot.sendSticker(chatIdGlobal, fileId);
  });
}
