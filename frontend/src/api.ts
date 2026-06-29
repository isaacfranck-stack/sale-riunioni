const API_URL = 'http://localhost:8000';

export interface Sala {
  id: number;
  nome: string;
  capienza: number;
  piano: number;
}

export interface Prenotazione {
  id: number;
  sala_id: number;
  sala_nome: string;
  nome_prenotante: string;
  data_prenotazione: string;
  ora_inizio: string;
  ora_fine: string;
}

export async function getSale(): Promise<Sala[]> {
  const res = await fetch(`${API_URL}/sale.php`);
  return res.json();
}

export async function getPrenotazioni(): Promise<Prenotazione[]> {
  const res = await fetch(`${API_URL}/prenotazioni.php`);
  return res.json();
}

export async function creaPrenotazione(data: {
  sala_id: number;
  prenotante: string;
  data: string;
  inizio: string;
  fine: string;
}): Promise<{ status: string; id?: number; message?: string }> {
  const res = await fetch(`${API_URL}/crea.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
