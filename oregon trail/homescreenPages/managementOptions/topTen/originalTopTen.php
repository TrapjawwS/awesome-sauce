<!-- Name: Kyle Fritz
	 File: originalTopTen.html
	 Date Created: 4/15/17
	 Description: Original Top Ten (Hardcoded)
	 
	 Name: Dan Schomisch
	 File: originalTopTen.php (renamed)
	 Date Created: 4/22/17
	 Description: added db functionality (db_update4_22)
-->

<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" type="text/css" href="https://swe.umbc.edu/~fritzk1/OregonTrail/proj2.css"> 
</head>

<body>
<?php
	$servername = "studentdb-maria.gl.umbc.edu";
	$username = "dschom1";
	$password = "dschom1";
	$dbname = "dschom1";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error ." <br><br>Did you use the right username/password/dbname?");
	} 

	$sql = "SELECT name, points, rating FROM scoreboard WHERE original = 1 ORDER BY points DESC LIMIT 10 ";
	$result = $conn->query($sql);
	
	echo '<div class="titleNormal normalFont textAlignCenter">
			<h2>
				Original Top Ten List<br><br>
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

	<p class="title">Press SPACE BAR to continue </p>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script src="topTen.js" type="text/javascript"></script>
</body>
</html>