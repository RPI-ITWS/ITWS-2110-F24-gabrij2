<?php

header('Content-Type: application/json');

$type = isset($_GET['type']) ? $_GET['type'] : 'random';

// Map to the appropriate endpoint
switch ($type) {
    case 'random':
        $api_url = 'https://zenquotes.io/api/random';
        break;
    case 'inspirational':
        $api_url = 'https://zenquotes.io/api/quotes';
        break;
    default:
        $api_url = 'https://zenquotes.io/api/random';
        break;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch quote']);
} else {
    echo $result;
}

curl_close($ch);
?>
