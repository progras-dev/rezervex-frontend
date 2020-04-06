import store from '../vuex/store'
export const updateReservations = {
  data: function () {
    return {
    }
  },
  computed: {
    reservations () {
      return store.getters.getReservations
    },
  },
  created: function () {
  },
  methods: {
    // Update reservation - removing specific item from the list
    // In this way I don't have to recalculate the custom properties such as dateFormatted, daysLeft etc..
    updateReservations(reservation) {
      let allReservations = this.reservations.map(item => ({...item}))
      let indexResToRemove = -1
      for (let i = 0; i < allReservations.length; i++) {
        if (reservation.id === allReservations[i].id) {
          indexResToRemove = i
        }
      }
      allReservations.splice(indexResToRemove, 1)

      this.$localStorage.set('reservations', JSON.stringify(allReservations))
      store.dispatch({
        type: 'setAppReservations',
        reservations: allReservations
      })
    }
  }
}
