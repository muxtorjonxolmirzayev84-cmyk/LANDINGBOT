// Bot handlerlari
const { message } = require('telegraf/filters');
const botController = require('../controllers/botController');

function registerBotRoutes(bot) {
  bot.start(botController.start);
  bot.help(botController.help);
  bot.command('menu', botController.menu);
  bot.hears(botController.BTN_MENU, botController.menu);
  bot.on(message('contact'), botController.contact);
  bot.on(message('text'), botController.fallback);

  bot.catch((err, ctx) => {
    console.error(`⚠️  Bot xatosi (${ctx?.updateType || 'update'}):`, err.message);
  });
}

module.exports = registerBotRoutes;
