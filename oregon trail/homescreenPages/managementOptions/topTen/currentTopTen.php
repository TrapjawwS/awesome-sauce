<!-- Name: Kyle Fritz
	 File: currentTopTen.php
	 Date Created: 4/17/17
	 Description: Current Top Ten (Hardcoded for now)
	 
	 Name: Dan Schomisch
	 File: currentTopTen.php
	 Date Modified: 4/22/17
	 Description: Added db functionality (db_update4_22).
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

	$sql = "SELECT name, points, rating FROM scoreboard ORDER BY points DESC LIMIT 10";
	$result = $conn->query($sql);
	
	echo '<div class="titleNormal normalFont textAlignCenter">
			<h2>
				Current Top Ten List<br><br>
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