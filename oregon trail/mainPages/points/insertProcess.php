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

	$sql = "INSERT INTO `scoreboard` (`id`, `name`, `points`, `rating`, `original`) VALUES (NULL, '".$_POST['name']."', '".$_POST['points']."', '".$_POST['rate']."', '0')";
	
	$result = $conn->query($sql);
	
	
	
	$conn->close();
	?>

	<br>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
	<script src="https://swe.umbc.edu/~fritzk1/OregonTrail/changeSound.js" type="text/javascript"></script>
	<script>

		location.replace("../../oregontrail.php");


	</script>

</body>
</html>
