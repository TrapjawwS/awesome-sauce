// space to return to menu
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
		location.replace("../main.html");
    }
};

$("#barButton2").click(function() {
	location.replace("../main.html");
});

function getScript(town) {

    var game = JSON.parse(window.sessionStorage.game);

    // randomly pull one person and their script from the
    //  landmarkInfo.js file
    var town = game.location;
	var num = Math.floor(Math.random() * 3);


	if (town == "Independence") {
		document.getElementById("talk").innerHTML = Independence.people[num].intro + "<br><br>" + Independence.people[num].script;
	}
	if (town == "the Kansas River crossing") {
		document.getElementById("talk").innerHTML = KansasRC.people[num].intro + "<br><br>" + KansasRC.people[num].script;
	}
    if (town == "the Big Blue River crossing") {
		document.getElementById("talk").innerHTML = BlueRC.people[num].intro + "<br><br>" + BlueRC.people[num].script;
	}
	if (town == "Fort Kearney") {
		document.getElementById("talk").innerHTML = KearneyF.people[num].intro + "<br><br>" + KearneyF.people[num].script;
	}
	if (town == "Chimney Rock") {
		document.getElementById("talk").innerHTML = ChimneyR.people[num].intro + "<br><br>" + ChimneyR.people[num].script;
	}
	if (town == "Fort Laramie") {
		document.getElementById("talk").innerHTML = LaramieF.people[num].intro + "<br><br>" + LaramieF.people[num].script;
	}
	if (town == "Independence Rock") {
		document.getElementById("talk").innerHTML = IndependenceR.people[num].intro + "<br><br>" + IndependenceR.people[num].script;
	}
	if (town == "South Pass") {
		document.getElementById("talk").innerHTML = SouthP.people[num].intro + "<br><br>" + SouthP.people[num].script;
	}
	if (town == "the Green River crossing") {
		document.getElementById("talk").innerHTML = GreenRC.people[num].intro + "<br><br>" + GreenRC.people[num].script;
	}
	if (town == "Fort Bridger") {
		document.getElementById("talk").innerHTML = BridgerF.people[num].intro + "<br><br>" + BridgerF.people[num].script;
	}
	if (town == "Soda Springs") {
		document.getElementById("talk").innerHTML = SodaS.people[num].intro + "<br><br>" + SodaS.people[num].script;
	}
	if (town == "Fort Hall") {
		document.getElementById("talk").innerHTML = HallF.people[num].intro + "<br><br>" + HallF.people[num].script;
	}
	if (town == "the Snake River crossing") {
		document.getElementById("talk").innerHTML = SnakeRC.people[num].intro + "<br><br>" + SnakeRC.people[num].script;
	}
	if (town == "Fort Boise") {
		document.getElementById("talk").innerHTML = BoiseF.people[num].intro + "<br><br>" + BoiseF.people[num].script;
	}
	if (town == "the Blue Mountains") {
		document.getElementById("talk").innerHTML = BlueM.people[num].intro + "<br><br>" + BlueM.people[num].script;
	}
	if (town == "Fort Walla Walla") {
		document.getElementById("talk").innerHTML = WallaF.people[num].intro + "<br><br>" + WallaF.people[num].script;
	}
	if (town == "The Dalles") {
		document.getElementById("talk").innerHTML = Dalles.people[num].intro + "<br><br>" + Dalles.people[num].script;
	}
}
