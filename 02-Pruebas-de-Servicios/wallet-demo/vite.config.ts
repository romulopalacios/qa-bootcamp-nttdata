import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Necesario para Docker (0.0.0.0)
    port: 5173,  // Puerto fijo
    watch: {
      usePolling: true // Ayuda con hot-reload en algunos sistemas Docker/Windows/Mac
    }
  }
})