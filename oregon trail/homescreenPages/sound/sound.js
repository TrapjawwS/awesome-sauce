$(document).ready(function(){
	var game = JSON.parse(window.sessionStorage.game);

	if(game.isSound === true){
		game.isSound = false;
	}
	else{
		game.isSound = true;
	}
	
	if(game.isSound){
		$('#text').html("The sound is now turned on.<br><br>You may turn the sound on or off during the program by pressing '.'");
	}
	else{
		$('#text').html("The sound is now turned off.<br><br>You may turn the sound on or off during the program by pressing '.'");
	}

	window.sessionStorage.game = JSON.stringify(game);
	
	$(document).keydown(function(e){
 		if(e.keyCode == spacebarKey){
 			location.replace("../../proj2.php");
		}
	}); // end keydown
	var spacebarKey = 32, enterKey = 13;
});