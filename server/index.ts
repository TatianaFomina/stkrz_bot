import { Bot } from './src/bot.js';
import { Server } from './src/server.js';
import * as dotenv from 'dotenv';

dotenv.config();

const bot = new Bot();
const server = new Server(bot);

server.start();
