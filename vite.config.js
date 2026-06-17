import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [],
  },
  resolve: {
    dedupe: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/autocomplete',
      '@codemirror/lang-sql',
      '@codemirror/theme-one-dark',
      'codemirror',
    ],
  },
})
