import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.jsx';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider } from 'react-redux';
import { store } from './store.js';
import i18next from 'i18next';
import './profanityFilter.js';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const initializeApp = async () => {
  const rollbarConfig = {
    accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
    environment: import.meta.env.MODE,
    captureUncaught: true,
    captureUnhandledRejections: true,
  };
  
  await i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
      debug: import.meta.env.MODE === 'development',
      interpolation: {
        escapeValue: false,
      },
    });

  return { rollbarConfig };
};

const runApp = async () => {
  try {
    const { rollbarConfig } = await initializeApp();
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Failed to find the root element');
    }

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <RollbarProvider config={rollbarConfig}>
          <ErrorBoundary>
            <Provider store={store}>
              <AuthProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </AuthProvider>
            </Provider>
          </ErrorBoundary>
        </RollbarProvider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.error(error);
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = 'Error loading application. Please check console.';
    }
  }
};

runApp();
