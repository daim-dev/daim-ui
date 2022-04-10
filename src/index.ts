import components from './components'
import '@unocss/reset/tailwind.css' // preflights from tailwind
import 'uno.css'

const plugin = {
  install(Vue, options) {
    for (const prop in components) {
      // eslint-disable-next-line no-prototype-builtins
      if (components.hasOwnProperty(prop)) {
        const component = components[prop]
        Vue.component(component.name, component)
      }
    }
  },
}

export default plugin
