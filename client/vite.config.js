import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_API_URL': JSON.stringify(process.env.VITE_APP_API_URL)
  },
  scripts: {
    "build": "echo 'Start build' && vite build && echo 'Build complete'"
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://online-store-project-production.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
