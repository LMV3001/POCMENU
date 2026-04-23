import { defineConfig } from 'vite'

export default defineConfig({
  // Le dossier où Vite va mettre les fichiers compilés
  build: {
    outDir: 'dist',
  },
  // Pour s'assurer que le serveur de dev local est accessible
  server: {
    host: true,
    port: 5173
  }
})
