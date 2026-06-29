import { useEffect, useState } from 'react';
import { getPrenotazioni, type Prenotazione } from '../api';

function ListaPrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroSala, setFiltroSala] = useState('');

  useEffect(() => {
    getPrenotazioni()
      .then(setPrenotazioni)
      .catch(() => setErrore('Impossibile caricare le prenotazioni. Verifica che il backend sia avviato.'))
      .finally(() => setCaricamento(false));
  }, []);

  const prenotazioniFiltrate = prenotazioni.filter((p) => {
    const matchData = !filtroData || p.data_prenotazione === filtroData;
    const matchSala = !filtroSala || p.sala_nome.toLowerCase().includes(filtroSala.toLowerCase());
    return matchData && matchSala;
  });

  if (caricamento) return <p className="messaggio">Caricamento in corso…</p>;
  if (errore)     return <p className="messaggio errore">{errore}</p>;

  return (
    <div>
      <h2>Prenotazioni</h2>

      <div className="filtri">
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
        />
        <input
          type="text"
          value={filtroSala}
          onChange={(e) => setFiltroSala(e.target.value)}
          placeholder="Filtra per sala..."
        />
        {(filtroData || filtroSala) && (
          <button onClick={() => { setFiltroData(''); setFiltroSala(''); }}>
            ✕ Azzera filtri
          </button>
        )}
      </div>

      {prenotazioniFiltrate.length === 0 ? (
        <p className="messaggio">Nessuna prenotazione trovata.</p>
      ) : (
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
              {prenotazioniFiltrate.map((p) => (
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