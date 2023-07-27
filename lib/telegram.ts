import { Markup, Telegraf } from 'telegraf';

export const bot = new Telegraf(process.env.BOT_TOKEN!);

const BASE_URL = 'https://hitch-rider.vercel.app';

bot.start(async (ctx) => {
  await Promise.all([
    ctx.setChatMenuButton({
      text: 'Open HitchRider',
      type: 'web_app',
      web_app: {
        url: BASE_URL,
      },
    }),
    ctx.reply(
      'Welcome to HitchRider!\nTo get started, use one of the buttons below:',
      Markup.inlineKeyboard(
        [
          Markup.button.webApp(
            '🚗 Explore available rides',
            `${BASE_URL}/rides`
          ),
          Markup.button.webApp(
            '🙋‍♂️ Find a travel companion',
            `${BASE_URL}/requests`
          ),
        ],
        {
          columns: 1,
        }
      )
    ),
  ]);
});

const DEV_BASE_URL = 'https://hitch-rider.loca.lt';

bot.command('dev', async (ctx) => {
  await Promise.all([
    ctx.setChatMenuButton({
      text: 'Open HitchRider Dev',
      type: 'web_app',
      web_app: {
        url: DEV_BASE_URL,
      },
    }),
    ctx.reply(
      'Links updated to use local dev mode. To reset, run /start again',
      Markup.inlineKeyboard(
        [
          Markup.button.webApp(
            '🚗 Explore available rides',
            `${DEV_BASE_URL}/rides`
          ),
          Markup.button.webApp(
            '🙋‍♂️ Find a travel companion',
            `${DEV_BASE_URL}/requests`
          ),
        ],
        {
          columns: 1,
        }
      )
    ),
  ]);
});
