import Unocss from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
const path = require('path')
const { defineConfig } = require('vite')
// const vue = require('@vitejs/plugin-vue');
const { createVuePlugin } = require('vite-plugin-vue2')

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
    createVuePlugin(),
    Unocss({
      shortcuts: [
        {
          btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
        },
        // dynamic shortcuts
        [
          /^btn-(.*)$/,
          ([, c], { theme }) => {
            const isColor = theme.colors[c]
            const bg = isColor
              ? `bg-${c}-400 hover:bg-${c}-700 focus:bg-${c}-700 active:bg-${c}-800`
              : ''
            const text = isColor ? `text-${c}-100` : ''
            return `${bg} ${text} inline-block px-6 py-2.5 font-medium text-xs leading-tight uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out`
          },
        ],
      ],
      theme: {
        fontFamily: {
          sans: ['Inter var'],
        },
        colors: {
          primary: 'rgb(52, 106, 227)',
          secondary: 'rgb(108, 117, 125)',
        },
      },
    }),
    Components({
      dts: true, // enabled by default if `typescript` is installed
    }),
  ],
})
