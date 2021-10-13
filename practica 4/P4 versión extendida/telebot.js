const TeleBot = require('telebot');
// const token = '1687857364:AAF9f4D__FCVBkhjubLcOuRXj5zzg9YLy_g';


const bot = new TeleBot({
    token: process.env.BOT_TOKEN, // Required. Telegram Bot API token.
    polling: { // Optional. Use polling.
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).

    },

});

bot.on('text', (msg) => {
  msg.reply.text(msg.text);
  bot.sendMessage(msg.from.id, `Hola, ${ msg.from.first_name }, ${ msg.from.last_name }!`);

  console.log(msg.from.id);

});


bot.on('/ping', (msg) => {
  msg.reply.text("hola buenas");
});


bot.on('start', () => {
  console.log("Hemos hecho start");

});

bot.start();
