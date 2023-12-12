$(document).ready(function(){
	var game = JSON.parse(window.sessionStorage.game);
	game.party = [];

	$(document).keydown(function(e){
		if(e.keyCode == enterKey && ($('#input1').val() != "" && $('#input2').val() != "" && $('#input3').val() != "" && $('#input4').val() != "" && $('#input5').val() != "")){
			names[0] = $('#input1').val();
			names[1] = $('#input2').val();
			names[2] = $('#input3').val();
			names[3] = $('#input4').val();
			names[4] = $('#input5').val();
			// save party variables in JS session storage game variable
			for (var i = 0; i < 5; i++){
				game.party.push(names[i]); // push all of the names
			}
			game.health = [10, 10, 10, 10, 10];
			game.ailment = [0, 0, 0, 0, 0];
			//alert(game.party);
			window.sessionStorage.game = JSON.stringify(game);
			location.replace("../pickMonth/pickMonth.html");
		}

	}); // end keydown
	var enterKey = 13;
	var names = [];
});
