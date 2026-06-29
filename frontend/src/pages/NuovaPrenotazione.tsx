import { useEffect, useState } from 'react';

// Importa gli hook necessari da React e i metodi per dialogare con i servizi API remoti.
import { getSale, creaPrenotazione, type Sala } from '../api';



// Questa funzione serve a notificare il completamento per poter aggiornare l'elenco delle prenotazioni.
interface Props {
  onSuccess: () => void;
}

function NuovaPrenotazione({ onSuccess }: Props) {
  // 3. Stati per la gestione del caricamento, dei messaggi e dello stato di invio
  const [sale, setSale] = useState<Sala[]>([]); 
  const [errore, setErrore] = useState('');     
  const [successo, setSuccesso] = useState(''); 
  const [invio, setInvio] = useState(false);    

 
  // Raggruppa tutti i campi del modulo in un unico oggetto per semplificare gli aggiornamenti dello stato.
  const [form, setForm] = useState({
    sala_id: '',
    prenotante: '',
    data: '',
    inizio: '',
    fine: '',
  });

 
  // Recupera l'elenco delle sale dal database non appena il componente viene inserito nel DOM.
  useEffect(() => {
    getSale()
      .then(setSale)
      .catch(() => setErrore('Impossibile caricare le sale. Verifica che il backend sia avviato.'));
  }, []);

 
  // Sfrutta l'attributo 'name' dei tag input/select per aggiornare la proprietà corretta dell'oggetto form.
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

 
  // Intercetta l'evento di submit del form, valida i dati ed esegue la chiamata asincrona verso il backend.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Blocca il ricaricamento nativo della pagina web
    setErrore('');       // Resetta eventuali messaggi di errore precedenti
    setSuccesso('');     // Resetta eventuali messaggi di successo precedenti

    
    // Controlla che nessuna stringa sia vuota prima di inviare i dati al database.
    if (!form.sala_id || !form.prenotante || !form.data || !form.inizio || !form.fine) {
      setErrore('Tutti i campi sono obbligatori.');
      return;
    }

    
    // Sfrutta il confronto nativo tra stringhe orarie (es: "10:00" <= "09:00") per bloccare orari invertiti.
    if (form.fine <= form.inizio) {
      setErrore("L'ora di fine deve essere successiva all'ora di inizio.");
      return;
    }

    setInvio(true); // Attiva lo stato di caricamento sul pulsante
    try {
      
      // Converte l'ID della sala in formato numerico ed effettua il POST dei dati.
      const risultato = await creaPrenotazione({
        sala_id: Number(form.sala_id),
        prenotante: form.prenotante,
        data: form.data,
        inizio: form.inizio,
        fine: form.fine,
      });

     
      // Se il backend risponde con un errore (es. codice 409 sovrapposizione), mostra il messaggio.
      if (risultato.status === 'error') {
        setErrore(risultato.message ?? 'La sala non è disponibile in questo orario.');
      } else {
        // Se l'inserimento va a buon fine, mostra il successo e avvia un timer.
        setSuccesso('Prenotazione creata con successo!');
        // Attende 1.2 secondi per permettere all'utente di leggere il messaggio, poi esegue la callback.
        setTimeout(onSuccess, 1200);
      }
    } catch {
      // Intercetta crash di rete o errori 500 del server.
      setErrore('Errore durante la creazione. Riprova.');
    } finally {
      setInvio(false); // Disattiva lo stato di caricamento e riabilita il pulsante
    }
  }

  // Rendering dell'Interfaccia Utente (UI)
  return (
    <div>
      <h2>Nuova Prenotazione</h2>

      <form className="form" onSubmit={handleSubmit}>
        {/* Menu a tendina per la selezione della sala dinamica */}
        <div className="campo">
          <label htmlFor="sala_id">Sala</label>
          <select id="sala_id" name="sala_id" value={form.sala_id} onChange={handleChange}>
            <option value="">— Seleziona una sala —</option>
            {/* Cicla l'array delle sale salvate nello stato per generare le opzioni selezionabili */}
            {sale.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} (piano {s.piano}, max {s.capienza} persone)
              </option>
            ))}
          </select>
        </div>

        {/* Input di testo per il nome del prenotante */}
        <div className="campo">
          <label htmlFor="prenotante">Nome prenotante</label>
          <input
            id="prenotante"
            name="prenotante"
            type="text"
            placeholder="Es. Mario Rossi"
            value={form.prenotante}
            onChange={handleChange}
          />
        </div>

        {/* Input di tipo data */}
        <div className="campo">
          <label htmlFor="data">Data</label>
          <input
            id="data"
            name="data"
            type="date"
            value={form.data}
            onChange={handleChange}
          />
        </div>

        {/* Riga contenente i due campi orari affiancati */}
        <div className="campo-riga">
          <div className="campo">
            <label htmlFor="inizio">Ora inizio</label>
            <input
              id="inizio"
              name="inizio"
              type="time"
              value={form.inizio}
              onChange={handleChange}
            />
          </div>
          <div className="campo">
            <label htmlFor="fine">Ora fine</label>
            <input
              id="fine"
              name="fine"
              type="time"
              value={form.fine}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Messaggi di feedback visualizzati condizionalmente */}
        {errore   && <p className="messaggio errore">{errore}</p>}
        {successo && <p className="messaggio ok">{successo}</p>}

        {/* Pulsante di conferma: cambia testo e si disabilita durante l'invio asincrono */}
        <button className="btn-submit" type="submit" disabled={invio}>
          {invio ? 'Salvataggio…' : 'Prenota'}
        </button>
      </form>
    </div>
  );
}

export default NuovaPrenotazione;
