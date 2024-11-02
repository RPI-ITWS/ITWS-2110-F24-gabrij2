<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Database configuration
$servername = "localhost";
$username = "gabrij2";
$password = "dixie2";
$dbname = "quiz1";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

require_once 'functions.php';

$stmt = $conn->prepare("SELECT * FROM quiz1");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  echo json_encode([$row]);
} else {
  echo json_encode(['success' => false, 'message' => 'No data found for the specified date']);
}

$stmt->close();
$conn->close();
?>
