/*
    File for common functions across several files

    start at 10 HP (very good)
    9 - 10 vg
    7 - 8 g
    5 - 6 f
    3 - 4 p
    1 - 2 vp
    0 d

    pace -> 0, -1, -2 (resting a day gives + 1)
    rations -> +1, 0, -1
    ailment -> -1 (for 1 week)

    day -> food | weather -> health
*/

var months = ["monthsList", "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"];

// create full date string from integer representation
function getDate(game) {
    var month = months[game.month];
    return month + " " + game.day.toString() + ", " + game.year.toString();
}

// compute the average health of the party overall
function healthStatus(healthArr) {
    var hAvg = 0;
    for (var i = 0; i < healthArr.length; i++) {
        hAvg += healthArr[i];
    }
    hAvg /= healthArr.length;

    if (hAvg >= 9) {
        return "very good";
    } else if (hAvg >= 7) {
        return "good";
    } else if (hAvg >= 5) {
        return "fair";
    } else if (hAvg >= 3) {
        return "poor";
    } else if (hAvg >= 1) {
        return "very poor";
    }
}

// determine the health level of individual party members
//  based on food availability, ailments, etc.
function calculateHealth(game) {

    var paceEffect = 0;
    var rationsEffect = 0;
    var rationsUse = 0;
    var isLeaderDead = false;

    // pace effects
    switch (game.pace) {
        case "rest":
            paceEffect += 1;
            break;
        case "trade": case "hunt":
            // paceEffect is 0 for trading and hunting
            break;
        case "steady":
            paceEffect -= 1;
            break;
        case "strenuous":
            paceEffect -= 2;
            break;
        case "grueling":
            paceEffect -= 3;
            break;
    }

    // rations effects
    switch (game.rations) {
        case "filling":
            rationsEffect += 2;
            rationsUse = 3;
            break;
        case "meager":
            rationsEffect += 1;
            rationsUse = 2;
            break;
        case "bare bones":
            rationsUse = 1;
            break;
    }

    // calculate for every party member
    for (var i = 0; i < game.party.length; i++) {
        // rations points only count if there's enough food
        game.health[i] += paceEffect;

        if (game.food > 0) {
            game.health[i] += rationsEffect;
            game.food -= rationsUse;
            if (game.food < 0) {
                game.food = 0;
            }
        } else {
            // if a party member can't eat, they lose health
            game.health[i] -= 1;
        }

        // if a party member has an ailment, they lose health
        if (game.ailment[i] != 0) {
            game.health[i] -= 1;
            // ailments only affect for so long
            game.ailment[i] -= 1;
        }

        if (game.health[i] > 10) {
            game.health[i] = 10;
        }
        if (game.health[i] <= 0) {
            // death state; remove from game tracking variables
            alert(game.party[i] + " has died.");
            if(i == 0){
            	isLeaderDead = true;
            	//alert("leader did died");
                break;
            }
            game.party.splice(i, 1);
            game.health.splice(i, 1);
            game.ailment.splice(i, 1);
        }

    } // end for
    return isLeaderDead;
}

// calculate progress ability based on number of oxen
//  and party member ailments ailments
function calcMiles(game) {

    var oxen = game.oxen;
    var healthPenalty = 0;

    var pace = game.pace;

    var progress;

    // one mile penalty per current ailment
    for (var i = 0; i < game.ailment.length; i++) {
        if (game.ailment[i] > 0) {
            healthPenalty += 1;
        }
    }

    // oxen have a flat rate effect up to effectively 5 oxen
	if (pace == 'strenuous') {
        progress = oxen * 6
        if (progress > 30) {
            progress = 30;
        }
	}
	else if (game.pace == 'grueling') {
        progress = oxen * 8
        if (progress > 40) {
            progress = 40;
        }
	}
	else {
        progress = oxen * 4
        if (progress > 20) {
            progress = 20;
        }
	}

    progress -= healthPenalty;

    game.miles += progress;
    game.toGo -= progress;

    // take extra miles back off
    if (game.toGo < 0) {
        game.miles -= (0 - game.toGo);
		game.toGo = 0;
	}

}

// day and month advancement
function calcDays(d, game) {
	game.day += d;
      	var m = game.month;

	if ((game.day>31) && (m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12)){

		game.day -= 31;
		if (m==12){
			game.year += 1;
			game.month = 1;
		}
		else {
			game.month += 1;
		}

	}
	else if ((game.day>30) && (m==4 || m==6 || m==9 || m==11)){
		game.day -= 30;
		game.month += 1;
	}
	else if ((game.day>28) && (m==2)){
		game.day -= 28;
		game.month += 1;
	}
} // end function

/// random functions /////////


// check to see if a bad thing happens
function getRandomEvents(game) {
    // random person out of party
	var rand = Math.floor(Math.random() * game.party.length);
	var rand2 = Math.floor((Math.random() * 3) + 1);
		switch (rand2) {
				case 1:
					ailments(rand, game);
					break;
				case 2:
					oxenStatus(game);
					break;
				case 3:
					robbed(game);
					break;
				default:
		}
}

// month-based weather generation
function updateWeather(month) {
	var tempRand = Math.random();
	var preciptRand = Math.random();
	var coldUB, coolUB, warmUB;
	var preciptChance;
	var cond;
	switch (month) {
		case 1:
		// chance of 		COLD				 COOL	    WARM   HOT
		// JAN |---------------------------|--------------|------|----|
		//     0                          .8             .98   .999   1
			coldUB = 0.80; coolUB = 0.98; warmUB = 0.999;
			preciptChance = 0.30;
			break;
		case 2:
			coldUB = 0.80; coolUB = 0.98; warmUB = 0.999;
			preciptChance = 0.25;
			break;
		case 3:
			coldUB = 0.75; coolUB = 0.98; warmUB = 0.99;
			preciptChance = 0.25;
			break;
		case 4:
			coldUB = 0.50; coolUB = 0.95; warmUB = 0.99;
			preciptChance = 0.25;
			break;
		case 5:
			coldUB = 0.10; coolUB = 0.60; warmUB = 0.97;
			preciptChance = 0.30;
			break;
		case 6:
			coldUB = 0.001; coolUB = 0.10; warmUB = 0.80;
			preciptChance = 0.15;
			break;
		case 7:
			coldUB = 0.001; coolUB = 0.10; warmUB = 0.50;
			preciptChance = 0.15;
			break;
		case 8:
			coldUB = 0.001; coolUB = 0.05; warmUB = 0.40;
			preciptChance = 0.25;
			break;
		case 9:
			coldUB = 0.001; coolUB = 0.20; warmUB = 0.75;
			preciptChance = 0.25;
			break;
		case 10:
			coldUB = 0.15; coolUB = 0.75; warmUB = 0.99;
			preciptChance = 0.25;
			break;
		case 11:
			coldUB = 0.50; coolUB = 0.95; warmUB = 0.99;
			preciptChance = 0.25;
			break;
		case 12:
			coldUB = 0.80; coolUB = 0.98; warmUB = 0.99;
			preciptChance = 0.25;
			break;
		default:
			cond = "cool";
			break;
	}
	if(tempRand < coldUB)cond = "cold";
	if(tempRand >= coldUB && tempRand <= coolUB)cond = "cool";
	if(tempRand >= coolUB && tempRand <= warmUB)cond = "warm";
	if(tempRand > warmUB)cond = "hot";
	if(preciptRand < preciptChance && cond == "cool" || preciptRand < preciptChance && cond == "warm"|| preciptRand < preciptChance && cond == "hot")cond = "rainy";
	if(preciptRand < preciptChance && cond == "cold")cond = "snowy";
	return cond;
}

//
function waterStatus() {
	var water = "good";
	var rand = Math.random();
	if(rand > 0.95) {
		water = "bad";
	}
	return water;
}

// weather- and water-based ailment determination
function ailments(person, game) {
	var ailment;
    var weather = game.weather;
    var waterStatus = game.water;
	var rand = Math.random();
	if (rand > 0.90) {
		if(weather == "cold") ailment = "Diptheria";
		else if(waterStatus == "bad" && weather == "cool") ailment = "Cholera";
		else if(waterStatus == "bad" && weather == "hot") ailment = "Dysentery";
		else if(waterStatus == "bad" && weather == "warm") ailment = "Typhoid Fever";
		else {
			var rand2 = Math.floor((Math.random()*3) + 1);

			switch (rand2) {
				case 1:
					ailment = "the measles";
					break;
				case 2:
					ailment = "a snake bite";
					break;
				case 3:
					ailment = "a broken leg";
					break;
				default:
			}
		}
        // ailments cause one week of problems for person
        game.ailment[person] = 7;
  		document.getElementById("random").style.display="block";
		document.getElementById("random").innerHTML = game.party[person] +" has "+ ailment;
	}

}

function oxenStatus(game) {
	var problem="";
	var rand = Math.random();
	console.log(rand);
	if(rand > 0.999) {
		problem = "One of your oxen has died.";
		--game.oxen;
	}
	else if(rand > 0.989) {
		problem = "One of your oxen has wandered off.";
		--game.oxen;
	}
	else if(rand > 0.97) {
		problem = "One of your oxen is sick.";
	}
	else if(rand <= 0.97) {
		problem = "No Problems.";
	}


  	document.getElementById("random").style.display="block";
	document.getElementById("random").innerHTML = problem;

}

// robbery contents determination
function robbed(game) {
	var foodCount = game.food;
	var clothingCount = game.sets;
	var ammunitionCount = game.ammunition;
	var oxenCount = game.oxen;
	var displayProperty = "block";
	var rand = Math.random();
	if(rand > 0.90) {
		var intro = "A thief comes during the <br> night and steals ";
		var amount;
		var outcome;
		var rand2 = Math.floor((Math.random()*4) + 1);
		switch (rand2) {
				case 1:
					if(foodCount <= 0) {displayProperty = "none";}
					else {
						amount = Math.floor((Math.random()*foodCount) + 1);
						outcome = " pounds of food.";
						game.food-=amount;
						if (game.food < 0){
							game.food = 0;
						}
					}
					break;
				case 2:
					if(clothingCount <= 0) {displayProperty = "none";}
					else {
						amount = Math.floor((Math.random()*clothingCount) + 1);
						outcome = " sets of clothing.";
						game.sets-=amount;
						if (game.sets < 0){
							game.sets = 0;
						}
					}
					break;
				case 3:
					if(ammunitionCount <= 0) {displayProperty = "none";}
					else {
						amount = Math.floor((Math.random()*ammunitionCount) + 1);
						outcome = " boxes of bullets.";
						game.ammunition-=amount;
						if (game.ammunition < 0){
							game.ammunition = 0;
						}
					}
					break;
				case 4:
					if(oxenCount <= 0) {displayProperty = "none";}
						else {
						amount = Math.floor((Math.random()*oxenCount) + 1);
						outcome = " oxen.";
						game.oxen-=amount;
						if (game.oxen < 0){
							game.oxen = 0;
						}
					}
					break;
				default:
			}
  		document.getElementById("random").style.display=displayProperty;
		document.getElementById("random").innerHTML = intro +amount +outcome;
	}

}
