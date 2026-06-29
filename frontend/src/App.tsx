import { useState } from 'react';
import ListaPrenotazioni from './pages/ListaPrenotazioni';
import NuovaPrenotazione from './pages/NuovaPrenotazione';
import './App.css';

type Pagina = 'lista' | 'nuova';

function App() {
  const [pagina, setPagina] = useState<Pagina>('lista');

  return (
    <div className="app">
      <header className="header">
        <h1>🏢 Gestionale Sale Riunioni</h1>
        <nav className="nav">
          <button
            className={pagina === 'lista' ? 'nav-btn attivo' : 'nav-btn'}
            onClick={() => setPagina('lista')}
          >
            📋 Prenotazioni
          </button>
          <button
            className={pagina === 'nuova' ? 'nav-btn attivo' : 'nav-btn'}
            onClick={() => setPagina('nuova')}
          >
            ➕ Nuova Prenotazione
          </button>
        </nav>
      </header>

      <main className="main">
        {pagina === 'lista' && <ListaPrenotazioni />}
        {pagina === 'nuova' && <NuovaPrenotazione onSuccess={() => setPagina('lista')} />}
      </main>
    </div>
  );
}

export default App;
