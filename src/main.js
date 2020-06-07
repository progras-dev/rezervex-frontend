// import Vue from 'vue'
import Vue from 'vue';
import App from './App'
import router from './router/index.js'
import BootstrapVue from 'bootstrap-vue'
import VueLocalStorage from 'vue-localstorage'
import moment from 'moment'
import Vuelidate from 'vuelidate'
import MultiLanguage from 'vue-multilanguage'
import VueResource from 'vue-resource'
import 'vue-awesome/icons'
import store from './vuex/store'
import * as VueGoogleMaps from 'vue2-google-maps'
import ToggleButton from 'vue-js-toggle-button'
import Toasted from 'vue-toasted'
import VueTimepicker from 'vue2-timepicker'
import VTooltip from 'v-tooltip'
import WrittenNumber from 'written-number'

import './assets/css/custom.css'
import './assets/css/material2.css'
import 'vue-select/dist/vue-select.css';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css' // Theme
import translation from './_translation'

Vue.use(VueMaterial)
Vue.use(BootstrapVue)
Vue.use(VueLocalStorage)
Vue.use(moment)
Vue.use(Vuelidate)
Vue.use(VueResource)
Vue.use(ToggleButton)
Vue.use(VueTimepicker)
Vue.use(VTooltip)
Vue.use(WrittenNumber)
Vue.use(Toasted, {
  iconPack: 'fontawesome',
  duration: 3700,
  className: 'toastText',
  containerClass: 'toastContainer'
})
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDlYPmmGrL52t7ecUgE_HXrnqwaJcqHGpo',
    libraries: 'places',
  }
})
Vue.use(MultiLanguage, {
  default: 'en',
  en: translation.en,
  tr: translation.tr,
})

Vue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'})
})

Vue.filter('numberFormatNoDecimal', (value) => {

  return Number(value).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}).slice(0, -3)
})

let checkAuth = function () {
  // localStorage.clear()
  let user = JSON.parse(localStorage.getItem('user', null))
  if (user !== null) {
    store.dispatch({
      type: 'setAppUser',
      user: user
    })
  }
}

router.beforeEach((to, from, next) => {
  checkAuth()
  if (to.path !== '/' && to.path !== '/register' && to.path !== '/passwordForgot' && to.name !== 'passwordReset' && (!store.state.user.authenticated || store.state.user.authenticated === undefined)) {
    // console.log('no permission - redirecting to /')
    next('/')
  } else if ((to.path === '/' || to.path === '/register' || to.path === '/passwordForgot' || to.name === 'passwordReset') && (!store.state.user.authenticated || store.state.user.authenticated === undefined)) {
    // console.log('going to public view...')
    next()
  } else if (store.state.user.authenticated) {
    // console.log('permission valid')
    next()
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


