import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vant')) {
            return 'vant';
          };
          if (id.includes('element-plus')) {
            return 'element-plus';
          }
        }
      }
    }
  },
  resolve: {
    alias: [
      {
        find: "lowcode-platform",
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  }
})
