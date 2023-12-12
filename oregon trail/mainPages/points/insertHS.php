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
	
	echo '<div class="titleNormal normalFont textAlignCenter">
			<h2>
				The Oregon Top Ten<br><br>
			</h2>
		</div>';
	
	if ($result->num_rows > 0) {
    echo '<div>
			<table>
				<tr class="headerRow">
					<th>Name</th>
					<th>Points</th>
					<th>Rating</th>
				</tr>';
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

	<div class="bordered normalFont">
		Congratulations!  Type your name as you would like to see it on the Oregon Top Ten list.
		<form action="insertProcess.php" method="post">
		
		<input class="optionInput normalFont" type="text" name="name" onblur="this.focus()" autofocus><br>
		<input class="optionInput normalFont" type="text" id="myText0" name="points"><br>
		<input class="optionInput normalFont" type="text" id="myText1" name="rate">
		
		<input type="submit" style="height: 0px; width: 0px; border: none; padding: 0px;" hidefocus="true">

		</form>
	</div>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="insertHS.js" type="text/javascript"></script>

</body>
</html>
