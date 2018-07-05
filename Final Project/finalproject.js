var c;
var ctx;
var cw;
var ch;

var mode = "user";

var fps = 30;

var playerSize = 60;
var y = 0;
var my = 0;
var ducking = false;
var jump = false;
var highjump = false;
var ground = true;

var distance = 0;
var boxdist = 100;
var speed = 7;
var rects = [];
//type 0 -> ground box, type 1 -> tall box, type 2 -> floaty box
var obstacleTypes = 3;
var boxSize = 50;

window.onload=init;
function init() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    cw = c.width;
    ch = c.height;
    requestAnimationFrame(loop, 1000/fps);
}

function drawGround() {
    ctx.clearRect(0, 0, cw, ch);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000"
    ctx.beginPath();
    ctx.moveTo(0, ch/2);
    ctx.lineTo(cw, ch/2);
    ctx.stroke();
}

function addRect() {
    rects.push([cw / 2 + distance + Math.random() * 50, Math.floor(Math.random() * obstacleTypes)]);
}

function drawRects() {
    for(var i = 0; i < rects.length; i++) {
        var location = rects[i][0] - distance + cw / 2
        var type = rects[i][1]
        
        if(type == 0) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize * 2, boxSize, boxSize * 2);
            ctx.stroke();
        }
        if(type == 1) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize * 3, boxSize, boxSize * 2);
            ctx.stroke();
        }
        if(type == 2) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize, boxSize, boxSize);
            ctx.stroke();
            
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    if(ducking == false) {
        ctx.fillRect(cw/2 - playerSize/4, cw/2 - playerSize - y, playerSize / 2, playerSize);
    } else {
        ctx.fillRect(cw/2 - playerSize/4, cw/2 - playerSize / 2 - y, playerSize / 2, playerSize / 2);
    }
}
        
function loop() {
    drawGround();
    if(distance == speed * boxdist) {
        addRect();
        boxdist = 100 + Math.floor(Math.random() * 100) + distance / speed;
    }
    if(rects.length > 5) {
        rects.shift();
    }
    drawRects();
    drawPlayer();
    if(y > 0) {
        ground = false;
    } else {
        ground = true;
    }
    if(ground == true && jump == true) {
        my = 15;
    }
    my -= 1;
    y += my;
    if(y < 0) {
        my = 0;
        y = 0;
    }
    distance += speed;
    requestAnimationFrame(loop, 1000/fps);
}

window.onkeydown = function(e) {
    if(mode == "user") {
        if(e.keyCode == 87 || e.keyCode == 38) {
            jump = true;
        }
        if(e.keyCode == 83 || e.keyCode == 40) {
            ducking = true;
        }
        if(e.keyCode == 32) {
            highjump = true;
        }
    }
}
window.onkeyup = function(e) {
    if(mode == "user") {
        if(e.keyCode == 87 || e.keyCode == 32 || e.keyCode == 38) {
            jump = false;
        }
        if(e.keyCode == 83 || e.keyCode == 40) {
            ducking = false;
        }
        if(e.keyCode == 32) {
            highjump = false;
        }
    }
}