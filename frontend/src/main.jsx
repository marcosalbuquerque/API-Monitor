// ─── Telemetria: DEVE vir antes de qualquer import de componente ─────────────
import { initTelemetry } from './telemetry';
initTelemetry();

// ─── A partir daqui os spans já são propagados corretamente ─────────────────
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
