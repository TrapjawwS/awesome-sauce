<!-- Name: Dan Schomisch
	 File: eraseProcess.php
	 Date Created: 4/22/17
	 Description: Deletes all non-original rows from db (db_update4_22).  
				  Redirects to managementOptions.php.
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

		//delete current scoreboard
		$sql = "DELETE from scoreboard WHERE original <> 1";
		$result = $conn->query($sql);

		$conn->close();
	?>
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
	
	<script language="javascript">
		window.location.href = "../managementOptions.php"; ////// REDIRECT /////
	</script>
</body>
</html>