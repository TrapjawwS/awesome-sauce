<!-- Name: TeamHaircut
	 File: oregonTopTen.html
	 Date Created: 5/28/20
	 Description: Oregon Top Ten, using database
-->



<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="../../oregontrail.css">
</head>

<body>
	<?php
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

	$sql = "SELECT name, points, rating FROM scoreboard ORDER BY points DESC LIMIT 10";
	$result = $conn->query($sql);
	
	echo '<div class="title textAlignCenter">
			<h1>
				The Oregon Top Ten
			</h1>
			<img src="../../images/header.png">
			<br>
		</div>';
	
	if ($result->num_rows > 0) {
    echo '<div>
	<table> <tr class="headerRow"> <th>Name</th> <th>Points</th> <th>Rating</th> </tr>';
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "	<tr>
					<td>".$row["name"]."</td>
					<td>".$row["points"]."</td>
					<td>".$row["rating"]."</td>
				</tr>";
    }
    echo "	</table>
		</div>";
	} else {
		echo "0 results";
	}
	$conn->close();
	?>

	<br>

	<div class="normalFont paragraphAlignCenter" style="border: solid; padding:0.5em">
		Would you like to see how points are earned?
		<input class="optionInput normalFont textAlignCenter" id="inputPointsEarned" type="text"
		onkeypress="checkEnteredValue(event)" onblur="this.focus()" autofocus></input>
	</div>

	<div class="textAlignCenter">
		<br>
		<img src="../../images/header.png">
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="oregonTopTen.js" type="text/javascript"></script>

</body>
</html>
