const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZ$";
const fallingObjects = [];
const objectSize = 30;
let score = 0;
let gameInterval;

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function createFallingObject() {
    let x;
    let overlap;
    do {
        overlap = false;
        x = Math.random() * (canvas.width - objectSize);
        for (const obj of fallingObjects) {
            if (Math.abs(obj.x - x) < objectSize) {
                overlap = true;
                break;
            }
        }
    } while (overlap);

    const symbol = getRandomSymbol();
    fallingObjects.push({ x, y: 0, symbol });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        obj.y += 2;

        if (obj.y > canvas.height) {
            fallingObjects.splice(i, 1);
            i--;
            continue;
        }

        ctx.fillStyle = obj.symbol === "$" ? "yellow" : "white";
        ctx.font = `${objectSize}px Arial`;
        ctx.fillText(obj.symbol, obj.x, obj.y);
    }

    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    createFallingObject();
    update();
}

function checkCollision(x, y) {
    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        const distance = Math.hypot(x - (obj.x + objectSize / 2), y - (obj.y - objectSize / 2));
        if (distance < objectSize / 2 + 3) { // 3 pixels tolerance
            if (obj.symbol === "$") {
                score++;
                fallingObjects.splice(i, 1);
                break;
            }
        }
    }
}

function getCanvasCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
    } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
    }
    return { x, y };
}

canvas.addEventListener("click", (e) => {
    const { x, y } = getCanvasCoordinates(e);
    checkCollision(x, y);
});

canvas.addEventListener("touchstart", (e) => {
    const { x, y } = getCanvasCoordinates(e);
    checkCollision(x, y);
});

function startGame() {
    if (startButton.textContent === "Start Game") {
        startButton.textContent = "Stop Game";
        gameInterval = setInterval(gameLoop, 50); // Faster interval for smoother falling
    } else {
        startButton.textContent = "Start Game";
        clearInterval(gameInterval);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fallingObjects.length = 0;
        score = 0;
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 10, 30);
    }
}

startButton.addEventListener("click", startGame); 