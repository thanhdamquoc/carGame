let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let speedDisplay = document.getElementById("speedDisplay");
let scoreDisplay = document.getElementById("scoreDisplay");

c.style.border = "1px solid black";
c.width = 700;
c.height = 500;
let gameScore = 10000;

let Player = function Player(x, y, width, height, speed, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;

    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    this.move = function(direction) {
        switch (direction) {
            case 0:
                this.x -= this.speed;
                break;
            case 1:
                this.x += this.speed;
                break;
            case 2:
                this.y -= this.speed;
                break;
            case 3:
                this.y += this.speed;
                break;
        }
    }
}

let carHeight = 45;
let car = new Player(c.width/2, carHeight /2 , 30, carHeight, 12, "black");
let destination = new Player(c.width - car.width/2, c.height - car.height/2, car.width, car.height, null, "green");
let enemies = [];
let animationFrameID;

function render() {
    //general settings
    let isWon = ((car.x === destination.x) && (car.y === destination.y));
    if (isWon) {
        cancelAnimationFrame(animationFrameID);
        return;
    }
    clearScreen();
    speedDisplay.innerHTML = "Speed: " + car.speed + " (Q: decrease speed, E: increase speed)";
    gameScore -= 1;
    scoreDisplay.innerText = "Score: " + gameScore + " points";
    //prevent player from going off-screen
    if (car.x < car.width/2) {car.x = car.width/2}
    if (car.x > c.width - car.width/2) {car.x = c.width - car.width/2}
    if (car.y < car.height/2) {car.y = car.height/2}
    if (car.y > c.height - car.height/2) {car.y = c.height - car.height/2}
    //draw player & destination
    destination.draw();
    car.draw();
    //spawn enemies
    let enemyRow;
    for (enemyRow = 0; enemyRow < 4; enemyRow++ ) {
        let y = (enemyRow+1) * 100;
        let randomCondition = (enemyRow+1)/100
        if (Math.random() < randomCondition) {
            enemies.push(new Player(710,y,60,40,10,"red"));
        }
    }
    //draw enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move(0);
        enemies[i].draw();
        //detect collision & remove off-screen enemies
        let distX = Math.abs(car.x - enemies[i].x);
        let distY = Math.abs(car.y - enemies[i].y);
        let isCollided = ((distX < (car.width + enemies[i].width)/2) && (distY < (car.height + enemies[i].height)/2));
        let isOffScreen = enemies[i].x < -enemies[i].width/2;
        if (isCollided) {
            enemies.splice(i,1);
            gameScore -= 3000;
        }
        if (isOffScreen) {
            enemies.splice(i,1);
        }
    }
    animationFrameID = requestAnimationFrame(render);
}
requestAnimationFrame(render);

function clearScreen() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.rect(0, 0, c.width, c.height);
    ctx.fill();
}

addEventListener("keypress", listenKeyPress);
function listenKeyPress(event) {
    let direction;
    switch (event.keyCode) {
        case 97:
            direction = 0;
            break;
        case 100:
            direction = 1;
            break;
        case 119:
            direction = 2;
            break;
        case 115:
            direction = 3;
            break;
        case 113:
            car.speed -= 1;
            break;
        case 101:
            car.speed += 1;
            break;
    }
    car.move(direction);
}
