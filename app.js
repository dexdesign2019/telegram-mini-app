const tg = window.Telegram.WebApp;


/* ---------------------------
   TELEGRAM
---------------------------- */

tg.ready();

tg.expand();


/* ---------------------------
   ELEMENTS
---------------------------- */

const licenseScreen =
    document.getElementById("licenseScreen");

const homeScreen =
    document.getElementById("homeScreen");


const licenseInput =
    document.getElementById("licenseInput");

const licenseButton =
    document.getElementById("licenseButton");

const licenseMessage =
    document.getElementById("licenseMessage");


const profilePhoto =
    document.getElementById("profilePhoto");

const profileFallback =
    document.getElementById("profileFallback");

const profileName =
    document.getElementById("profileName");

const profileUsername =
    document.getElementById("profileUsername");


/* ---------------------------
   TELEGRAM USER
---------------------------- */

const user =
    tg.initDataUnsafe?.user;


/* ---------------------------
   SHOW USER
---------------------------- */

function loadTelegramUser() {

    if (!user) {

        profileName.textContent =
            "مهمان";

        profileUsername.textContent =
            "Telegram";

        profilePhoto.style.display =
            "none";

        profileFallback.style.display =
            "flex";

        profileFallback.textContent =
            "?";

        return;
    }


    const firstName =
        user.first_name || "";

    const lastName =
        user.last_name || "";


    const fullName =
        `${firstName} ${lastName}`.trim();


    profileName.textContent =
        fullName || "کاربر";


    if (user.username) {

        profileUsername.textContent =
            `@${user.username}`;

    } else {

        profileUsername.textContent =
            "username ندارد";

    }


    if (user.photo_url) {

        profilePhoto.src =
            user.photo_url;

        profilePhoto.style.display =
            "block";

        profileFallback.style.display =
            "none";

    } else {

        profilePhoto.style.display =
            "none";

        profileFallback.style.display =
            "flex";

        profileFallback.textContent =
            (firstName || "?")
                .charAt(0)
                .toUpperCase();

    }

}


/* ---------------------------
   SCREEN CHANGE
---------------------------- */

function showHome() {

    licenseScreen.classList.remove("active");

    homeScreen.classList.add("active");

}


/* ---------------------------
   LICENSE CHECK
---------------------------- */

/*
    این قسمت فعلاً موقت است.

    لایسنس واقعی را بعداً به سرور
    وصل می‌کنیم.

    لیست لایسنس‌ها را نباید اینجا
    قرار بدهیم.
*/

async function checkLicense(license) {

    const cleanLicense =
        license.trim();


    if (!cleanLicense) {

        return {
            valid: false,
            message: "لطفاً لایسنس را وارد کنید."
        };

    }


    /*
       فعلاً برای تست:

       هر لایسنس با حداقل 8 کاراکتر
       معتبر فرض می‌شود.

       این قسمت موقتی است و در نسخه
       واقعی حذف خواهد شد.
    */

    if (cleanLicense.length < 8) {

        return {
            valid: false,
            message: "فرمت لایسنس صحیح نیست."
        };

    }


    return {
        valid: true
    };

}


/* ---------------------------
   LICENSE BUTTON
---------------------------- */

licenseButton.addEventListener(
    "click",
    async function () {

        licenseMessage.textContent =
            "";

        const license =
            licenseInput.value;


        licenseButton.classList.add(
            "loading"
        );

        licenseButton.textContent =
            "در حال بررسی...";


        const result =
            await checkLicense(license);


        licenseButton.classList.remove(
            "loading"
        );

        licenseButton.textContent =
            "ورود";


        if (!result.valid) {

            licenseMessage.textContent =
                result.message;

            return;

        }


        /*
           لایسنس معتبر است
        */

        showHome();

    }
);


/* ---------------------------
   ENTER KEY
---------------------------- */

licenseInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            licenseButton.click();

        }

    }
);


/* ---------------------------
   MENU BUTTONS
---------------------------- */

const menuButtons =
    document.querySelectorAll(".menu-card");


menuButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            const page =
                button.dataset.page;


            /*
               فعلاً فقط تست کنیم
               که دکمه‌ها کار می‌کنند.
            */

            alert(
                `بخش ${page} در مرحله بعد ساخته می‌شود.`
            );

        }
    );

});


/* ---------------------------
   START
---------------------------- */

loadTelegramUser();
