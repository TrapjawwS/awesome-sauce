function directInput() {
	document.getElementById("optionsChoice").focus();
}
$(document).ready(function(){

    var game = JSON.parse(window.sessionStorage.game);

    $("#optionsChoice").keydown( function (e) {
        if (e.keyCode == 13) {
            var choice = parseInt($(this).val());
            if(!isNaN(choice) && choice <= 9 && choice >= 0){
				calcDays(choice, game);
				var savePace = game.pace;
				game.pace = "rest";
				// calcuate health effects and weather over rest period
				for (var i = 0; i < choice; i++) {
					calculateHealth(game);
					game.weather = updateWeather(game.month);
					game.water = waterStatus();
				}
				game.pace = savePace;
                window.sessionStorage.game = JSON.stringify(game);
                location.replace("../main.html");
            }
        }
    });
});
