import { join } from 'path'
import {
  defineNuxtModule,
  addPluginTemplate,
  extendViteConfig,
} from '@nuxt/kit'
import VitePlugin from '@unocss/vite'

export default defineNuxtModule({
  meta: {
    name: 'daim-ui',
    configKey: 'daim',
  },
  hooks: {
    'components:dirs'(dirs) {
      // Add ./components dir to the list
      dirs.push({
        path: join(__dirname, 'components'),
        prefix: 'daim',
      })
    },
  },
  setup(moduleOptions, nuxt) {
    addPluginTemplate({
      filename: 'unocss.mjs',
      getContents: () => {
        const lines = ["import 'uno.css'", 'export default () => {};']
        lines.unshift("import '@unocss/reset/tailwind.css'")
        return lines.join('\n')
      },
    })
    extendViteConfig((config) => {
      config.plugins = config.plugins || []
      config.plugins.unshift(...VitePlugin(moduleOptions))
    })
  },
})
