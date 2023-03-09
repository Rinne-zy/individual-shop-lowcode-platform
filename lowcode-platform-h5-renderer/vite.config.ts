import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "lowcode-platform-h5-renderer",
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  }
})
