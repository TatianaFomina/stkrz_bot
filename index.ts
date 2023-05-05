import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
dotenv.config();

const token = process.env.TG_API_TOKEN || '';
const webAppUrl = process.env.WEB_APP_URL || '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/start"
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // send back the button to open web app
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
