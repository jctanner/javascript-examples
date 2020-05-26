/*
JavaScript understands more than
100 color names, including Green,
Blue, Orange, Red, Yellow, Purple,
White, Black, Pink, Turquoise, Violet,
SkyBlue, PaleGreen, Lime, Fuchsia,
DeepPink, Cyan, and Chocolate
*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//ctx.fillStyle = "Red";
//ctx.fillRect(0,0,100,100);

/*
ctx.strokeStyle = "DeepPink";
ctx.lineWidth = 4;
ctx.strokeRect(10, 10, 100, 20);
*/

/*
ctx.fillStyle = "Blue";
for (var i = 0; i < 8; i++) {
    ctx.fillRect(i * 10, i * 10, 10, 10);
}
*/

/*
ctx.strokeStyle = "TurQuoise";
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(60, 60);
ctx.moveTo(60, 10);
ctx.lineTo(10, 60);
ctx.stroke();
*/

/*
ctx.fillStyle = "SkyBlue";
ctx.beginPath();
ctx.moveTo(100, 100);
ctx.lineTo(100, 60);
ctx.lineTo(130, 30);
ctx.lineTo(160, 60);
ctx.lineTo(160, 100);
ctx.lineTo(100, 100);
ctx.fill();
*/

/*
ctx.lineWidth = 2;
ctx.strokeStyle = "Green";
ctx.beginPath();
ctx.arc(50, 50, 20, 0, Math.PI / 2, false);
ctx.stroke();

ctx.beginPath();
ctx.arc(100, 50, 20, 0, Math.PI, false);
ctx.stroke();

ctx.beginPath();
ctx.arc(150, 50, 20, 0, Math.PI * 2, false);
ctx.stroke();
*/

/*
var position = 0;
var direction = 1;

setInterval(function () {
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillRect(position, 0, 20, 20);
    position = position + direction;
    if (position > 200) {
        direction = -1;
    } else if (position < 0) {
        direction = 1;
    }


}, 30);
*/

/*
var size = 0;
setInterval(function () {
    ctx.clearRect(0, 0, 200, 200);
    ctx.fillRect(0, 0, size, size);
    size++;
    if (size > 200) {
        size = 0;
    }
}, 0.5);
*/

/*
var circle = function(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

var drawBee = function(x,y) {
    ctx.lineWidth = 2;
    ctx.strokeStype = "Black";
    ctx.fillStyle = "Gold";

    circle(x, y, 8, true);
    circle(x, y, 8, false);
    circle(x-5, y - 11, 5, false);
    circle(x+5, y-11, 5, false);
    circle(x-2, y-1, 2, false);
    circle(x+2, y-1, 2, false);
}

var update = function(coordinate) {
    var offset = Math.random() * 4 - 2;
    coordinate += offset;

    if (coordinate > 200) {
        coordinate = 200;
    }
    if (coordinate < 0) {
        coordinate = 0;
    }
    return coordinate;
}

var x = 100;
var y = 100;

setInterval(function () {
    ctx.clearRect(0, 0, 200, 200);
    drawBee(x, y);
    x = update(x);
    y = update(y);
    ctx.strokeRect(0, 0, 200, 200);
}, 20);
*/

/*
var Ball = function() {
    this.x = 100;
    this.y = 100;
    this.xSpeed = -2;
    this.ySpeed = 3;
};

 var circle = function(x, y, radius, fillCircle) {
     ctx.beginPath();
     ctx.arc(x, y, radius, 0, Math.PI*2, false);
     if (fillCircle) {
         ctx.fill();
     } else {
         ctx.stroke();
     }
 };

 Ball.prototype.draw = function() {
     circle(this.x, this.y, 3, true);
 };

 Ball.prototype.move = function() {
     this.x += this.xSpeed;
     this.y += this.ySpeed;
 };

 Ball.prototype.checkCollision = function () {
     if (this.x < 0 || this.x > 200) {
         this.xSpeed = -this.xSpeed;
     }
     if (this.y < 0 || this.y > 200) {
         this.ySpeed = -this.ySpeed;
     }
 };

 var ball = new Ball();
 setInterval(function() {
     ctx.clearRect(0, 0, 200, 200);
     ball.draw();
     ball.move();
     ball.checkCollision();

     ctx.strokeRect(0, 0, 200, 200);
 })
*/

/*
var keyNames = {
    32: "space",
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$("body").keydown(function(event) {
    console.log(keyNames[event.keyCode]);
})
*/


/*
var width = canvas.width;
var height = canvas.height;

var circle = function(x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

var Ball = function () {
    this.x = width / 2;
    this.y = height / 2;
    this.xSpeed = 5;
    this.ySpeed = 0;
};

Ball.prototype.move = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0) {
        this.x = width;
    } else if (this.x > width) {
        this.x = 0;
    } else if (this.y < 0) {
        this.y = height;
    } else if (this.y > height) {
        this.y = 0;
    }
}

Ball.prototype.draw = function() {
    circle(this.x, this.y, 10, true);
}

Ball.prototype.setDirection = function(direction) {
    if (direction == "up") {
        this.xSpeed = 0;
        this.ySpeed = -5;
    } else if (direction == "down") {
        this.xSpeed = 0;
        this.ySpeed = 5;
    } else if (direction == "left") {
        this.xSpeed = -5;
        this.ySpeed = 0;
    } else if (direction == "right") {
        this.xSpeed = 5;
        this.ySpeed = 0;
    } else if (direction == "stop") {
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
};

var ball = new Ball();

var keyActions = {
    32: "stop",
    37: "left",
    38: "up",
    39: "right",
    40: "down"
}

$("body").keydown(function(event) {
    var direction = keyActions[event.keyCode];
    ball.setDirection(direction);
})

setInterval(function() {
    ctx.clearRect(0, 0, width, height);
    ball.draw();
    ball.move();
    ctx.strokeRect(0, 0, width, height);
}, 30);
*/