const tg = window.Telegram.WebApp;

tg.ready();

tg.expand();

const user = tg.initDataUnsafe.user;

const userName = document.getElementById("userName");

if (user) {

    userName.textContent =
        "سلام " + user.first_name + " 👋";

} else {

    userName.textContent =
        "سلام مهمان 👋";

}

document.getElementById("helloBtn").addEventListener("click", () => {

    alert("دکمه کار می‌کند! 🚀");

});