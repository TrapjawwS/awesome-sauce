document.body.onkeyup = function(e){
        if(e.keyCode == 32){
        location.replace("../branch.html");
        }
}

$("#barButton2").click(function() {
	location.replace("../branch.html");
});

var game = JSON.parse(window.sessionStorage.game);

var points = {
    "Independence" : [778, 377] ,
    "the Kansas River crossing" : [742, 370] ,
    "the Big Blue River crossing" : [720, 344] ,
    "Fort Kearney" : [680, 338] ,
    "Chimney Rock" : [630, 330] ,
    "Fort Laramie" : [570, 311] ,
    "Independence Rock" : [518, 283] ,
    "South Pass" : [474, 298] ,
    "the Green River crossing" : [435, 310] ,
    "Fort Bridger" : [433, 344] ,
    "Soda Springs" : [417, 295] ,
    "Fort Hall" : [373, 274] ,
    "the Snake River crossing" : [320, 260] ,
    "Fort Boise" : [295, 219] ,
    "the Blue Mountains" : [260, 185] ,
    "Fort Walla Walla" : [252, 149] ,
    "The Dalles" : [227, 163] ,
    "the Willamette Valley" : [190, 149]
};

var mapctx = document.getElementById("map").getContext("2d");
mapctx.strokeStyle = "red";
mapctx.lineWidth = 2.5;
// always start from Independence
mapctx.moveTo(points["Independence"][0], points["Independence"][1]);

// draw the line to every place visited
for (var i = 0; i < game.visited.length; i++) {
    var loc = game.visited[i];
    mapctx.lineTo(points[loc][0], points[loc][1]);
    mapctx.stroke();
}
