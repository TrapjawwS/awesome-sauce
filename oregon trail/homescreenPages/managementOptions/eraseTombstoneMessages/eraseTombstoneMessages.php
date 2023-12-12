<!-- Name: Kyle Fritz
	 File: eraseTombstoneMessages.php
	 Date Created: 4/19/17
	 Description: Erases the tombstone messages (?)
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
			Erase tombstone messages<br><br>
		</h2>
	</div>

	<div class="centerParagraph normalFont">
		<p>There may be one tombstone on the first half of the trail and one tombstone on the second half.  If you erase the tombstone messages, they will not be replaced.</p><br><br>
		Do you want to do this? 
		<input id="inputEraseTombstoneMessages" class="optionInput normalFont" type="text" name="quantity" onblur="this.focus()" autofocus>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="eraseTombstoneMessages.js" type="text/javascript"></script>
</body>
</html>