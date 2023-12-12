/* Name: Dan Schomisch
	 File: eraseTombstoneMessages.js
	 Date Modified: 4/23/17
	 Description: Added db functionality to erase tombstone messages(db_update4_23).
*/

document.body.onkeyup = function(e){
	var choice = document.getElementById('inputEraseTombstoneMessages').value; // get chosen value

	if (e.keyCode == enterKey){ // enter key
		switch(choice){
			case 'n': case 'no':
				location.replace("../managementOptions.html");
				break;
			case 'y': case 'yes':
				location.replace("eraseTombstoneMessagesProcess.php");
				break;
			default:
				;
		}
	}
}

var enterKey = 13;