```javascript
/* =========================================================
   TELEGRAM
========================================================= */

const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

try {
    tg.setHeaderColor("#07080d");
    tg.setBackgroundColor("#07080d");
} catch (e) {
    console.log("Telegram theme methods unavailable.");
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

const placeholderScreen =
    document.getElementById("placeholderScreen");


/* =========================================================
   USER
========================================================= */

const user =
    tg.initDataUnsafe?.user || null;


function loadUser() {

    const name =
        user
            ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
            : "مهمان";


    const username =
        user?.username
            ? `@${user.username}`
            : "username ندارد";


    const nameElement =
        document.getElementById(
            "homeProfileName"
        );

    const usernameElement =
        document.getElementById(
            "homeProfileUsername"
        );


    if (nameElement) {
        nameElement.textContent =
            name || "کاربر";
    }


    if (usernameElement) {
        usernameElement.textContent =
            username;
    }


    const photo =
        document.getElementById(
            "homeProfilePhoto"
        );


    const fallback =
        document.getElementById(
            "homeProfileFallback"
        );


    if (!photo || !fallback) {
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
            (user?.first_name || "?")
                .charAt(0)
                .toUpperCase();

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


let gamePoints = 0;


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

    amount =
        Math.max(
            0,
            Number(amount) || 0
        );


    totalPoints +=
        amount;


    savePoints();

    updatePointsUI();

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


/*
    موقتاً فقط برای تست.

    سیستم واقعی License بعداً روی سرور
    پیاده‌سازی خواهد شد.
*/


function checkLicense(license) {

    const value =
        String(license || "")
            .trim();


    if (!value) {

        return {
            valid: false,
            message:
                "لطفاً لایسنس را وارد کنید."
        };

    }


    if (value.length < 8) {

        return {
            valid: false,
            message:
                "لایسنس معتبر نیست."
        };

    }


    return {
        valid: true
    };

}


if (licenseButton) {

    licenseButton.addEventListener(
        "click",
        () => {

            const result =
                checkLicense(
                    licenseInput
                        ? licenseInput.value
                        : ""
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


            if (licenseInput) {

                localStorage.setItem(
                    "dex_license",
                    licenseInput.value.trim()
                );

            }


            showScreen(
                "home"
            );

        }
    );

}


if (licenseInput) {

    licenseInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                if (licenseButton) {

                    licenseButton.click();

                }

            }

        }
    );

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


    /*
       مهم:
       صفحه License هم باید فعال شود.
    */

    if (
        name === "license" &&
        licenseScreen
    ) {

        licenseScreen.classList.add(
            "active"
        );

    }


    if (
        name === "home" &&
        homeScreen
    ) {

        homeScreen.classList.add(
            "active"
        );

    }


    if (
        name === "game" &&
        gameScreen
    ) {

        gameScreen.classList.add(
            "active"
        );

    }


    if (
        name === "rewards" &&
        rewardsScreen
    ) {

        rewardsScreen.classList.add(
            "active"
        );

    }


    if (
        name === "placeholder" &&
        placeholderScreen
    ) {

        placeholderScreen.classList.add(
            "active"
        );

    }


    updatePointsUI();

}


/* =========================================================
   APP START
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
   HOME → GAME
========================================================= */

const miniGameButton =
    document.getElementById(
        "miniGameButton"
    );


if (miniGameButton) {

    miniGameButton.addEventListener(
        "click",
        () => {

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
    .querySelectorAll(".home-card")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

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

                    const names = {

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


                    const placeholderTitle =
                        document.getElementById(
                            "placeholderTitle"
                        );


                    if (
                        placeholderTitle
                    ) {

                        placeholderTitle.textContent =
                            names[page] ||
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
    .querySelectorAll(".page-back")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

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


    container.innerHTML = "";


    rewards.forEach(
        reward => {

            const canBuy =
                totalPoints >=
                reward.price;


            const card =
                document.createElement(
                    "div"
                );


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
                    class="reward-button ${canBuy ? "" : "disabled"}"
                    data-reward="${reward.id}"
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


    document
        .querySelectorAll(
            ".reward-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const reward =
                            rewards.find(
                                item =>
                                    item.id ===
                                    Number(
                                        button.dataset.reward
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
   GAME
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


let animationId = null;

let gameRunning = false;

let gameOver = false;

let gameLastTime = 0;

let gameDistance = 0;

let gameSpeed = 1;

let lane = 1;

let targetLane = 1;

let roadOffset = 0;

let obstacleTimer = 0;

let obstacles = [];

let lastPointMilestone = 0;

let swipeStartX = 0;

let swipeStartY = 0;


/*
   100 متر در هر 10 ثانیه
   = 10 متر در ثانیه
*/

const METERS_PER_SECOND = 10;


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
    () => {

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

        width: rect.width,

        height: rect.height

    };

}


function getRoad(width) {

    const roadWidth =
        Math.min(
            width * 0.78,
            420
        );


    const roadLeft =
        (width - roadWidth) / 2;


    return {

        left: roadLeft,

        width: roadWidth,

        laneWidth:
            roadWidth / 3

    };

}


function laneCenter(
    index,
    width
) {

    const road =
        getRoad(width);


    return (
        road.left +
        road.laneWidth * index +
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
    } = getGameSize();


    const road =
        getRoad(width);


    /* Grass */

    ctx.fillStyle =
        "#18311f";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* Grass lines */

    ctx.fillStyle =
        "#1b3923";


    const stripe =
        42;


    for (
        let y =
            -stripe +
            roadOffset * .25;

        y < height;

        y += stripe
    ) {

        ctx.fillRect(
            0,
            y,
            width,
            2
        );

    }


    /* Road */

    ctx.fillStyle =
        "#24272b";

    ctx.fillRect(
        road.left,
        0,
        road.width,
        height
    );


    /* Texture */

    ctx.strokeStyle =
        "rgba(255,255,255,.025)";

    ctx.lineWidth =
        1;


    for (
        let y = -80;

        y < height + 80;

        y += 34
    ) {

        ctx.beginPath();

        ctx.moveTo(
            road.left,
            y + roadOffset * .4
        );

        ctx.lineTo(
            road.left +
            road.width,
            y + roadOffset * .4
        );

        ctx.stroke();

    }


    /* Side lines */

    ctx.fillStyle =
        "#d8d8d8";

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


    /* Lane lines */

    ctx.setLineDash(
        [28, 25]
    );

    ctx.lineWidth =
        3;

    ctx.strokeStyle =
        "rgba(255,255,255,.25)";


    for (
        let i = 1;
        i < 3;
        i++
    ) {

        const x =
            road.left +
            road.laneWidth * i;


        ctx.beginPath();

        ctx.moveTo(
            x,
            -100
        );

        ctx.lineTo(
            x,
            height + 100
        );

        ctx.stroke();

    }


    ctx.setLineDash([]);

}


/* =========================================================
   DRAW CAR
========================================================= */

function drawCar() {

    if (!ctx)
        return;


    const {
        width,
        height
    } = getGameSize();


    const road =
        getRoad(width);


    const x =
        laneCenter(
            lane,
            width
        );


    const carWidth =
        Math.min(
            road.laneWidth * .52,
            67
        );


    const carHeight =
        carWidth * 1.6;


    const y =
        height - 165;


    /* Shadow */

    ctx.fillStyle =
        "rgba(0,0,0,.35)";


    ctx.beginPath();

    ctx.ellipse(
        x,
        y + carHeight * .48,
        carWidth * .65,
        carHeight * .18,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* Body */

    const gradient =
        ctx.createLinearGradient(
            x,
            y,
            x,
            y + carHeight
        );


    gradient.addColorStop(
        0,
        "#f44336"
    );


    gradient.addColorStop(
        1,
        "#a91511"
    );


    ctx.fillStyle =
        gradient;


    roundRect(
        ctx,
        x - carWidth / 2,
        y,
        carWidth,
        carHeight,
        14
    );


    ctx.fill();


    /* Windshield */

    ctx.fillStyle =
        "#1b2129";


    roundRect(
        ctx,
        x - carWidth * .34,
        y + carHeight * .17,
        carWidth * .68,
        carHeight * .25,
        8
    );


    ctx.fill();


    /* Lights */

    ctx.fillStyle =
        "#ffe8a3";


    roundRect(
        ctx,
        x - carWidth * .35,
        y + carHeight * .06,
        carWidth * .20,
        carHeight * .09,
        4
    );


    ctx.fill();


    roundRect(
        ctx,
        x + carWidth * .15,
        y + carHeight * .06,
        carWidth * .20,
        carHeight * .09,
        4
    );


    ctx.fill();


    /* Wheels */

    ctx.fillStyle =
        "#0a0b0e";


    ctx.fillRect(
        x - carWidth * .57,
        y + carHeight * .23,
        carWidth * .13,
        carHeight * .28
    );


    ctx.fillRect(
        x + carWidth * .44,
        y + carHeight * .23,
        carWidth * .13,
        carHeight * .28
    );


    /* Highlight */

    ctx.fillStyle =
        "rgba(255,255,255,.16)";


    roundRect(
        ctx,
        x - carWidth * .20,
        y + carHeight * .08,
        carWidth * .10,
        carHeight * .75,
        5
    );


    ctx.fill();

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
   CREATE OBSTACLE
========================================================= */

function createObstacle() {

    const randomLane =
        Math.floor(
            Math.random() * 3
        );


    obstacles.push({

        lane:
            randomLane,

        y:
            -120,

        speed:
            1 +
            Math.random() * .8,

        type:
            Math.random() > .5
                ? "barrier"
                : "traffic"

    });

}


/* =========================================================
   DRAW OBSTACLE
========================================================= */

function drawObstacle(
    obstacle
) {

    if (!ctx)
        return;


    const {
        width
    } = getGameSize();


    const road =
        getRoad(width);


    const x =
        laneCenter(
            obstacle.lane,
            width
        );


    const w =
        Math.min(
            road.laneWidth * .58,
            70
        );


    const h =
        75;


    if (
        obstacle.type ===
        "traffic"
    ) {

        ctx.fillStyle =
            "#315ec9";


        roundRect(
            ctx,
            x - w / 2,
            obstacle.y,
            w,
            h,
            11
        );


        ctx.fill();


        ctx.fillStyle =
            "#1b2029";


        roundRect(
            ctx,
            x - w * .30,
            obstacle.y + 13,
            w * .60,
            h * .32,
            7
        );


        ctx.fill();


        ctx.fillStyle =
            "#f4d36c";


        ctx.fillRect(
            x - w * .32,
            obstacle.y + h - 15,
            w * .18,
            6
        );


        ctx.fillRect(
            x + w * .14,
            obstacle.y + h - 15,
            w * .18,
            6
        );

    } else {

        ctx.fillStyle =
            "#e5483f";


        roundRect(
            ctx,
            x - w / 2,
            obstacle.y,
            w,
            h * .55,
            9
        );


        ctx.fill();


        ctx.fillStyle =
            "#fff3d0";


        for (
            let i = -1;
            i <= 1;
            i++
        ) {

            ctx.save();

            ctx.translate(
                x +
                i * w * .25,
                obstacle.y +
                h * .28
            );

            ctx.rotate(
                -0.55
            );


            ctx.fillRect(
                -w * .07,
                -h * .03,
                w * .14,
                h * .34
            );


            ctx.restore();

        }

    }

}


/* =========================================================
   COLLISION
========================================================= */

function hasCollision(
    obstacle
) {

    const {
        width,
        height
    } = getGameSize();


    const road =
        getRoad(width);


    const carX =
        laneCenter(
            lane,
            width
        );


    const carW =
        Math.min(
            road.laneWidth * .52,
            67
        );


    const carH =
        carW * 1.6;


    const carY =
        height - 165;


    const obstacleW =
        Math.min(
            road.laneWidth * .58,
            70
        );


    const obstacleH =
        75;


    if (
        obstacle.lane !==
        Math.round(lane)
    )
        return false;


    return (

        obstacle.y +
            obstacleH * .75
            >= carY

        &&

        obstacle.y
            <= carY + carH

        &&

        Math.abs(
            laneCenter(
                obstacle.lane,
                width
            ) - carX
        )
        <
        (carW + obstacleW) /
        2.25

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


    /* gradual acceleration */

    gameSpeed +=
        delta * .018;


    roadOffset +=
        delta *
        (
            170 +
            gameSpeed * 30
        );


    /* obstacle spawn */

    obstacleTimer +=
        delta;


    const spawnInterval =
        Math.max(
            .55,
            .95 -
            gameSpeed * .055
        );


    if (
        obstacleTimer >=
        spawnInterval
    ) {

        obstacleTimer = 0;

        createObstacle();

    }


    /* move obstacles */

    obstacles.forEach(
        obstacle => {

            obstacle.y +=
                delta *
                (
                    210 +
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


    /* Smooth lane movement */

    lane +=
        (
            targetLane -
            lane
        ) *
        Math.min(
            1,
            delta * 14
        );


    /* Score milestone */

    const milestone =
        Math.floor(
            gameDistance / 100
        );


    if (
        milestone >
        lastPointMilestone
    ) {

        const gained =
            milestone -
            lastPointMilestone;


        gamePoints +=
            gained;


        lastPointMilestone =
            milestone;


        showPointAnimation(
            gained
        );


        updatePointsUI();

    }


    /* Collision */

    for (
        const obstacle
        of obstacles
    ) {

        if (
            hasCollision(
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


    if (!gameLastTime) {

        gameLastTime =
            timestamp;

    }


    let delta =
        (
            timestamp -
            gameLastTime
        ) / 1000;


    gameLastTime =
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


    gameRunning = true;

    gameOver = false;

    gameLastTime = 0;

    gameDistance = 0;

    gamePoints = 0;

    gameSpeed = 1;

    lane = 1;

    targetLane = 1;

    roadOffset = 0;

    obstacleTimer = 0;

    obstacles = [];

    lastPointMilestone = 0;


    const gameOverElement =
        document.getElementById(
            "gameOver"
        );


    if (gameOverElement) {

        gameOverElement.classList.add(
            "hidden"
        );

    }


    const finalScore =
        document.getElementById(
            "finalGameScore"
        );


    if (finalScore) {

        finalScore.textContent =
            "0";

    }


    updatePointsUI();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   GAME OVER
========================================================= */

function endGame() {

    if (gameOver)
        return;


    gameRunning = false;

    gameOver = true;


    cancelAnimationFrame(
        animationId
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
   POINT ANIMATION
========================================================= */

function showPointAnimation(
    amount
) {

    if (!pointAnimation)
        return;


    pointAnimation.textContent =
        `+${amount}`;


    pointAnimation.classList.remove(
        "show"
    );


    void pointAnimation.offsetWidth;


    pointAnimation.classList.add(
        "show"
    );

}


/* =========================================================
   EXIT GAME
========================================================= */

function finishGameAndExit() {

    /*
       Prototype:

       در این نسخه امتیاز بازی
       هنگام خروج به حساب اضافه می‌شود.

       نسخه نهایی:
       امتیاز باید روی سرور ثبت شود.
    */

    if (
        gamePoints > 0
    ) {

        addPoints(
            gamePoints
        );

    }


    gameRunning = false;

    cancelAnimationFrame(
        animationId
    );


    gamePoints = 0;


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
        () => {

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
        () => {

            finishGameAndExit();

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
        () => {

            if (gameOver) {

                finishGameAndExit();

            } else {

                gameRunning = false;

                cancelAnimationFrame(
                    animationId
                );

                showScreen(
                    "home"
                );

            }

        }
    );

}


/* =========================================================
   SWIPE
========================================================= */

if (gameWorld) {

    gameWorld.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches[0];


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
        event => {

            const touch =
                event.changedTouches[0];


            const dx =
                touch.clientX -
                swipeStartX;


            const dy =
                touch.clientY -
                swipeStartY;


            if (
                Math.abs(dx) <=
                Math.abs(dy)
            )
                return;


            if (
                Math.abs(dx) < 25
            )
                return;


            if (dx > 0) {

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
   START
========================================================= */

loadUser();

updatePointsUI();

startApp();
```
