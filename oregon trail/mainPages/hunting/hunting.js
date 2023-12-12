var game = JSON.parse(window.sessionStorage.game);
var myGamePiece;
var myObstacles = [];
var trees;
var myAnimals = [];
var animals = 3;
var sessionMeat = 0;

function startGame() {
	//TODO HNT-0010
	if(game.ammunition == 0) {
		alert("You do not have any ammunition to hunt with.");
		location.replace("../trail/trail.html");
	}
	//TODO end
	if (game.ammunition > 0) {
		game.ammunition -=1;
	}
	var start = 100;
	var time = setInterval(frame,15);
	function frame() {
		console.log(start);
		if(start == -500) {//sessionLength
			clearInterval(time);
			
			if(sessionMeat != 0) {
				if(game.food == 2000) {
					alert("From the animals you shot, you got " + sessionMeat + " pounds of meat. However you were not able to carry any back to the wagon" );
				}
				if(sessionMeat + game.food > 2000) {
					var haul = 2000 - game.food;
					game.food = 2000;
					alert("From the animals you shot, you got " + sessionMeat + " pounds of meat. However you were only able to carry " + haul + " back to the wagon" );
				}
				else {
					alert("From the animals you shot, you got " + sessionMeat + " pounds of meat.");
					game.food += sessionMeat;
				}
			}
			else {
					alert("You were unable to shoot any food.");
			}
			calcDays(1,game);
			var savePace = game.pace;
			game.pace = "hunt";
			calculateHealth(game)
			game.pace = savePace;
			game.weather = updateWeather(game.month);
			game.water = waterStatus();
			window.sessionStorage.game = JSON.stringify(game);
			location.replace("../trail/trail.html");
			
		}
		else {
			start--;
		}
	}

	myGameArea.start();
	myGamePiece = new hunter(73,78,"black",10,10);//73,78
	trees = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
	for (i = 0; i < trees; i += 1) {
		var x = Math.floor(Math.random() * (myGameArea.canvas.width - 250))+125;
		var y = Math.floor(Math.random() * (myGameArea.canvas.height - 125));
		myObstacles.push(new component(125,125,"black",x,y));
	}
	for (i = 0; i < animals; i += 1) {
		//               Math.floor(Math.random() * (max - min + 1)) + min;
		var cond = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
		var type = Math.floor(Math.random() * (5 - 1 +1)) + 1;
			/*
				1 - squirrel
				2 - rabbit
				3 - bison
				4 - deer
				5 - bear
			*/
		console.log(cond);
		switch(cond) {
			case 1://leftside
				var x = Math.floor(Math.random() * (-60 - -200 + 1)) + -200;//-60 to cover image width
				var y = Math.floor(Math.random() * (800 - -200 + 1)) + -200;
				var speedX = 1;
				var speedY = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
				myAnimals.push(new animal(type,70,50,"black",x,y,speedX,speedY));//console.log("1");
				break;

			case 2://top
				var x = Math.floor(Math.random() * (1200 - -200 + 1)) + -200;
				var y = Math.floor(Math.random() * (-60 - -200 + 1)) + -200;//-60 to cover image hieght
				var speedY = 1;
				var speedX = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
				myAnimals.push(new animal(type,70,50,"black",x,y,speedX,speedY));//console.log("2");
				break;

			case 3://rightside
				var x = Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000;
				var y = Math.floor(Math.random() * (800 - -200 + 1)) + -200;
				var speedX = -1;
				var speedY = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
				myAnimals.push(new animal(type,70,50,"black",x,y,speedX,speedY));//console.log("3");
				break;

			case 4://bottom
				var x = Math.floor(Math.random() * (1200 - -200 + 1)) + -200;
				var y = Math.floor(Math.random() * (800 - 600 + 1)) + 600;
				var speedY = -1;
				var speedX = Math.floor(Math.random() * (1 - -1 + 1)) + -1;
				myAnimals.push(new animal(type,70,50,"black",x,y,speedX,speedY));//console.log("4");
				break;
		}	
	}
	
}

var myGameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1000;
		this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea,20);
		window.addEventListener('keydown', function (e) {
			myGameArea.key = e.keyCode;
		})
		window.addEventListener('keyup', function (e) {
			myGameArea.key = false;
		})
	},
	clear : function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	stop : function() {
		clearInterval(this.interval);
	}
}

function component(width,height,color,x,y) {
	this.gamearea = myGameArea;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.availableMoves = 4;

	this.myImage = new Image(this.width,this.height);
	this.myImage.src = 'images/tree.png';

	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.0;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.globalAlpha = 1.0;
		ctx.drawImage(this.myImage,x,y);
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
				crash = false;
			}
		return crash;
	}
	this.stop = function() {
		this.speedX = 0;
		this.speedY = 0;
	}
}

function hunter(width,height,color,x,y) {
	
	this.gamearea = myGameArea;
	
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.availableMoves = 4;
	this.inbounds = true;

	this.myBullets = [];
	this.bulletsAvailable = 20;
	this.bulletCount = 0;

	this.myImage = new Image(this.x,this.y);
	this.myImage.src = 'images/hunterRight.png';

	for (i = 0; i < this.bulletsAvailable; i += 1) {
		this.myBullets.push(new bullet(3,3,"white", this.x+40, this.y+28));
	}

	this.sheet = new SpriteSheet('images/wagonRight.png',238,87);
	this.sheet2 = new SpriteSheet('images/wagonLeft.png',238,87);
	this.walkAnimRight = new Animation(this.sheet,3,0,2);
	this.walkAnimLeft = new Animation(this.sheet2,3,0,2);
	this.anim = this.walkAnimRight;

	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.0;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.globalAlpha = 1.0;
		ctx.drawImage(this.myImage,this.x,this.y);
		ctx.font = "20px Here Lies MECC Regular";
		ctx.fillStyle = "white";
		ctx.fillText("Bullets = "+(this.bulletsAvailable - this.bulletCount),10,590);
		if (this.x < 0) {
			this.x += 1; this.speedX = 0; this.speedY = 0;
		}
		else if ((this.x + this.width) > 1000) {
			this.x -= 1; this.speedX = 0; this.speedY = 0;		
		}
		else if(this.y < 0) {
			this.y += 1; this.speedX = 0; this.speedY = 0;
		}
		else if ((this.y + this.height) > 600) {
			this.y -= 1; this.speedX = 0; this.speedY = 0;
		}
		else {
			this.inbounds = true;
		}

		if(this.speedX == -1) {
			this.anim = this.walkAnimLeft;
		}
		else if (this.speedX == 1) {
			this.anim = this.walkAnimRight;
		}
		if(this.speedY == -1) {
			this.anim = this.walkAnimRight;
		}
		else if (this.speedY == 1) {
			this.anim = this.walkAnimLeft;
		}
		this.anim.update();
	}
	this.draw = function() {
		this.anim.draw(this.x,this.y);
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
				crash = false;
			}
		return crash;
	}
	this.stop = function() {
		this.speedX = 0;
		this.speedY = 0;
	}
}

function SpriteSheet(path,frameWidth,frameHeight){
	this.image = new Image();
	this.frameWidth = frameWidth;
	this.frameHeight = frameHeight; 
	var self = this;
	this.image.width = 714;
	self.framesPerRow = Math.floor(this.image.width/self.frameWidth);
	this.image.src = path;
}

function Animation(spritesheet,frameSpeed,startFrame,endFrame) {
	
	var animationSequence = [];
	var currentFrame = 0;
	var counter = 0;
	for(var frameNumber = startFrame; frameNumber <= endFrame; frameNumber++){
		animationSequence.push(frameNumber);//0,1,2
	}
	this.update = function() {
		if(counter == (frameSpeed -1)) {
			currentFrame = (currentFrame + 1) % animationSequence.length;
		}
		counter = (counter + 1) % frameSpeed;
	}
	this.draw = function(x,y) {
		
		var row = Math.floor(animationSequence[currentFrame] / spritesheet.framesPerRow);
		var col = Math.floor(animationSequence[currentFrame] % spritesheet.framesPerRow);
		ctx.drawImage(spritesheet.image,col*spritesheet.frameWidth,row*spritesheet.frameHeight, spritesheet.frameWidth,spritesheet.frameHeight,x,y,spritesheet.frameWidth,spritesheet.frameHeight);
	}

}

function bullet(width,height,color,x,y) {
	this.gamearea = myGameArea;
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.hit = false;
	this.fired = false;
	this.directionX = 1;
	this.directionY = 0;

	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
				crash = false;
			}
		return crash;
	}
	this.stop = function() {
		this.speedX = 0;
		this.speedY = 0;
	}
}

function animal(type,width,height,color,x,y,speedX,speedY) {
	this.gamearea = myGameArea;
	this.width = width;
	this.height = height;
	this.speedX = speedX;
	this.speedY = speedY;
	this.x = x;
	this.y = y;
	this.dead = false;
	this.type = type;
	/*
		1 - squirrel
		2 - rabbit
		3 - bison
		4 - deer
		5 - bear
	*/
	this.meat = 0;
	this.sheet = new SpriteSheet('images/oxRight.png',238,87);
	this.sheet2 = new SpriteSheet('images/oxLeft.png',238,87);
	this.sheet3 = new SpriteSheet('images/oxRight.png',238,87);
	this.walkAnimRight = new Animation(this.sheet,3,0,2);
	this.walkAnimLeft = new Animation(this.sheet2,3,0,2);
	this.walkAnimDead = new Animation(this.sheet3,0,0,2);
	this.anim = this.walkAnimRight;

	switch(this.type) {
		case 1:
			this.meat = Math.floor(Math.random() * (3 - 2 + 1)) + 2;//2-3
			break;
		case 2:
			this.meat = Math.floor(Math.random() * (8 - 3 + 1)) + 3;//3-8
			break;
		case 3:
			this.meat = Math.floor(Math.random() * (1000 - 800 + 1)) + 800;//800-1000
			break;
		case 4:
			this.meat = Math.floor(Math.random() * (120 - 80 + 1)) + 80;//80-120
			break;
		case 5:
			this.meat = Math.floor(Math.random() * (350 - 230 + 1)) + 230;//230-350
			break;
	}

	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.globalAlpha = 0.0;
		ctx.fillRect(this.x,this.y,this.width,this.height);
		ctx.globalAlpha = 1.0;
		if(this.speedX == 1 && this.speedY == 1) {
			this.anim = this.walkAnimRight;
		}
		else if (this.speedX == 1 && this.speedY == -1) {
			this.anim = this.walkAnimRight;
		}
		else if(this.speedX == -1 && this.speedY == 1) {
			this.anim = this.walkAnimLeft;
		}
		else if (this.speedX == -1 && this.speedY == -1) {
			this.anim = this.walkAnimLeft;
		}
		else if (this.speedX == 1 && this.speedY == 0) {
			this.anim = this.walkAnimRight;
		}
		else if (this.speedX == -1 && this.speedY == 0) {
			this.anim = this.walkAnimLeft;
		}
		else if (this.speedX == 0 && this.speedY == 1) {
			this.anim = this.walkAnimLeft;
		}
		else if (this.speedX == 0 && this.speedY == -1) {
			this.anim = this.walkAnimRight;
		}
		if(this.dead) {
			this.anim = this.walkAnimDead;
		}
		this.anim.update();
	}
	this.draw = function() {
		this.anim.draw(this.x,this.y);
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
	}
	this.crashWith = function(otherobj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherobj.x;
		var otherright = otherobj.x + (otherobj.width);
		var othertop = otherobj.y;
		var otherbottom = otherobj.y + (otherobj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
				crash = false;
			}
		return crash;
	}
	this.stop = function() {
		this.speedX = 0;
		this.speedY = 0;
	}
}

function updateGameArea() {

	myGameArea.clear();

	for (i = 0; i < myObstacles.length; i += 1) {
		for (j = 0; j < myGamePiece.myBullets.length; j += 1) {
			if (myGamePiece.myBullets[j].crashWith(myObstacles[i])) {
				myGamePiece.myBullets[j].hit = true;
			}
		}
		
		for (j = 0; j < animals; j += 1) {
			if (myAnimals[j].crashWith(myObstacles[i])) {
				myAnimals[j].speedX = -1*myAnimals[j].speedX;
				myAnimals[j].speedY = -1*myAnimals[j].speedY;
			}
		}
	
		if (myGamePiece.crashWith(myObstacles[i])) {
			if (myGamePiece.speedX == 1) {
				myGamePiece.stop(); myGamePiece.availableMoves = 0; myGamePiece.x -=1;
			}	
			if (myGamePiece.speedY == 1) {
				myGamePiece.stop(); myGamePiece.availableMoves = 1; myGamePiece.y -=1;
			}
			if (myGamePiece.speedX == -1) {
				myGamePiece.stop(); myGamePiece.availableMoves = 2; myGamePiece.x +=1;
			}
			if (myGamePiece.speedY == -1) {
				myGamePiece.stop(); myGamePiece.availableMoves = 3; myGamePiece.y +=1;
			}
		}
		myObstacles[i].update();
	}
	
	if (myGamePiece.availableMoves == 4) {
		if (myGameArea.key && myGameArea.key == 37 && myGamePiece.inbounds) {myGamePiece.speedX = -1; myGamePiece.speedY = 0; myGamePiece.myImage.src = 'images/hunterLeft.png';}
		if (myGameArea.key && myGameArea.key == 39 && myGamePiece.inbounds) {myGamePiece.speedX = 1; myGamePiece.speedY = 0; myGamePiece.myImage.src = 'images/hunterRight.png';}
		if (myGameArea.key && myGameArea.key == 38 && myGamePiece.inbounds) {myGamePiece.speedY = -1; myGamePiece.speedX = 0; myGamePiece.myImage.src = 'images/hunterUp.png';}
		if (myGameArea.key && myGameArea.key == 40  && myGamePiece.inbounds) {myGamePiece.speedY = 1; myGamePiece.speedX = 0; myGamePiece.myImage.src = 'images/hunterDown.png';}
		if (myGameArea.key && myGameArea.key == 32 && myGamePiece.inbounds) {myGamePiece.speedY = 0; myGamePiece.speedX = 0; myGamePiece.myImage.src = 'images/hunterDown.png';}
		if (myGameArea.key && myGameArea.key == 66) {
			if (myGamePiece.bulletCount < myGamePiece.bulletsAvailable) {
				myGamePiece.myBullets[myGamePiece.bulletCount].fired = true;
				myGamePiece.myBullets[myGamePiece.bulletCount].directionX = myGamePiece.speedX;
				myGamePiece.myBullets[myGamePiece.bulletCount].directionY = myGamePiece.speedY;
				myGamePiece.bulletCount +=1;
			}
			myGameArea.key = false;
		}
	}
	else if (myGamePiece.availableMoves == 0) {
		if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1;  myGamePiece.availableMoves = 4;}
	}
	else if (myGamePiece.availableMoves == 1) {
		if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1;  myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; myGamePiece.availableMoves = 4;}
	}
	else if (myGamePiece.availableMoves == 2) {
		if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1;  myGamePiece.availableMoves = 4;}
	}
	else if (myGamePiece.availableMoves == 3) {
		if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1;  myGamePiece.availableMoves = 4;}
		if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; myGamePiece.availableMoves = 4;}
	}

	for (i = 0; i < animals; i += 1) {
		if (!myAnimals[i].dead) {
			myAnimals[i].newPos();
		}
		myAnimals[i].update();
		myAnimals[i].draw();
	}

	myGamePiece.newPos();
	myGamePiece.update();
	myGamePiece.draw();

	for (i = 0; i < myGamePiece.myBullets.length; i += 1) {
		if (myGamePiece.speedX == 1 && !myGamePiece.myBullets[i].fired) {myGamePiece.myBullets[i].speedX = 1; myGamePiece.myBullets[i].speedY = 0;}
		if (myGamePiece.speedX == -1 && !myGamePiece.myBullets[i].fired) {myGamePiece.myBullets[i].speedX = -1; myGamePiece.myBullets[i].speedY = 0;}
		if (myGamePiece.speedY == 1 && !myGamePiece.myBullets[i].fired) {myGamePiece.myBullets[i].speedX = 0; myGamePiece.myBullets[i].speedY = 1;}
		if (myGamePiece.speedY == -1 && !myGamePiece.myBullets[i].fired) {myGamePiece.myBullets[i].speedX = 0; myGamePiece.myBullets[i].speedY = -1;}
		if ((myGamePiece.speedY == 0 && myGamePiece.speedX ==0) && !myGamePiece.myBullets[i].fired) {myGamePiece.myBullets[i].speedX = 0; myGamePiece.myBullets[i].speedY = 0;}
		
		if (myGamePiece.myBullets[i].fired) {
				if (myGamePiece.myBullets[i].directionX == 1) {
					myGamePiece.myBullets[i].speedX = 4;
				}
				if (myGamePiece.myBullets[i].directionY == 1) {
					myGamePiece.myBullets[i].speedY = 4;
				}
				if (myGamePiece.myBullets[i].directionX == -1) {
					myGamePiece.myBullets[i].speedX = -4;
				}
				if (myGamePiece.myBullets[i].directionY == -1) {
					myGamePiece.myBullets[i].speedY = -4;
				}	
						
		}

		for (j = 0; j < animals; j += 1) {
			if (myAnimals[j].crashWith(myGamePiece.myBullets[i])) {
				if(!myAnimals[j].dead) {sessionMeat = sessionMeat + myAnimals[j].meat;}
				myAnimals[j].dead = true; myGamePiece.myBullets[i].hit = true;
			}
		}

		if (!myGamePiece.myBullets[i].hit) {
			myGamePiece.myBullets[i].newPos();
			myGamePiece.myBullets[i].update();
		}
	}
	


	
}
