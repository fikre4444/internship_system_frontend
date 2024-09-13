import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {  // Adjust this path to match your API endpoints
        target: 'http://localhost:8080',  // Replace with your Spring Boot backend URL
        changeOrigin: true,
        secure: false
      },
    },
  },
});
