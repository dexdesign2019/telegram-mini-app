const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8822767949:AAHc74cvjc7f_TB-uhE8AeP8v237AM8aj-0";

const bot = new TelegramBot(TOKEN, {
    polling: true
});


bot.on("message", (msg) => {

    if (!msg.web_app_data) return;


    const userId = msg.chat.id;

    const data = JSON.parse(
        msg.web_app_data.data
    );


    if (data.type === "text") {

        bot.sendMessage(
            userId,
            "سلام 👋 این متن انتخابی شماست."
        );

    }


    if (data.type === "music") {

        bot.sendAudio(
            userId,
            "./music.mp3"
        );

    }


    if (data.type === "video") {

        bot.sendVideo(
            userId,
            "./video.mp4"
        );

    }

});
console.log("Bot started successfully");
