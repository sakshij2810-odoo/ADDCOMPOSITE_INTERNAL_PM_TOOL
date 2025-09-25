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
      // Proxy all API calls to our local API Gateway
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: { port: PORT, host: true },
});
