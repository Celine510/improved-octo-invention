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
      include: ["src/**/*.js", "src/**/*.jsx"], // 需要包含在覆蓋率計算中的檔案
      exclude: ["src/main.js"], // 需要排除在覆蓋率計算之外的檔案
    },
    onConsoleLog(log, type) { // Vitest 提供的 hook，監聽並處理測試期間的控制台輸出
      console.log('log in test: ', log); // 監控所有的控制台輸出
      if (log === 'message from third party library' && type === 'stdout') { // 過濾特定輸出
        return false;
      }
    },
  },
});
