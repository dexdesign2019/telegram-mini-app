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


    document.getElementById(
        "homeProfileName"
    ).textContent = name || "کاربر";


    document.getElementById(
        "homeProfileUsername"
    ).textContent = username;


    const photo =
        document.getElementById(
            "homeProfilePhoto"
        );


    const fallback =
        document.getElementById(
            "homeProfileFallback"
        );


    if (user?.photo_url) {

        photo.src = user.photo_url;

        photo.style.display = "block";

        fallback.style.display = "none";

    } else {

        photo.style.display = "none";

        fallback.style.display = "flex";

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
        localStorage.getItem("dex_total_points")
    ) || 0;


/*
    Prototype only.

    در نسخه نهایی این مقدار باید
    از سرور دریافت شود.
*/


function savePoints() {

    localStorage.setItem(
        "dex_total_points",
        String(totalPoints)
    );

}


function updatePointsUI() {

    const homeScore =
        document.getElementById("homeScore");

    const rewardScore =
        document.getElementById("rewardScore");

    const gameScore =
        document.getElementById("gameScore");


    if (homeScore)
        homeScore.textContent = totalPoints;


    if (rewardScore)
        rewardScore.textContent = totalPoints;


    if (gameScore)
        gameScore.textContent = gamePoints;

}


function addPoints(amount) {

    amount = Math.max(
        0,
        Number(amount) || 0
    );


    totalPoints += amount;

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
    موقتاً برای تست:

    هر کد حداقل 8 کاراکتری قبول می‌شود.

    سیستم اصلی License بعداً به سرور وصل می‌شود.
*/


function checkLicense(license) {

    const value =
        license.trim();


    if (!value) {

        return {
            valid: false,
            message: "لطفاً لایسنس را وارد کنید."
        };

    }


    if (value.length < 8) {

        return {
            valid: false,
            message: "لایسنس معتبر نیست."
        };

    }


    return {
        valid: true
    };

}


licenseButton.addEventListener(
    "click",
    () => {

        const result =
            checkLicense(
                licenseInput.value
            );


        licenseMessage.textContent =
            result.valid
                ? ""
                : result.message;


        if (!result.valid)
            return;


        localStorage.setItem(
            "dex_license",
            licenseInput.value.trim()
        );


        showScreen("home");

    }
);


licenseInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            licenseButton.click();

        }

    }
);


/* =========================================================
   SCREENS
========================================================= */

function hideAllScreens() {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove(
                "active"
            );

        });

}


function showScreen(name) {

    hideAllScreens();


    if (name === "home")
        homeScreen.classList.add("active");


    if (name === "game")
        gameScreen.classList.add("active");


    if (name === "rewards")
        rewardsScreen.classList.add("active");


    if (name === "placeholder")
        placeholderScreen.classList.add("active");


    updatePointsUI();

}


function startApp() {

    const savedLicense =
        localStorage.getItem(
            "dex_license"
        );


    if (savedLicense) {

        showScreen("home");

    } else {

        showScreen("license");

    }

}


/* =========================================================
   HOME
========================================================= */

document
    .getElementById("miniGameButton")
    .addEventListener(
        "click",
        () => {

            showScreen("game");

            startGame();

        }
    );


document
    .querySelectorAll(".home-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;


                if (page === "rewards") {

                    renderRewards();

                    showScreen(
                        "rewards"
                    );

                    return;

                }


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


                document
                    .getElementById(
                        "placeholderTitle"
                    )
                    .textContent =
                    names[page] || "بخش";


                showScreen(
                    "placeholder"
                );

            }
        );

    });


/* =========================================================
   BACK BUTTONS
========================================================= */

document
    .querySelectorAll(".page-back")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showScreen("home");

            }
        );

    });


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


    container.innerHTML = "";


    rewards.forEach(reward => {

        const canBuy =
            totalPoints >= reward.price;


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
                ${canBuy ? "دریافت جایزه" : "امتیاز کافی نیست"}
            </button>

        `;


        container.appendChild(card);

    });


    document
        .querySelectorAll(".reward-button")
        .forEach(button => {

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

        });

}


/* =========================================================
   GAME ENGINE
========================================================= */

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext("2d");


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

let gamePoints = 0;

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
    Every 10 real seconds:

    100m

    یعنی 10 متر بر ثانیه.

    سرعت تصویری بازی به‌تدریج
    افزایش پیدا می‌کند، ولی منطق
    امتیازدهی بر اساس milestone است.
*/


const METERS_PER_SECOND = 10;


function resizeCanvas() {

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

        if (gameRunning)
            resizeCanvas();

    }
);


/* =========================================================
   GAME GEOMETRY
========================================================= */

function getGameSize() {

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


function laneCenter(index, width) {

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

    const { width, height } =
        getGameSize();


    const road =
        getRoad(width);


    /* grass */

    ctx.fillStyle =
        "#18311f";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* subtle grass stripes */

    ctx.fillStyle =
        "#1b3923";


    const grassStripe =
        42;


    for (
        let y = -grassStripe + roadOffset * .25;
        y < height;
        y += grassStripe
    ) {

        ctx.fillRect(
            0,
            y,
            width,
            2
        );

    }


    /* road */

    ctx.fillStyle =
        "#24272b";

    ctx.fillRect(
        road.left,
        0,
        road.width,
        height
    );


    /* asphalt texture */

    ctx.strokeStyle =
        "rgba(255,255,255,.025)";

    ctx.lineWidth = 1;


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
            road.left + road.width,
            y + roadOffset * .4
        );

        ctx.stroke();

    }


    /* side lines */

    ctx.fillStyle =
        "#d8d8d8";

    ctx.fillRect(
        road.left,
        0,
        3,
        height
    );


    ctx.fillRect(
        road.left + road.width - 3,
        0,
        3,
        height
    );


    /* lane lines */

    ctx.setLineDash(
        [28, 25]
    );


    ctx.lineWidth = 3;

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

    const { width, height } =
        getGameSize();


    const x =
        laneCenter(
            lane,
            width
        );


    const carWidth =
        Math.min(
            getRoad(width).laneWidth * .52,
            67
        );


    const carHeight =
        carWidth * 1.6;


    const y =
        height - 165;


    /* shadow */

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


    /* body */

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


    /* windshield */

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


    /* front light */

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


    /* wheels */

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


    /* shine */

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
   HELPER
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

    const randomLane =
        Math.floor(
            Math.random() * 3
        );


    obstacles.push({

        lane: randomLane,

        y: -120,

        speed:
            1 + Math.random() * .8,

        type:
            Math.random() > .5
                ? "barrier"
                : "traffic"

    });

}


function drawObstacle(
    obstacle
) {

    const { width } =
        getGameSize();


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
                x + i * w * .25,
                obstacle.y + h * .28
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

    const { width, height } =
        getGameSize();


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
        obstacle.lane !== lane
    )
        return false;


    return (

        obstacle.y + obstacleH * .75
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
        (carW + obstacleW) / 2.25

    );

}


/* =========================================================
   GAME UPDATE
========================================================= */

function updateGame(
    delta
) {

    /*
       Distance is fixed at:

       10 meters / second

       => 100 meters / 10 seconds
    */

    gameDistance +=
        METERS_PER_SECOND *
        delta;


    distanceText.textContent =
        `${Math.floor(gameDistance)}m`;


    /* gradual visual speed */

    gameSpeed +=
        delta * .018;


    roadOffset +=
        delta *
        (170 + gameSpeed * 30);


    /* obstacle spawn */

    obstacleTimer += delta;


    const spawnInterval =
        Math.max(
            0.55,
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


    /* obstacles */

    obstacles.forEach(
        obstacle => {

            obstacle.y +=
                delta *
                (210 +
                 gameSpeed * 70 *
                 obstacle.speed);

        }
    );


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.y < 1100
        );


    /* lane movement */

    lane +=
        (targetLane - lane) *
        Math.min(
            1,
            delta * 14
        );


    /* milestone */

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


    /* collisions */

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
   GAME DRAW
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


    if (!gameLastTime)
        gameLastTime =
            timestamp;


    let delta =
        (timestamp -
         gameLastTime) /
        1000;


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


    document
        .getElementById(
            "gameOver"
        )
        .classList.add(
            "hidden"
        );


    document
        .getElementById(
            "finalGameScore"
        )
        .textContent = "0";


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


    document
        .getElementById(
            "finalGameScore"
        )
        .textContent =
        gamePoints;


    document
        .getElementById(
            "gameOver"
        )
        .classList.remove(
            "hidden"
        );

}


/* =========================================================
   GAME POINT ANIMATION
========================================================= */

function showPointAnimation(
    amount
) {

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
   ADD GAME SCORE WHEN EXITING
========================================================= */

function finishGameAndExit() {

    /*
       امتیاز حاصل از همان بازی
       وارد امتیاز حساب می‌شود.
    */

    if (gamePoints > 0) {

        addPoints(
            gamePoints
        );

    }


    gamePoints = 0;

    showScreen("home");

}


/* =========================================================
   GAME BUTTONS
========================================================= */

document
    .getElementById(
        "restartGameButton"
    )
    .addEventListener(
        "click",
        () => {

            startGame();

        }
    );


document
    .getElementById(
        "exitGameButton"
    )
    .addEventListener(
        "click",
        () => {

            finishGameAndExit();

        }
    );


document
    .getElementById(
        "gameBackButton"
    )
    .addEventListener(
        "click",
        () => {

            if (
                gameOver
            ) {

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


/* =========================================================
   SWIPE
========================================================= */

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


        /*
           فقط حرکت افقی
        */

        if (
            Math.abs(dx)
            <=
            Math.abs(dy)
        )
            return;


        if (
            Math.abs(dx) <
            25
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


/* =========================================================
   INITIALIZE
========================================================= */

loadUser();

updatePointsUI();

startApp();
