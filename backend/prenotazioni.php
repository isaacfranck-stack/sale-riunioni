<?php

require_once 'database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$database = connectDatabase();

$results = $database->query('
    SELECT
        p.id,
        p.sala_id,
        s.nome            AS sala_nome,
        p.nome_prenotante,
        p.data_prenotazione,
        p.ora_inizio,
        p.ora_fine
    FROM prenotazioni p
    JOIN sale s ON s.id = p.sala_id
    ORDER BY p.data_prenotazione, p.ora_inizio
');

$rows         = $results->fetchAll();
$reservations = [];

foreach ($rows as $row) {
    $reservations[] = [
        'id'               => (int) $row['id'],
        'sala_id'          => (int) $row['sala_id'],
        'sala_nome'        => $row['sala_nome'],
        'nome_prenotante'  => $row['nome_prenotante'],
        'data_prenotazione'=> $row['data_prenotazione'],
        'ora_inizio'       => $row['ora_inizio'],
        'ora_fine'         => $row['ora_fine'],
    ];
}

echo json_encode($reservations);
