import store from '../vuex/store'
import moment from 'moment'
export const initReservations = {
  data: function () {
    return {
    }
  },
  methods: {
    // get reservations from API
    // add custom data
    // update store and localStorage
    initReservations(allReservations) {
      let finalReservationArray = []
      for (let i = 0; i < allReservations.length; i++) {
        let reservation = {...allReservations[i]}
        reservation.dateFormatted = moment(reservation.date).format('DD-MM-YYYY')
        reservation.expirationDateFormatted = moment(reservation.expiration_date).format('DD-MM-YYYY')
        let expirationDate = moment(reservation.expiration_date)
        let today = moment().startOf('day')
        let daysLeft = expirationDate.diff(today, 'days')
        if (daysLeft < 0) {
          reservation.daysLeft = 0
          reservation.expired = true
        } else {
          reservation.daysLeft = daysLeft
          reservation.expired = false
        }
        reservation.percentage = 100 - (daysLeft * 25)
        if (reservation.percentage < 0) {
          reservation.percentage = 10
        }
        if (reservation.percentage < 20) {
          reservation.percentage = 5
        }
        finalReservationArray.push(reservation)
      }

      store.dispatch({
        type: 'setAppReservations',
        reservations: finalReservationArray
      })
      this.$localStorage.set('reservations', JSON.stringify(finalReservationArray))

      this.initNotifications(finalReservationArray)
    },
    initNotifications(allReservations) {
      let unreadNotifications = []
      let readNotifications = JSON.parse(this.$localStorage.get('readNotifications', null))
      if (readNotifications === null) {
        readNotifications = []
      }
      for (let i = 0; i < allReservations.length; i++) {
        let reservation = {...allReservations[i]}

        // Check if is read
        let isRead = false
        if (readNotifications.length > 0) {
          for (let j = 0; j < readNotifications.length; j++) {
            if (reservation.id === readNotifications[j]) {
              isRead = true
            }
          }
        }

        // If is not read push in notifications array
        if (!isRead && reservation.daysLeft < 2) {
          unreadNotifications.push(reservation)
        }
      }
      store.dispatch({
        type: 'setAppNotifications',
        notifications: unreadNotifications
      })
      this.$localStorage.set('notifications', JSON.stringify(unreadNotifications))
    },
  }
}
