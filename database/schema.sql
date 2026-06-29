-- ============================================================
--  Esame - Gestionale Prenotazioni Sale Riunioni
--  Script di creazione del database (modalità "DB first")
-- ============================================================

-- 1. Creazione e selezione del Database
-- Crea il database se non esiste già sul server MySQL, evitando errori in caso di esecuzioni ripetute.
CREATE DATABASE IF NOT EXISTS sale_riunioni;
-- Imposta il database appena creato (o già esistente) come area di lavoro attiva per i comandi successivi.
USE sale_riunioni;

-- 2. Pulizia delle tabelle preesistenti (Reset)
-- Rimuove le tabelle esistenti per evitare conflitti durante il riavvio dello script.
-- L'ordine è fondamentale: viene eliminata prima 'prenotazioni' perché dipende da 'sale' tramite chiave esterna.
DROP TABLE IF EXISTS prenotazioni;
DROP TABLE IF EXISTS sale;

-- ------------------------------------------------------------
--  Tabella: sale
-- ------------------------------------------------------------
-- 3. Definizione della struttura per l'anagrafica delle sale
CREATE TABLE sale (
    id        INT AUTO_INCREMENT PRIMARY KEY, -- Identificativo numerico univoco che si autoincrementa a ogni inserimento
    nome      VARCHAR(100) NOT NULL,          // Stringa di testo fino a 100 caratteri per il nome della sala (obbligatoria)
    capienza  INT          NOT NULL,          // Numero intero per indicare quante persone può ospitare la sala (obbligatorio)
    piano     INT          NOT NULL           // Numero intero per indicare l'ubicazione del piano dell'edificio (obbligatorio)
);

-- ------------------------------------------------------------
--  Tabella: prenotazioni
-- ------------------------------------------------------------
-- 4. Definizione della struttura per la gestione dei blocchi orari
CREATE TABLE prenotazioni (
    id               INT AUTO_INCREMENT PRIMARY KEY, -- Identificativo univoco della prenotazione
    sala_id          INT          NOT NULL,          // ID di riferimento alla sala occupata
    nome_prenotante  VARCHAR(100) NOT NULL,          // Nome e cognome di chi effettua la prenotazione
    data_prenotazione DATE         NOT NULL,         // Campo in formato data (AAAA-MM-GG) per il giorno prenotato
    ora_inizio       TIME         NOT NULL,          // Campo in formato orario (HH:MM:SS) per l'inizio dell'evento
    ora_fine         TIME         NOT NULL,          // Campo in formato orario (HH:MM:SS) per il termine dell'evento
    
    -- Vincolo di Integrità Referenziale
    -- Lega la colonna 'sala_id' alla colonna 'id' della tabella 'sale'. Impedisce di inserire prenotazioni 
    -- per sale inesistenti ed evita l'eliminazione accidentale di una sala se ha prenotazioni collegate.
    CONSTRAINT fk_prenotazioni_sala
        FOREIGN KEY (sala_id) REFERENCES sale(id)
);

-- ------------------------------------------------------------
--  Dati di esempio
-- ------------------------------------------------------------
-- 5. Popolamento iniziale della tabella sale
-- Inserisce tre sale di prova con caratteristiche differenti su piani diversi.
INSERT INTO sale (nome, capienza, piano) VALUES
    ('Sala Alpha',  10, 1),
    ('Sala Beta',   20, 2),
    ('Sala Gamma',   8, 3);

-- 6. Popolamento iniziale della tabella prenotazioni
-- Assegna degli slot temporali fittizi legandoli alle sale create sopra tramite i loro ID (1, 2 e 3).
INSERT INTO prenotazioni (sala_id, nome_prenotante, data_prenotazione, ora_inizio, ora_fine) VALUES
    (1, 'Mario Rossi',    '2025-04-10', '09:00', '10:30'),
    (2, 'Lucia Bianchi',  '2025-04-10', '11:00', '12:00'),
    (3, 'Paolo Verdi',    '2025-04-11', '14:00', '15:30');
