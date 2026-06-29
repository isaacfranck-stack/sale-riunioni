<?php

require_once 'database.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$database = connectDatabase();
$results  = $database->query('SELECT id, nome, capienza, piano FROM sale ORDER BY nome');
$rooms    = $results->fetchAll();

echo json_encode($rooms);
