function directInput() {
	document.getElementById("optionsChoice").focus();
}

$(document).ready(function() {

    var game = JSON.parse(window.sessionStorage.game);
    $("#currentPace").text(game.pace);
    $("#optionsChoice").keydown(function (e) {
        if (e.keyCode == 13) {
            var choice = parseInt($(this).val());
            if(!isNaN(choice) && choice <= 4 && choice >= 1) {
                if (choice == 4) {
                    location.replace("paceDesc.html");
                }
                else {
                    switch(choice) {
                        case 1:
                            game.pace = "steady";
                            break;
                        case 2:
                            game.pace = "strenuous";
                            break;
                        case 3:
                            game.pace = "grueling";
                            break;
                    }
                window.sessionStorage.game = JSON.stringify(game);
                location.replace("../main.html");
                }
            }
        }
    });
});
