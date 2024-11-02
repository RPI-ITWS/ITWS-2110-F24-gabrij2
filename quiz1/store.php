<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "gabrij2";
$password = "dixie2";
$dbname = "quiz1";

$conn = new mysqli($servername, $username, $password, $dbname);

// Get JSON
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

$stmt = $conn->prepare("INSERT INTO quiz1 data) VALUES (?)");
$stmt->bind_param("s", $data);

$data_serialized = json_encode($data['data']);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'success']);
} else {
    echo json_encode(['success' => false, 'message' => 'failed']);
}

$stmt->close();
$conn->close();
?>