/* =========================================================
   TELEGRAM
========================================================= */

const tg =
    window.Telegram &&
    window.Telegram.WebApp
        ? window.Telegram.WebApp
        : null;


if (tg) {

    try {
        tg.ready();
    } catch (e) {}

    try {
        tg.expand();
    } catch (e) {}

    try {
        tg.setHeaderColor(
            "#07080d"
        );
    } catch (e) {}

    try {
        tg.setBackgroundColor(
            "#07080d"
        );
    } catch (e) {}

}


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://dnhzloyskxcihkkaspez.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_f8eKkpgrTdFK08_XQq-ozg_24-UOyLh";


let supabaseClient =
    null;


/*
   مهم:
   این بار دوباره const تعریف نمی‌کنیم.
*/

if (
    window.supabase &&
    typeof window.supabase.createClient ===
        "function"
) {

    try {

        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

    }

}


/* =========================================================
   ELEMENTS
========================================================= */

const licenseScreen =
    document.getElementById(
        "licenseScreen"
    );


const homeScreen =
    document.getElementById(
        "homeScreen"
    );


const gameScreen =
    document.getElementById(
        "gameScreen"
    );


const leaderboardScreen =
    document.getElementById(
        "leaderboardScreen"
    );


const rewardsScreen =
    document.getElementById(
        "rewardsScreen"
    );


const placeholderScreen =
    document.getElementById(
        "placeholderScreen"
    );


/* =========================================================
   TELEGRAM USER
========================================================= */

const user =
    tg?.initDataUnsafe?.user ||
    null;


function loadUser() {

    const nameElement =
        document.getElementById(
            "homeProfileName"
        );


    const usernameElement =
        document.getElementById(
            "homeProfileUsername"
        );


    const photo =
        document.getElementById(
            "homeProfilePhoto"
        );


    const fallback =
        document.getElementById(
            "homeProfileFallback"
        );


    const firstName =
        user?.first_name ||
        "";


    const lastName =
        user?.last_name ||
        "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const username =
        user?.username
            ? `@${user.username}`
            : "username ندارد";


    if (nameElement) {

        nameElement.textContent =
            fullName ||
            "کاربر";

    }


    if (usernameElement) {

        usernameElement.textContent =
            username;

    }


    if (
        !photo ||
        !fallback
    ) {

        return;

    }


    if (user?.photo_url) {

        photo.src =
            user.photo_url;

        photo.style.display =
            "block";

        fallback.style.display =
            "none";

    } else {

        photo.style.display =
            "none";

        fallback.style.display =
            "flex";

        fallback.textContent =
            firstName
                ? firstName
                    .charAt(0)
                    .toUpperCase()
                : "?";

    }

}


/* =========================================================
   UTILITIES
========================================================= */

/*
   FIX:
   این تابع در نسخه قبلی تعریف نشده بود
   ولی داخل renderLeaderboard() استفاده می‌شد.
   نتیجه: هر بار که داده واقعی از Supabase می‌رسید،
   یک ReferenceError رخ می‌داد و catch می‌شد،
   پس همیشه پیام "دریافت لیدربرد با مشکل مواجه شد"
   نمایش داده می‌شد حتی اگر فچ کاملاً موفق بود.
*/

function escapeHtml(
    text
) {

    return String(
        text
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   POINT SYSTEM
========================================================= */

let totalPoints =
    Number(
        localStorage.getItem(
            "dex_total_points"
        )
    ) || 0;


let gamePoints =
    0;


function savePoints() {

    localStorage.setItem(
        "dex_total_points",
        String(totalPoints)
    );

}


function updatePointsUI() {

    const homeScore =
        document.getElementById(
            "homeScore"
        );


    const rewardScore =
        document.getElementById(
            "rewardScore"
        );


    const gameScore =
        document.getElementById(
            "gameScore"
        );


    if (homeScore) {

        homeScore.textContent =
            totalPoints;

    }


    if (rewardScore) {

        rewardScore.textContent =
            totalPoints;

    }


    if (gameScore) {

        gameScore.textContent =
            gamePoints;

    }

}


function addPoints(
    amount
) {

    const value =
        Math.max(
            0,
            Number(amount) || 0
        );


    totalPoints +=
        value;


    savePoints();

    updatePointsUI();

}


/* =========================================================
   SCREEN SYSTEM
========================================================= */

function hideAllScreens() {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );

            }
        );

}


function showScreen(
    name
) {

    hideAllScreens();


    switch (name) {

        case "license":

            if (licenseScreen) {

                licenseScreen.classList.add(
                    "active"
                );

            }

            break;


        case "home":

            if (homeScreen) {

                homeScreen.classList.add(
                    "active"
                );

            }

            break;


        case "game":

            if (gameScreen) {

                gameScreen.classList.add(
                    "active"
                );

            }

            break;


        case "leaderboard":

            if (leaderboardScreen) {

                leaderboardScreen.classList.add(
                    "active"
                );

            }

            break;


        case "rewards":

            if (rewardsScreen) {

                rewardsScreen.classList.add(
                    "active"
                );

            }

            break;


        case "placeholder":

            if (placeholderScreen) {

                placeholderScreen.classList.add(
                    "active"
                );

            }

            break;

    }


    updatePointsUI();

}


/* =========================================================
   START APP
========================================================= */

function startApp() {

    const savedLicense =
        localStorage.getItem(
            "dex_license"
        );


    if (savedLicense) {

        showScreen(
            "home"
        );

    } else {

        showScreen(
            "license"
        );

    }

}


/* =========================================================
   LICENSE
========================================================= */

const licenseInput =
    document.getElementById(
        "licenseInput"
    );


const licenseButton =
    document.getElementById(
        "licenseButton"
    );


const licenseMessage =
    document.getElementById(
        "licenseMessage"
    );


function checkLicense(
    value
) {

    const license =
        String(
            value || ""
        )
            .trim();


    if (!license) {

        return {

            valid:
                false,

            message:
                "لطفاً لایسنس را وارد کنید."

        };

    }


    if (
        license.length < 8
    ) {

        return {

            valid:
                false,

            message:
                "لایسنس باید حداقل ۸ کاراکتر باشد."

        };

    }


    /*
       فعلاً فقط برای تست.

       بعداً سیستم واقعی License
       روی Server قرار می‌گیرد.
    */

    return {

        valid:
            true

    };

}


if (licenseButton) {

    licenseButton.addEventListener(
        "click",
        function () {

            const value =
                licenseInput
                    ? licenseInput.value.trim()
                    : "";


            const result =
                checkLicense(
                    value
                );


            if (licenseMessage) {

                licenseMessage.textContent =
                    result.valid
                        ? ""
                        : result.message;

            }


            if (
                !result.valid
            ) {

                return;

            }


            localStorage.setItem(
                "dex_license",
                value
            );


            showScreen(
                "home"
            );

        }
    );

}


if (licenseInput) {

    licenseInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                licenseButton?.click();

            }

        }
    );

}


/* =========================================================
   HOME → GAME
========================================================= */

const miniGameButton =
    document.getElementById(
        "miniGameButton"
    );


if (miniGameButton) {

    miniGameButton.addEventListener(
        "click",
        function () {

            showScreen(
                "game"
            );


            startGame();

        }
    );

}


/* =========================================================
   HOME CARDS
========================================================= */

document
    .querySelectorAll(
        ".home-card"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const page =
                        button.dataset.page;


                    if (
                        page ===
                        "rewards"
                    ) {

                        renderRewards();


                        showScreen(
                            "rewards"
                        );


                        return;

                    }


                    const pageNames = {

                        achievements:
                            "دستاوردها",

                        points:
                            "دریافت امتیاز",

                        learning:
                            "مسیر یادگیری",

                        upgrade:
                            "ارتقای سطح",

                        guide:
                            "راهنما"

                    };


                    const title =
                        document.getElementById(
                            "placeholderTitle"
                        );


                    if (title) {

                        title.textContent =
                            pageNames[page]
                            ||
                            "بخش";

                    }


                    showScreen(
                        "placeholder"
                    );

                }
            );

        }
    );


/* =========================================================
   BACK BUTTONS
========================================================= */

document
    .querySelectorAll(
        ".page-back"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    showScreen(
                        "home"
                    );

                }
            );

        }
    );


/* =========================================================
   REWARDS
========================================================= */

const rewards = [

    {
        id:
            1,

        name:
            "کتاب الکترونیکی",

        icon:
            "📘",

        price:
            5
    },


    {
        id:
            2,

        name:
            "Badge اختصاصی",

        icon:
            "🏅",

        price:
            10
    },


    {
        id:
            3,

        name:
            "والپیپر اختصاصی",

        icon:
            "🖼️",

        price:
            15
    },


    {
        id:
            4,

        name:
            "پک آیکن",

        icon:
            "✨",

        price:
            20
    },


    {
        id:
            5,

        name:
            "اکسسوری",

        icon:
            "🧢",

        price:
            30
    },


    {
        id:
            6,

        name:
            "T-Shirt",

        icon:
            "👕",

        price:
            50
    },


    {
        id:
            7,

        name:
            "Design Audit",

        icon:
            "🔍",

        price:
            80
    },


    {
        id:
            8,

        name:
            "منتورینگ خصوصی",

        icon:
            "🧠",

        price:
            120
    },


    {
        id:
            9,

        name:
            "Desk Mat",

        icon:
            "🖱️",

        price:
            160
    },


    {
        id:
            10,

        name:
            "دوره Premium",

        icon:
            "🎓",

        price:
            250
    }

];


function renderRewards() {

    const container =
        document.getElementById(
            "rewardsGrid"
        );


    if (!container)
        return;


    container.innerHTML =
        "";


    rewards.forEach(
        reward => {

            const card =
                document.createElement(
                    "div"
                );


            const canBuy =
                totalPoints >=
                reward.price;


            card.className =
                "reward-card";


            card.innerHTML = `

                <div class="reward-icon">
                    ${reward.icon}
                </div>

                <div class="reward-name">
                    ${reward.name}
                </div>

                <div class="reward-price">
                    ★ ${reward.price} امتیاز
                </div>

                <button
                    class="reward-button ${
                        canBuy
                            ? ""
                            : "disabled"
                    }"
                    data-reward-id="${reward.id}"
                    type="button"
                    ${
                        canBuy
                            ? ""
                            : "disabled"
                    }
                >
                    ${
                        canBuy
                            ? "دریافت جایزه"
                            : "امتیاز کافی نیست"
                    }
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );


    container
        .querySelectorAll(
            ".reward-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        const reward =
                            rewards.find(
                                item =>
                                    item.id ===
                                    Number(
                                        button.dataset.rewardId
                                    )
                            );


                        if (!reward)
                            return;


                        if (
                            totalPoints <
                            reward.price
                        )
                            return;


                        totalPoints -=
                            reward.price;


                        savePoints();

                        updatePointsUI();

                        renderRewards();


                        alert(
                            `🎁 ${reward.name} دریافت شد!`
                        );

                    }
                );

            }
        );

}


/* =========================================================
   LEADERBOARD
========================================================= */

let leaderboardData =
    [];


function getCurrentMonthKey() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    return (
        `${year}-${month}-01`
    );

}


async function loadLeaderboard() {

    const list =
        document.getElementById(
            "leaderboardList"
        );


    if (!list)
        return;


    list.innerHTML = `

        <div class="leaderboard-loading">
            در حال دریافت اطلاعات...
        </div>

    `;


    if (!supabaseClient) {

        list.innerHTML = `

            <div class="leaderboard-empty">
                اتصال به دیتابیس برقرار نیست.
            </div>

        `;

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "game_leaderboard"
                )
                .select(
                    "*"
                )
                .eq(
                    "month_key",
                    getCurrentMonthKey()
                )
                .order(
                    "best_score",
                    {
                        ascending:
                            false
                    }
                )
                .order(
                    "updated_at",
                    {
                        ascending:
                            true
                    }
                );


        if (error) {

            throw error;

        }


        leaderboardData =
            data || [];


        renderLeaderboard();


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        list.innerHTML = `

            <div class="leaderboard-empty">
                دریافت لیدربرد با مشکل مواجه شد.
            </div>

        `;

    }

}


function renderLeaderboard() {

    const list =
        document.getElementById(
            "leaderboardList"
        );


    if (!list)
        return;


    const totalPlayers =
        leaderboardData.length;


    const playerCount =
        document.getElementById(
            "playerCount"
        );


    const leaderboardPlayers =
        document.getElementById(
            "leaderboardPlayers"
        );


    if (playerCount) {

        playerCount.textContent =
            totalPlayers;

    }


    if (leaderboardPlayers) {

        leaderboardPlayers.textContent =
            totalPlayers;

    }


    list.innerHTML =
        "";


    if (
        leaderboardData.length ===
        0
    ) {

        list.innerHTML = `

            <div class="leaderboard-empty">
                هنوز کسی این ماه بازی نکرده.
            </div>

        `;


        updateMyRank(
            null,
            0
        );


        return;

    }


    leaderboardData.forEach(
        (
            player,
            index
        ) => {

            const rank =
                index + 1;


            const isCurrentUser =
                user &&
                Number(
                    player.telegram_id
                ) ===
                Number(
                    user.id
                );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "leaderboard-row";


            if (
                isCurrentUser
            ) {

                row.classList.add(
                    "current-user"
                );

            }


            let rankText =
                String(
                    rank
                );


            if (
                rank === 1
            ) {

                rankText =
                    "🥇";

            }


            if (
                rank === 2
            ) {

                rankText =
                    "🥈";

            }


            if (
                rank === 3
            ) {

                rankText =
                    "🥉";

            }


            const name =
                `${player.first_name || ""} ${
                    player.last_name || ""
                }`
                    .trim()
                ||
                "کاربر";


            const username =
                player.username
                    ? `@${player.username}`
                    : "";


            let avatarHTML;


            if (
                player.photo_url
            ) {

                avatarHTML = `

                    <img
                        class="leaderboard-avatar"
                        src="${escapeHtml(
                            player.photo_url
                        )}"
                        alt=""
                    >

                `;

            } else {

                const initial =
                    (
                        player.first_name ||
                        "?"
                    )
                        .charAt(0)
                        .toUpperCase();


                avatarHTML = `

                    <div
                        class="leaderboard-avatar-fallback"
                    >
                        ${escapeHtml(
                            initial
                        )}
                    </div>

                `;

            }


            row.innerHTML = `

                <div
                    class="leaderboard-rank ${
                        rank <= 3
                            ? "top"
                            : ""
                    }"
                >
                    ${rankText}
                </div>


                ${avatarHTML}


                <div
                    class="leaderboard-user"
                >

                    <div
                        class="leaderboard-name"
                    >
                        ${escapeHtml(
                            name
                        )}
                    </div>

                    ${
                        username
                            ? `
                                <div
                                    class="leaderboard-username"
                                >
                                    ${escapeHtml(
                                        username
                                    )}
                                </div>
                              `
                            : ""
                    }

                </div>


                <div
                    class="leaderboard-points"
                >
                    ★ ${Number(
                        player.best_score
                    ) || 0}
                </div>

            `;


            list.appendChild(
                row
            );

        }
    );


    const myIndex =
        user
            ? leaderboardData.findIndex(
                player =>
                    Number(
                        player.telegram_id
                    ) ===
                    Number(
                        user.id
                    )
            )
            : -1;


    if (
        myIndex >= 0
    ) {

        updateMyRank(
            myIndex + 1,

            Number(
                leaderboardData[
                    myIndex
                ].best_score
            ) || 0

        );

    } else {

        updateMyRank(
            null,
            0
        );

    }

}


function updateMyRank(
    rank,
    score
) {

    const myRank =
        document.getElementById(
            "myRank"
        );


    const myRankBottom =
        document.getElementById(
            "myRankBottom"
        );


    const myBestScore =
        document.getElementById(
            "myBestScore"
        );


    if (myRank) {

        myRank.textContent =
            rank
                ? `#${rank}`
                : "—";

    }


    if (myRankBottom) {

        myRankBottom.textContent =
            rank
                ? `#${rank}`
                : "—";

    }


    if (myBestScore) {

        myBestScore.textContent =
            score || 0;

    }

}


/* =========================================================
   LEADERBOARD BUTTON
========================================================= */

const leaderboardButton =
    document.getElementById(
        "leaderboardButton"
    );


if (leaderboardButton) {

    leaderboardButton.addEventListener(
        "click",
        async function () {

            showScreen(
                "leaderboard"
            );


            await loadLeaderboard();

        }
    );

}


/* =========================================================
   LEADERBOARD BACK
========================================================= */

const leaderboardBackButton =
    document.getElementById(
        "leaderboardBackButton"
    );


if (leaderboardBackButton) {

    leaderboardBackButton.addEventListener(
        "click",
        function () {

            showScreen(
                "game"
            );

        }
    );

}


/* =========================================================
   GAME VARIABLES
========================================================= */

const canvas =
    document.getElementById(
        "gameCanvas"
    );


const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;


const gameWorld =
    document.getElementById(
        "gameWorld"
    );


const pointAnimation =
    document.getElementById(
        "pointAnimation"
    );


const distanceText =
    document.getElementById(
        "distanceText"
    );


let animationId =
    null;


let gameRunning =
    false;


let gameOver =
    false;


let lastFrame =
    0;


let gameDistance =
    0;


let gameSpeed =
    1;


let currentLane =
    1;


let targetLane =
    1;


let roadOffset =
    0;


let spawnTimer =
    0;


let obstacles =
    [];


let lastMilestone =
    0;


let swipeStartX =
    0;


let swipeStartY =
    0;


/*
   100m = 10 seconds
   => 10m/s
*/

const METERS_PER_SECOND =
    10;


/* =========================================================
   CANVAS
========================================================= */

function resizeCanvas() {

    if (
        !canvas ||
        !gameWorld ||
        !ctx
    ) {

        return;

    }


    const rect =
        gameWorld.getBoundingClientRect();


    const dpr =
        Math.min(
            window.devicePixelRatio ||
                1,
            2
        );


    canvas.width =
        Math.floor(
            rect.width *
            dpr
        );


    canvas.height =
        Math.floor(
            rect.height *
            dpr
        );


    canvas.style.width =
        `${rect.width}px`;


    canvas.style.height =
        `${rect.height}px`;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

}


window.addEventListener(
    "resize",
    function () {

        if (gameRunning) {

            resizeCanvas();

        }

    }
);


/* =========================================================
   GAME SIZE
========================================================= */

function getGameSize() {

    if (!gameWorld) {

        return {

            width:
                0,

            height:
                0

        };

    }


    const rect =
        gameWorld.getBoundingClientRect();


    return {

        width:
            rect.width,

        height:
            rect.height

    };

}


function getRoad(
    width
) {

    const roadWidth =
        Math.min(
            width * .78,
            420
        );


    const left =
        (
            width -
            roadWidth
        ) / 2;


    return {

        left,

        width:
            roadWidth,

        laneWidth:
            roadWidth /
            3

    };

}


function getLaneX(
    laneIndex,
    width
) {

    const road =
        getRoad(
            width
        );


    return (
        road.left +
        road.laneWidth *
            laneIndex +
        road.laneWidth /
            2
    );

}


/* =========================================================
   DRAW ROAD
========================================================= */

function drawRoad() {

    if (!ctx)
        return;


    const {
        width,
        height
    } =
        getGameSize();


    const road =
        getRoad(
            width
        );


    /* grass */

    ctx.fillStyle =
        "#18311f";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* road */

    ctx.fillStyle =
        "#25282c";


    ctx.fillRect(
        road.left,
        0,
        road.width,
        height
    );


    /* side lines */

    ctx.fillStyle =
        "#d9d9d9";


    ctx.fillRect(
        road.left,
        0,
        3,
        height
    );


    ctx.fillRect(
        road.left +
            road.width -
            3,
        0,
        3,
        height
    );


    /* lanes */

    ctx.strokeStyle =
        "rgba(255,255,255,.22)";


    ctx.lineWidth =
        3;


    ctx.setLineDash(
        [30,24]
    );


    for (
        let i = 1;
        i < 3;
        i++
    ) {

        const x =
            road.left +
            road.laneWidth *
                i;


        ctx.beginPath();


        ctx.moveTo(
            x,
            -100 +
                roadOffset
        );


        ctx.lineTo(
            x,
            height +
                100 +
                roadOffset
        );


        ctx.stroke();

    }


    ctx.setLineDash([]);

}


/* =========================================================
   ROUND RECT
========================================================= */

function roundRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {

    context.beginPath();


    context.moveTo(
        x + radius,
        y
    );


    context.arcTo(
        x + width,
        y,
        x + width,
        y + height,
        radius
    );


    context.arcTo(
        x + width,
        y + height,
        x,
        y + height,
        radius
    );


    context.arcTo(
        x,
        y + height,
        x,
        y,
        radius
    );


    context.arcTo(
        x,
        y,
        x + width,
        y,
        radius
    );


    context.closePath();

}


/* =========================================================
   CAR
========================================================= */

function drawCar() {

    if (!ctx)
        return;


    const {
        width,
        height
    } =
        getGameSize();


    const road =
        getRoad(
            width
        );


    const x =
        getLaneX(
            currentLane,
            width
        );


    const carWidth =
        Math.min(
            road.laneWidth *
                .52,
            66
        );


    const carHeight =
        carWidth *
        1.60;


    const y =
        height -
        170;


    /* shadow */

    ctx.fillStyle =
        "rgba(0,0,0,.36)";


    ctx.beginPath();


    ctx.ellipse(
        x,
        y +
            carHeight *
            .50,
        carWidth *
            .62,
        carHeight *
            .14,
        0,
        0,
        Math.PI * 2
    );


    ctx.fill();


    /* body */

    const body =
        ctx.createLinearGradient(
            x,
            y,
            x,
            y +
                carHeight
        );


    body.addColorStop(
        0,
        "#f74b43"
    );


    body.addColorStop(
        1,
        "#a91411"
    );


    ctx.fillStyle =
        body;


    roundRect(
        ctx,
        x -
            carWidth / 2,
        y,
        carWidth,
        carHeight,
        13
    );


    ctx.fill();


    /* windshield */

    ctx.fillStyle =
        "#18212a";


    roundRect(
        ctx,

        x -
            carWidth *
            .34,

        y +
            carHeight *
            .18,

        carWidth *
            .68,

        carHeight *
            .24,

        8
    );


    ctx.fill();


    /* lights */

    ctx.fillStyle =
        "#fff0ae";


    roundRect(
        ctx,

        x -
            carWidth *
            .35,

        y +
            carHeight *
            .06,

        carWidth *
            .20,

        7,

        3
    );


    ctx.fill();


    roundRect(
        ctx,

        x +
            carWidth *
            .15,

        y +
            carHeight *
            .06,

        carWidth *
            .20,

        7,

        3
    );


    ctx.fill();


    /* wheels */

    ctx.fillStyle =
        "#08090c";


    ctx.fillRect(
        x -
            carWidth *
            .57,

        y +
            carHeight *
            .25,

        carWidth *
            .13,

        carHeight *
            .27
    );


    ctx.fillRect(
        x +
            carWidth *
            .44,

        y +
            carHeight *
            .25,

        carWidth *
            .13,

        carHeight *
            .27
    );


    /* highlight */

    ctx.fillStyle =
        "rgba(255,255,255,.14)";


    roundRect(
        ctx,

        x -
            carWidth *
            .20,

        y +
            carHeight *
            .09,

        carWidth *
            .09,

        carHeight *
            .72,

        5
    );


    ctx.fill();

}


/* =========================================================
   OBSTACLES
========================================================= */

function createObstacle() {

    obstacles.push({

        lane:
            Math.floor(
                Math.random() *
                3
            ),

        y:
            -120,

        type:
            Math.random() >
            .5
                ? "car"
                : "barrier",

        speed:
            .9 +
            Math.random() *
            .4

    });

}


function drawObstacle(
    obstacle
) {

    if (!ctx)
        return;


    const {
        width
    } =
        getGameSize();


    const road =
        getRoad(
            width
        );


    const x =
        getLaneX(
            obstacle.lane,
            width
        );


    const w =
        Math.min(
            road.laneWidth *
                .58,
            70
        );


    const h =
        74;


    if (
        obstacle.type ===
        "car"
    ) {

        ctx.fillStyle =
            "#2f63d4";


        roundRect(
            ctx,
            x -
                w / 2,
            obstacle.y,
            w,
            h,
            10
        );


        ctx.fill();


        ctx.fillStyle =
            "#1c222b";


        roundRect(
            ctx,
            x -
                w * .30,
            obstacle.y + 12,
            w * .60,
            h * .33,
            7
        );


        ctx.fill();


    } else {

        ctx.fillStyle =
            "#e64b42";


        roundRect(
            ctx,
            x -
                w / 2,
            obstacle.y,
            w,
            42,
            9
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff2ce";


        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            ctx.save();


            ctx.translate(
                x +
                    i *
                    w *
                    .24,

                obstacle.y +
                    21
            );


            ctx.rotate(
                -.55
            );


            ctx.fillRect(
                -4,
                -14,
                8,
                28
            );


            ctx.restore();

        }

    }

}


/* =========================================================
   COLLISION
========================================================= */

function checkCollision(
    obstacle
) {

    if (
        obstacle.lane !==
        Math.round(
            currentLane
        )
    ) {

        return false;

    }


    const {
        width,
        height
    } =
        getGameSize();


    const road =
        getRoad(
            width
        );


    const carWidth =
        Math.min(
            road.laneWidth *
                .52,
            66
        );


    const carHeight =
        carWidth *
        1.60;


    const carY =
        height -
        170;


    const obstacleHeight =
        74;


    return (

        obstacle.y +
            obstacleHeight >=
            carY + 10

        &&

        obstacle.y <=
            carY +
            carHeight -
            10

    );

}


/* =========================================================
   GAME UPDATE
========================================================= */

function updateGame(
    delta
) {

    gameDistance +=
        METERS_PER_SECOND *
        delta;


    if (distanceText) {

        distanceText.textContent =
            `${Math.floor(
                gameDistance
            )}m`;

    }


    /*
       Gradual acceleration
    */

    gameSpeed +=
        delta *
        .020;


    /*
       Road movement
    */

    roadOffset +=
        delta *
        (
            180 +
            gameSpeed *
            30
        );


    /*
       Spawn obstacles
    */

    spawnTimer +=
        delta;


    const interval =
        Math.max(
            .52,
            .95 -
                gameSpeed *
                .055
        );


    if (
        spawnTimer >=
        interval
    ) {

        spawnTimer =
            0;


        createObstacle();

    }


    /*
       Move obstacles
    */

    obstacles.forEach(
        obstacle => {

            obstacle.y +=
                delta *
                (
                    215 +
                    gameSpeed *
                    70 *
                    obstacle.speed
                );

        }
    );


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y <
                1100
        );


    /*
       Smooth lane movement
    */

    currentLane +=
        (
            targetLane -
            currentLane
        ) *
        Math.min(
            1,
            delta * 14
        );


    /*
       Every 100 meters = 1 point
    */

    const milestone =
        Math.floor(
            gameDistance /
            100
        );


    if (
        milestone >
        lastMilestone
    ) {

        const gained =
            milestone -
            lastMilestone;


        gamePoints +=
            gained;


        lastMilestone =
            milestone;


        showPointAnimation();

        updatePointsUI();

    }


    /*
       Collision
    */

    for (
        const obstacle
        of obstacles
    ) {

        if (
            checkCollision(
                obstacle
            )
        ) {

            endGame();

            return;

        }

    }

}


/* =========================================================
   DRAW GAME
========================================================= */

function drawGame() {

    drawRoad();


    obstacles.forEach(
        drawObstacle
    );


    drawCar();

}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(
    timestamp
) {

    if (!gameRunning)
        return;


    if (!lastFrame) {

        lastFrame =
            timestamp;

    }


    let delta =
        (
            timestamp -
            lastFrame
        ) /
        1000;


    lastFrame =
        timestamp;


    delta =
        Math.min(
            delta,
            .033
        );


    updateGame(
        delta
    );


    drawGame();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    if (
        !canvas ||
        !ctx ||
        !gameWorld
    ) {

        return;

    }


    cancelAnimationFrame(
        animationId
    );


    resizeCanvas();


    gameRunning =
        true;


    gameOver =
        false;


    lastFrame =
        0;


    gameDistance =
        0;


    gamePoints =
        0;


    gameSpeed =
        1;


    currentLane =
        1;


    targetLane =
        1;


    roadOffset =
        0;


    spawnTimer =
        0;


    obstacles =
        [];


    lastMilestone =
        0;


    const gameOverElement =
        document.getElementById(
            "gameOver"
        );


    if (gameOverElement) {

        gameOverElement.classList.add(
            "hidden"
        );

    }


    if (distanceText) {

        distanceText.textContent =
            "0m";

    }


    updatePointsUI();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   END GAME
========================================================= */

function endGame() {

    if (gameOver)
        return;


    gameRunning =
        false;


    gameOver =
        true;


    cancelAnimationFrame(
        animationId
    );


    /*
       ارسال بهترین رکورد به سرور
    */

    submitGameScore(
        gamePoints
    );


    const finalScore =
        document.getElementById(
            "finalGameScore"
        );


    if (finalScore) {

        finalScore.textContent =
            gamePoints;

    }


    const gameOverElement =
        document.getElementById(
            "gameOver"
        );


    if (gameOverElement) {

        gameOverElement.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   SUBMIT GAME SCORE
========================================================= */

async function submitGameScore(
    score
) {

    if (
        !user ||
        !tg
    ) {

        console.error(
            "Telegram user is unavailable."
        );

        return;

    }


    if (
        !score ||
        score <= 0
    ) {

        return;

    }


    if (!supabaseClient) {

        console.error(
            "Supabase is unavailable."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .functions
                .invoke(
                    "submit-score",
                    {

                        body: {

                            initData:
                                tg.initData,

                            score:
                                Math.floor(
                                    score
                                )

                        }

                    }
                );


        if (error) {

            console.error(
                "Submit score error:",
                error
            );

            return;

        }


        console.log(
            "Score submitted:",
            data
        );


    } catch (error) {

        console.error(
            "Score request failed:",
            error
        );

    }

}


/* =========================================================
   EXIT GAME
========================================================= */

function exitGame() {

    /*
       فعلاً امتیاز حساب روی localStorage است.

       بعداً آن را هم به سرور منتقل می‌کنیم.
    */

    if (
        gamePoints > 0
    ) {

        addPoints(
            gamePoints
        );

    }


    gameRunning =
        false;


    cancelAnimationFrame(
        animationId
    );


    gamePoints =
        0;


    showScreen(
        "home"
    );

}


/* =========================================================
   GAME BUTTONS
========================================================= */

const restartGameButton =
    document.getElementById(
        "restartGameButton"
    );


if (restartGameButton) {

    restartGameButton.addEventListener(
        "click",
        function () {

            startGame();

        }
    );

}


const exitGameButton =
    document.getElementById(
        "exitGameButton"
    );


if (exitGameButton) {

    exitGameButton.addEventListener(
        "click",
        function () {

            exitGame();

        }
    );

}


const gameBackButton =
    document.getElementById(
        "gameBackButton"
    );


if (gameBackButton) {

    gameBackButton.addEventListener(
        "click",
        function () {

            if (gameOver) {

                exitGame();

                return;

            }


            gameRunning =
                false;


            cancelAnimationFrame(
                animationId
            );


            /*
               با زدن × در وسط بازی،
               امتیاز همان بازی ثبت نمی‌شود.
            */

            gamePoints =
                0;


            showScreen(
                "home"
            );

        }
    );

}


/* =========================================================
   SWIPE
========================================================= */

if (gameWorld) {

    gameWorld.addEventListener(
        "touchstart",
        function (event) {

            const touch =
                event.changedTouches[0];


            if (!touch)
                return;


            swipeStartX =
                touch.clientX;


            swipeStartY =
                touch.clientY;

        },
        {
            passive:
                true
        }
    );


    gameWorld.addEventListener(
        "touchend",
        function (event) {

            const touch =
                event.changedTouches[0];


            if (!touch)
                return;


            const dx =
                touch.clientX -
                swipeStartX;


            const dy =
                touch.clientY -
                swipeStartY;


            /*
               فقط Swipe افقی
            */

            if (
                Math.abs(dx) <=
                Math.abs(dy)
            ) {

                return;

            }


            if (
                Math.abs(dx) <
                25
            ) {

                return;

            }


            if (
                dx > 0
            ) {

                targetLane =
                    Math.min(
                        2,
                        targetLane + 1
                    );

            } else {

                targetLane =
                    Math.max(
                        0,
                        targetLane - 1
                    );

            }

        },
        {
            passive:
                true
        }
    );

}


/* =========================================================
   POINT ANIMATION
========================================================= */

function showPointAnimation() {

    if (!pointAnimation)
        return;


    pointAnimation.textContent =
        "+1";


    pointAnimation.classList.remove(
        "show"
    );


    void pointAnimation.offsetWidth;


    pointAnimation.classList.add(
        "show"
    );

}


/* =========================================================
   SUPABASE TEST
========================================================= */

async function testSupabase() {

    if (!supabaseClient) {

        console.error(
            "Supabase library was not loaded."
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "game_leaderboard"
                )
                .select(
                    "*"
                )
                .limit(
                    5
                );


        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            return;

        }


        console.log(
            "Supabase connection successful:",
            data
        );


    } catch (error) {

        console.error(
            "Supabase Test Error:",
            error
        );

    }

}


/* =========================================================
   INITIALIZATION
========================================================= */

loadUser();

updatePointsUI();

testSupabase();

startApp();
