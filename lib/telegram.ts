import { Telegraf } from 'telegraf';

export const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => {
  ctx.setChatMenuButton({
    text: 'Open web app',
    type: 'web_app',
    web_app: {
      url: `https://hitch-rider.vercel.app/`,
    },
  });
  ctx.reply('Welcome!');
});
