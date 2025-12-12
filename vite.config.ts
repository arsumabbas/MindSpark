import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Environment variables from Netlify/Vercel are injected into process.env during the build.
    // We map this to the code's expected process.env.API_KEY.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});