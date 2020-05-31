import { createLocalVue } from '@vue/test-utils'

import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

localVue.directive('lang', {
  inserted: function (el) {}
})

export default localVue