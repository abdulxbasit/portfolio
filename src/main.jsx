import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { BookProvider } from './context/BookContext';
import App from './App';
import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BookProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BookProvider>
  </React.StrictMode>
);