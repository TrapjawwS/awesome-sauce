function checkEnteredValue(e){
	var choice = document.getElementById('inputPointsEarned').value; // get chosen value

    if (e.keyCode == enterKey){ // enter key
		switch(choice){
			case 'n':
				location.replace("../../oregontrail.php");
				break;
			case 'no':
				location.replace("../../oregontrail.php");
				break;
			case 'N':
				location.replace("../../oregontrail.php");
				break;
			case 'NO':
				location.replace("../../oregontrail.php");
				break;
			case 'y':
				location.replace("howPointsEarned/howPointsEarned.html");
				break;
			case 'yes':
				location.replace("howPointsEarned/howPointsEarned.html");
				break;
			case 'Y':
				location.replace("howPointsEarned/howPointsEarned.html");
				break;
			case 'YES':
				location.replace("howPointsEarned/howPointsEarned.html");
				break;
			default:
				;
		}
    }
}

var enterKey = 13;
