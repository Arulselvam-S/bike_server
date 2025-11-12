require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const chatId = process.env.FAMILY_CHAT_ID;

bot.sendMessage(chatId, '🚨 SOS! This is a test message from your bike prototype.')
   .then(() => console.log('Message sent!'))
   .catch(err => console.error(err));