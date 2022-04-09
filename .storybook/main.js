const path = require('path')
const Inspect = require('vite-plugin-inspect')
const Unocss = require('unocss/vite')
const { mergeConfig } = require('vite')
const unocssConfig = require('../unocss.config.js')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/vue3',
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, {}) {
    return mergeConfig(config, {
      resolve: {
        alias: { '~': `${path.resolve(__dirname, 'src')}/` },
      },
      plugins: [Unocss.default(unocssConfig), Inspect()],
    })
  },
}
