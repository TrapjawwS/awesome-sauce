var imgMap = {
    "Independence" : "../images/independence.png" ,
    "the Kansas River crossing" : "images/kansas.png" ,
    "the Big Blue River crossing" : "images/blueR.png" ,
    "Fort Kearney" : "images/kearney.png" ,
    "Chimney Rock" : "images/chimney.png" ,
    "Fort Laramie" : "images/laramie.png" ,
    "Independence Rock" : "images/indepr.png" ,
    "South Pass" : "images/south.png" ,
    "the Green River crossing" : "images/green.png" ,
    "Fort Bridger" : "images/bridger.png" ,
    "Soda Springs" : "images/soda.png" ,
    "Fort Hall" : "images/hall.png" ,
    "the Snake River crossing" : "images/snake.png" ,
    "Fort Boise" : "images/boise.png" ,
    "the Blue Mountains" : "images/blue.png" ,
    "Fort Walla Walla" : "images/walla.png" ,
    "The Dalles" : "images/columbia.png" ,
    "the Willamette Valley" : "images/will.png"
};

$(document).ready(function() {

    var game = JSON.parse(window.sessionStorage.game);
    // whatever the location variable is
    var name = game.location;

    game.visited.push(name);
    var fullDate = getDate(game);
    var locationImage = "url(" + imgMap[name] + ")";

    game.inTown = true;
    window.sessionStorage.game = JSON.stringify(game);

    // sets the canvas background to the image specified
    $("#picture").css("background-image", locationImage);
    // set the location and date titling
    $("#dateLocation").html(name + "<br>" + fullDate);

    if(typeof game.isSound == 'undefined'){
        game.isSound = true; // sound starts out as true
    }

    window.sessionStorage.game = JSON.stringify(game);


    if(game.isSound){
        var sound = new Audio();
        sound.src = "https://swe.umbc.edu/~fritzk1/OregonTrail/sounds/new_place.mp3";
        sound.loop = true;
        sound.play();
    }

    $("#barButton2").click(function() {
		    if (name == 'The Dalles'){
            	location.replace("riverGameDesc.html");
		    }
            else if (name == "the Willamette Valley") {
                // game completion, calculate points
                location.replace("../points/points.php");
            }
		    else{
            	location.replace("../main.html");
		    }
    });

    $(document).keydown(function(e) {
        if (e.keyCode == spacebarKey) {
		    if (name == 'The Dalles'){
            	location.replace("riverGameDesc.html");
		    }
            else if (name == "the Willamette Valley") {
                // game completion, calculate points
                location.replace("../points/points.php");
            }
		    else{
            	location.replace("../main.html");
		    }
        }
    });
    var spacebarKey = 32, enterKey = 13;
});
