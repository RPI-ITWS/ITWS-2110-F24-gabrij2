<?php
// get_data.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Database configuration
$servername = "localhost";
$username = "gabrij2";
$password = "dixie2";
$dbname = "lab4";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query data
$sql = "SELECT * FROM weather_data ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

$data_array = array();

if ($result->num_rows > 0) {
    // Output data of the latest entry
    $row = $result->fetch_assoc();
    $data_array = array(
        'id' => $row['id'],
        'city' => $row['city'],
        'data' => json_decode($row['data'], true)
    );
}

$conn->close();

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data_array);
?>