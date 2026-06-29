<?php

require_once 'database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$database = connectDatabase();

$input = json_decode(file_get_contents('php://input'), true);

$sala_id         = $input['sala_id'];
$nome_prenotante = $input['prenotante'];
$data            = $input['data'];
$ora_inizio      = $input['inizio'];
$ora_fine        = $input['fine'];

// Controllo sovrapposizione orari
$check = $database->prepare('
    SELECT id FROM prenotazioni
    WHERE sala_id = ?
      AND data_prenotazione = ?
      AND ora_inizio < ?
      AND ora_fine   > ?
    LIMIT 1
');
$check->execute([$sala_id, $data, $ora_fine, $ora_inizio]);

if ($check->fetch()) {
    http_response_code(409);
    header('Content-Type: application/json');
    echo json_encode([
        'status'  => 'error',
        'message' => 'La sala è già prenotata in questo orario. Scegli un orario diverso.',
    ]);
    exit;
}

$statement = $database->prepare('
    INSERT INTO prenotazioni (sala_id, nome_prenotante, data_prenotazione, ora_inizio, ora_fine)
    VALUES (?, ?, ?, ?, ?)
');
$statement->execute([$sala_id, $nome_prenotante, $data, $ora_inizio, $ora_fine]);
$new_id = $database->lastInsertId();

header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'id'     => (int) $new_id,
]);