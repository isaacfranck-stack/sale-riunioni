<?php


// Definisce una funzione globale riutilizzabile per stabilire la connessione con il database.
function connectDatabase()
{
   
    // Imposta le variabili di rete e di accesso necessarie per comunicare con il server MySQL.
    $host     = 'localhost';       
    $database = 'sale_riunioni';  
    $username = 'root';            
    $password = '';                
    
   
    // Specifica il driver (mysql), l'host, il nome del database e la codifica caratteri corretta per supportare anche emoji e accenti.
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $database);
    

    // Crea e restituisce una nuova istanza della classe PDO per gestire la connessione.
    return new PDO($dsn, $username, $password, [
        // Forza PDO a lanciare Eccezioni (errori bloccanti) in caso di query fallite, facilitando il debug.
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        
        // Imposta la modalità di recupero predefinita: i risultati delle query saranno array associativi (es: $riga['nome']).
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}
