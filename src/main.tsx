import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const isAdmin = window.location.pathname.startsWith('/admin');

async function mountApp() {
  const root = createRoot(document.getElementById('root')!);
  if (isAdmin) {
    const { default: AdminApp } = await import('./admin/AdminApp');
    root.render(
      <StrictMode>
        <AdminApp />
      </StrictMode>
    );
  } else {
    const { default: App } = await import('./App');
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}

mountApp();
