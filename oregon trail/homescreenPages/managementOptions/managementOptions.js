function checkEnteredValue(e)
{
	var choice = parseInt(document.getElementById('managementOptionsChoice').value); // get chosen value

    if (e.keyCode == enterKey){ // if enter key pressed
    	if(choice != NaN && choice <= 5 && choice >= 1){
    		switch(choice){
				case 1:
					location.replace("topTen/currentTopTen.php");
					break;
				case 2:
					location.replace("topTen/originalTopTen.php");
					break;
				case 3:
					location.replace("topTen/eraseTopTen.php");
					break;
				case 4:
					location.replace("eraseTombstoneMessages/eraseTombstoneMessages.php");
					break;
				case 5:
					location.replace("../../oregontrail.php");
					break;
				default:
					location.replace("../../oregontrail.php");
				}
    	}
    }
}

var enterKey = 13;
