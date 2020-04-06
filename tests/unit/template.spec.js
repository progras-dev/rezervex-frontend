import { createLocalVue, shallowMount } from '@vue/test-utils'
import Dashboard from '@/views/Dashboard.vue'
import store from '@/vuex/store.js'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

localVue.directive('lang', {
  inserted: function (el) {}
})

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

const showWelcomeMessage = jest.fn()

const wrapper = shallowMount(Dashboard, {
  store,
  localVue,
  methods: { showWelcomeMessage }
})

wrapper.setData({
  bookingsForComponent: [],
})

const setLanguage = store._mutations.setLanguage[0]
setLanguage('en')

describe('Template Component', () => {

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

})