import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/',

  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-404-for-gh-pages',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist')
        const indexHtml = path.resolve(distDir, 'index.html')
        const notFoundHtml = path.resolve(distDir, '404.html')

        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, notFoundHtml)
        }
      }
    }
  ],

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ],
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']
  }
})