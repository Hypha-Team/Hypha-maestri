import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site under /hypha/; everywhere else it lives at the root.
  base: process.env.BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: { host: true },
  build: { chunkSizeWarningLimit: 1000 },
})
