import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('[Frontend] Iniciando montaje de la aplicación React...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('[Frontend] Error Crítico: No se encontró el elemento #root en el DOM.');
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('[Frontend] Render inicial completado.');
} catch (error) {
  console.error('[Frontend] Error durante el renderizado:', error);
}