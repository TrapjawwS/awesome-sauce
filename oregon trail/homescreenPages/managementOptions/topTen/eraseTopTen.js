/* Name: Dan Schomisch
	 File: eraseTopTen.js
	 Date Modified: 4/22/17
	 Description: Added db functionality to erase current top ten list, 
				  and restore original list(db_update4_22).
*/

document.body.onkeyup = function(e){
	var choice = document.getElementById('inputEraseTopTen').value; // get chosen value

	if (e.keyCode == enterKey){ // enter key
		switch(choice){
			case 'n':
				location.replace("../managementOptions.html");
				break;
			case 'no':
				location.replace("../managementOptions.html");
				break;
			case 'y':
				location.replace("eraseProcess.php");
				break;
			case 'yes':
				location.replace("eraseProcess.php");							
				break;
			default:
				;
		}
	}
}

var enterKey = 13;