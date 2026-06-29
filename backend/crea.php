<?php


// Carica le funzioni o le configurazioni esterne per connettersi al database.
require_once 'database.php';


// Permette a siti web esterni (es. un frontend React, Vue o Mobile) di fare richieste a questa API.
header('Access-Control-Allow-Origin: *'); // Consente l'accesso da qualsiasi dominio
header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Specifica i metodi HTTP consentiti
header('Access-Control-Allow-Headers: Content-Type'); // Consente l'invio dell'intestazione Content-Type


// I browser inviano una richiesta OPTIONS prima del POST per verificare i permessi CORS.
// Se la richiesta è OPTIONS, l'applicazione interrompe l'esecuzione e risponde subito positivamente.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}


// Chiama la funzione (definita in database.php) per ottenere l'oggetto di connessione (es. PDO).
$database = connectDatabase();


// Legge il body della richiesta HTTP (testo grezzo in formato JSON) e lo trasforma in un array associativo PHP.
$input = json_decode(file_get_contents('php://input'), true);


// Estrae i singoli valori dall'array $input e li salva in variabili dedicate.
$sala_id         = $input['sala_id'];
$nome_prenotante = $input['prenotante'];
$data            = $input['data'];
$ora_inizio      = $input['inizio'];
$ora_fine        = $input['fine'];


// Prepara una query SQL per cercare se esiste già una prenotazione per la stessa sala, nello stesso giorno,
// e i cui orari si sovrappongono a quelli richiesti.
$check = $database->prepare('
    SELECT id FROM prenotazioni
    WHERE sala_id = ?
      AND data_prenotazione = ?
      AND ora_inizio < ?
      AND ora_fine   > ?
    LIMIT 1
');
// Esegue la query inserendo in modo sicuro i parametri per evitare SQL Injection.
$check->execute([$sala_id, $data, $ora_fine, $ora_inizio]);


// Se la query precedente restituisce almeno una riga, significa che la sala è occupata.
if ($check->fetch()) {
    http_response_code(409); // Imposta lo stato HTTP a 409 Conflict
    header('Content-Type: application/json'); // Specifica che la risposta è un JSON
    echo json_encode([ // Invia il messaggio d'errore formattato in JSON
        'status'  => 'error',
        'message' => 'La sala è già prenotata in questo orario. Scegli un orario diverso.',
    ]);
    exit; // Blocca lo script ed evita di procedere con l'inserimento
}


// Prepara la query di inserimento per salvare la prenotazione nella tabella del database.
$statement = $database->prepare('
    INSERT INTO prenotazioni (sala_id, nome_prenotante, data_prenotazione, ora_inizio, ora_fine)
    VALUES (?, ?, ?, ?, ?)
');
// Esegue l'inserimento passando in modo sicuro i dati estratti dall'input.
$statement->execute([$sala_id, $nome_prenotante, $data, $ora_inizio, $ora_fine]);


// Ottiene l'ID univoco (chiave primaria) appena creato dal database per questa prenotazione.
$new_id = $database->lastInsertId();


// Imposta l'intestazione JSON e restituisce una conferma con lo stato "ok" e l'ID della prenotazione.
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'id'     => (int) $new_id, // Converte l'ID in un numero intero
]);
