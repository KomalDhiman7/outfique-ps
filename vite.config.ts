import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // <- this makes it work with Codespaces
    port: 5173,       // <- or pick another port if needed
    strictPort: true
  }
})
