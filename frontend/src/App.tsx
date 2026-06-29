import { useState } from 'react';
//  Importazione dei componenti e degli stili
import ListaPrenotazioni from './pages/ListaPrenotazioni';
import NuovaPrenotazione from './pages/NuovaPrenotazione';
import './App.css';

// 2. Definizione del Tipo personalizzato per la navigazione
type Pagina = 'lista' | 'nuova';

function App() {
 
  // Traccia quale schermata è attualmente visibile. Di default l'app mostra la lista delle prenotazioni.
  const [pagina, setPagina] = useState<Pagina>('lista');

  //  Rendering della struttura globale dell'applicazione
  return (
    <div className="app">
     
      <header className="header">
        <h1>🏢 Gestionale Sale Riunioni</h1>
        
        
        <nav className="nav">
         
          <button
            // Aggiunge la classe CSS 'attivo' se la pagina corrente è 'lista' per evidenziare il bottone
            className={pagina === 'lista' ? 'nav-btn attivo' : 'nav-btn'}
            onClick={() => setPagina('lista')} // Al click, aggiorna lo stato mostrando la lista
          >
            📋 Prenotazioni
          </button>
          
         
          <button
            // Aggiunge la classe 'attivo' se la pagina corrente è 'nuova'
            className={pagina === 'nuova' ? 'nav-btn attivo' : 'nav-btn'}
            onClick={() => setPagina('nuova')} // Al click, aggiorna lo stato mostrando il form
          >
            ➕ Nuova Prenotazione
          </button>
        </nav>
      </header>

    
     
      <main className="main">

        {pagina === 'lista' && <ListaPrenotazioni />}
        
        {/* Se lo stato è impostato su 'nuova', mostra il componente del form */}
       
        {pagina === 'nuova' && <NuovaPrenotazione onSuccess={() => setPagina('lista')} />}
      </main>
    </div>
  );
}

export default App;
