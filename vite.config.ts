import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unocssConfig from './unocss.config'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  build: {
    lib: {
      formats: ['es', 'cjs', 'umd', 'iife'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ca',
      fileName: (format: string) => `daim-ui.${format}.js`,
    },
    // ssr: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // Add external deps here
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
    Unocss(unocssConfig),
    Components({
      dts: true, // enabled by default if `typescript` is installed
    }),
  ],
})
