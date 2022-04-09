/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Vue2 as Vue, install } from 'vue-demi'
import '@unocss/reset/tailwind.css' // preflights from tailwind
import 'uno.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import 'v-mapbox/dist/v-mapbox.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { MglMap, MglMarker, MglPopup, MglScaleControl } from 'v-mapbox'
import Mapbox from 'mapbox-gl'
import VueTippy, { TippyComponent } from 'vue-tippy'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import vuedraggable from 'vuedraggable'
import App from './App.vue'
import GlobalMixin from './mixins/global.js'
import installEditor from './config'

install()

installEditor(Vue, {})

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueTippy)

Vue.component('MglMap', MglMap)
Vue.component('MglMarker', MglMarker)
Vue.component('MglPopup', MglPopup)
Vue.component('MglScaleControl', MglScaleControl)
Vue.component('Tippy', TippyComponent)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)
Vue.component('Draggable', vuedraggable)

Vue.prototype.$mapbox = Mapbox

Vue.mixin(GlobalMixin)

// @ts-ignore
library.add(fas)
// @ts-ignore
library.add(fal)
// @ts-ignore
library.add(far)

new Vue({
  render: (h) => h(App),
}).$mount('#app')
