import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // 啟用 Vitest 的全域 API
    environment: 'jsdom', // 模擬瀏覽器環境
    setupFiles: './src/test/setup.js', // 測試環境初始化
  },
})
