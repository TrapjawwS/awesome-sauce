var total = 0;
document.body.onkeyup = function(e){
    if(e.keyCode == spacebarKey){ // spacebar
		var r = /\d+/;
		var s = window.sessionStorage.dbscore;
		var q = s.match(r)[0];
		if(q < total){
			window.sessionStorage.dbscore = total;
			location.replace("insertHS.php"); // ... enter high score
		}
		else {
			location.replace("../../oregontrail.php");
		}

    }
}

function barButton() {
	var r = /\d+/;
	var s = window.sessionStorage.dbscore;
	var q = s.match(r)[0];
	if(q < total){
		window.sessionStorage.dbscore = total;
		location.replace("insertHS.php"); // ... enter high score
	}
	else {
		location.replace("../../oregontrail.php");
	}
}

var game = JSON.parse(window.sessionStorage.game);
var part = game.axles + game.wheels + game.tongues;

switch(game.job) {
	case 'banker':
		jobMulti = 1;
		break;
	case 'carptenter':
		jobMulti = 2;
		break;
	case 'farmer':
		jobMulti = 3;
		break;
	default:
		jobMulti = 1;
		break;
}

var numGood=0;
var numFair=0;
var numPoor=0;
var numVPoor=0;
document.getElementById("goodrow").style.display = "none";
document.getElementById("fairrow").style.display = "none";
document.getElementById("poorrow").style.display = "none";
document.getElementById("vpoorrow").style.display = "none";
for(i = 0; i < game.party.length; i++) {
	if (game.health[i] >= 7) {
        numGood++;
		document.getElementById("goodrow").style.display = "table-row";
    } else if (game.health[i] >= 5) {
        numFair++;
		document.getElementById("fairrow").style.display = "table-row";
    } else if (game.health[i] >= 3) {
        numPoor++;
		document.getElementById("poorrow").style.display = "table-row";
    } else if (game.health[i] >= 1) {
        numVPoor++;
		document.getElementById("vpoorrow").style.display = "table-row";
    }
}

var goodPts = numGood * 500;
var fairPts = numFair * 400;
var poorPts = numPoor * 300;
var vpoorPts = numVPoor * 200;

//display points in html table
document.getElementById('numGood').innerHTML = numGood;
document.getElementById('goodPts').innerHTML = goodPts;
document.getElementById('numFair').innerHTML = numFair;
document.getElementById('fairPts').innerHTML = fairPts;
document.getElementById('numPoor').innerHTML = numPoor;
document.getElementById('poorPts').innerHTML = poorPts;
document.getElementById('numVPoor').innerHTML = numVPoor;
document.getElementById('vpoorPts').innerHTML = vpoorPts;
document.getElementById('oxen').innerHTML = game.oxen;
document.getElementById('oxenPts').innerHTML = game.oxen*4;
document.getElementById('part').innerHTML = part;
document.getElementById('partPts').innerHTML = part*2;
document.getElementById('clothing').innerHTML = game.sets;
document.getElementById('clothingPts').innerHTML = game.sets*2;
document.getElementById('ammunition').innerHTML = game.ammunition;
document.getElementById('ammunitionPts').innerHTML = game.ammunition*1;
document.getElementById('food').innerHTML = game.food;
document.getElementById('foodPts').innerHTML = Math.floor(game.food/25);
document.getElementById('cash').innerHTML = '$'+game.money.toFixed(2)+ '';
document.getElementById('cashPts').innerHTML = Math.floor(game.money.toFixed(2)/5);
document.getElementById('totalPts').innerHTML = jobMulti*((goodPts)+(fairPts)+(poorPts)+(vpoorPts)+(game.oxen*4)+(part*2)+(game.sets*2)+(game.ammunition*1)+(Math.floor(game.food/25))+(Math.floor(game.money.toFixed(2)/5)));
total = jobMulti*((goodPts)+(fairPts)+(poorPts)+(vpoorPts)+(game.oxen*4)+(part*2)+(game.sets*2)+(game.ammunition*1)+(Math.floor(game.food/25))+(Math.floor(game.money.toFixed(2)/5)));



var spacebarKey = 32;
