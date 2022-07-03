import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias:{
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: 'localhost',
    port: 3001,
    proxy:{
      "/api":{
        target: 'http://localhost:3000'
      }
    }
  },
  plugins: [vue()]
})
