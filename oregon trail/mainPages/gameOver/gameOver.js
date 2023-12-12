$(document).ready(function(){
	// RESET GAME
	var game = [];
	window.sessionStorage.game = JSON.stringify(game);
	$(document).keydown(function(e){
 		if(e.keyCode == spacebarKey){
			location.replace("../../oregontrail.php"); 
		} // end keycode
	}); // end keydown

	$("#barButton").click(function() {
		location.replace("../../oregontrail.php");
	});

	var spacebarKey = 32, enterKey = 13;
});
