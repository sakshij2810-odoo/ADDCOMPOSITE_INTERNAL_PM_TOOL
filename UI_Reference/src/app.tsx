import 'src/global.css';

// ----------------------------------------------------------------------

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider } from 'src/auth/context/jwt';
// import { AuthProvider as Auth0AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider as AmplifyAuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';
// import { AuthProvider as FirebaseAuthProvider } from 'src/auth/context/firebase';

import { DataTableV2Provider } from './mui-components/TableV2/context/DataTableV2Provider';
import { MuiLoadingDialog } from './rm-components/MuiLoadingDialog/MuiLoadingDialog';
import { RMSnackbarDialog } from './rm-components/RMSnackbarDialog/RMSnackbarDialog';
import { SocketProvider } from './providers/socket-provider';

// ----------------------------------------------------------------------

// const AuthProvider =
//   (CONFIG.auth.method === 'amplify' && AmplifyAuthProvider) ||
//   (CONFIG.auth.method === 'firebase' && FirebaseAuthProvider) ||
//   (CONFIG.auth.method === 'supabase' && SupabaseAuthProvider) ||
//   (CONFIG.auth.method === 'auth0' && Auth0AuthProvider) ||
//   JwtAuthProvider;

export default function App() {
  useScrollToTop();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <SettingsProvider settings={defaultSettings}>
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <DataTableV2Provider tableConfig={{ stickyHeader: true }}>
                  <MotionLazy>
                    <CheckoutProvider>
                      <Snackbar />
                      <ProgressBar />
                      <SettingsDrawer />
                      <Router />
                    </CheckoutProvider>
                  </MotionLazy>
                </DataTableV2Provider>
              </SocketProvider>
            </AuthProvider>
            <RMSnackbarDialog />
            <MuiLoadingDialog />
          </ThemeProvider>
        </SettingsProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
