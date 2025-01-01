import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), basicSsl()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  define: {
    __API_URL__: process.env.VITE_API_URL,
    __APP_SECRET_KEY__:process.env.VITE_APP_SECRET_KEY
  },
});
