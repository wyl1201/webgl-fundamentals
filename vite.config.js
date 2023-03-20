// vite.config.js
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import commonjs from 'vite-plugin-commonjs'

function getInput(dir) {
  return readdirSync(resolve(__dirname, dir)).reduce((pages, page) => {
    pages[page] = resolve(__dirname, `${dir}/${page}/index.html`)
    return pages
  }, {})
}

export default defineConfig({
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...getInput('webgl'),
      },
    },
  },
  plugins: [commonjs()],
})
