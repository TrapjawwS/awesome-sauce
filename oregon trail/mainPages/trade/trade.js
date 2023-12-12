var enterKey = 13;
var spaceKey = 32;

var items = ["oxen", "sets", "ammunition", "wheels", "axles", "tongues", "food"];

// all askances must be carry-able, at least
var askLimits = {
	"oxen" : 5 ,
	"sets" :  5 ,
	"ammunition" : 5 ,
	"wheels" : 3 ,
	"axles" : 3 ,
	"tongues" : 3 ,
	"food" : 2000
};

// null indicates no limit
var supplyLimits = {
	"oxen" : 20 ,
	"sets" : null ,
	"ammunition" : null ,
	"wheels" : 3 ,
	"axles" : 3 ,
	"tongues" : 3 ,
	"food" : 2000

};

// odds that a trader is available
function traderAvailable() {
	var chance = Math.random();

	if (chance < 0.90) {
		return true;
	}
	return false;
}

// randomly select some item desired
function traderWants() {
	var itemNum = Math.floor(Math.random() * items.length);
	var item = items[itemNum];
	var amount = Math.floor((Math.random() * askLimits[item]) + 1) // always at least 1

	return {"item" : itemNum , "amount" : amount};
}

// randomly select some item to trade that wasn't the same being asked for
function traderGives(wantItem, game) {

	// make sure trade isn't for the same thing
	var itemNum = wantItem;
	while (itemNum == wantItem){
		itemNum = Math.floor(Math.random() * items.length);
	}
	var item = items[itemNum];
	// make sure no carrying capacities are broken by trade
	var amount = supplyLimits[item];
	if (amount !== null) {
		var limit = supplyLimits[item] - game[item];
		if (limit > askLimits[item]) {
			limit = askLimits[item];
		}
		amount = Math.floor((Math.random() * limit) + 1)
	} else {
		amount = Math.floor((Math.random() * askLimits[item]) + 1) // always at least 1
	}

	return {"item" : itemNum , "amount" : amount};
}

function tradeToString(item, amount) {
	var itemStr = items[item];

	// account for singulars
	if (amount == 1) {
		if (item == 0) {
			itemStr = itemStr.slice(0, -2);
		} else {
			itemStr = itemStr.slice(0, -1);
		}
	}

	// account for wording for clothing
	if (item == 1) {
		itemStr += " of clothing";
	} else if (item == 6) {
		itemStr = "pounds of food";
	}

	return amount + " " + itemStr;
}


$(document).ready(function() {

	var game = JSON.parse(window.sessionStorage.game);

	// a day passes while attempting trade
	calcDays(1, game);
	var savePace = game.pace;
	game.pace = "trade";
	calculateHealth(game);
	game.pace = savePace;
	game.weather = updateWeather(game.month);
	game.water = waterStatus();
	window.sessionStorage.game = JSON.stringify(game);

	// display current supplies
	$("#oxen").text(game.oxen);
	$("#food").text(game.food);
	$("#sets").text(game.sets);
	$("#ammunition").text(game.ammunition);
	$("#axles").text(game.axles);
	$("#wheels").text(game.wheels);
	$("#tongues").text(game.tongues);

	var trader = traderAvailable();
	var canTrade = false;

	var wants;
	var wItemNum;
	var wItem;
	var gives;
	var gItemNum;
	var gItem;


	if (trader) {

		 wants = traderWants();
		 wItemNum = wants["item"];
		 wItem = items[wItemNum];

		 $("#trader").css("display", "block");
		 $("#wants").text(tradeToString(wItemNum, wants["amount"]));

		 if (game[wItem] < wants["amount"]) {
			 // cannot trade
			 $("#cannotTrade").css("display", "block");
		 } else {
			 // trade possible
			 canTrade = true;

			 gives = traderGives(wItemNum, game);
			 gItemNum = gives["item"];
			 gItem = items[gItemNum];

			 // show trading options
			 $("#canTrade").css("display", "block");
			 $("#gives").text(tradeToString(gItemNum, gives["amount"]));
			 $("#willTrade").css("display", "block");
			 $("#inputTrade").focus();
		 }
	} else {
		// no trader
		$("#noTrader").css("display", "block");
	}

	// only allow yes/no if trade is possible
	if (trader && canTrade) {

		$(document).keydown(function(e){

			// decide to trade or not
			var choice = document.getElementById('inputTrade').value; // get chosen value
			if (e.keyCode == enterKey){ // enter key
				switch(choice){
					case 'n': case 'no': case 'N': case 'No': case 'NO':
						location.replace("../main.html");
						break;
					case 'y': case 'yes': case 'Y': case 'Yes': case 'YES':
						// do trade;
						game[wItem] -= wants["amount"];
						game[gItem] += gives["amount"];
						window.sessionStorage.game = JSON.stringify(game);
						location.replace("../main.html");
						break;
					default:
						;
				}
			}
		});

	//  if can't trade, just space to return
	} else {

		$(document).keydown(function(e) {
			if (e.keyCode == spaceKey) {
				location.replace("../main.html");
			}
		});

		$("#barButton2").click(function() {
			location.replace("../main.html");
		});

	}
});
