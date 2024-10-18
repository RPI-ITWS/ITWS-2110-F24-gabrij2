<?php

require_once 'db_connect.php';
require_once 'functions.php';


// Fetch all entries from the database
$sql = "SELECT date, troy_day_results FROM troy_day_data ORDER BY date DESC";
$result = $conn->query($sql);

$entries = [];

if ($result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $date = $row['date'];
    $troy_day_results = json_decode($row['troy_day_results'], true);

    // Calculate Troy Day score (number of passes)
    $numPasses = 0;
    foreach ($troy_day_results as $res) {
      if ($res['passes']) {
        $numPasses++;
      }
    }
    $troyDayPercentage = ($numPasses / 10) * 100;

    $entries[] = [
      'date' => $date,
      'score' => $troyDayPercentage,
    ];
  }
} else {
  echo "No data found.";
  exit;
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Historical Troy Day Data</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
    crossorigin="anonymous"
  >
</head>
<body>
  <div class="container">
    <h1>Historical Troy Day Data</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Date</th>
          <th>Troy Day Score (%)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($entries as $entry): ?>
          <tr>
            <td><?php echo $entry['date']; ?></td>
            <td><?php echo $entry['score']; ?>%</td>
            <td>
              <a href="../index.html?date=<?php echo $entry['date']; ?>">View</a> |
              <a href="edit.php?date=<?php echo $entry['date']; ?>">Edit</a>
            </td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
    <a href="../index.html">Back to Main Page</a>
  </div>
</body>
</html>
