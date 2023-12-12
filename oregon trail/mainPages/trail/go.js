var game = JSON.parse(window.sessionStorage.game);
var spacebarKey = 32, enterKey = 13;

function checkEvent() {

	if (game.location == "South Pass" && game.branch == 1){
		game.branch = 0;
		window.sessionStorage.game = JSON.stringify(game);
		location.replace("branch/branch.html");
	}
	if (game.location == 'the Blue Mountains' && game.branch == 1){
		game.branch = 0;
		window.sessionStorage.game = JSON.stringify(game);
		location.replace("branch/branch.html");
	}
	//DEAD CODE; obsolete by commit TTT=0028//
	if(game.location == 'the Kansas River crossing' || game.location == 'the Big Blue River crossing' || game.location == 'the Green River crossing' || game.location == 'the Snake River crossing'){
		//alert("38,27");
		if (game.crossing == 1) {
			//alert("40,35");
			game.crossing = 0;
			window.sessionStorage.game = JSON.stringify(game);
			location.replace("crossing/crossing.html");
		}
	}
	//DEAD CODE END//
}

function go() {
  var initialDistance;
  var start;
  var difference;
  var scaleFactor;
  var objectContainer = document.getElementById("object");
  var landmarkObject = document.getElementById("object1");
  var name = game.location;
  //alert(game.next);
   	if (name == 'Independence') {
		initialDistance = 102;scaleFactor = 5.4;
		landmarkObject.style.backgroundImage = "url('images/river.png')";
    	}
   	if (name == 'the Kansas River crossing') {
    		initialDistance = 82;scaleFactor = 6.7;
		landmarkObject.style.backgroundImage = "url('images/river.png')"; 
    	}
    	if (name == 'the Big Blue River crossing') {
    		initialDistance = 118;scaleFactor = 4.6;
		landmarkObject.style.backgroundImage = "url('images/fort.png')";
    	}
    	if (name == 'Fort Kearney') {
    		initialDistance = 250;scaleFactor = 2.2;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'Chimney Rock') {
    		initialDistance = 86;scaleFactor = 6.4;
		landmarkObject.style.backgroundImage = "url('images/fort.png')";
    	}
    	if (name == 'Fort Laramie') {
    		initialDistance = 190;scaleFactor = 2.9;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'Independence Rock') {
    		initialDistance = 102;scaleFactor = 5.4;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'South Pass') {
		//TTT-0040
    		initialDistance = 57;scaleFactor = 9.6;
		if(game.next == 'Fort Bridger') {
			landmarkObject.style.backgroundImage = "url('images/fort.png')";
		}
		else if(game.next == 'the Green River crossing') {
			landmarkObject.style.backgroundImage = "url('images/river.png')";
		}
		else {
			landmarkObject.style.backgroundImage = "url('images/river.png')";
		}
		//TTT-0040 end
    	}
    	if (name == 'Fort Bridger') {
    		initialDistance = 162;scaleFactor = 3.4;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'the Green River crossing') {
    		initialDistance = 143;scaleFactor = 3.8;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'Soda Springs') {
    		initialDistance = 57;scaleFactor = 9.6;
		landmarkObject.style.backgroundImage = "url('images/fort.png')";
    	}
    	if (name == 'Fort Hall') {
    		initialDistance = 182;scaleFactor = 3.0;
		landmarkObject.style.backgroundImage = "url('images/river.png')";
    	}
    	if (name == 'the Snake River crossing') {
    		initialDistance = 113;scaleFactor = 4.8;
		landmarkObject.style.backgroundImage = "url('images/fort.png')";
    	}
    	if (name == 'Fort Boise') {
    		initialDistance = 160;scaleFactor = 3.4;
		landmarkObject.style.backgroundImage = "url('images/landmark.png')";
    	}
    	if (name == 'the Blue Mountains') {
		initialDistance = 55;scaleFactor = 10;
		//TTT-0040
		if(game.next == 'Fort Walla Walla') {
			landmarkObject.style.backgroundImage = "url('images/fort.png')";
		}
		else if(game.next == 'The Dalles') {
			landmarkObject.style.backgroundImage = "url('images/river.png')";
		}
		else {
			landmarkObject.style.backgroundImage = "url('images/river.png')";
		}
		//TTT-0040 end
    	}
	if (name == 'Fort Walla Walla') {
		initialDistance = 120;scaleFactor = 4.6;
		landmarkObject.style.backgroundImage = "url('images/river.png')";
    	}

  difference = initialDistance-game.toGo;
  start = (scaleFactor)*(difference);
  objectContainer.style.left = start + 'px';

  calcDays(1, game);
  calcMiles(game);
  game.weather = updateWeather(game.month);
  game.water = waterStatus();
  var gameOver = calculateHealth(game);
  var tombstoneStop = false;


  var tombstones = JSON.parse(window.sessionStorage.tombstones);
  for(var i = 0; i < tombstones.length; i++){
    if (game.toGo <= tombstones[i]['mile'] && game.location == tombstones[i]['start']){
        tombstoneStop = true;
        break;
    }
  }

    if(gameOver) {
        location.replace("../gameOver/gameOver.html");
    }
    else if(tombstoneStop){
        window.sessionStorage.game = JSON.stringify(game);
        location.replace('../tombstone/tombstone.html');
    }
    else {
      if (game.toGo <= 0) {

        // arriving at a landmark, the location is set based on previously visited
    	if (name == 'Independence') {
    		game.location = 'the Kansas River crossing';
    		game.crossing = 1;
    		game.riverWidth = Math.floor(Math.random() * (700 - 600) ) + 600;
    		game.riverDepth = (Math.random() * (3 - 2) + 2).toFixed(1);
    		game.next = 'the Big Blue River crossing';
    		game.toGo = 82;
    	}
    	if (name == 'the Kansas River crossing') {
    		game.location = 'the Big Blue River crossing';
    		game.crossing = 1;
    		game.riverWidth = Math.floor(Math.random() * (300 - 200) ) + 200;
    		game.riverDepth = (Math.random() * (2 - 1)  + 1).toFixed(1);
    		game.next = 'Fort Kearney';
    		game.toGo = 118;
    	}
    	if (name == 'the Big Blue River crossing') {
    		game.location = "Fort Kearney";
    		game.next = 'Chimney Rock';
    		game.toGo = 250;
    	}
    	if (name == 'Fort Kearney') {
    		game.location = "Chimney Rock";
    		game.next = 'Fort Laramie';
    		game.toGo = 86;
    	}
    	if (name == 'Chimney Rock') {
    		game.location = "Fort Laramie";
    		game.next = 'Independence Rock';
    		game.toGo = 190;
    	}
    	if (name == 'Fort Laramie') {
    		game.location = "Independence Rock";
    		game.next = 'South Pass';
    		game.toGo = 102;
    	}
    	if (name == 'Independence Rock') {
    		game.location = "South Pass";
    		game.next = 'the Green River crossing';
    		game.next2 = 'Fort Bridger';
    		game.branch = 1;
    		game.toGo = 57;
    		game.toGo2 = 125;
    	}
    	if (name == 'South Pass') {

    		if (game.next == 'the Green River crossing') {
    			game.location = 'the Green River crossing';
    			game.crossing = 1;
    			game.riverWidth = Math.floor(Math.random() * (500 - 400) ) + 400;
    			game.riverDepth = (Math.random() * (25 - 20) + 20).toFixed(1);
    			game.next = 'Soda Springs';
    			game.toGo = 143;

    		}
    		else {
    			game.location = "Fort Bridger";
    			game.next = 'Soda Springs';
    			game.toGo = 162;
    		}
    	}
    	if (name == 'the Green River crossing' || name == 'Fort Bridger') {
    		game.location = "Soda Springs";
    		game.next = 'Fort Hall';
    		game.toGo = 57;
    	}
    	if (name == 'Soda Springs') {
    		game.location = "Fort Hall";
    		game.next = 'the Snake River crossing';
    		game.toGo = 182;
    	}
    	if (name == 'Fort Hall') {
    		game.location = 'the Snake River crossing';
    		game.crossing = 1;
    		game.riverWidth = Math.floor(Math.random() * (1100 - 1000) ) + 1000;
    		game.riverDepth = (Math.random() * (7 - 5) + 5).toFixed(1);
    		game.next = 'Fort Boise';
    		game.toGo = 113;
    	}
    	if (name == 'the Snake River crossing') {
    		game.location = "Fort Boise";
    		game.next = 'the Blue Mountains';
    		game.toGo = 160;
    	}
    	if (name == 'Fort Boise') {
    		game.location = "the Blue Mountains";
    		game.next = 'Fort Walla Walla';
    		game.next2 = 'The Dalles';
    		game.branch = 1;
    		game.toGo = 55;
    		game.toGo2 = 125;
    	}
    	if (name == 'the Blue Mountains') {

    		if (game.next == 'Fort Walla Walla') {
    			game.location = "Fort Walla Walla";
    			game.next = 'The Dalles';
    			game.toGo = 120;
    		}
    		else {
    			game.location = "The Dalles";
			game.next = "the Willamette Valley";
			game.riverGame = 0;
    		}
    	}
    	if (name == 'Fort Walla Walla') {
    		game.location = "The Dalles";
    		game.next = 'the Willamette Valley';
    		game.riverGame = 0;
    	}

    	window.sessionStorage.game = JSON.stringify(game);
    	location.replace("landmark.html");
      }
      else {
        getRandomEvents(game);
    	window.sessionStorage.game = JSON.stringify(game);
    	location.replace("go.php");
      }
    }
}
$(document).ready(function() {
	$('#nameLocation').html(game.location);
	$('#nextLocation').html(game.next);
	$('#nextLocation2').html(game.next2);

	$('#dateLocation').html(getDate(game));
	$('#milesLeft').html(game.toGo);
	$('#milesLeft2').html(game.toGo);

	$('#milesGone').html(game.miles);
	$('#milesBranch').html(game.toGo2);

	$("#food").text(game.food);
	$("#health").text(healthStatus(game.health));
	$("#weather").text(game.weather);

	$("#rivWidth").text(game.riverWidth);
	$("#rivDepth").text(game.riverDepth);

	$("#barButton2").click(function() {
    		game.inTown = false;
    		window.sessionStorage.game = JSON.stringify(game);
    		location.replace("go.php");
	});

	$("#returnButton2").click(function() {
    		game.inTown = false;
    		window.sessionStorage.game = JSON.stringify(game);
                location.replace("../main.html");
	});

    	$(document).keydown(function(e) {
    		if(e.keyCode == spacebarKey){
    			game.inTown = false;
    			window.sessionStorage.game = JSON.stringify(game);
    			location.replace("go.php");
    		}
        	if(e.keyCode == enterKey){
    			game.inTown = false;
    			window.sessionStorage.game = JSON.stringify(game);
                location.replace("../main.html");
    		}
	});
});
