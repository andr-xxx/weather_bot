require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const { getWeatherByCoords, getCoordsByCityName } = require('./weather')

const { BOT_TOKEN } = process.env

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.setMyCommands([{
    command: '/weather_by_city', description: 'Weather'
}], { scope: { type: "all_group_chats" } })

bot.onText(/\/start/, (msg, match) => {
    console.log(msg)
    console.log(match)

    bot.sendMessage(msg.chat.id, 'Hello. Welcome to our bot');
})

bot.onText(/\/weather_by_city/, (msg) => {
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Krakow',
                        callback_data: 'krakow'
                    }
                ]
            ]
        }
    };

    bot.sendMessage(msg.chat.id, 'Please, select city', opts);
})

bot.on('callback_query', async ({ data, message }) => {
    const opts = {
        chat_id: message.chat.id,
        message_id: message.message_id,
    };

    if (data === 'krakow') {
        const coords = await getCoordsByCityName('krakow')
        const { temp, feelsLike, description } = await getWeatherByCoords(coords)

        bot.editMessageText(`Temperature in Krakow is ${temp}. Feels like - ${feelsLike}. Description - ${description}`, opts);
    }
})