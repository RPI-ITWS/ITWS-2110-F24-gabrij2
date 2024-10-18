<?php

require_once 'db_connect.php';
require_once 'functions.php';

$date = isset($_GET['date']) ? $_GET['date'] : '';

if (!$date) {
  die("Date parameter is required.");
}

$dateOnly = date('Y-m-d', strtotime($date));

$troyDayCriteria = [
  'is_in_troy' => [
    'threshold' => true,
    'message' => "Currently In Troy?",
  ],
  'is_cloudy' => [
    'threshold' => 50,
    'message' => "Some Clouds?",
  ],
  'is_overcast' => [
    'threshold' => 85,
    'message' => "Overcast Clouds?",
  ],
  'feels_like' => [
    'threshold' => 32,
    'message' => "Freezing (32°F)?",
  ],
  'freezing_temp' => [
    'threshold' => 32,
    'message' => "Feels-like is colder?",
  ],
  'daylight_hours' => [
    'threshold' => 11,
    'message' => "Under 11 hrs of light?",
  ],
  'wind_speed' => [
    'threshold' => 5,
    'message' => "Windspeed > 5mph?",
  ],
  'is_wet' => [
    'threshold' => ["drizzle", "mist", "haze", "fog"],
    'message' => "Wet (Fog/ Mist)?",
  ],
  'is_raining' => [
    'threshold' => ["rain", "snow"],
    'message' => "Raining/Drizzling?",
  ],
  'is_storming' => [
    'threshold' => ["thunderstorm"],
    'message' => "Thunderstorm?",
  ],
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Handle form submission
  $updatedResults = [];
  foreach ($_POST['criteria'] as $key => $value) {
    $passes = isset($_POST['passes'][$key]) ? true : false;
    $updatedResults[$key] = [
      'value' => $value,
      'passes' => $passes,
    ];
  }

  $troyDayResultsJson = json_encode($updatedResults);

  $stmt = $conn->prepare("UPDATE troy_day_data SET troy_day_results = ? WHERE date = ?");
  $stmt->bind_param("ss", $troyDayResultsJson, $dateOnly);

  if ($stmt->execute()) {
    echo "Data updated successfully. <a href='../index.html?date=$dateOnly'>View Updated Data</a>";
  } else {
    echo "Error updating data: " . $stmt->error;
  }

  $stmt->close();
  $conn->close();
  exit();
}

// Fetch existing data
$stmt = $conn->prepare("SELECT troy_day_results FROM troy_day_data WHERE date = ?");
$stmt->bind_param("s", $dateOnly);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  die("No data found for the specified date.");
}

$row = $result->fetch_assoc();
$troy_day_results = json_decode($row['troy_day_results'], true);

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit Troy Day Data for <?php echo $dateOnly; ?></title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  >
</head>
<body>
  <div class="container">
    <h1>Edit Troy Day Data for <?php echo $dateOnly; ?></h1>
    <form method="post">
      <?php foreach ($troy_day_results as $key => $result): ?>
        <div class="mb-3">
          <label class="form-label"><?php echo $troyDayCriteria[$key]['message']; ?></label>
          <input type="text" name="criteria[<?php echo $key; ?>]" class="form-control" value="<?php echo htmlspecialchars($result['value']); ?>">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="passes[<?php echo $key; ?>]" id="passes_<?php echo $key; ?>" <?php if ($result['passes']) echo 'checked'; ?>>
            <label class="form-check-label" for="passes_<?php echo $key; ?>">
              Passes
            </label>
          </div>
        </div>
      <?php endforeach; ?>
      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
    <a href="history.php">Back to History</a>
  </div>
</body>
</html>
