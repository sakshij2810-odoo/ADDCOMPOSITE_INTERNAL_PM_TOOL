import { Provider } from "react-redux"
import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { appStore } from './redux';
import { AppConfigurationProvider } from "./providers";
import { AppHeader } from "./mui-components/AppHeader/AppHeader";

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={appStore}>
        <AppConfigurationProvider>
          <AppHeader />
          <BrowserRouter>
            <Suspense>
              <App />
            </Suspense>
          </BrowserRouter>
        </AppConfigurationProvider>
      </Provider>
    </HelmetProvider>
  </StrictMode>
);
