var Game = Game || {};
var Component = Component || {};

// attribute for game
var game;
var objectSize = 20;

// attribute for snake
var coorX
var coorY;
var snakeX;
var snakeY;
var tail;
var trail;

// attribute for food
var foodX;
var foodY;

// attribute for score
var score = 0;
var level = 1;
var levelMapping = [
    { level: 1, min: 0, max: 30 },
    { level: 2, min: 31, max: 60 },
    { level: 3, min: 61, max: 90 },
    { level: 4, min: 91, max: 120 },
];

// attribute for state game
var stateKeyCode = null;
var gameover = false;

function start() {
    generateSnake();
    generateFood();
    resetGame();

    new Game.Snake('stage');
}

function resetGame() {
    // reset level
    level = 1;
    document.querySelector('.level').innerHTML = level;

    // reset score
    score = 0;
    document.querySelector('.score').innerHTML = score;

    // reset game over
    gameover = false;
    document.querySelector('.game-over').style.display = 'none';
}

function generateSnake() {
    // generate coordinate snake
    coorX = 0;
    coorY = 0;
    snakeX = 0; 
    snakeY = 0;

    // generate trail and tail snake
    trail = [];
    tail = 5;
}

function generateFood() {
    // generate food at random location
    foodX = Math.floor(Math.random() * objectSize);
    foodY = Math.floor(Math.random() * objectSize);
}

function keyPress(event) {
    if (event.keyCode === 37 && stateKeyCode !== 39) {
        if(coorX == 0 && coorY == 0){
            // didn't allow to move left at start of game
            return;
        } else {
            stateKeyCode = event.keyCode;
            coorX = -1;
            coorY = 0;
        }
    } else if (event.keyCode === 39 && stateKeyCode !== 37) {
        stateKeyCode = event.keyCode;
        coorX = 1;
        coorY = 0;
    } else if (event.keyCode === 38 && stateKeyCode !== 40) {
        if(coorX == 0 && coorY == 0){
            // didn't allow to move up at start of game
            return;
        } else {
            stateKeyCode = event.keyCode;
            coorX = 0;
            coorY = -1;
        }
    } else if (event.keyCode === 40 && stateKeyCode !== 38) {
        stateKeyCode = event.keyCode;
        coorX = 0;
        coorY = 1;
    }
}

Component.Canvas = function (element) {
    var canvas = document.getElementById(element);
    var context = canvas.getContext('2d');
    return { canvas, context };
};

Component.Stage = function (element) {
    var { canvas, context } = new Component.Canvas(element);

    /**
     * Object move
     */

    snakeX += coorX;
    snakeY += coorY;

    if (snakeX < 0 || snakeX > objectSize - 1 || snakeY < 0 || snakeY > objectSize - 1){
        document.querySelector('.game-over').style.display = null;
        gameover = true;
        clearInterval(game);
    } 
    
    /**
     * Draw canvas to black
     */

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    /**
     * Draw object snake
     */

    context.fillStyle = 'lime';
    for (i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * objectSize, trail[i].y * objectSize, objectSize - 2, objectSize - 2);
    }
    trail.push({ x: snakeX, y: snakeY });


    if (trail.length > tail) {
        trail.shift();
    }

    /**
     * Draw object food
     */

    context.fillStyle = 'red';
    if (snakeX == foodX && snakeY == foodY) {

        // Increase snake
        tail++;

        // Scoring
        score += 10;
        document.querySelector('.score').innerHTML = score;

        // Initiate new food coordinate
        generateFood();
    }
    context.fillRect(foodX * objectSize, foodY * objectSize, objectSize - 2, objectSize - 2);

    // Leveling
    levelMapping.forEach(elm => {
        if (score >= elm.min && score <= elm.max) {
            level = elm.level;
        }
    });
    document.querySelector('.level').innerHTML = level;
};

Game.Snake = function (element) {
    document.onkeydown = keyPress;

    game = setInterval(function () {
        new Component.Stage(element);
    }, 1000 / 15);
};

window.onload = function () {
    start();
};

window.onclick = function () {
    if(gameover) {
        start();
    }
}