import { main_app_routes, paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  serverChatUrl: string;
  serverBaseUrl: string;
  calendlyBaseUrl: string;
  calendlyAuthToken: string;
  calendlyEventType: string;
  assetsDir: string;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
  mapboxApiKey: string;
  googleLocationApiKey: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Nova World',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  serverChatUrl: import.meta.env.VITE_SERVER_BASE_URL ?? '',
  serverBaseUrl: `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1`,
  calendlyBaseUrl: import.meta.env.VITE_CALENDLY_SERVER_BASE_URL ?? '',
  calendlyAuthToken: import.meta.env.VITE_CALENDLY_AUTH_TOKEN ?? '',
  calendlyEventType: import.meta.env.VITE_CALENDLY_EVENT_TYPE ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  googleLocationApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_MAP_API_KEY ?? '',
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: main_app_routes.root,
  },
  /**
   * Mapbox
   */
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? ''

};
