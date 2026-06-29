import { useEffect, useState } from 'react';
import { getSale, creaPrenotazione, type Sala } from '../api';

interface Props {
  onSuccess: () => void;
}

function NuovaPrenotazione({ onSuccess }: Props) {
  const [sale, setSale] = useState<Sala[]>([]);
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState('');
  const [invio, setInvio] = useState(false);

  const [form, setForm] = useState({
    sala_id: '',
    prenotante: '',
    data: '',
    inizio: '',
    fine: '',
  });

  useEffect(() => {
    getSale()
      .then(setSale)
      .catch(() => setErrore('Impossibile caricare le sale. Verifica che il backend sia avviato.'));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrore('');
    setSuccesso('');

    if (!form.sala_id || !form.prenotante || !form.data || !form.inizio || !form.fine) {
      setErrore('Tutti i campi sono obbligatori.');
      return;
    }

    if (form.fine <= form.inizio) {
      setErrore("L'ora di fine deve essere successiva all'ora di inizio.");
      return;
    }

    setInvio(true);
    try {
      const risultato = await creaPrenotazione({
        sala_id: Number(form.sala_id),
        prenotante: form.prenotante,
        data: form.data,
        inizio: form.inizio,
        fine: form.fine,
      });

      if (risultato.status === 'error') {
        setErrore(risultato.message ?? 'La sala non è disponibile in questo orario.');
      } else {
        setSuccesso('Prenotazione creata con successo!');
        setTimeout(onSuccess, 1200);
      }
    } catch {
      setErrore('Errore durante la creazione. Riprova.');
    } finally {
      setInvio(false);
    }
  }

  return (
    <div>
      <h2>Nuova Prenotazione</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="sala_id">Sala</label>
          <select id="sala_id" name="sala_id" value={form.sala_id} onChange={handleChange}>
            <option value="">— Seleziona una sala —</option>
            {sale.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome} (piano {s.piano}, max {s.capienza} persone)
              </option>
            ))}
          </select>
        </div>

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

        {errore   && <p className="messaggio errore">{errore}</p>}
        {successo && <p className="messaggio ok">{successo}</p>}

        <button className="btn-submit" type="submit" disabled={invio}>
          {invio ? 'Salvataggio…' : 'Prenota'}
        </button>
      </form>
    </div>
  );
}

export default NuovaPrenotazione;
