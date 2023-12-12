$(document).ready(function(){
	if(window.sessionStorage.game == undefined){
		var game = {isSound : true};
	}
	else{
		var game = JSON.parse(window.sessionStorage.game);
	}

	if(game.isSound){
		$('#sound').text("4. Turn sound off");
	}
	else{
		$('#sound').text("4. Turn sound on");		
	}
	window.sessionStorage.game = JSON.stringify(game);		


	$(document).keydown(function(e){
		if (e.keyCode == enterKey){ // enter key
			var choice = parseInt($('#optionsChoice').val());
			if(choice != NaN && choice <= 4 && choice >= 1){
				switch(choice){
					case 1:
						location.replace("gameSetup/jobSetup.html");
						break;
					case 2:
						location.replace("homescreenPages/learnTrail/learnTrail.html");
						break;
					case 3:
						location.replace("homescreenPages/oregonTopTen/oregonTopTen.php");
						break;
					case 4:
						location.replace("homescreenPages/sound/sound.html");
						break;
					/*case 5:
						location.replace("homescreenPages/managementOptions/managementOptions.html");
						break;
					case 6:
						location.replace("homescreenPages/end.html");
						break;*/
					default:
						;
				} // end switch
			} // end inner if
		} // end keycode
	}); // end keydown
	var spacebarKey = 32, enterKey = 13;
});
