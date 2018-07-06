var c;
var ctx;
var cw;
var ch;

var mode = "AI";

var fps = 5;

var playerSize = 60;
var y = 0;
var my = 0;
var ducking = false;
var jump = false;
var highjump = false;
var ground = true;
var dead = false;
var menu = true;

var distance = 0;
var boxdist = 50;
var speed = 7;
var rects = [];
var boxWidth = 5;
//type 0 -> ground box, type 1 -> tall box, type 2 -> floaty box
var obstacleTypes = 3;
var boxSize = 50;
//__________________________________________________________neural network code starts here_______________________________________________________________________________________
//NEURAL NET VARS:
//input neurons.
var inputs = [];
//output neurons
var outputs = [];
//synapses/connections between neurons
var connections = [];
//used when testing to see if the previous state or new state performs better
var savedState = [];
//strength required to fire an output neuron
var activationStrength = 0.5;
//amount added/taken away from a connection during each test.
var randomStrength = 1;

//neural net functions:
function setupNet(numInputs, numOutputs) {
    
    for(var i = 0; i < numInputs; i++) {
        //represents the strength of imput coming in to this "neuron"
        inputs.push(0);
    }
    for(var i = 0; i < numOutputs; i++) {
        //represents the strength of output coming out of this "neuron"
        outputs.push(0);
    }
    for(var i = 0; i < numInputs; i++) {
        for(var j = 0; j < numOutputs; j++) {
            //item 0 is each connection's unique ID [input neuron, output neuron] | item 1 is each connection's weight.
            connections.push([[i, j], 0]);
        }
    }
    
}
//adds or subtracts a weight of the specified strength to a randomly selected connection.
function randomWeight(strength) {
    var rand = Math.floor(Math.random() * connections.length); 
    if(Math.random() < 0.5) {
        connections[rand][1] += strength;
    } else {
        connections[rand][1] -= strength / 2;
    }
        
}
//gets an output using the neural network 
function getOutput(inputData) {
    clearNet();
    //move input data to inputs list
    for(var i = 0; i < inputData.length; i++) {
        inputs[i] = inputData[i];
    }
    //grab the correct weight for each possible connection and multiply the values. this is the part that acutally "thinks"
    for(var i = 0; i < inputs.length; i++) {
        for(var j = 0; j < outputs.length; j++) {
            outputs[j] = outputs[j] + inputs[i] * searchForConn(i, j);
            console.log(i, j);
        }
    }
    //chose the best candidate output based on which is most heavily weighted.
    var candidate = [0];
    var best = activationStrength;
    for(var i = 0; i < outputs.length; i++) {
        if(outputs[i] > best) {
            candidate.push(i);
        }
    }
    return candidate;
}
//search for a specific connection based on ID
function searchForConn(input, output) {
    for(var i = 0; i < connections.length; i++) {
        if(input == connections[i][0][0] && output == connections[i][0][1]) {
            return connections[i][1];
        }
    }
    return "no match";
}
//clears the network so that data can be imported
function clearNet() {
    for(var i = 0; i < inputs.length; i++) {
        inputs[i] = 0;
    }
    for(var i = 0; i < outputs.length; i++) {
        outputs[i] = 0;
    }
}
function findNearestRect() {
    for(var i = 0; i < rects.length; i++) {
        if(rects[i][0] - distance > 0) {
            return i;
        }
        return [0]
    }
}
//gathers inputs from the game for the model to use.
function gatherImputs() {
    if(rects.length > 0) {
        var returnval = [];
        for(var i = 0; i < inputs.length; i++) {
            returnval.push(0);
            if(rects[findNearestRect()][1] == i) {
                returnval[i] = (200 - (rects[findNearestRect()][0] - distance)) / 100;
            }
        }
        return returnval;
    }
    return [0];
}
function AIloop() {
    var machineChoice = getOutput(gatherImputs());
    jump = false;
    ducking = false;
    if(machineChoice.includes(1) == true) {
        jump = true;
    }
    if(machineChoice.includes(2) == true) {
        crouch = true;
    }
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
        my = 16;
    }
    if(ground == true && highjump == true) {
        my = 20;
    }
    my -= 1;
    y += my;
    if(y < 0) {
        my = 0;
        y = 0;
    }
    distance += speed;
    if(checkCollisions() == false) {
        requestAnimationFrame(AIloop, 1000/fps);
    } else {
        console.log(outputs);
        dead = true;
        randomWeight(randomStrength);
        deathScreen();
        
    }
}
//__________________________________________________________neural network code ends here_________________________________________________________________________________________

window.onload=init;
function init() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    cw = c.width;
    ch = c.height;
    mainMenu();
}

//game functions
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
    var rand = Math.floor(Math.random() * obstacleTypes);
    var rand2 = cw / 2 + distance + Math.random() * 50;
    rects.push([rand2, rand]);
}

function drawRects() {
    for(var i = 0; i < rects.length; i++) {
        var location = rects[i][0] - distance + cw / 2;
        var type = rects[i][1];
        
        if(type == 0) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize, boxWidth , boxSize);
            ctx.stroke();
        }
        if(type == 1) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize * 2, boxWidth, boxSize * 2);
            ctx.stroke();
        }
        if(type == 2) {
            ctx.beginPath();
            ctx.rect(location, ch / 2 - boxSize * 3, boxWidth, boxSize * 2);
            ctx.stroke();
            
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    if(ducking == false) {
        ctx.fillRect(cw/2 - playerSize/4, ch/2 - playerSize - y, playerSize / 2, playerSize);
    } else {
        ctx.fillRect(cw/2 - playerSize/4, ch/2 - playerSize / 2 - y, playerSize / 2, playerSize / 2);
    }
}
//OK look i got it working I'm not even sure exactly what it does and some of the variables don't work as intended but the end result works perfectly. DO NOT TOUCH!
function checkCollisions() {
    var playerCenter = (ch / 2) - (playerSize / 2) - y;
    for(var i = 0; i < rects.length; i++) {
        var boxCenter = rects[i][0] - distance;
        if(boxCenter + boxSize / 2 > playerSize / 2 && boxCenter - speed + boxSize / 2<= playerSize / 2) {
            if(rects[i][1] == 0) {
                var boxCenter = (ch / 2) - boxSize * 0.5 ;
                var boxHeight = boxSize / 2
            }
            if(rects[i][1] == 1) {
                var boxCenter = (ch / 2) - boxSize;
                var boxHeight = boxSize;
            }
            if(rects[i][1] == 2) {
                var boxCenter =  (ch / 2) - boxSize * 2;
                var boxHeight = boxSize;
            }
            var pHeight = playerSize;
            if(ducking == true) {
                playerCenter = (ch / 2) - (playerSize / 4) - y
                pHieght = playerSize / 2;
            }
            if(Math.abs(boxCenter - playerCenter) < (pHeight / 2) + boxHeight) {
                return true;
            }
        }
    }
    return false;
}

//Loop runs every frame
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
        my = 16;
    }
    if(ground == true && highjump == true) {
        my = 20;
    }
    my -= 1;
    y += my;
    if(y < 0) {
        my = 0;
        y = 0;
    }
    distance += speed;
    if(checkCollisions() == false) {
        requestAnimationFrame(loop, 1000/fps);
    } else {
        console.log('You Crashed!');
        dead = true;
        deathScreen();
        
    }
}

//menu functions
function deathScreen(mouseX, mouseY, mousedown) {
    if(mode == "AI") {
        dead = false;
                distance = 0;
                boxdist = 50;
                rects = [];
                requestAnimationFrame(AIloop, 1000/fps);
    }
    ctx.strokeStyle = "#000000";
    ctx.clearRect(cw * 0.25, ch * 0.25, cw * 0.5, ch * 0.5);
    ctx.font = "30px Arial";
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeRect(cw * 0.25, ch * 0.25, cw * 0.5, ch * 0.5);
    ctx.lineWidth = 1;
    ctx.strokeText("restart", cw * 0.25 + 10, ch * 0.25 + 40);
    ctx.strokeText("main menu", cw * 0.25 + 10, ch * 0.5 + 40);
    ctx.moveTo(cw * 0.25, ch * 0.5);
    ctx.lineTo(cw * 0.75, ch * 0.5);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = "#FF0000";
    if(mouseX > cw * 0.25 && mouseX < cw * 0.75 && mouseY > ch * 0.25 && mouseY < ch * 0.75) {
        if(mouseY < ch * 0.5) {
            ctx.strokeRect(cw * 0.25, ch * 0.25, cw * 0.5, ch * 0.25);
            ctx.lineWidth = 1;
            ctx.strokeText("restart", cw * 0.25 + 10, ch * 0.25 + 40);
            if(mousedown == true) {
                dead = false;
                distance = 0;
                boxdist = 50;
                rects = [];
                requestAnimationFrame(loop, 1000/fps);
            }
        } else {
            ctx.strokeRect(cw * 0.25, ch * 0.5, cw * 0.5, ch * 0.25);
            ctx.lineWidth = 1;
            ctx.strokeText("main menu", cw * 0.25 + 10, ch * 0.5 + 40);
            if(mousedown == true) {
                dead = false;
                menu = true;
                mainMenu();
            }
        }
    }
    
}

function mainMenu(mouseX, mouseY, mousedown) {
    ctx.clearRect(0, 0, cw, ch);
    ctx.strokeStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeRect(cw * 0.25, 0, cw * 0.5, ch);
    ctx.moveTo(cw * 0.25, ch / 3);
    ctx.lineTo(cw * 0.75, ch / 3);
    ctx.moveTo(cw * 0.25, 2 * ch / 3);
    ctx.lineTo(cw * 0.75, 2 * ch / 3);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeText("play", cw * 0.25 + 10, 40);
    ctx.strokeText("train AI", cw * 0.25 + 10, ch / 3 + 40);
    ctx.strokeText("neural network", cw * 0.25 + 10, 2 * ch / 3 + 40);
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 5;
    if(mouseX > cw * 0.25 && mouseX < cw * 0.75 && mouseY > 0 && mouseY < ch) {
        if(mouseY < ch / 3) {
            ctx.strokeRect(cw * 0.25, 0, cw * 0.5, ch / 3);
            ctx.lineWidth = 1;
            ctx.strokeText("play", cw * 0.25 + 10, 40);
            if(mousedown == true) {
                mode = "user";
                menu = false;
                dead = false;
                distance = 0;
                boxdist = 50;
                rects = [];
                requestAnimationFrame(loop, 1000/fps);
            }
        } else if(mouseY < ch * 2 / 3) {
            ctx.strokeRect(cw * 0.25, ch / 3, cw * 0.5, ch / 3);
            ctx.lineWidth = 1;
            ctx.strokeText("train AI", cw * 0.25 + 10, ch / 3 + 40);
            if(mousedown == true) {
                mode = "AI";
                menu = false;
                dead = false;
                distance = 0;
                boxdist = 50;
                rects = [];
                setupNet(3, 2);
                requestAnimationFrame(AIloop, 1000/fps);
            }
        } else {
            ctx.strokeRect(cw * 0.25, ch * 2 / 3, cw * 0.5, ch / 3);
            ctx.lineWidth = 1;
            ctx.strokeText("neural network", cw * 0.25 + 10, 2 * ch / 3 + 40);
        }
    }
    
}

//user inputs:
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
window.onmousemove = function(e) {
    if(menu == true) {
        mainMenu(e.clientX, e.clientY, false);
    }
    if(dead == true) {
        deathScreen(e.clientX, e.clientY, false);
    }
}
window.onmousedown = function(e) {
    if(menu == true) {
        mainMenu(e.clientX, e.clientY, true);
    }
    if(dead == true) {
        deathScreen(e.clientX, e.clientY, true);
    }
}