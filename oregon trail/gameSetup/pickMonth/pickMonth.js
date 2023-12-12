$(document).ready(function(){

	// get the game session out of session storage
	var game = JSON.parse(window.sessionStorage.game);
	game.month = 2;
	game.day = 1;
	game.year = 1848;


	// Remove a page from view, using input string pageId
	function removePage(pageId) {
		var page = $(pageId);
		page.attr("style", "display: none");
	}

	// Display a new page to the screen, using input string pageId
	function displayPage(pageId) {
		var page = $(pageId);
		page.attr("style", "display: block");
	}

	// Focus on a give input tag's id and reset its value
	function focusOnInput(input) {
		if(input != null){
			$(input).val(""); // reset it
			$(input).focus();
		}
	}

	// Display the main options page of the store
	function displayHome(pageToRemove) {
		removePage(pageToRemove);
		displayPage("#mainPage");
		focusOnInput("#optionsChoice");
		currentPage = "mainPage";
	}

	// Input: ID of the page to display, input tag ID
	// Output: remove the main page, focus on the given input, set currentPage
	function displayNewPage(pageToDisplay, input) {
		removePage("#mainPage");
		displayPage("#" + pageToDisplay);
		focusOnInput(input);
		currentPage = pageToDisplay;
	}

	$(document).keydown(function(e){
 		if(e.keyCode == enterKey && currentPage == "mainPage"){
			var choice = parseInt($('#optionsChoice').val()); // get chosen value
			if(choice != NaN && choice <= 6 && choice >= 1){
				if (choice == 6) {
					displayNewPage("explanationPage", null);
				}
				else {
					switch(choice){
						case 1: case 2: case 3: case 4: case 5:
							game.month += choice;
					} // end switch
				window.sessionStorage.game = JSON.stringify(game);
				location.replace("../store/storeSetup/storeSetup.html");
				} // end else

			} 
		} // end enterkey if
		if(e.keyCode == spacebarKey && currentPage == "explanationPage"){
            displayHome("#explanationPage");
        } // end spacebarKey if
	}); // end keydown

	$("#barButton").click(function(){
		if(currentPage == "explanationPage"){
            		displayHome("#explanationPage");
        	}
	});

	var currentPage = "mainPage";
	var spacebarKey = 32, enterKey = 13;
});
