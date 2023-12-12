var game = JSON.parse(window.sessionStorage.game);

function animateCross() {
  	var crossingImage = document.getElementById("crossingImage");

  	var start = 100;
 	var time = setInterval(frame, 15);

 	function frame() {
    		if (start == -250) {
      			clearInterval(time);
                getRiverEvent();
                window.sessionStorage.game = JSON.stringify(game);
			    location.replace("../trail.html");
    		}
    		else {
     			start--;
      				crossingImage.style.top = start + 'px';
      				crossingImage.style.left = start + 'px';				
			if(game.riverChoice == 1) {
				crossingImage.style.backgroundImage = "url('../images/ford.png')";
			}
			else if(game.riverChoice == 2) {
				crossingImage.style.backgroundImage = "url('../images/caulk.png')";			
			}
			else if(game.riverChoice == 3) {
				crossingImage.style.backgroundImage = "url('../images/ferry.png')";			
			}
    		}
  	}
}

function getRiverPen(){
		var intro = "Your wagon was flooded. You lost ";
		var amount;
		var outcome;
		var rand2 = Math.floor((Math.random()*4) + 1);
		switch (rand2) {
				case 1:
					if(game.food <= 0) {alert("You had no problem crossing the river"); break;} 
					else {
						amount = Math.floor((Math.random()*100) + 1);
						outcome = " pounds of food.";
						game.food-=amount;
						if (game.food < 0){
							game.food = 0;
						}
						window.sessionStorage.game = JSON.stringify(game);
						alert(intro +amount +outcome);
					}
					break;
				case 2:
					if(game.sets <= 0) {alert("You had no problem crossing the river"); break;} 
					else {
						amount = Math.floor((Math.random()*5) + 1);
						outcome = " sets of clothing.";
						game.sets-=amount;
						if (game.sets < 0){
							game.sets = 0;
						}
						window.sessionStorage.game = JSON.stringify(game);
						alert(intro +amount +outcome);
					}
					break;
				case 3:
					if(game.ammunition <= 0) {alert("You had no problem crossing the river"); break;} 
					else {
						amount = Math.floor((Math.random()*2) + 1);
						outcome = " boxes of bullets.";
						game.ammunition-=amount;
						if (game.ammunition < 0){
							game.ammunition = 0;
						}
						window.sessionStorage.game = JSON.stringify(game);
						alert(intro +amount +outcome);
					}
					break;
				case 4:
					if(game.oxen <= 0) {alert("You had no problem crossing the river"); break;} 
					else {
						amount = Math.floor((Math.random()*2) + 1);
						outcome = " oxen.";
						game.oxen-=amount;
						if (game.oxen < 0){
							game.oxen = 0;
						}
						window.sessionStorage.game = JSON.stringify(game);
						alert(intro +amount +outcome);
					}
					break;
				default:

		}
        	//alert(intro +amount +outcome);
}

function getRiverEvent(){
	var rand = Math.random();
	var choice = game.riverChoice;
	if (game.riverChoice == 1) {

	   	if(rand > 0.90 && game.riverDepth <= 2.5) {
			getRiverPen();
		}
	   	else if(rand > 0.50) {
			getRiverPen();
		}
		else{
            		alert("You had no problem crossing the river");
		}
	}
	else if (game.riverChoice == 2 && game.riverDepth <= 2.5) {

	   	if(rand > 0.90 && game.riverDepth <= 2.5) {
			getRiverPen();
		}
	   	else if(rand > 0.75) {
			getRiverPen();
		}
		else{
            		alert("You had no problem crossing the river");
		}
	}
	else if (game.riverChoice == 3 && game.riverDepth <= 2.5) {

	   	if(rand > 0.90) {
			getRiverPen();
		}
		else{
            		alert("You had no problem crossing the river");
		}
	}
	else{}
}

document.body.onkeyup = function(e){
    	if(e.keyCode == 32){
		location.replace("crossing.html");
    	}
}

function barButton() {
	location.replace("crossing.html");
}
