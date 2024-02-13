import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        watch: {
            followSymlinks: false,
		}
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@imagens', replacement: path.resolve(__dirname, './imagens') },
      { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
      { find: '@components', replacement: path.resolve(__dirname, './src/components') },
      { find: '@common', replacement: path.resolve(__dirname, './src/common') },
      { find: '@http', replacement: path.resolve(__dirname, './src/http') },
    ]
  }
})
