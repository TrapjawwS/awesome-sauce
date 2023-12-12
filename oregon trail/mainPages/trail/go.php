<?php
	sleep(5);
?>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="../../oregontrail.css">
</head>

<body onload="go();">

	<div class="trailCanvas alignCenter">
  		<div id="object">
  			<div id="object1"></div>
  		</div>
  		<div id="wheelCanvas" style="margin-left:500px">
  			<div id="animation"></div>
    			<div class="front">
      				<div class="moveWheel"></div>
    			</div>
    			<div class="back">
      				<div class="moveWheel"></div>
    			</div>
  		</div>
	</div>

	<div class="status normalFont negativeColor trailParagraphAlignCenter textAlignCenter">
		Date: <span id="dateLocation"></span> <br>
		Weather: <span id="weather"></span> <br>
		Health: <span id="health"></span> <br>
		Food: <span id="food"></span> <br>
		Next landmark: <span id="milesLeft"></span> <br>
		Miles traveled: <span id="milesGone"></span> <br>
	</div>
	<div class="normalFont trailParagraphAlignCenter textAlignCenter" id="info">
		<span id="random" style="display: none"></span>
	</div>
	<div class="normalFont trailParagraphAlignCenter textAlignCenter" id="space">Press <button class="spaceButton" id="returnButton2" >RETURN</button> to size up the situation</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="../../landmarkInfo.js" type="text/javascript"></script>
	<script src="../common.js" type="text/javascript"></script>
	<script src="go.js" type="text/javascript"></script>

</body>
</html>
