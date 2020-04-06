import { createLocalVue, shallowMount } from '@vue/test-utils'
import Logs from '@/views/Logs.vue'
import store from '@/vuex/store.js'
import Vuex from 'vuex'
// import BootstrapVue to avoid error: Unknown custom element: <b-card>
import BootstrapVue from 'bootstrap-vue'

// Create LocalVue instace to pass directive lang and avoid error: Failed to resolve directive 'lang'
const localVue = createLocalVue()
localVue.directive('lang', {
  inserted: function (el) {}
})

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

localVue.use(Vuex)
localVue.use(BootstrapVue)


// mock functions
const initList = jest.fn()
const initPagination = jest.fn()

const wrapper = shallowMount(Logs, {
  store,
  localVue,
  methods: { initList, initPagination }
})

wrapper.setData({
  totalItems: 0,
  itemsPerPage: 20,
  currentPage: 1,
  currentItems: [],
  showPagination: false,
  logsListScoped: [],
})

const setLogsList = store._mutations.setLogsList[0]
const setLanguage = store._mutations.setLanguage[0]

const logsStub = [{
  created_at: "2018-09-21 14:56:52",
  field1: "390",
  field2: "61",
  field3: "lovelove",
  field4: "2018-10-24",
  field5: "day",
  field6: "3000",
  id: 2763,
  project_id: 13,
  text: "Made a booking",
  type: "booking_new",
  updated_at: "2018-09-21 14:56:52",
  user_id: 102,
  user_name: "Francesco Mussi"
}]

describe('Logs Component', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('render the div element', () => {
    expect(wrapper.is('div')).toBe(true)
  })

  it('render the header', () => {
    expect(wrapper.find('.pageTitleRow').exists()).toBe(true)
  })

  it('render the list', () => {
    expect(wrapper.find('ul.list-group').exists()).toBe(true)
  })

  it('setup the component properly', () => {
    expect(initList).toBeCalled()
    expect(initPagination).toBeCalled()
  })

  it('no-logs paragraph is being displayed if there are no elements', () => {
    expect(wrapper.find('.noItems').isVisible()).toBe(true)
  })

  it('no-logs paragraph is not being displayed if there are elements', () => {
    setLogsList(logsStub)
    expect(store.state.logsList.length).toEqual(1)
    expect(wrapper.vm.logsList.length).toEqual(1)
    wrapper.vm.logsListScoped = wrapper.vm.logsList
    wrapper.vm.currentItems = wrapper.vm.logsList
    expect(wrapper.vm.logsListScoped.length).toEqual(1)
    expect(wrapper.find('.noItems').exists()).toBe(false)
  })

  it('render the elements of the list', () => {
    expect(wrapper.vm.currentItems.length).toEqual(1)
    setLanguage('en')
    expect(store.state.language).toEqual('en')
    expect(wrapper.find('.list-group-item').exists()).toBe(true)
    expect(wrapper.find('.badge-success').exists()).toBe(true)
    expect(wrapper.find('.timeContainer').exists()).toBe(true)
    expect(wrapper.find('.text-danger').exists()).toBe(true)

    let userNameSpan = wrapper.find('.crimson')
    expect(userNameSpan.exists()).toBe(true)
    expect(userNameSpan.text()).toBe(wrapper.vm.logsList[0].user_name)
  })

})

