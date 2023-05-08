import TelegramBot from 'node-telegram-bot-api';
import { EventEmitter } from 'node:events';

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
      id: data.queryId,
      photo_file_id: data.queryId,
      photo_url: imageUrl,
      thumb_url: imageUrl,
    });
  });
}
