import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, highly cacheable
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          // UI icons
          'ui-libs': ['lucide-react'],
          // Markdown / content rendering
          'markdown': ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-highlight', 'rehype-katex'],
          // Chart
          'chart': ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
})