import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 8004;

export default defineConfig({
  plugins: [
    react(),
    // checker({
    //   typescript: true,
    //   eslint: {
    //     lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
    //     dev: { logLevel: ['error'] },
    //   },
    //   overlay: {
    //     position: 'tl',
    //     initialIsOpen: false,
    //   },
    // }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: PORT,
    host: true,
    proxy: {
      // Proxy API calls to backend services
      '/api/v1/authentication': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/user': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/projects': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/tasks': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/daily-tasks': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
      },
      // Proxy to Nova World Group API for existing endpoints
      '/api/v1/analytics': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/general': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/approval': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/lead': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/comment': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/companyInformation': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        secure: false,
      },
      '/api/v1/conversation': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/customer': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/dataManagement': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/formula': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/history': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/questionnaire': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/security': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/services': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/template': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
      '/api/v1/workflow': {
        target: 'https://api.novaworldgroup.ca',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: { port: PORT, host: true },
});
