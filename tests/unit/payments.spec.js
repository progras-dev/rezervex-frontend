import { createLocalVue, shallowMount } from '@vue/test-utils'
import Payments from '@/views/Payments.vue'
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

const initBookings = jest.fn()
const initPagination = jest.fn()

const wrapper = shallowMount(Payments, {
  store,
  localVue,
  methods: { initBookings, initPagination }
})


const setLanguage = store._mutations.setLanguage[0]
setLanguage('en')

const paymentsStub = [
  {
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
  },
  {
    advance: 10000,
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
    total_cost: 10000,
    total_guests: 50,
    type: "day",
    updated_at: "2018-09-21 12:27:02"
  },
]



// V - test that we don't see the filter button if there are no elements
// V - test that we see "No payments" if there are no payments
// V - test that we see the filter button and don't see "No payments" if there are elements
// we see the badge Pending if is pending (slot...)
// we see the badge Complete if is complete (slot...)
// test the filter button - show only pending (slot...)
// test that the search work
// test redirect on click buttons

describe('Payments Component', () => {

  beforeEach(() => {
    wrapper.vm.currentItems = paymentsStub
  })

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
    expect(wrapper.find('.table-outline').exists()).toBe(true)
    expect(wrapper.find({ref: 'modalCompletePayment'}).exists()).toBe(true)
  })

  it('calls the method when mounted', () => {
    expect(initBookings).toBeCalled()
    expect(initPagination).toBeCalled()
  })

  it('It show no payments if there are no payments', () => {
    expect(wrapper.find('.noItems').exists()).toBe(true)
  })

  it('It does not show the button if there are no payments', () => {
    expect(wrapper.find('.btn').exists()).toBe(false)
  })

  it('if there are payments we see the button and do not see the noItems', () => {
    // console.log(wrapper.vm.currentItems)
    expect(wrapper.find('.btn').exists()).toBe(true)
    expect(wrapper.find('.noItems').exists()).toBe(false)
  })

  it('If click the button it filter the items', () => {
    // console.log(wrapper.vm.listShowType)
    let button = wrapper.find('.btn')
    button.trigger('click')
    // console.log(wrapper.vm.listShowType)
    expect(wrapper.vm.listShowType).toEqual('pending')
  })

  it('display the table', () => {
    let table = wrapper.find('.table-outline')
    expect(table.html().includes('Pending')).toBe(true)
  })

})