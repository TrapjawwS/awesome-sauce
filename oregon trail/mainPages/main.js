function directInput() {
	document.getElementById("optionsChoice").focus();
}

$(document).ready(function(){

	function getMonth(monthNum) {
		switch(monthNum) {
			case 1:
				return "January";
			case 2:
				return "February";
			case 3:
				return "March";
			case 4:
				return "April";
			case 5:
				return "May";
			case 6:
				return "June";
			case 7:
				return "July";
			case 8:
				return "August";
			case 9:
				return "September";
			case 10:
				return "October";
			case 11:
				return "November";
			case 12:
				return "December";
		} // end switch
	} // end function


	var game = JSON.parse(window.sessionStorage.game);

	if(!game.weather){
		game.weather = 'cool';
	}
	if(!game.health){
		game.health = 'good';
	}
	if(!game.pace){
		game.pace = 'steady';
	}
	if(!game.rations){
		game.rations = 'filling';
	}
	if(!game.location){
		game.location = 'Independence';
	}
	if(game.location == 'Independence' && game.inTown == true){
		game.next = 'the Kansas River crossing';
		game.toGo = 102;
	}

	window.sessionStorage.game = JSON.stringify(game);

	var inTown = game.inTown;
	var loc = game.location;

	if (inTown) {
		$('#dateLocation').html(game.location + "<br>" + getMonth(game.month) + " " + game.day + ", " + game.year);
  		document.getElementById("atLandmark").style.display="block";
  		document.getElementById("onTrail").style.display="none";
		if (loc == "Independence" || loc == "Fort Kearney" || loc == "Fort Laramie" || loc == "Fort Bridger" || loc == "Fort Hall" || loc == "Fort Boise" || loc == "Fort Walla Walla") {
  			document.getElementById("canShop").style.display="block";
		}
		else {
  			document.getElementById("canShop").style.display="none";
		}
	}
	else{
		$('#dateLocation').html(getMonth(game.month) + " " + game.day + ", " + game.year);
  		document.getElementById("atLandmark").style.display="none";
  		document.getElementById("onTrail").style.display="block";
  		document.getElementById("canShop").style.display="none";
	}

	$("#weather").text(game.weather);
	$("#health").text(healthStatus(game.health));
	$("#pace").text(game.pace);
	$("#rations").text(game.rations);
	
	// get option set
	$("#optionsChoice").keydown(function(e) {
		if (e.keyCode == 13) {
			var choice = parseInt($(this).val());

			if(!isNaN(choice) && choice <= 9 && choice >= 1){
				switch(choice) {
					case 1:
						if(game.location == "the Kansas River crossing" || game.location == "the Big Blue River crossing" || game.location == "the Green River crossing" || game.location == "the Snake River crossing") {
							if(game.crossing == 1) {
								game.crossing = 0;
								window.sessionStorage.game = JSON.stringify(game);
								location.replace("trail/crossing/crossing.html");
							}
							else {
								location.replace("trail/trail.html");
							}	
						}
						else if(game.location == "South Pass" || game.location == "the Blue Mountains") {
							if(game.branch == 1) {
								game.branch = 0;
								window.sessionStorage.game = JSON.stringify(game);
								location.replace("trail/branch/branch.html");
							}
							else {
								location.replace("trail/trail.html");
							}
						}
						else {
							location.replace("trail/trail.html");
						}
						break;
					case 2:
						location.replace("supplies/supplies.html");
						break;
					case 3:
						location.replace("map/map.html");
						break;
					case 4:
						location.replace("pace/pace.html");
						break;
					case 5:
						location.replace("rations/rations.html");
						break;
					case 6:
						location.replace("rest/rest.html");
						break;
					case 7:
						location.replace("trade/trade.html");
						break;
					case 8:
						if (inTown) {
							location.replace("talk/talk.html");
						}
						else {
							location.replace("hunting/hunting.html");
						}
						break;
					case 9:
						if (inTown) {
							if (loc == "Independence" || loc == "Fort Kearney" || loc == "Fort Laramie" || loc == "Fort Bridger" || loc == "Fort Hall" || loc == "Fort Boise" || loc == "Fort Walla Walla") {
								location.replace("buy/buy.html");
							}
						}
						break;
					default:
						;
				} // end switch
			} // end if
		}
	}); // end keydown
});
