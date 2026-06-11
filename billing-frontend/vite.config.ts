import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const apiProxyTarget =
    env.VITE_API_BASE_URL_PROXY?.trim() || 'http://localhost:5000';

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      include: ['react-day-picker', 'date-fns'],
    },
    server: {
      port: 5173,
      /** Expose dev server on LAN (e.g. http://<laptop-ip>:5173 from phone). */
      host: true,
      /** ngrok / tunnel hostnames (Vite blocks unknown Host headers by default). */
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.app'],
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
