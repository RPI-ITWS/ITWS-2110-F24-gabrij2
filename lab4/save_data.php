<?php
// save_data.php
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

// Get JSON data from POST request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO weather_data (city, data) VALUES (?, ?)");
$stmt->bind_param("ss", $city, $data_serialized);

// Set parameters and execute
$city = $data['name'];
$data_serialized = json_encode($data);

$stmt->execute();

$stmt->close();
$conn->close();

echo "Data saved successfully.";
?>