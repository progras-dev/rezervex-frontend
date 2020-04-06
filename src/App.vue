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
      let properties = JSON.parse(this.$localStorage.get('properties', null))
      // console.log('properties')
      // console.log(properties)
      if (properties !== null) {
        store.dispatch({
          type: 'setAppProperties',
          properties: properties
        })
      }

      let users = JSON.parse(this.$localStorage.get('users', null))
      // console.log('users')
      // console.log(users)
      if (users !== null) {
        store.dispatch({
          type: 'setAppUsers',
          users: users
        })
      }

      let services = JSON.parse(this.$localStorage.get('services', null))
      // console.log('services')
      // console.log(services)
      if (services !== null) {
        store.dispatch({
          type: 'setAppServices',
          services: services
        })
      }

      let bookings = JSON.parse(this.$localStorage.get('bookingList', null))
      // console.log('bookings')
      // console.log(bookings)
      if (bookings !== null) {
        store.dispatch({
          type: 'setAppBookings',
          bookings: bookings
        })
      }

      let bookingListIndexed = JSON.parse(this.$localStorage.get('bookingListIndexed', null))
      // console.log('bookingListIndexed')
      // console.log(bookingListIndexed)
      if (bookingListIndexed !== null) {
        store.dispatch({
          type: 'setAppBookingListIndexed',
          bookingListIndexed: bookingListIndexed
        })
      }

      let bookingListByDate = JSON.parse(this.$localStorage.get('bookingListByDate', null))
      // console.log('bookingListByDate')
      // console.log(bookingListByDate)
      if (bookingListByDate !== null) {
        store.dispatch({
          type: 'setAppBookingListByDate',
          bookingListByDate: bookingListByDate
        })
      }

      let bookingViewData = JSON.parse(this.$localStorage.get('bookingViewData', null))
      // console.log('bookingViewData')
      // console.log(bookingViewData)
      if (bookingViewData !== null) {
        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: bookingViewData
        })
      }

      let currentService = JSON.parse(this.$localStorage.get('currentService', null))
      // console.log('currentService')
      // console.log(currentService)
      if (currentService !== null) {
        store.dispatch({
          type: 'setAppCurrentService',
          currentService: currentService
        })
      }

      let serviceFormType = this.$localStorage.get('serviceFormType', null)
      // console.log('serviceFormType')
      // console.log(serviceFormType)
      if (serviceFormType !== null) {
        store.dispatch({
          type: 'setAppServiceFormType',
          serviceFormType: serviceFormType
        })
      }

      let propertyFormType = this.$localStorage.get('propertyFormType', null)
      // console.log('propertyFormType')
      // console.log(propertyFormType)
      if (propertyFormType !== null) {
        store.dispatch({
          type: 'setAppPropertyFormType',
          propertyFormType: propertyFormType
        })
      }

      let currentProperty = JSON.parse(this.$localStorage.get('currentProperty', null))
      // console.log('currentProperty')
      // console.log(currentProperty)
      if (currentProperty !== null) {
        store.dispatch({
          type: 'setAppCurrentProperty',
          currentProperty: currentProperty
        })
      }

      let bookingsForChart = JSON.parse(this.$localStorage.get('bookingsForChart', null))
      // console.log('bookingsForChart')
      // console.log(bookingsForChart)
      if (bookingsForChart !== null) {
        store.dispatch({
          type: 'setAppBookingsForChart',
          bookingsForChart: bookingsForChart
        })
      }

      let bookingListWithServices = JSON.parse(this.$localStorage.get('bookingListWithServices', null))
      // console.log('bookingListWithServices')
      // console.log(bookingListWithServices)
      if (bookingListWithServices !== null) {
        store.dispatch({
          type: 'setAppBookingListWithServices',
          bookingListWithServices: bookingListWithServices
        })
      }

      let currentBooking = JSON.parse(this.$localStorage.get('currentBooking', null))
      // console.log('currentBooking')
      // console.log(currentBooking)
      if (currentBooking !== null) {
        store.dispatch({
          type: 'setAppCurrentBooking',
          currentBooking: currentBooking
        })
      }

      let currentUser = JSON.parse(this.$localStorage.get('currentUser', null))
      // console.log('currentUser')
      // console.log(currentUser)
      if (currentUser !== null) {
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: currentUser
        })
      }

      let propertiesManager = JSON.parse(this.$localStorage.get('propertiesManager', null))
      // console.log('propertiesManager')
      // console.log(propertiesManager)
      if (propertiesManager !== null) {
        store.dispatch({
          type: 'setAppPropertiesManager',
          propertiesManager: propertiesManager
        })
      }

      let userFormType = this.$localStorage.get('userFormType', null)
      // console.log('userFormType')
      // console.log(userFormType)
      if (userFormType !== null) {
        store.dispatch({
          type: 'setAppUserFormType',
          userFormType: userFormType
        })
      }

      let pricesList = JSON.parse(this.$localStorage.get('pricesList', null))
      // console.log('pricesList')
      // console.log(pricesList)
      if (pricesList !== null) {
        store.dispatch({
          type: 'setAppPricesList',
          pricesList: pricesList
        })
      }

      let user = JSON.parse(this.$localStorage.get('user', null))
      // console.log('user')
      // console.log(user)
      if (user !== null) {
        store.dispatch({
          type: 'setAppUser',
          user: user
        })
      }

      let clients = JSON.parse(this.$localStorage.get('clients', null))
      // console.log('clients')
      // console.log(clients)
      if (clients !== null) {
        store.dispatch({
          type: 'setAppClients',
          clients: clients
        })
      }

      let currentClient = JSON.parse(this.$localStorage.get('currentClient', null))
      // console.log('currentClient')
      // console.log(currentClient)
      if (currentClient !== null) {
        store.dispatch({
          type: 'setAppCurrentClient',
          currentClient: currentClient
        })
      }

      let contractFormType = this.$localStorage.get('contractFormType', null)
      // console.log('contractFormType')
      // console.log(contractFormType)
      if (contractFormType !== null) {
        store.dispatch({
          type: 'setAppContractFormType',
          contractFormType: contractFormType
        })
      }

      let contractFields = JSON.parse(this.$localStorage.get('contractFields', null))
      // console.log('contractFields')
      // console.log(contractFields)
      if (contractFields !== null) {
        store.dispatch({
          type: 'setAppContractFields',
          contractFields: contractFields
        })
      }

      let contracts = JSON.parse(this.$localStorage.get('contracts', null))
      // console.log('contracts')
      // console.log(contracts)
      if (contracts !== null) {
        store.dispatch({
          type: 'setAppContracts',
          contracts: contracts
        })
      }

      let currentContract = JSON.parse(this.$localStorage.get('currentContract', null))
      // console.log('currentContract')
      // console.log(currentContract)
      if (currentContract !== null) {
        store.dispatch({
          type: 'setAppCurrentContract',
          currentContract: currentContract
        })
      }

      let usersSuper = JSON.parse(this.$localStorage.get('usersSuper', null))
      // console.log('usersSuper from main.js')
      // console.log(usersSuper)
      if (usersSuper !== null) {
        store.dispatch({
          type: 'setAppUsersSuper',
          usersSuper: usersSuper
        })
      }

      let reservations = JSON.parse(this.$localStorage.get('reservations', null))
      // console.log('reservations')
      // console.log(reservations)
      if (reservations !== null) {
        store.dispatch({
          type: 'setAppReservations',
          reservations: reservations
        })
      }

      let notifications = JSON.parse(this.$localStorage.get('notifications', null))
      // console.log('notifications')
      // console.log(notifications)
      if (notifications !== null) {
        store.dispatch({
          type: 'setAppNotifications',
          notifications: notifications
        })
      }

      let currentReservation = JSON.parse(this.$localStorage.get('currentReservation', null))
      // console.log('currentReservation')
      // console.log(currentReservation)
      if (currentReservation !== null) {
        store.dispatch({
          type: 'setAppCurrentReservation',
          currentReservation: currentReservation
        })
      }

      let counter = JSON.parse(this.$localStorage.get('counter', null))
      if (counter) {
        store.dispatch({
          type: 'setAppCounter',
          counter: counter
        })
      }

      let packages = JSON.parse(this.$localStorage.get('packages', null))
      if (packages) {
        store.dispatch({
          type: 'setAppPackages',
          packages: packages
        })
      }

      let plans = JSON.parse(this.$localStorage.get('plans', null))
      if (plans) {
        store.dispatch({
          type: 'setAppPlans',
          plans: plans
        })
      }

      let subscriptionData = JSON.parse(this.$localStorage.get('subscriptionData', null))
      if (packages) {
        store.dispatch({
          type: 'setAppSubscriptionData',
          subscriptionData: subscriptionData
        })
      }

      if (this.user.role === 'admin') {
        let logsList = JSON.parse(this.$localStorage.get('logsList', null))
        // console.log('logsList')
        // console.log(logsList)
        if (logsList !== null) {
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
