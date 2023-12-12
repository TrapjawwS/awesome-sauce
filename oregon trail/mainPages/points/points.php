<!-- Name: TeamHaircut
	 File: points.php
	 Date Created: 6/14/2020
	 Description: displays point total
-->

<?php
	session_start();

	/* Determine if user had a high score */
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

	//Did they make Top Ten?
	$sql = "SELECT * FROM scoreboard ORDER BY points desc LIMIT 9,1";
	$result = $conn->query($sql);
	
	echo "<script>
			var dbscore = [];
		</script>";
	
    
	while($scoreboardRow = $result->fetch_assoc()){
    	$points = $scoreboardRow["points"];

		echo "<script>
			var points = ". json_encode($points).";
			var currentScore = {
				'points' : points
			};
			dbscore.push(currentScore);
		</script>";
    }

    // Set the score sessionStorage variable up
    echo "<script>
    	 window.sessionStorage.dbscore = JSON.stringify(dbscore);
    	 </script>";
   	// UNCOMMENT NEXT LINE TO SEE WHAT dbscore HOLDS
   	// echo "<script> alert(window.sessionStorage.dbscore); </script>";

	$conn->close();
	
?>


<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="../../oregontrail.css">	
</head>

<body>
<div id="demo"></div>
	<div class="normalFont textAlignCenter">
		<h2>Points for arriving in Oregon<br></h2>
	</div>
	<div>
		<table>
			<tr id="goodrow">
				<td id="numGood"></td>
				<td>people in good health</td>
				<td id="goodPts"></td>
			</tr>
			<tr id="fairrow">
				<td id="numFair"></td>
				<td>people in fair health</td>
				<td id="fairPts"></td>
			</tr>
			<tr id="poorrow">
				<td id="numPoor"></td>
				<td>people in poor health</td>
				<td id="poorPts"></td>
			</tr>
			<tr id="vpoorrow">
				<td id="numVPoor"></td>
				<td>people in very poor health</td>
				<td id="vpoorPts"></td>
			</tr>
			<tr>
				<td>1</td>
				<td>wagon</td>
				<td>50</td>
			</tr>
			<tr>
				<td id="oxen"></td>
				<td>oxen</td>
				<td id="oxenPts"></td>
			</tr>
			<tr>
				<td id="part"></td>
				<td>spare wagon parts</td>
				<td id="partPts"></td>
			</tr>
			<tr>
				<td id="clothing"></td>
				<td>sets of clothing</td>
				<td id="clothingPts"></td>
			</tr>
			<tr>
				<td id="ammunition"></td>
				<td>boxes of ammunition</td>
				<td id="ammunitionPts"></td>
			</tr>
			<tr>
				<td id="food"></td>
				<td>pounds of food</td>
				<td id="foodPts"></td>
			</tr>
			<tr>
				<td id="cash"> </td>
				<td>cash</td>
				<td id="cashPts"></td>
			</tr>
			<tr>
				<td> </td>
				<td>Total:</td>
				<td id="totalPts"></td>
			</tr>
		</table>
	</div>
	
	<br>

	<p class="normalFont textAlignCenter">
			Press <button class="spaceButton" onclick="barButton()" >SPACE BAR</button> to continue 
	</p>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="points.js" type="text/javascript"></script>

</body>
</html>
