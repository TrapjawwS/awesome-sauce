document.body.onkeyup = function(e){
    if(e.keyCode == spacebarKey){ // spacebar
        pageNum++; // next page

        switch(pageNum){
        	case 2:
        		paragraph.innerHTML = "How will you cross the rivers? If you have money, you might take a ferry (if there is a ferry).  Or, you can ford the river and hope you and your wagon aren't swallowed alive!";
        		break;
        	case 3:
        		paragraph.innerHTML = "What about supplies?  Well, if you're low on food you can hunt.  You might get a buffalo...you might.  And there are bear in the mountains.";
        		break;
        	case 4:
        		paragraph.innerHTML = "At the Dalles, you can try navigating the Columbia River, but if running the rapids with a makeshift raft makes you queasy, better take the Barlow Road.";
        		break;
        	case 5:
        		paragraph.innerHTML = "If for some reason you don't survive -- your wagon burns, or thieves steal you oxen, or you run out of provisions, or you die of cholera -- don't give up!  Try again...and again...until your name is up with the others on The Oregon Top Ten.";
        		break;
        	case 6:
        		paragraphHead.innerHTML = "Control-S key";
        		paragraph.innerHTML = "You may turn the sound on or off during the program by pressing Control-S";
        		break;
        	case 7:
        		paragraphHead.innerHTML = "Developed for the web by: <br><br>	";
        		paragraph.setAttribute("style", "text-align: center");
        		paragraph.innerHTML = "TeamHaircut Digital Network<br>www.teamhaircut.org<br>";
        		break;
        	default: // if something fails, or pageNum > 8...
	        	location.replace("../../oregontrail.php"); // ... go back to homescreen
	        	break;

        }
    }
}

function barButton() {
        pageNum++; // next page

        switch(pageNum){
        	case 2:
        		paragraph.innerHTML = "How will you cross the rivers? If you have money, you might take a ferry (if there is a ferry).  Or, you can ford the river and hope you and your wagon aren't swallowed alive!";
        		break;
        	case 3:
        		paragraph.innerHTML = "What about supplies?  Well, if you're low on food you can hunt.  You might get a buffalo...you might.  And there are bear in the mountains.";
        		break;
        	case 4:
        		paragraph.innerHTML = "At the Dalles, you can try navigating the Columbia River, but if running the rapids with a makeshift raft makes you queasy, better take the Barlow Road.";
        		break;
        	case 5:
        		paragraph.innerHTML = "If for some reason you don't survive -- your wagon burns, or thieves steal you oxen, or you run out of provisions, or you die of cholera -- don't give up!  Try again...and again...until your name is up with the others on The Oregon Top Ten.";
        		break;
        	case 6:
        		paragraphHead.innerHTML = "Control-S key";
        		paragraph.innerHTML = "You may turn the sound on or off during the program by pressing Control-S";
        		break;
        	case 7:
        		paragraphHead.innerHTML = "Developed for the web by: <br><br>	";
        		paragraph.setAttribute("style", "text-align: center");
        		paragraph.innerHTML = "TeamHaircut Digital Network<br>www.teamhaircut.org<br>";
        		break;
        	default: // if something fails, or pageNum > 8...
	        	location.replace("../../oregontrail.php"); // ... go back to homescreen
	        	break;

        }
}



var pageNum = 1; // learnTrail.html is pageNum = 1
var paragraph = document.getElementById('learnTrailDesc'); // to change the paragraph
var paragraphHead = document.getElementById('paragraphHead'); // as a header to the paragraph

var spacebarKey = 32;
