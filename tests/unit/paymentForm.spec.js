import { createLocalVue, shallowMount } from '@vue/test-utils'
import PaymentForm from '@/views/PaymentForm.vue'
import store from '@/vuex/store.js'
import Vuex from 'vuex'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)
localVue.use(Vuelidate)

localVue.directive('lang', {
  inserted: function (el) {}
})

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

const initPayments = jest.fn()
const paymentAdd = jest.fn()

const wrapper = shallowMount(PaymentForm, {
  store,
  localVue,
  methods: { initPayments, paymentAdd }
})


const setLanguage = store._mutations.setLanguage[0]
setLanguage('en')

let bookingData = {
  advance: 0,
  bride_fullname: "xcv",
  bride_phone: null,
  bride_region: null,
  client_email: "francesco.mussi@hotmail.it",
  client_id: 3,
  client_name: "Andrea Pirlo",
  client_phone: "12121212",
  created_at: "2018-09-21 12:27:02",
  date: "2019-02-08",
  dateFormatted: "08-02-2019",
  deleted_at: null,
  groom_fullname: "asdasd",
  groom_phone: null,
  groom_region: null,
  hour: "15",
  id: 385,
  manager_first_name: "Francesco",
  manager_id: 102,
  manager_last_name: "Mussi",
  minute: "00",
  notes: null,
  price: 33,
  project_id: 13,
  property_has_invoice: 1,
  property_id: 77,
  property_name: "Testing app",
  total_cost: 17632,
  total_guests: 50,
  type: "day",
  updated_at: "2018-09-21 12:27:02"
}

// setting the bookingData by calling the mutation in the store
const setCurrentBooking = store._mutations.setCurrentBooking[0]
setCurrentBooking(bookingData)
// console.log(wrapper.vm.bookingData)


// V - see stuff
// V - stub booking data (through the store)
// V - see the booking data
// V - test validation
// V - tet add payment
// - test checkAmount on blur

describe('PaymentForm Component', () => {

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
    expect(wrapper.find('.row').exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(true)
    expect(wrapper.find('.form-group').exists()).toBe(true)
    expect(wrapper.find('.form-control').exists()).toBe(true)
    expect(wrapper.find('.card-text').exists()).toBe(true)
  })

  it('show the booking data', () => {
    expect(wrapper.html().includes('Andrea Pirlo')).toBe(true)
  })

  it('test the validation', () => {
    wrapper.vm.$v.$touch()
    expect(wrapper.vm.$v.currentPayment.$error).toBe(true)

    wrapper.vm.currentPayment = 37
    expect(wrapper.vm.$v.currentPayment.$error).toBe(false)
  })

  it('call the function when button is clicked', () => {
    let button = wrapper.find('.buttonAddPayment')
    expect(button.exists()).toBe(true)
    button.trigger('click')
    expect(paymentAdd).toBeCalled()
  })


})