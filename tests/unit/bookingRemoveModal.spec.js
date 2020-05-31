import {shallowMount, createLocalVue} from '@vue/test-utils'
import BookingRemoveModal from '@/components/Modals/BookingRemove'
import Vuex from 'vuex'
import BootstrapVue, {BModal} from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BootstrapVue)

localVue.filter('numberFormat', (value) => {
  return Number(value).toLocaleString('tr-TR')
})

localVue.directive('lang', {
  inserted: function (el) {}
})


// TESTS TO DO
// V - it renders a modal
// it renders forms and other stuff
// V - test data
// it translates content
// on cancel CLICK it closes the modal
// on submit CLICK it call the function
// on submit it shows the spinner
// it shows a toast if total refund is > advance
// it calls the api with the proper data
// it emits event modal-booking-remove-success
// tests all v-if (4)
// test form and input field


describe('BookingRemoveModal', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store()
  })

  it('is a vue instance', () => {
    const wrapper = shallowMount(BookingRemoveModal, {
      store,
      localVue,
      propsData: {
        bookingViewData: {},
        user: {}
      }
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('renders a modal', () => {
    const wrapper = shallowMount(BookingRemoveModal, {
      localVue,
      store,
      propsData: {
        bookingViewData: {},
        user: {}
      },
    })
    const modal = wrapper.find(BModal)
    expect(modal.exists()).toBe(true)
  })

  it('if showTotalRefund is false renders span1 but no span2', () => {
    const wrapper = shallowMount(BookingRemoveModal, {
      localVue,
      store,
      propsData: {
        bookingViewData: {},
        user: {}
      },
      data() {
        return {
          totalRefund: 0,
          showTotalRefund: false
        }
      }
    })

    const span1 = wrapper.find({ref: 'span1'})
    const span2 = wrapper.find({ref: 'span2'})
    expect(span1.exists()).toBe(true)
    expect(span2.exists()).toBe(false)
  })

  it('if showTotalRefund is true renders span2 but no span1', () => {
    const wrapper = shallowMount(BookingRemoveModal, {
      localVue,
      store,
      propsData: {
        bookingViewData: {},
        user: {}
      },
      data() {
        return {
          totalRefund: 0,
          showTotalRefund: true
        }
      }
    })

    const span1 = wrapper.find({ref: 'span1'})
    const span2 = wrapper.find({ref: 'span2'})
    expect(span1.exists()).toBe(false)
    expect(span2.exists()).toBe(true)
  })
})