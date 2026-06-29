import { useEffect, useState } from 'react';

// Importa gli hook nativi di React per gestire lo stato (useState) ed eseguire effetti collaterali (useEffect).
// Importa la funzione API per scaricare i dati e l'interfaccia TypeScript 'Prenotazione' per la tipizzazione.
import { getPrenotazioni, type Prenotazione } from '../api';

function ListaPrenotazioni() {

  // Definisce le variabili di stato per tracciare i dati asincroni e gli input dell'utente.
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [caricamento, setCaricamento] = useState(true);                 
  const [errore, setErrore] = useState('');                              
  const [filtroData, setFiltroData] = useState('');                     
  const [filtroSala, setFiltroSala] = useState('');                    

  
  // Questo hook viene eseguito una sola volta al montaggio del componente (grazie all'array di dipendenze vuoto `[]`).
  useEffect(() => {
    getPrenotazioni()
      .then(setPrenotazioni) // Se la promessa ha successo, salva le prenotazioni nello stato dedicatp
      .catch(() => setErrore('Impossibile caricare le prenotazioni. Verifica che il backend sia avviato.')) // In caso di errore di rete, salva la stringa nello stato
      .finally(() => setCaricamento(false)); // In ogni caso (successo o fallimento), disattiva lo stato di caricamento
  }, []);

  
  // Calcola dinamicamente a ogni render l'array ridotto da mostrare all'utente in base ai filtri attivi.
  const prenotazioniFiltrate = prenotazioni.filter((p) => {
    // Se filtroData è vuoto il controllo passa sempre (true), altrimenti verifica l'uguaglianza esatta delle stringhe
    const matchData = !filtroData || p.data_prenotazione === filtroData;
    // Se filtroSala è vuoto passa sempre, altrimenti fa un controllo case-insensitive parziale sul nome della sala
    const matchSala = !filtroSala || p.sala_nome.toLowerCase().includes(filtroSala.toLowerCase());
    // Mantiene la prenotazione solo se soddisfa contemporaneamente entrambi i criteri di ricerca
    return matchData && matchSala;
  });


  // Interrompe temporaneamente il rendering dell'interfaccia principale se i dati non sono pronti o se c'è un blocco di rete.
  if (caricamento) return <p className="messaggio">Caricamento in corso…</p>;
  if (errore)     return <p className="messaggio errore">{errore}</p>;

  
  return (
    <div>
      <h2>Prenotazioni</h2>

     
      <div className="filtri">
        
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)} // Aggiorna lo stato della data al cambio di valore
        />
        {/* Input di testo per la ricerca testuale */}
        <input
          type="text"
          value={filtroSala}
          onChange={(e) => setFiltroSala(e.target.value)} // Aggiorna lo stato del testo della sala alla digitazione
          placeholder="Filtra per sala..."
        />
        {/* Pulsante condizionale: compare solo se almeno uno dei due filtri contiene dei dati compilati */}
        {(filtroData || filtroSala) && (
          <button onClick={() => { setFiltroData(''); setFiltroSala(''); }}>
            ✕ Azzera filtri
          </button>
        )}
      </div>

      {/*  Rendering condizionale della tabella o del messaggio di vuoto */}
      {prenotazioniFiltrate.length === 0 ? (
        // Mostra questo avviso se la ricerca o i filtri non producono nessun record corrispondente
        <p className="messaggio">Nessuna prenotazione trovata.</p>
      ) : (
        // Mostra la tabella se sono presenti elementi nell'array filtrato
        <div className="tabella-wrapper">
          <table className="tabella">
            <thead>
              <tr>
                <th>#</th>
                <th>Sala</th>
                <th>Prenotante</th>
                <th>Data</th>
                <th>Inizio</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {/* Cicla l'array delle prenotazioni filtrate generando una riga HTML (tr) per ciascuna di esse */}
              {prenotazioniFiltrate.map((p) => (
                // L'attributo 'key' è obbligatorio per React per gestire in modo efficiente gli aggiornamenti del DOM
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.sala_nome}</td>
                  <td>{p.nome_prenotante}</td>
                  <td>{p.data_prenotazione}</td>
                  <td>{p.ora_inizio}</td>
                  <td>{p.ora_fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ListaPrenotazioni;
