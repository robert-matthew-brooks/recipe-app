import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './components/context/UserContext.jsx';
import { PromptContextProvider } from './components/context/PromptContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BrowserRouter>
      <PromptContextProvider>
        <App />
      </PromptContextProvider>
    </BrowserRouter>
  </UserContextProvider>
);
