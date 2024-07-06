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
    const x = Math.random() * (canvas.width - objectSize);
    const symbol = getRandomSymbol();
    fallingObjects.push({ x, y: 0, symbol });
    console.log("Created falling object:", { x, y: 0, symbol });
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

        ctx.fillStyle = obj.symbol === "$" ? "green" : "black";
        ctx.font = `${objectSize}px Arial`;
        ctx.fillText(obj.symbol, obj.x, obj.y);
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function checkCollision(x, y) {
    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        if (x > obj.x && x < obj.x + objectSize && y > obj.y && y < obj.y + objectSize) {
            if (obj.symbol === "$") {
                score++;
                fallingObjects.splice(i, 1);
                console.log("Collected $ symbol! Score:", score);
                break;
            }
        }
    }
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log("Click at:", { x, y });
    checkCollision(x, y);
});

canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    console.log("Touch at:", { x, y });
    checkCollision(x, y);
});

function startGame() {
    console.log("Starting game...");
    startButton.style.display = "none";
    canvas.style.display = "block";
    gameInterval = setInterval(() => {
        createFallingObject();
        update();
    }, 100);
}

startButton.addEventListener("click", startGame);
