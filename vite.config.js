import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // 啟用 Vitest 的全域 API (不用再 import it 等)
    environment: 'jsdom', // 模擬瀏覽器環境
    setupFiles: './src/test/setup.js', // 測試環境初始化
    coverage: {
      provider: 'v8', // 預設使用，可不加 V8 作為覆蓋率提供者
      reporter: ['text', 'html'], // 指定覆蓋率報告輸出格式
      exclude: ['src/main.js', '**/node_modules/**'],
      coverage: {
        include: ['src/**/*.js'],
        exclude: ['src/main.js'],
      },
    },
    onConsoleLog(log, type) {
      console.log('log in test: ', log);
      if (log === 'message from third party library' && type === 'stdout') {
        return false;
      }
    },
  },
});
