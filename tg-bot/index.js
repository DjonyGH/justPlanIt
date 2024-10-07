const TelegramBot = require('node-telegram-bot-api')

const token = '7049203455:AAGv_Kj2-E2nAsAq_tR9b4Ipt5ru-1h4_9c'
const webAppUrl = 'https://be25-176-196-20-174.ngrok-free.app'

const bot = new TelegramBot(token, { polling: true })

bot.on('message', async (msg) => {
  const chatId = msg.chat.id

  if (msg.text === '/start') {
    await bot.sendMessage(chatId, 'Старт игры', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Старт', web_app: { url: webAppUrl } }]],
      },
    })
  }
})
