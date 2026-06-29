import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// 1. Importazione degli stili e del componente radice
import './App.css'
import App from './App.tsx'

// 2. Rendering e aggancio al DOM reale del browser
createRoot(document.getElementById('root')!).render(
 
  <StrictMode>
    {/* Monta il componente radice dell'app avviando l'intera interfaccia utente */}
    <App />
  </StrictMode>,
)
