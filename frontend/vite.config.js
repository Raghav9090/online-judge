import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 required for Docker to expose it
    port: 3000       // 👈 match this with your Docker override
  }
});
