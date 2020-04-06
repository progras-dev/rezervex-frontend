import store from '../vuex/store'
export const updateBookingLists = {
  data: function () {
    return {
    }
  },
  created: function () {
  },
  methods: {
    updateBookings(response) {
      store.dispatch({
        type: 'setAppBookingListWithServices',
        bookingListWithServices: response.body.data.bookingListWithServices
      })
      this.$localStorage.set('bookingListWithServices', JSON.stringify(response.body.data.bookingListWithServices))

      store.dispatch({
        type: 'setAppBookings',
        bookings: response.body.data.bookingList
      })
      this.$localStorage.set('bookingList', JSON.stringify(response.body.data.bookingList))

      store.dispatch({
        type: 'setAppBookingListIndexed',
        bookingListIndexed: response.body.data.bookingListIndexed
      })
      this.$localStorage.set('bookingListIndexed', JSON.stringify(response.body.data.bookingListIndexed))

      store.dispatch({
        type: 'setAppBookingListByDate',
        bookingListByDate: response.body.data.bookingListByDate
      })
      this.$localStorage.set('bookingListByDate', JSON.stringify(response.body.data.bookingListByDate))

      store.dispatch({
        type: 'setAppBookingsForChart',
        bookingsForChart: response.body.data.bookingsForChart
      })
      this.$localStorage.set('bookingsForChart', JSON.stringify(response.body.data.bookingsForChart))
    }
  }
}
