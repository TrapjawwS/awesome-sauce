$(document).ready(function(){
	var game = JSON.parse(window.sessionStorage.game);
	if(typeof game.isSound == 'undefined'){
		game.isSound = true; // sound starts out as true
		window.sessionStorage.game = JSON.stringify(game);
	}
	$(document).keydown(function(e){
		if(e.which == periodKey){ // '.' key
			game.isSound = !game.isSound;
			window.sessionStorage.game = JSON.stringify(game);
		}
	});
	var periodKey = 190;
});