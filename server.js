require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());

// Serve frontend HTML/JS
app.use(express.static(path.join(__dirname, '../bike_frontend'))); // make sure this path points to your frontend folder

// Telegram bot setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const familyChatIds = (process.env.FAMILY_CHAT_ID || '').split(',');

let latest = { speed: 0, crashed: false };

// Crash endpoint
app.post('/api/crash', (req, res) => {
    console.log('Crash endpoint called', req.body);

    const { speed, latitude, longitude } = req.body;
    if (!speed) {
        return res.status(400).json({ ok: false, message: 'Speed is missing!' });
    }

    latest = { speed, crashed: true, latitude, longitude };

    let msg = `🚨 Your friend met with an accident\nSpeed: ${speed} km/h`;
    if (latitude && longitude) {
        msg += `\nLocation: https://www.google.com/maps?q=${latitude},${longitude}`;
    }

    familyChatIds.forEach(id => {
        bot.sendMessage(id, msg)
            .then(() => console.log(`SOS sent to chat ID: ${id}`))
            .catch(err => console.error('Error sending SOS:', err.message));
    });

    res.json({ ok: true, message: 'Crash reported and Telegram SOS sent!' });
});

// Status endpoint
app.get('/api/status', (req, res) => res.json(latest));

// Serve index.html on root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../bike_frontend/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));