const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const TOKEN = "8822767949:AAHc74cvjc7f_TB-uhE8AeP8v237AM8aj-0";

const bot = new TelegramBot(TOKEN, {
    polling: true
});


bot.on("message", async (msg) => {

    if (!msg.web_app_data) return;

    const userId = msg.chat.id;

    const data = JSON.parse(msg.web_app_data.data);

    console.log("دریافت شد:", data);


    if (data.type === "text") {

        await bot.sendMessage(
            userId,
            "سلام 👋 این متن انتخابی شماست."
        );

    }


    if (data.type === "music") {

        const musicPath = path.join(__dirname, "music.mp3");

        await bot.sendAudio(
            userId,
            musicPath
        );

    }


    if (data.type === "video") {

        const videoPath = path.join(__dirname, "video.mp4");

        await bot.sendVideo(
            userId,
            videoPath
        );

    }

});


bot.on("polling_error", (error) => {
    console.log("Polling Error:", error.message);
});


console.log("Bot started successfully");
