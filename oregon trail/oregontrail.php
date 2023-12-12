<!-- Name: TeamHaircut
	 File: oregontrail.php
	 Date Created: 5/27/20
	 Description: Home screen
	 Changes: Updated DB info, refactored filenames
-->

<?php
	session_start();

	/* For getting tombstone messages */
	$servername = "localhost";
	$username = "root";
	$password = "oregontrail";
	$dbname = "oregontrail";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error ." <br><br>Did you use the right username/password/dbname?");
	} 

	$sql = "SELECT * FROM tombstone";
	$result = $conn->query($sql);
	
	echo "<script>
			var tombstones = [];
		</script>";
	
    // Data of each row in the tombstone table from the db
	while($tombstoneRow = $result->fetch_assoc()){
    	$name = $tombstoneRow["name"];
    	$message = $tombstoneRow["message"];
    	$sector = $tombstoneRow["sector"];
    	$mile = $tombstoneRow["mile"]; // The current mile on the current sector
    	echo "<script>
    		var sectorArray = ". json_encode($sector).".split('|');
    		var start = sectorArray[0];
    		var end = sectorArray[1];

			var name = ". json_encode($name).";
			var message = ". json_encode($message).";
			var sector = ". json_encode($sector).";		
			var mile = ". json_encode($mile).";

			var currentTombstone = {
				'name' : name,
				'message' : message,
				'sector' : sector,
				'start' : start,
				'end' : end,
				'mile' : mile
			};
			tombstones.push(currentTombstone);
		</script>";
    }

    // Set the tombstones sessionStorage variable up
    echo "<script>
    	 window.sessionStorage.tombstones = JSON.stringify(tombstones);
    	 </script>";
   	// UNCOMMENT NEXT LINE TO SEE WHAT tombstones HOLDS
   	//echo "<script> alert(window.sessionStorage.tombstones); </script>";

	$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="oregontrail.css">
</head>

<body>
	<div class="title textAlignCenter">
		<h1>
			The Oregon Trail
		</h1>
		<img src="images/header.png">
		<br>
	</div>

	<div class="normalFont paragraphAlignCenter">
		<br>You may: <br>
		<p class="optionsList">
			1. Travel the trail <br>
			2. Learn about the trail <br>
			3. See the Oregon Top Ten<br>
			<span id="sound">4. Turn sound off</span><br>
		</p>
			What is your choice?
			<input class="optionInput normalFont textAlignCenter" id="optionsChoice" type="text" name="quantity" min="1" max="4" onblur="this.focus()" autofocus>
	</div>

	<div class="textAlignCenter">
		<br>
		<img src="images/header.png">
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="oregontrail.js" type="text/javascript"></script>
</body>
</html>
