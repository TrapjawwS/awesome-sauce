$(document).ready(function(){

	var game = JSON.parse(window.sessionStorage.game); // pull game variables from session storage

	$("#playerMoney").text("$" + (game.money.toFixed(2)).toString()); // display how much money the player has

	// always start on the first of month, map month name to number
	switch (game.month) {
		case 3:
			$("#month").text("March");
			break;
		case 4:
			$("#month").text("April");
			break;
		case 5:
			$("#month").text("May");
			break;
		case 6:
			$("#month").text("June");
			break;
		case 7:
			$("#month").text("July");
			break;
	}

	// Remove a page from view, using input string pageId
	function removePage(pageId) {
	  var page = $(pageId);
	  page.attr("style", "display: none");
	}

	// Display a new page to the screen, using input string pageId
	function displayPage(pageId) {
	  //alert(pageId);
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

	// Input: ID of the page to remove
	// Output: Display the main options page of the store
	function displayHome(pageToRemove) {
		calculateNewBill(); // calculate for the homescreen
		removePage(pageToRemove);
		displayPage("#mainOptions");
		focusOnInput("#optionsChoice");
		currentPage = "mainPage";
	}

	// Input: ID of the page to display, input tag ID, and what you want to the currentPage to
	// Output: remove the main options page, focus on the given input, set currentPage
	function displayNewPage(pageToDisplay, input, currPage) {
		//alert(pageToDisplay);
		removePage("#mainOptions");
		displayPage(pageToDisplay);
		focusOnInput(input);
		currentPage = currPage;
	}

	// Calculate the user's total bill, then put it on the main options page
	function calculateNewBill() {
		totalBill = numOxen * oxenPrice + numFood * foodPrice + numClothing * clothingPrice + numAmmunition * ammunitionPrice + (numWheels + numAxles + numTongues) * partsPrice;
		$("#storeTable")[0].rows[7].cells[1].innerHTML = "$" + (totalBill.toFixed(2)).toString();
	}

	// Sets the cost on the HTML page, given the row number of the item that is being bought and the price (numItem * itemPrice)
	function setHTML(rowNum, price){
		$("#storeTable")[0].rows[rowNum].cells[1].innerHTML = "$" + (price.toFixed(2)).toString();
	}

	// Check if the user has bought oxen or not. User can only leave the store if oxen has been bought.
	function checkHasOxen() {
		if(numOxen >= 1){
			return true;
		}
		return false;
	}

	// Get the user input for the amount of the item that they want from the store, and setting up the html for it on the store page
	// if user input is outside of min & max, return -1
	function getValuesAndSetupHomepage(inputId, itemPrice, min, max, rowIndex){
		amount = parseInt($(inputId).val());
		if(amount != NaN && amount <= max && amount >= min){
			setHTML(rowIndex, itemPrice * amount);
			return amount;
		} // end if
		return -1;
	}

	// Input: the amount of a given item, the page to remove
	// Output: Display the homepage if numItem != -1
	function checkValue(numItem, pageToRemove) {
		if(numItem != -1){
			displayHome(pageToRemove);
		}
	}
    
//
//

    $(document).keydown(function(e){
        if(e.keyCode == spacebarKey){
        	if(currentPage == "mainPage" && checkHasOxen()){

				if (totalBill > game.money){
	        		displayNewPage("#errorPage", null, "errorPage");
	        	}
	        	else {
	        		game.money -= totalBill;
	        		game.oxen = numOxen * 2; // 2 oxen = 1 yoke
					game.food = numFood;
					game.sets = numClothing;
					game.ammunition = numAmmunition;
					game.wheels = numWheels;
					game.axles = numAxles;
					game.tongues = numTongues;

					// setup remaining game variables before continuing
					game.location = "Independence";
					game.visited = [];
					game.miles = 0;

					game.weather = updateWeather(game.month);
					game.water = waterStatus();
					game.pace = "steady";
					game.rations = "filling";

					window.sessionStorage.game = JSON.stringify(game);
					displayNewPage("#afterPage", null, "afterPage");
				} // end else

        	} // end inner if
        	else if(currentPage == "errorPage"){
        		displayHome("#errorPage");
        	}
        	else if(currentPage == "afterPage"){
			//alert("180,36");
        		location.replace("../../mainPages/trail/landmark.html");
        	}

        } // end spacebarKey if

		else if(e.keyCode == enterKey){
			if(currentPage == "mainPage"){
				choice = parseInt($("#optionsChoice").val());
				if(choice != NaN && choice <= 7 && choice >= 1){
					switch(choice){
						case 1:
							displayNewPage("#buyOxen", "#inputBuyOxen", "oxenPage");
							break;
						case 2:
							displayNewPage("#buyFood", "#inputBuyFood", "foodPage");
							break;
						case 3:
							displayNewPage("#buyClothing", "#inputBuyClothing", "clothingPage");
							break;
						case 4:
							displayNewPage("#buyAmmunition", "#inputBuyAmmunition", "ammunitionPage");
							break;
						case 5:
							displayNewPage("#buyWheels", "#inputBuyWheels", "wheelsPage");
							break;
						case 6:
							displayNewPage("#buyAxles", "#inputBuyAxles", "axlesPage");
							break;
						case 7:
							displayNewPage("#buyTongues", "#inputBuyTongues", "tonguesPage");
							break;
						default:
							;
					} // end switch
				} // end inner if
			} // end currentPage if
			else if(currentPage == "oxenPage"){
				numOxen = getValuesAndSetupHomepage("#inputBuyOxen", oxenPrice, 1, 9, 0);
				checkValue(numOxen, "#buyOxen");
			} // end currentPage if
			else if(currentPage == "foodPage"){
				numFood = getValuesAndSetupHomepage("#inputBuyFood", foodPrice, 0, 2000, 1);
				checkValue(numFood, "#buyFood");
			} // end currentPage if
			else if(currentPage == "clothingPage"){
				numClothing = getValuesAndSetupHomepage("#inputBuyClothing", clothingPrice, 0, 99, 2);
				checkValue(numClothing, "#buyClothing");
			} // end currentPage if
			else if(currentPage == "ammunitionPage"){
				numAmmunition = getValuesAndSetupHomepage("#inputBuyAmmunition", ammunitionPrice, 0, 99, 3);
				checkValue(numAmmunition, "#buyAmmunition");
			} // end currentPage if
			else if(currentPage == "wheelsPage"){
				numWheels = getValuesAndSetupHomepage("#inputBuyWheels", partsPrice, 0, 3, 4);
				checkValue(numWheels, "#buyWheels");
			} // end currentPage if
			else if(currentPage == "axlesPage"){
				numAxles = getValuesAndSetupHomepage("#inputBuyAxles", partsPrice, 0, 3, 5);
				checkValue(numAxles, "#buyAxles");
			} // end currentPage if
			else if(currentPage == "tonguesPage"){
				numTongues = getValuesAndSetupHomepage("#inputBuyTongues", partsPrice, 0, 3, 6);
				checkValue(numTongues, "#buyTongues");
			} // end currentPage if
		} // end enterKey else if

    }); // end keydown

    $("#barButton2").click(function() {
	     location.replace("../../mainPages/trail/landmark.html");
});

    $("#barButton3").click(function() {
	if(currentPage == "errorPage"){
		//alert("139,35");
		displayHome("#errorPage");
	}
	else if(currentPage == "afterPage"){
		//alert("139,35");
		location.replace("../../mainPages/trail/landmark.html");
	}
});

    $("#barButton").click(function() {
	//alert("104,Col24");
	if(currentPage == "mainPage" && checkHasOxen()){
		if (totalBill > game.money){

        		displayNewPage("#errorPage", null, "errorPage");
        	}
        	else {
			//alert("110,43");
        		game.money -= totalBill;
        		game.oxen = numOxen * 2; // 2 oxen = 1 yoke
				game.food = numFood;
				game.sets = numClothing;
				game.ammunition = numAmmunition;
				game.wheels = numWheels;
				game.axles = numAxles;
				game.tongues = numTongues;

				// setup remaining game variables before continuing
				game.location = "Independence";
				game.visited = [];
				game.miles = 0;

				game.weather = updateWeather(game.month);
				game.water = waterStatus();
				game.pace = "steady";
				game.rations = "filling";
				window.sessionStorage.game = JSON.stringify(game);
				//alert("130,52");
				displayNewPage("#afterPage", null, "afterPage");
		} // end else
	} // end inner if
 });


  var currentPage = "mainPage"; // initially main options are displayed, keep track of the current page that the user is on
  var spacebarKey = 32, enterKey = 13;
  var numOxen = 0, numFood = 0, numClothing = 0, numAmmunition = 0, numWheels = 0, numAxles = 0, numTongues = 0;
  var oxenPrice = 40, foodPrice = 0.2, clothingPrice = 10, ammunitionPrice = 2, partsPrice = 10;
  var totalBill = 0.00;
});
