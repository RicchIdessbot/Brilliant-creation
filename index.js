const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot("8500810300:AAFe1hSutWDnMIs8f9gJnLtwiQlnXeirigY", { polling: true });

console.log("🚀 ULTRA MUSIC BOT ONLINE");

// 🎉 START MENU
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`👋 Xup ${msg.from.first_name} 😎

🎵 I’m your ULTRA Music Assistant
Send me a song name OR use the menu below 👇`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🎵 SONG", callback_data: "song" },
            { text: "👨‍💻 DEV", callback_data: "dev" }
          ],
          [
            { text: "👑 OWNER", callback_data: "owner" },
            { text: "❓ HELP", callback_data: "help" }
          ]
        ]
      }
    }
  );
});

// 🎛 BUTTON HANDLER
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;

  switch (query.data) {
    case "song":
      bot.sendMessage(
        chatId,
        "🎧 Send me a song name and I’ll fetch it for you instantly 🔥"
      );
      break;

    case "dev":
      bot.sendMessage(
        chatId,
        "👨‍💻 Dev: Built with Node.js + Telegram API ⚡\n💡 Ultra Mode UI system active By; IDEAS"
      );
      break;

    case "owner":
      bot.sendMessage(chatId, "👑 Owner: IDEAS😎🔥");
      break;

    case "help":
      bot.sendMessage(
        chatId,
`❓ HELP MENU

🎵 Just send a song name
Example:
👉 Shape of You

I will:
✔ Find song
✔ Show cover
✔ Send preview audio`
      );
      break;
  }
});

// 🎧 SONG SEARCH (ULTRA MODE)
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // ignore commands & empty
  if (!text || text.startsWith("/")) return;

  try {
    const res = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(text)}&limit=1`
    );

    const song = res.data.results[0];

    if (!song) {
      return bot.sendMessage(chatId, "😔 No song found... try another name 🔁");
    }

    // 🎵 fancy result
    bot.sendPhoto(chatId, song.artworkUrl100, {
      caption:
`🎵 *${song.trackName}*
👤 ${song.artistName}
💿 ${song.collectionName}

🔥 Powered by ULTRA Music Bot`,
      parse_mode: "Markdown"
    });

    // 🎧 preview
    if (song.previewUrl) {
      bot.sendAudio(chatId, song.previewUrl);
    }

  } catch (err) {
    bot.sendMessage(chatId, "⚠️ Error fetching song...");
  }
});
