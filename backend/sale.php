<?php


// Carica il file esterno 'database.php' per poter utilizzare la funzione connectDatabase().
require_once 'database.php';

// Prepara il browser o l'applicazione client a ricevere i dati nel formato corretto.
header('Access-Control-Allow-Origin: *'); // Abilita il CORS permettendo a qualsiasi dominio esterno di chiamare questa API
header('Content-Type: application/json; charset=utf-8'); // Specifica che la risposta è un oggetto JSON codificato in UTF-8


// Chiama la funzione di connessione e assegna l'oggetto PDO alla variabile $database per eseguire le query.
$database = connectDatabase();


// Invia una richiesta diretta al database per selezionare le colonne principali delle sale disponibili, ordinandole alfabeticamente per nome.
$results  = $database->query('SELECT id, nome, capienza, piano FROM sale ORDER BY nome');


// Recupera tutti i record trovati e li organizza in un array associativo grazie alle impostazioni predefinite di PDO.
$rooms    = $results->fetchAll();


// Converte l'array delle sale in formato stringa JSON e lo stampa a schermo come output finale dell'API.
echo json_encode($rooms);
