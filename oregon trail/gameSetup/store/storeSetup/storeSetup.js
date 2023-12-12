$(document).ready(function(){

    var game = JSON.parse(window.sessionStorage.game);
    $("#playerMoney").text("$" + (game.money.toFixed(2)).toString());

    $("#barButton").click(function() {
	// Changing the text on the page...
            pageNum++;
            switch(pageNum){
                case 2:
                    paragraph.text("You can buy whatever you need at Matt's general store.");
                    break;
                case 3:
                    paragraphHead.text("Hello, I'm Matt.  So you're going to Oregon!  I can fix you up with what you need: ");
                    paragraph.html("<br>- a team of oxen to pull your wagon<br><br>- clothing for both summer and winter");
                    break;
                case 4:
                    paragraph.html("<br>- plenty of food for the trip<br><br>- ammunition for your rifles<br><br>- spare parts for your wagon");
                    break;
                case 5:

                default:
                    location.replace("../store.html");
                    break;

            } // end switch
    });

    $(document).keydown(function(e){
        if(e.keyCode == spacebarKey){
            // Changing the text on the page...
            pageNum++;
            switch(pageNum){
                case 2:
                    paragraph.text("You can buy whatever you need at Matt's general store.");
                    break;
                case 3:
                    paragraphHead.text("Hello, I'm Matt.  So you're going to Oregon!  I can fix you up with what you need: ");
                    paragraph.html("<br>- a team of oxen to pull your wagon<br><br>- clothing for both summer and winter");
                    break;
                case 4:
                    paragraph.html("<br>- plenty of food for the trip<br><br>- ammunition for your rifles<br><br>- spare parts for your wagon");
                    break;
                case 5:

                default:
                    location.replace("../store.html");
                    break;

            } // end switch

        } // end if

    }); // end keydown

    var spacebarKey = 32;
    var pageNum = 1; // storeSetup.html text is pageNum = 1
    var paragraph = $('#text'); // to change the paragraph
    var paragraphHead = $('#paragraphHead');

});


