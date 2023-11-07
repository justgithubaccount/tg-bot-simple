require('dotenv').config();

const tgToken = process.env.TELEGRAM_TOKEN;

const TelegramBot = require('node-telegram-bot-api');
const {gameSet, gameAgain} = require('./options.js')

const options = {
    polling: true
};

const dataChats = {};

const startGame = async (chatId) => {
    const randomNumber = String(Math.floor(Math.random() * 10));
    dataChats[chatId] = randomNumber;

    await bot.sendMessage(chatId, `Тебе нужно будет угадать число от 1 до 9`);
    await bot.sendMessage(chatId, `Начинай отгадывать число`, gameSet);
}

const bot = new TelegramBot(tgToken, options);

const run = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Проверить бота на увожение' },
        { command: '/info', description: 'Проверить бота на слежку' },
        { command: '/game', description: 'Проверить удачу' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;
        const userName = msg.from.username;
        const isPremium = msg.from.is_premium;

        const stickHiLink = "https://tlgrm.ru/_/stickers/58e/b5e/58eb5e33-62ef-4f43-9238-6cee0348df74/8.webp";

        if (text === '/start') {
            await bot.sendMessage(chatId, `Привет ${firstName}`);
            return bot.sendSticker(chatId, stickHiLink);
        }

        if (text === '/info') {
            await bot.sendMessage(chatId, `Я не много знаю о тебе, помимо того что тебя зовут ${firstName}, твой ник (${userName}), а ID в Telegram у тебя ${chatId}`);

            if (isPremium == true) {
                return bot.sendMessage(chatId, `Ах, да, я вижу что у тебя еще и куплен прем :)`);
            } else {
                return bot.sendMessage(chatId, `Ах, да, я вижу что у тебя нету према :(`);
            }
        }

        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Ты слишком умен чтобы меня обмануть. Попробуй еще раз.`);
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            startGame(chatId);
        }

        if (data === dataChats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал. Это цифра ${dataChats[chatId]}.`, gameAgain);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал. Это была цифра ${dataChats[chatId]}. Аминь.`, gameAgain);
        }
    })
}

run();