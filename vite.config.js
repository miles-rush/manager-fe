import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: 'localhost',
    port: 3000,
    proxy: {
      "/api": {
        target: 'http://localhost:7980/api'
      }
    }
  },
  plugins: [
    vue(),
    viteCompression()
  ],
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15']
  }
})
