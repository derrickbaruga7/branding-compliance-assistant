import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  base: '/branding-compliance-assistant/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})


