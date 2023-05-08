import { init as initBot } from './src/bot.js';
import { init as initServer } from './src/server.js';
import { EventEmitter } from 'node:events';
import * as dotenv from 'dotenv';

dotenv.config();

const commonEventBus = new EventEmitter();

initBot(commonEventBus);
initServer(commonEventBus);


