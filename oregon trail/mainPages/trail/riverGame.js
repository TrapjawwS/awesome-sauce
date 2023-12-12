var game = JSON.parse(window.sessionStorage.game);
document.body.onkeyup = function(e){
    	if(e.keyCode == 32 && game.riverGame == 2){
			location.replace("landmark.html");
    	}
    	else if(e.keyCode == 13 && game.riverGame == 1){
			location.replace("../main.html");
    	}
    	else if(e.keyCode == 13){
			location.replace("riverGame.html");
    	}
	else{}
}

function returnClick() {
    	if(game.riverGame == 2){
		location.replace("landmark.html");
    	}
    	else if(game.riverGame == 1){
		location.replace("../main.html");
    	}
    	else{
		location.replace("riverGame.html");
    	}
}

var wagon;
var debris = [];
var board = {
    canvas : document.getElementById('canvas'),
    start : function() {

        this.canvas.width = 1000;
        this.canvas.height = 300;
        this.frameNum = 0;

        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(refresh, 20);
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            board.keys = (board.keys || []);
            board.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            board.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

//function start()
//Coding Designs from W3Schools:
//https://www.w3schools.com/graphics/game_intro.asp
function start() {
    wagon = new sprite(30, 30, "images/ferry.png", 500, 150);
    board.start();
}

//function sprite()
//Coding Designs from W3Schools:
//https://www.w3schools.com/graphics/game_intro.asp
function sprite(width, height, img, x, y) {
    this.image = new Image();
    this.image.src = img;

    this.speedX = 0;
    this.speedY = 0; 
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.update = function() {
        ctx = board.context;
        ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
    }

    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    
    this.crashWith = function(otherobj) {
        var crash = true;
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);

        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);

        if ((bottom < othertop) || (top > otherbottom) || (right < otherleft) || (left > otherright)) {
            crash = false;
        }
	if (img == "images/ford.png"){
        	if ((bottom >= 280) || (top <= 0) || (right >= 1000) || (left <= 0)) {
            		crash = true;
        	}
	}
        return crash;
    }
}

//function refresh()
//Coding Designs from W3Schools:
//https://www.w3schools.com/graphics/game_intro.asp
function refresh() {
  if (debris.length >= 100) {
	var image = document.getElementById('will');
	ctx.drawImage(image, 0, 0, 1000, 300);
	game.riverGame = 2;
	game.location = "the Willamette Valley";
 	window.sessionStorage.game = JSON.stringify(game);
	return;
  }
  else{
    var height, x;
    for (i = 0; i < debris.length; i += 1) {
        if (wagon.crashWith(debris[i])) {
            board.stop();
	    var image = document.getElementById('crash');
	    ctx.drawImage(image, 0, 0, 1000, 300);
	    game.riverGame = 1;
	    window.sessionStorage.game = JSON.stringify(game);
            return;
        } 
    }
    board.clear();
    board.frameNum += 1;

    if (board.frameNum == 1 || checkInt(150)) {
        x = board.canvas.width;
    	height = Math.floor(Math.random() * (230 - 20) ) + 0;

        debris.push(new sprite(30, 30, "images/debris.png", 0, 20));
        debris.push(new sprite(30, 30, "images/debris.png", 0, height));
        debris.push(new sprite(30, 30, "images/debris.png", 0, 250));

    }

    for (i = 0; i < debris.length; i += 1) {
        debris[i].x += 1;
        debris[i].update();
    }

    wagon.speedX = 0;
    wagon.speedY = 0;

    if (board.keys && board.keys[37]) {wagon.speedX= -1; }
    if (board.keys && board.keys[39]) {wagon.speedX= 1; }
    if (board.keys && board.keys[38]) {wagon.speedY= -1; }
    if (board.keys && board.keys[40]) {wagon.speedY= 1; }

    wagon.newPos();    
    wagon.update();
  }
}

//function checkInt()
//Coding Designs from W3Schools:
//https://www.w3schools.com/graphics/game_intro.asp
function checkInt(n) {
    if ((board.frameNum / n) % 1 == 0) {return true;}
    return false;
}
