<!-- Name: Kyle Fritz
	 File: eraseTopTen.php
	 Date Created: 4/17/17
	 Description: Erases the current top ten from the database (that are not from the original top ten).
-->

<!-- PHP WILL BE USED IN THE FUTURE -->


<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="https://swe.umbc.edu/~fritzk1/OregonTrail/proj2.css"> 
</head>

<body>
	<div class="titleNormal normalFont textAlignCenter">
		<h2>
			Erase Top Ten list<br><br>
		</h2>
	</div>

	<div class="centerParagraph normalFont">
		<p>If you erase the current Top Ten list, the names and scores will be replaced by those on the original list.</p><br><br>
		Do you want to do this? 
		<input id="inputEraseTopTen" class="optionInput normalFont" type="text" name="quantity" onblur="this.focus()" autofocus>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="eraseTopTen.js" type="text/javascript"></script>
</body>
</html>