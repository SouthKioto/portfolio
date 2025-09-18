import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MainPage } from './pages/MainPage';
import { BrowserRouter, Routes, Route } from 'react-router';
import './main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
