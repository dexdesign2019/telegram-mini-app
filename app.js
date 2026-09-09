```javascript
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
        tg.setHeaderColor("#07080d");
    } catch (e) {}

    try {
        tg.setBackgroundColor("#07080d");
    } catch (e) {}

}


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://dnhzloyskxcihkkaspez.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_f8eKkpgrTdFK08_XQq-ozg_24-UOyLh";

let supabaseClient = null;


if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
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
    document.getElementById("licenseScreen");

const homeScreen =
    document.getElementById("homeScreen");

const gameScreen =
    document.getElementById("gameScreen");

const rewardsScreen =
    document.getElementById("rewardsScreen");

const leaderboardScreen =
    document.getElementById("leaderboardScreen");

const placeholderScreen =
    document.getElementById("placeholderScreen");


/* =========================================================
   USER
========================================================= */

const user =
    tg?.initDataUnsafe?.user || null;


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
        user?.first_name || "";

    const lastName =
        user?.last_name || "";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const username =
        user?.username
            ? `@${user.username}`
            : "username ندارد";


    if (nameElement) {

        nameElement.textContent =
            fullName || "کاربر";

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


function addPoints(amount) {

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
   SCREEN MANAGEMENT
========================================================= */

function hideAllScreens() {

    document
        .querySelectorAll(".screen")
        .forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );

            }
        );

}


function showScreen(name) {

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


        case "rewards":

            if (rewardsScreen) {

                rewardsScreen.classList.add(
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
   APP START
========================================================= */

function startApp() {

    /*
       برای اینکه تست ورود راحت باشد،
       فعلاً اگر License ذخیره شده باشد
       کاربر مستقیم وارد Home می‌شود.
    */

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


function checkLicense(value) {

    const license =
        String(
            value || ""
        )
            .trim();


    if (!license) {

        return {

            valid: false,

            message:
                "لطفاً لایسنس را وارد کنید."

        };

    }


    if (
        license.length < 8
    ) {

        return {

            valid: false,

            message:
                "لایسنس باید حداقل ۸ کاراکتر باشد."

        };

    }


    /*
       فعلاً برای تست همه کدهای
       ۸ کاراکتری یا بیشتر قبول می‌شوند.

       بعداً این بخش به سیستم License
       واقعی روی سرور وصل می‌شود.
    */

    return {

        valid: true

    };

}


/*
   دکمه ورود
*/

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


            if (!result.valid) {

                return;

            }


            /*
               ذخیره License
            */

            localStorage.setItem(
                "dex_license",
                value
            );


            /*
               ورود به Home
            */

            showScreen(
                "home"
            );

        }
    );

}


/*
   Enter روی کیبورد
*/

if (licenseInput) {

    licenseInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Enter"
            ) {

                if (licenseButton) {

                    licenseButton.click();

                }

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
   HOME BUTTONS
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


                    /*
                       Rewards
                    */

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


                    /*
                       سایر صفحات
                    */

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
                            || "بخش";

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
        id: 1,
        name: "کتاب الکترونیکی",
        icon: "📘",
        price: 5
    },

    {
        id: 2,
        name: "Badge اختصاصی",
        icon: "🏅",
        price: 10
    },

    {
        id: 3,
        name: "والپیپر اختصاصی",
        icon: "🖼️",
        price: 15
    },

    {
        id: 4,
        name: "پک آیکن",
        icon: "✨",
        price: 20
    },

    {
        id: 5,
        name: "اکسسوری",
        icon: "🧢",
        price: 30
    },

    {
        id: 6,
        name: "T-Shirt",
        icon: "👕",
        price: 50
    },

    {
        id: 7,
        name: "Design Audit",
        icon: "🔍",
        price: 80
    },

    {
        id: 8,
        name: "منتورینگ خصوصی",
        icon: "🧠",
        price: 120
    },

    {
        id: 9,
        name: "Desk Mat",
        icon: "🖱️",
        price: 160
    },

    {
        id: 10,
        name: "دوره Premium",
        icon: "🎓",
        price: 250
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
                    ${canBuy ? "" : "disabled"}
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

let leaderboardData = [];


function getCurrentMonthKey() {

    const now =
        new Date();


    return `${now.getFullYear()}-${
        String(
            now.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            )
    }-01`;

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
                .select("*")
                .eq(
                    "month_key",
                    getCurrentMonthKey()
                )
                .order(
                    "best_score",
                    {
                        ascending: false
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


function escapeHtml(value) {

    return String(value)

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


function renderLeaderboard() {

    const list =
        document.getElementById(
            "leaderboardList"
        );


    if (!list)
        return;


    const playerCount =
        document.getElementById(
            "playerCount"
        );


    const leaderboardPlayers =
        document.getElementById(
            "leaderboardPlayers"
        );


    const totalPlayers =
        leaderboardData.length;


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


            const isMe =
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
                "leaderboard-row" +
                (
                    isMe
                        ? " current-user"
                        : ""
                );


            let rankText =
                String(rank);


            if (
                rank === 1
            )
                rankText =
                    "🥇";


            if (
                rank === 2
            )
                rankText =
                    "🥈";


            if (
                rank === 3
            )
                rankText =
                    "🥉";


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


                <div
                    class="leaderboard-user"
                >

                    <div
                        class="leaderboard-name"
                    >
                        ${escapeHtml(name)}
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
                    ★ ${player.best_score}
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
            leaderboardData[
                myIndex
            ].best_score
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
    )
        return;


    const rect =
        gameWorld.getBoundingClientRect();


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    canvas.width =
        Math.floor(
            rect.width * dpr
        );


    canvas.height =
        Math.floor(
            rect.height * dpr
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

            width: 0,

            height: 0

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


function getRoad(width) {

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
            roadWidth / 3

    };

}


function getLaneX(
    laneIndex,
    width
) {

    const road =
        getRoad(width);


    return (
        road.left +
        road.laneWidth *
            laneIndex +
        road.laneWidth / 2
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
        getRoad(width);


    ctx.fillStyle =
        "#18311f";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    ctx.fillStyle =
        "#25282c";


    ctx.fillRect(
        road.left,
        0,
        road.width,
        height
    );


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
        getRoad(width);


    const x =
        getLaneX(
            currentLane,
            width
        );


    const carWidth =
        Math.min(
            road.laneWidth * .52,
            66
        );


    const carHeight =
        carWidth * 1.60;


    const y =
        height - 170;


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


    const body =
        ctx.createLinearGradient(
            x,
            y,
            x,
            y + carHeight
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
        x - carWidth / 2,
        y,
        carWidth,
        carHeight,
        13
    );


    ctx.fill();


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
   OBSTACLES
========================================================= */

function createObstacle() {

    obstacles.push({

        lane:
            Math.floor(
                Math.random() * 3
            ),

        y:
            -120,

        type:
            Math.random() > .5
                ? "car"
                : "barrier",

        speed:
            .9 +
            Math.random() * .4

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
        getRoad(width);


    const x =
        getLaneX(
            obstacle.lane,
            width
        );


    const w =
        Math.min(
            road.laneWidth * .58,
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
            x - w / 2,
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
            x - w * .30,
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
            x - w / 2,
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
        getRoad(width);


    const carWidth =
        Math.min(
            road.laneWidth * .52,
            66
        );


    const carHeight =
        carWidth * 1.60;


    const carY =
        height - 170;


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


    gameSpeed +=
        delta *
        .020;


    roadOffset +=
        delta *
        (
            180 +
            gameSpeed *
            30
        );


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

        spawnTimer = 0;

        createObstacle();

    }


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


    currentLane +=
        (
            targetLane -
            currentLane
        ) *
        Math.min(
            1,
            delta * 14
        );


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
    )
        return;


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
       ارسال رکورد به سرور.
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
   SUBMIT SCORE
========================================================= */

async function submitGameScore(
    score
) {

    if (
        !user ||
        !tg
    ) {

        console.error(
            "Telegram user not available."
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
            "Supabase is not connected."
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
                "Score submit error:",
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
       امتیاز بازی فعلاً برای حساب محلی
       هم اضافه می‌شود.

       بعداً این بخش را هم کاملاً
       روی سرور منتقل می‌کنیم.
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
            passive: true
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
            passive: true
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
   FINAL INITIALIZATION
========================================================= */

loadUser();

updatePointsUI();

startApp();
```
