document.body.onkeyup = function(e){
	if(e.keyCode == spacebarKey){ // spacebar
		location.replace("../managementOptions.html");
	}
}

var spacebarKey = 32;