const { resolve, join } = require('path')
export default function (moduleOptions) {
  // get all options for the module
  const options = {
    ...moduleOptions,
    ...this.options.daim,
  }

  this.nuxt.hook('components:dirs', (dirs) => {
    // Add ./components dir to the list
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'd',
    })
  })

  // expose the namespace / set a default
  if (!options.namespace) options.namespace = 'daim'
  const { namespace } = options

  // add all of the initial plugins
  const pluginsToSync = ['components/index.js']
  for (const pathString of pluginsToSync) {
    this.addPlugin({
      src: resolve(__dirname, pathString),
      fileName: join(namespace, pathString),
      options,
    })
  }
}
module.exports.meta = require('../package.json')
