import store from '../vuex/store'
export const updateNotifications = {
  data: function () {
    return {
    }
  },
  computed: {
    notifications () {
      return store.getters.getNotifications
    },
  },
  created: function () {
  },
  methods: {
    updateNotifications(notification) {
      // Add reservation to array of read
      let readNotifications = JSON.parse(this.$localStorage.get('readNotifications', null))
      if (readNotifications === null) {
        readNotifications = []
      }
      readNotifications.push(notification.id)
      this.$localStorage.set('readNotifications', JSON.stringify(readNotifications))

      // Remove item from notification list
      let unreadNotifications = this.notifications.map(item => ({...item}))
      let index = unreadNotifications.indexOf(notification)
      if (index > -1) {
        unreadNotifications.splice(index, 1)
      }
      // Update store and localstorage
      store.dispatch({
        type: 'setAppNotifications',
        notifications: unreadNotifications
      })
      this.$localStorage.set('notifications', JSON.stringify(unreadNotifications))
    }
  }
}
