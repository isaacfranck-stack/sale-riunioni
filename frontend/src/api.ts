
// Imposta l'indirizzo di radice del server backend a cui l'applicazione invierà le richieste HTTP.
const API_URL = 'http://localhost:8000';



// Interfaccia per la struttura di una singola sala riunioni
export interface Sala {
  id: number;      
  nome: string;     
  capienza: number; 
  piano: number;    
}

// Interfaccia per la struttura di una prenotazione completata
export interface Prenotazione {
  id: number;               
  sala_id: number;          
  sala_nome: string;         
  nome_prenotante: string;  
  data_prenotazione: string; 
  ora_inizio: string;        
  ora_fine: string;        
}



/**
 * Recupera l'elenco completo di tutte le sale disponibili.
 * Ritorna una Promise che si risolve in un array di oggetti di tipo 'Sala'.
 */
export async function getSale(): Promise<Sala[]> {
  // Effettua una richiesta HTTP GET predefinita verso l'endpoint dello script sale.php
  const res = await fetch(`${API_URL}/sale.php`);
  // Estrae il body della risposta convertendolo da stringa JSON a oggetto JavaScript tipizzato
  return res.json();
}

/**
 * Recupera l'elenco completo delle prenotazioni esistenti.
 * Ritorna una Promise che si risolve in un array di oggetti di tipo 'Prenotazione'.
 */
export async function getPrenotazioni(): Promise<Prenotazione[]> {
  // Effettua una richiesta HTTP GET verso lo script prenotazioni.php per scaricare lo storico
  const res = await fetch(`${API_URL}/prenotazioni.php`);
  // Analizza e restituisce i dati convertiti in formato JSON
  return res.json();
}

/**
 * Invia i dati strutturati al backend per registrare una nuova prenotazione nel database.
 * @param data Oggetto contenente tutte le informazioni inserite dall'utente nel form.
 * @returns Ritorna una Promise con lo stato dell'operazione, l'ID generato o un eventuale messaggio di errore.
 */
export async function creaPrenotazione(data: {
  sala_id: number;
  prenotante: string;
  data: string;
  inizio: string;
  fine: string;
}): Promise<{ status: string; id?: number; message?: string }> {
  // Configura ed esegue una richiesta HTTP di tipo POST verso crea.php
  const res = await fetch(`${API_URL}/crea.php`, {
    method: 'POST', // Specifica il metodo di invio dei dati
    headers: { 'Content-Type': 'application/json' }, // Comunica al server PHP che il body contiene testo in formato JSON
    body: JSON.stringify(data), // Converte l'oggetto JavaScript in una stringa JSON valida
  });
  // Restituisce la risposta del server (es: {"status": "ok", "id": 12} oppure {"status": "error", "message": "..."})
  return res.json();
}
