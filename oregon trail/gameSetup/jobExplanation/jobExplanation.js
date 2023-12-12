$(document).ready(function(){
    var spacebarKey = 32;
    $(document).keydown(function(e){
        if(e.keyCode == spacebarKey){
            location.replace("../jobSetup.html");
        }
    });
});
