<?php

require_once 'db_connect.php';
require_once 'functions.php';

$date = isset($_GET['date']) ? $_GET['date'] : '';

if (!$date) {
  echo json_encode(['success' => false, 'message' => 'Date parameter is required']);
  exit;
}

$dateOnly = date('Y-m-d', strtotime($date));

$stmt = $conn->prepare("SELECT * FROM troy_day_data WHERE date = ?");
$stmt->bind_param("s", $dateOnly);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $row = $result->fetch_assoc();
  echo json_encode([
    'success' => true,
    'data' => [
      'date' => $row['date'],
      'weatherData' => json_decode($row['weather_data'], true),
      'troyDayResults' => json_decode($row['troy_day_results'], true)
    ]
  ]);
} else {
  echo json_encode(['success' => false, 'message' => 'No data found for the specified date']);
}

$stmt->close();
$conn->close();
?>
