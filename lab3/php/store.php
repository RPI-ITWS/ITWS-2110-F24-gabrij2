<?php

require_once 'db_connect.php';
require_once 'functions.php';

$data = file_get_contents('php://input');
$json = json_decode($data, true);

if (!$json) {
  echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
  exit;
}

$weatherData = $json['weatherData'];
$troyDayResults = $json['troyDayResults'];
$date = $json['date'];

$weatherDataJson = json_encode($weatherData);
$troyDayResultsJson = json_encode($troyDayResults);

$dateOnly = date('Y-m-d', strtotime($date));

$stmt = $conn->prepare("
  INSERT INTO troy_day_data (date, weather_data, troy_day_results) VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE weather_data = VALUES(weather_data), troy_day_results = VALUES(troy_day_results)
");
$stmt->bind_param("sss", $dateOnly, $weatherDataJson, $troyDayResultsJson);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
}

$stmt->close();
$conn->close();
?>
