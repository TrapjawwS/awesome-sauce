document.body.onkeyup = function(e){
    if(e.keyCode == enterKey){
		location.replace("insertProcess.php");
	}
}
var score=window.sessionStorage.dbscore;
document.getElementById('myText0').value=score;

var rate='';
var game = JSON.parse(window.sessionStorage.game);

switch(game.job) {
	case 'banker':
		rate='Greenhorn';
		break;
	case 'carptenter':
		rate='Adventurer';
		break;
	case 'farmer':
		rate='Trail Guide';
		break;
	default:
		rate='Greenhorn';
		break;
}

document.getElementById('myText1').value=rate;

var enterKey=13;