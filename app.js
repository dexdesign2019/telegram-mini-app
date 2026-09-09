const tg = window.Telegram.WebApp;


/* Telegram آماده شود */
tg.ready();


/* صفحه را بزرگ‌تر کن */
tg.expand();


/* کاربر Telegram */
const user = tg.initDataUnsafe?.user;


/* عناصر صفحه */
const profilePhoto = document.getElementById("profilePhoto");
const avatarFallback = document.getElementById("avatarFallback");

const fullName = document.getElementById("fullName");
const username = document.getElementById("username");

const nameValue = document.getElementById("nameValue");
const usernameValue = document.getElementById("usernameValue");
const idValue = document.getElementById("idValue");

const copyId = document.getElementById("copyId");


/* اگر Mini App از داخل Telegram باز شده باشد */
if (user) {

    /* نام */
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";

    const fullUserName =
        `${firstName} ${lastName}`.trim();


    fullName.textContent =
        fullUserName || "کاربر Telegram";


    nameValue.textContent =
        fullUserName || "ثبت نشده";


    /* Username */
    if (user.username) {

        username.textContent =
            `@${user.username}`;

        usernameValue.textContent =
            `@${user.username}`;

    } else {

        username.textContent =
            "Username ندارد";

        usernameValue.textContent =
            "ثبت نشده";

    }


    /* Telegram ID */
    idValue.textContent =
        user.id;


    /* عکس پروفایل */
    if (user.photo_url) {

        profilePhoto.src =
            user.photo_url;

        profilePhoto.style.display =
            "block";

        avatarFallback.style.display =
            "none";

    } else {

        profilePhoto.style.display =
            "none";

        avatarFallback.style.display =
            "flex";

        avatarFallback.textContent =
            (firstName || "?")
                .charAt(0)
                .toUpperCase();

    }


} else {

    /*
       اگر صفحه مستقیماً در مرورگر باز شود
       و داخل Telegram نباشد
    */

    fullName.textContent =
        "مهمان";

    username.textContent =
        "Telegram یافت نشد";

    nameValue.textContent =
        "اطلاعات در دسترس نیست";

    usernameValue.textContent =
        "اطلاعات در دسترس نیست";

    idValue.textContent =
        "—";

    profilePhoto.style.display =
        "none";

    avatarFallback.style.display =
        "flex";

    avatarFallback.textContent =
        "?";

}


/* کپی کردن ID */

copyId.addEventListener("click", async () => {

    const id = user?.id;

    if (!id) {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            String(id)
        );

        copyId.textContent =
            "کپی شد ✓";


        setTimeout(() => {

            copyId.textContent =
                "کپی";

        }, 1500);


    } catch {

        copyId.textContent =
            "خطا";

    }

});
