<!-- Name: Dan Schomisch
	 File: eraseTombstoneMessagesProcess.php
	 Date Created: 4/23/17
	 Description: Erases the tombstone messages from db (db_update4_23). 
				  Redirects to managementOptions.php
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
	$sql = "DELETE from tombstone";
	$result = $conn->query($sql);

	$conn->close();
?>
	<div class="titleNormal normalFont textAlignCenter">
		<h2>
			Erase tombstone messages<br><br>
		</h2>
	</div>

	<div class="centerParagraph normalFont">
		<p>There may be one tombstone on the first half of the trail and one tombstone on the second half.  If you erase the tombstone messages, they will not be replaced until team leaders die along the trail.</p><br><br>
		Do you want to do this? 
		<input id="inputEraseTombstoneMessages" class="optionInput normalFont" type="text" name="quantity" onblur="this.focus()" autofocus>
	</div>

	<script language="javascript">
		window.location.href = "../managementOptions.php"; ////// REDIRECT /////
	</script>
</body>
</html>