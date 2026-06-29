-- ============================================================
--  Esame - Gestionale Prenotazioni Sale Riunioni
--  Script di creazione del database (modalità "DB first")
-- ============================================================

CREATE DATABASE IF NOT EXISTS sale_riunioni;
USE sale_riunioni;

-- Se rilancio lo script, parto pulito.
DROP TABLE IF EXISTS prenotazioni;
DROP TABLE IF EXISTS sale;

-- ------------------------------------------------------------
--  Tabella: sale
-- ------------------------------------------------------------
CREATE TABLE sale (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    nome      VARCHAR(100) NOT NULL,
    capienza  INT          NOT NULL,
    piano     INT          NOT NULL
);

-- ------------------------------------------------------------
--  Tabella: prenotazioni
-- ------------------------------------------------------------
CREATE TABLE prenotazioni (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    sala_id          INT          NOT NULL,
    nome_prenotante  VARCHAR(100) NOT NULL,
    data_prenotazione DATE         NOT NULL,
    ora_inizio       TIME         NOT NULL,
    ora_fine         TIME         NOT NULL,
    CONSTRAINT fk_prenotazioni_sala
        FOREIGN KEY (sala_id) REFERENCES sale(id)
);

-- ------------------------------------------------------------
--  Dati di esempio
-- ------------------------------------------------------------
INSERT INTO sale (nome, capienza, piano) VALUES
    ('Sala Alpha',  10, 1),
    ('Sala Beta',   20, 2),
    ('Sala Gamma',   8, 3);

INSERT INTO prenotazioni (sala_id, nome_prenotante, data_prenotazione, ora_inizio, ora_fine) VALUES
    (1, 'Mario Rossi',    '2025-04-10', '09:00', '10:30'),
    (2, 'Lucia Bianchi',  '2025-04-10', '11:00', '12:00'),
    (3, 'Paolo Verdi',    '2025-04-11', '14:00', '15:30');
