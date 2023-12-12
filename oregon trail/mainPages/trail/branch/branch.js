function directInput() {
	document.getElementById("optionsChoice").focus();
}
$(document).ready(function(){

	var game = JSON.parse(window.sessionStorage.game);

	// get option set
	$("#optionsChoice").keydown(function(e) {
        	if(e.keyCode == 13){
			var choice = parseInt($(this).val());
			if(!isNaN(choice) && choice <= 3 && choice >= 1){
				switch(choice) {
					case 1:
						location.replace("../trail.html");
						break;
					case 2:
						game.next = game.next2;
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("../trail.html");
						break;
					case 3:
						location.replace("map/map.html");
						break;

					default:
						location.replace("branch.html");
				}
			}
		}
	});
});
