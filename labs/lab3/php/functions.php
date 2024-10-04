<?php

function respond($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function handleError($message) {
    respond(['success' => false, 'message' => $message]);
}
?>
