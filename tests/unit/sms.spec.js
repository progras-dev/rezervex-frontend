import { createLocalVue, shallowMount } from '@vue/test-utils'
import Sms from '@/views/Sms.vue'
import store from '@/vuex/store.js'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'
import vSelect from 'vue-select'
import BootstrapVue from 'bootstrap-vue'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuelidate)
localVue.use(vSelect)
localVue.use(BootstrapVue)

localVue.directive('lang', {
  inserted: function (el) {}
})

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

const messageSend = jest.fn()

const wrapper = shallowMount(Sms, {
  store,
  localVue,
  methods: {
    messageSend
  }
})

const setLanguage = store._mutations.setLanguage[0]
setLanguage('en')

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

  it('render the elements', () => {
    expect(wrapper.find('.jumbotron').exists()).toBe(true)
    expect(wrapper.find(vSelect).exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.form-group').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('.btn').exists()).toBe(true)
  })

  it('setup the computed tableFields', () => {
    expect(wrapper.vm.tableFields).toEqual({
      full_name: {
        label: 'Name',
        class: ['text-center', 'propertiesTable']
      },
      phone: {
        label: 'Phone',
        class: ['text-center', 'propertiesTable']
      },
      has_booking: {
        label: 'Has Booking',
        class: ['text-center', 'propertiesTable']
      },
    })
  })

  it('show the table if showTable is true', () => {
    wrapper.vm.showTable = true
    let table = wrapper.find('.table-responsive-sm')
    expect(table.exists()).toBe(true)

    wrapper.vm.selectedCustomers = [{
      bookings: [],
      created_at: "2018-05-18 09:10:55",
      email: null,
      full_name: "gigi",
      id: 25,
      label: "gigi",
      manager_id: 24,
      phone: "2323",
      project_id: 13,
      reservations: [],
      updated_at: "2018-05-18 09:10:55",
      value: 25
    }]

    // console.log(wrapper.vm.tableFields)
    // console.log(table.html())
    //expect(table.html()).toContain('gigi')
  })

  it('show the form-check div if there are customerListOptions', () => {
    expect(wrapper.vm.customerListOptions).toEqual([
      { text: 'All Customers', value: 'all' },
      { text: 'Without booking', value: 'without' },
      { text: 'With booking', value: 'with' }
    ])

    expect(wrapper.find('.form-check').exists()).toBe(true)
  })

  it('expect the input to contain propert value and to be checked', () => {
    expect(wrapper.find('.form-check-input').exists()).toBe(true)
    let input = wrapper.find('#all')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toEqual('all')

    expect(wrapper.vm.customerListType).toEqual('all')
    expect(input.element.checked).toBe(true)
  })

  it('test validation on message', () => {
    wrapper.vm.$v.$touch()
    //console.log(wrapper.vm.$v.message)
    expect(wrapper.vm.$v.message.$error).toBe(true)

    wrapper.vm.message = 'asdas'
    expect(wrapper.vm.$v.message.$error).toBe(false)
  })

  it('call the messageSend function if button Send is clicked', () => {
    let buttonSend = wrapper.find('button')
    expect(buttonSend.exists()).toBe(true)

    buttonSend.trigger('click')
    expect(messageSend).toBeCalled()
  })


})