import { createLocalVue, shallowMount } from '@vue/test-utils'
import Stats from '@/views/Stats.vue'
import store from '@/vuex/store.js'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import VueMonthlyPicker from '@/components/VueMonthlyPicker'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.use(VueMonthlyPicker)

localVue.directive('lang', {
  inserted: function (el) {}
})

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

let properties = [{
  address: "asasddsa",
  admin_id: 43,
  capacity_general: 111,
  capacity_with_food: 222,
  contract: Object,
  contract_id: 29,
  created_at: "2018-04-24 07:19:10",
  deleted_at: null,
  description: "assadas asdasdsaddsasad asdasassaasd",
  has_invoice: 0,
  high_season_months: "[2,3,4,5,6,7,8,9,10,11]",
  id: 56,
  images: Array(0),
  invoice_counter: 65,
  is_deleted: "",
  lat: null,
  lng: null,
  low_season_months: "[1,12]",
  managers: Array(0),
  managers_ids: Array(0),
  name: "newnewapp",
  project_id: 13,
  text: "newnewapp",
  thumbs: Array(0),
  updated_at: "2018-09-14 11:10:26",
  value: 56,
}]

const initProperties = jest.fn()
const updateYearStats = jest.fn()
const propertyChanged = jest.fn()

const setLanguage = store._mutations.setLanguage[0]
const setProperties = store._mutations.setProperties[0]
setLanguage('en')

const wrapper = shallowMount(Stats, {
  store,
  localVue,
  methods: { initProperties, updateYearStats, propertyChanged }
})

wrapper.setData({
  currentPropertyId: 0,
})

describe('Stats Component', () => {

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('render the div element', () => {
    expect(wrapper.is('div')).toBe(true)
  })

  it('render the header', () => {
    expect(wrapper.find('.pageTitleRow').exists()).toBe(true)
  })

  it('render the elements', () => {
    expect(wrapper.find('.form-group').exists()).toBe(true)
    expect(wrapper.find('.input-group').exists()).toBe(true)
    expect(wrapper.find('.lead').exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.progress').exists()).toBe(true)
  })

  it('render the b-form-select', () => {
    expect(wrapper.find('#b-form-select').exists()).toBe(true)
  })

  it('render the VueMonthlyPicker', () => {
    expect(wrapper.find(VueMonthlyPicker).exists()).toBe(true)
  })

  it('setup the component properly', () => {
    expect(initProperties).toBeCalled()
    expect(updateYearStats).toBeCalled()
  })

  it('setup the data', () => {
    setProperties(properties)
    expect(store.state.properties.length).toEqual(1)
    expect(wrapper.vm.properties.length).toEqual(1)
  })

  it('test the on input event of the select', () => {
    let bFormSelect = wrapper.find('#b-form-select')
    bFormSelect.trigger('input')
    // wrapper.vm.propertyChanged()
    // expect(wrapper.vm.propertyChanged).toBeCalled()
  })

})