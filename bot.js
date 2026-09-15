// نصب:
// npm install node-telegram-bot-api

const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "8625872330:AAF2vWpl4jCg3AlWQrycYa2yx1Y9KL5kD-Q";

const bot = new TelegramBot(TOKEN,{
    polling:true
});

bot.on("message", async (msg)=>{

    if(!msg.web_app_data) return;

    const userId = msg.from.id;

    const data = JSON.parse(
        msg.web_app_data.data
    );

    if(data.type==="text"){
        bot.sendMessage(
            userId,
            "سلام! این فایل متن انتخابی شماست."
        );
    }

    if(data.type==="music"){
        bot.sendAudio(
            userId,
            "./music.mp3"
        );
    }

    if(data.type==="video"){
        bot.sendVideo(
            userId,
            "./video.mp4"
        );
    }

});
