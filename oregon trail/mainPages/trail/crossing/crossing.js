function directInput() {
	document.getElementById("optionsChoice").focus();
}

$(document).ready(function(){

	var game = JSON.parse(window.sessionStorage.game);

	function getRiverDepth(game) {
		if(game.weather == 'rainy' || game.weather == 'very rainy'){
			game.riverDepth += Math.random() * 0.7;
		}
		else{
			game.riverDepth -= Math.random() * 0.7;
		}

		if(game.riverDepth < 1.5){
			game.riverDepth = 1.5;
		}
		//TTT-0014//
		if(isNaN(game.riverDepth)){
			var currentValue = game.riverDepth;
			var decimalPart = "0."+currentValue.substring(5,6);
			game.riverDepth = parseFloat(game.riverDepth) + parseFloat(decimalPart);
		}
		else{
			game.riverDepth = game.riverDepth.toFixed(1);
		}
		//TTT-0014 End//
		
	}

	// get option set
	$("#optionsChoice").keydown(function(e) {
        	if(e.keyCode == 13){
			var choice = parseInt($(this).val());
			if(!isNaN(choice) && choice <= 5 && choice >= 1){
				switch(choice) {
					case 1:
						game.riverChoice = 1;
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("riverCross.html");
						break;
					case 2:
						game.riverChoice = 2;
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("riverCross.html");
						break;
					case 3:
						game.riverChoice = 3;
						var d = Math.floor(Math.random() * 5) + 1;
						var m = Math.floor(Math.random() * 10) + 1;
						game.money -= m;
						calcDays(d, game);
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("riverCross.html");
						break;
					case 4:
						var d = 1;
						calcDays(d, game);
						game.weather = updateWeather(game.month);
						getRiverDepth(game);
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("crossing.html");
						break;
					case 5:
						location.replace("crossDesc.html");
						break;

					default:
						location.replace("crossing.html");
				}
			}
		}
	});
	$('#nameLocation').html(game.location);
	$('#nextLocation').html(game.next);
	$('#nextLocation2').html(game.next2);

	$('#dateLocation').html(getDate(game));
	$('#milesLeft').html(game.toGo);
	$('#milesLeft2').html(game.toGo);

	$('#milesGone').html(game.miles);
	$('#milesBranch').html(game.toGo2);

	$("#food").text(game.food);
	$("#health").text(game.health);
	$("#weather").text(game.weather);

	$("#rivWidth").text(game.riverWidth);
	$("#rivDepth").text(game.riverDepth);
});
