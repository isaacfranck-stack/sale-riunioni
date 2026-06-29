<?php


// Carica il file esterno contenente la funzione connectDatabase() per poter interagire con il database.
require_once 'database.php';


// Permette l'accesso alla risorsa da qualsiasi dominio esterno (CORS) e definisce il tipo di risposta.
header('Access-Control-Allow-Origin: *'); // Consente le richieste JavaScript provenienti da altri domini (es. frontend dedicato)
header('Content-Type: application/json; charset=utf-8'); // Indica al browser/client che riceverà dati in formato JSON codificati in UTF-8


// Avvia la connessione utilizzando la funzione definita in database.php e salva l'oggetto PDO nella variabile $database.
$database = connectDatabase();


// Esegue una query diretta sul database per recuperare tutte le prenotazioni correnti.

$results = $database->query('
    SELECT
        p.id,
        p.sala_id,
        s.nome AS sala_nome, 
        p.nome_prenotante,
        p.data_prenotazione,
        p.ora_inizio,
        p.ora_fine
    FROM prenotazioni p
    JOIN sale s ON s.id = p.sala_id 
    ORDER BY p.data_prenotazione, p.ora_inizio 
');


// Estrae contemporaneamente tutti i record trovati dalla query sotto forma di array multidimensionale.
$rows         = $results->fetchAll();

// Crea un array vuoto che verrà popolato con i dati formattati delle prenotazioni.
$reservations = [];


// Scorre ogni singola riga restituita dal database per ripulire e convertire i tipi di dato.
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


// Trasforma l'array di prenotazioni in una stringa JSON valida e la stampa a schermo come risposta dell'API.
echo json_encode($reservations);
