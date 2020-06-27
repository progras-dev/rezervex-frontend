<template>
  <router-view/>
</template>

<script>
import store from './vuex/store'
export default {
  name: 'app',
  data() {
    return {
      // appApiPath: 'http://127.0.0.1:8000',
      appApiPath: 'https://rezervex.denet.men/api/public',
      reservationListScoped: []
    }
  },
  computed: {
    user() {
      return store.getters.getUser
    },
  },
  created() {
    this.initAppLanguage()
    this.initAppPath()
    // window.localStorage.clear()
    this.initStoreOnRefresh()
  },
  methods: {
    initAppPath () {
      // this.$localStorage.set('appApiPath', this.appApiPath)

      store.dispatch({
        type: 'setAppApiPath',
        appApiPath: this.appApiPath
      })
    },
    initAppLanguage () {
      let appLanguage = this.$localStorage.get('appLanguage')
      // console.log('applanguage from main')
      // console.log(appLanguage)

      if (appLanguage !== 'tr' && appLanguage !== 'en') {
        this.$language = 'tr'
      } else {
        this.$language = appLanguage
      }

      this.initLabels()

      store.dispatch({
        type: 'setAppLanguage',
        language: this.$language
      })
      this.$localStorage.set('appLanguage', this.$language)
    },
    initLabels () {
      // console.log('init label for chart')
      let labelsObject = {}
      if (this.$language === 'en') {
        labelsObject.totalBookings = 'Total Bookings'
        store.dispatch({
          type: 'setAppLabels',
          labels: labelsObject
        })
      } else if (this.$language === 'tr') {
        labelsObject.totalBookings = 'Toplam rezervasyonlar'
        store.dispatch({
          type: 'setAppLabels',
          labels: labelsObject
        })
      }
    },
    initStoreOnRefresh () {
      const properties = JSON.parse(this.$localStorage.get('properties', null))
      if (properties) {
        store.dispatch({
          type: 'setAppProperties',
          properties: properties
        })
      }

      const users = JSON.parse(this.$localStorage.get('users', null))
      if (users) {
        store.dispatch({
          type: 'setAppUsers',
          users: users
        })
      }

      const services = JSON.parse(this.$localStorage.get('services', null))
      if (services) {
        store.dispatch({
          type: 'setAppServices',
          services: services
        })
      }

      const bookings = JSON.parse(this.$localStorage.get('bookingList', null))
      if (bookings) {
        store.dispatch({
          type: 'setAppBookings',
          bookings: bookings
        })
      }

      const bookingListIndexed = JSON.parse(this.$localStorage.get('bookingListIndexed', null))
      if (bookingListIndexed) {
        store.dispatch({
          type: 'setAppBookingListIndexed',
          bookingListIndexed: bookingListIndexed
        })
      }

      const bookingListByDate = JSON.parse(this.$localStorage.get('bookingListByDate', null))
      if (bookingListByDate) {
        store.dispatch({
          type: 'setAppBookingListByDate',
          bookingListByDate: bookingListByDate
        })
      }

      const bookingViewData = JSON.parse(this.$localStorage.get('bookingViewData', null))
      if (bookingViewData) {
        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: bookingViewData
        })
      }

      const currentService = JSON.parse(this.$localStorage.get('currentService', null))
      if (currentService) {
        store.dispatch({
          type: 'setAppCurrentService',
          currentService: currentService
        })
      }

      const serviceFormType = this.$localStorage.get('serviceFormType', null)
      if (serviceFormType) {
        store.dispatch({
          type: 'setAppServiceFormType',
          serviceFormType: serviceFormType
        })
      }

      const propertyFormType = this.$localStorage.get('propertyFormType', null)
      if (propertyFormType) {
        store.dispatch({
          type: 'setAppPropertyFormType',
          propertyFormType: propertyFormType
        })
      }

      const currentProperty = JSON.parse(this.$localStorage.get('currentProperty', null))
      if (currentProperty) {
        store.dispatch({
          type: 'setAppCurrentProperty',
          currentProperty: currentProperty
        })
      }

      const bookingsForChart = JSON.parse(this.$localStorage.get('bookingsForChart', null))
      if (bookingsForChart) {
        store.dispatch({
          type: 'setAppBookingsForChart',
          bookingsForChart: bookingsForChart
        })
      }

      const bookingListWithServices = JSON.parse(this.$localStorage.get('bookingListWithServices', null))
      if (bookingListWithServices) {
        store.dispatch({
          type: 'setAppBookingListWithServices',
          bookingListWithServices: bookingListWithServices
        })
      }

      const currentBooking = JSON.parse(this.$localStorage.get('currentBooking', null))
      if (currentBooking) {
        store.dispatch({
          type: 'setAppCurrentBooking',
          currentBooking: currentBooking
        })
      }

      const currentUser = JSON.parse(this.$localStorage.get('currentUser', null))
      if (currentUser) {
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: currentUser
        })
      }

      const propertiesManager = JSON.parse(this.$localStorage.get('propertiesManager', null))
      if (propertiesManager) {
        store.dispatch({
          type: 'setAppPropertiesManager',
          propertiesManager: propertiesManager
        })
      }

      const userFormType = this.$localStorage.get('userFormType', null)
      if (userFormType) {
        store.dispatch({
          type: 'setAppUserFormType',
          userFormType: userFormType
        })
      }

      const pricesList = JSON.parse(this.$localStorage.get('pricesList', null))
      if (pricesList) {
        store.dispatch({
          type: 'setAppPricesList',
          pricesList: pricesList
        })
      }

      const user = JSON.parse(this.$localStorage.get('user', null))
      if (user) {
        store.dispatch({
          type: 'setAppUser',
          user: user
        })
      }

      const clients = JSON.parse(this.$localStorage.get('clients', null))
      if (clients) {
        store.dispatch({
          type: 'setAppClients',
          clients: clients
        })
      }

      const currentClient = JSON.parse(this.$localStorage.get('currentClient', null))
      if (currentClient) {
        store.dispatch({
          type: 'setAppCurrentClient',
          currentClient: currentClient
        })
      }

      const contractFormType = this.$localStorage.get('contractFormType', null)
      if (contractFormType) {
        store.dispatch({
          type: 'setAppContractFormType',
          contractFormType: contractFormType
        })
      }

      const contractFields = JSON.parse(this.$localStorage.get('contractFields', null))
      if (contractFields) {
        store.dispatch({
          type: 'setAppContractFields',
          contractFields: contractFields
        })
      }

      const contracts = JSON.parse(this.$localStorage.get('contracts', null))
      if (contracts) {
        store.dispatch({
          type: 'setAppContracts',
          contracts: contracts
        })
      }

      const currentContract = JSON.parse(this.$localStorage.get('currentContract', null))
      if (currentContract) {
        store.dispatch({
          type: 'setAppCurrentContract',
          currentContract: currentContract
        })
      }

      const usersSuper = JSON.parse(this.$localStorage.get('usersSuper', null))
      if (usersSuper) {
        store.dispatch({
          type: 'setAppUsersSuper',
          usersSuper: usersSuper
        })
      }

      const reservations = JSON.parse(this.$localStorage.get('reservations', null))
      if (reservations) {
        store.dispatch({
          type: 'setAppReservations',
          reservations: reservations
        })
      }

      const notifications = JSON.parse(this.$localStorage.get('notifications', null))
      if (notifications) {
        store.dispatch({
          type: 'setAppNotifications',
          notifications: notifications
        })
      }

      const currentReservation = JSON.parse(this.$localStorage.get('currentReservation', null))
      if (currentReservation) {
        store.dispatch({
          type: 'setAppCurrentReservation',
          currentReservation: currentReservation
        })
      }

      const calendarNotes = JSON.parse(this.$localStorage.get('calendarNotes', null))
      if (calendarNotes) {
        store.commit('setCalendarNotes', calendarNotes)
      }

      const counter = JSON.parse(this.$localStorage.get('counter', null))
      if (counter) {
        store.dispatch({
          type: 'setAppCounter',
          counter: counter
        })
      }

      const packages = JSON.parse(this.$localStorage.get('packages', null))
      if (packages) {
        store.dispatch({
          type: 'setAppPackages',
          packages: packages
        })
      }

      const plans = JSON.parse(this.$localStorage.get('plans', null))
      if (plans) {
        store.dispatch({
          type: 'setAppPlans',
          plans: plans
        })
      }

      const subscriptionData = JSON.parse(this.$localStorage.get('subscriptionData', null))
      if (packages) {
        store.dispatch({
          type: 'setAppSubscriptionData',
          subscriptionData: subscriptionData
        })
      }

      if (this.user.role === 'admin') {
        const logsList = JSON.parse(this.$localStorage.get('logsList', null))
        if (logsList) {
          store.dispatch({
            type: 'setAppLogsList',
            logsList: logsList
          })
        }
      }
    },
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import './scss/style';

  /* Import Font Awesome Icons Set */
  /* $fa-font-path: '~font-awesome/fonts/'; */
  $fa-font-path: '~@fortawesome/fontawesome-free/webfonts/';
  @import '~font-awesome/css/font-awesome.min.css';
  @import '~@fortawesome/fontawesome-free/css/all.min.css';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/css/simple-line-icons.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
</style>
