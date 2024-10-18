<?php
// save_data.php

// Database configuration
$servername = "localhost";
$username = "your_db_username";
$password = "your_db_password";
$dbname = "weather_app";

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