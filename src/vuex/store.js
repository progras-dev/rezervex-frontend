import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    role: '',
    language: '',
    properties: [],
    users: [],
    services: [],
    appApiPath: '',
    bookings: [],
    bookingListIndexed: [],
    bookingListByDate: [],
    bookingViewData: {},
    currentService: {},
    serviceFormType: '',
    currentProperty: {},
    propertyFormType: '',
    bookingsForChart: [],
    bookingListWithServices: [],
    currentBooking: {},
    labels: {},
    currentUser: {},
    propertiesManager: [],
    userFormType: '',
    pricesList: {},
    logsList: [],
    user: {},
    clients: [],
    currentClient: {},
    contractFormType: '',
    contractFields: [],
    contracts: [],
    currentContract: {},
    usersSuper: [],
    reservations: [],
    notifications: [],
    currentReservation: {},
    showWelcome: false,
    plans: [],
    packages: [],
    currentPlan: {},
    planFormType: '',
    counter: {},
    subscriptionData: null,
  },

  getters: {
    getSmsPackages: () => {
      return store.state.packages.filter(item => item.type === 'sms')
    },
    getEmailPackages: () => {
      return store.state.packages.filter(item => item.type === 'email')
    },
    getRole: (state) => {
      return state.role
    },
    getLanguage: (state) => {
      return state.language
    },
    getProperties: (state) => {
      return state.properties
    },
    getProperty: (state) => (id) => {
      return state.properties.find(property => property.id === id)
    },
    getUsers: (state) => {
      return state.users
    },
    getServices: (state) => {
      return state.services
    },
    getApiPath: (state) => {
      return state.appApiPath
    },
    getBookings: (state) => {
      return state.bookings
    },
    getBookingListIndexed: (state) => {
      return state.bookingListIndexed
    },
    getBookingListByDate: (state) => {
      return state.bookingListByDate
    },
    getBookingViewData: (state) => {
      return state.bookingViewData
    },
    getCurrentService: (state) => {
      return state.currentService
    },
    getServiceFormType: (state) => {
      return state.serviceFormType
    },
    getCurrentProperty: (state) => {
      return state.currentProperty
    },
    getPropertyFormType: (state) => {
      return state.propertyFormType
    },
    getBookingsForChart: (state) => {
      return state.bookingsForChart
    },
    getBookingListWithServices: (state) => {
      return state.bookingListWithServices
    },
    getCurrentBooking: (state) => {
      return state.currentBooking
    },
    getLabels: (state) => {
      return state.labels
    },
    getCurrentUser: (state) => {
      return state.currentUser
    },
    getPropertiesManager: (state) => {
      return state.propertiesManager
    },
    getUserFormType: (state) => {
      return state.userFormType
    },
    getPricesList: (state) => {
      return state.pricesList
    },
    getLogsList: (state) => {
      return state.logsList
    },
    getUser: (state) => {
      return state.user
    },
    getClients: (state) => {
      // Order clients by full_name
      let array = []
      array = state.clients.map(item => ({...item}))
      array.sort(function (a, b) {
        var nameA = a.full_name.toLowerCase()
        var nameB = b.full_name.toLowerCase()
        if (nameA < nameB) { // sort string ascending
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0 // default return value (no sorting)
      })
      return array
    },
    getCurrentClient: (state) => {
      return state.currentClient
    },
    getContractFormType: (state) => {
      return state.contractFormType
    },
    getContractFields: (state) => {
      return state.contractFields
    },
    getContracts: (state) => {
      return state.contracts
    },
    getCurrentContract: (state) => {
      return state.currentContract
    },
    getUsersSuper: (state) => {
      return state.usersSuper
    },
    getReservations: (state) => {
      return state.reservations
    },
    getNotifications: (state) => {
      return state.notifications
    },
    getCurrentReservation: (state) => {
      return state.currentReservation
    },
    getShowWelcome: (state) => {
      return state.showWelcome
    },
  },

  mutations: {
    setRole: (state, role) => {
      state.role = role
    },
    setLanguage: (state, language) => {
      state.language = language
    },
    setProperties: (state, properties) => {
      state.properties = properties
    },
    setUsers: (state, users) => {
      state.users = users
    },
    setServices: (state, services) => {
      state.services = services
    },
    setApiPath: (state, appApiPath) => {
      state.appApiPath = appApiPath
    },
    setBookings: (state, bookings) => {
      state.bookings = bookings
    },
    setBookingListIndexed: (state, bookingListIndexed) => {
      state.bookingListIndexed = bookingListIndexed
    },
    setBookingListByDate: (state, bookingListByDate) => {
      state.bookingListByDate = bookingListByDate
    },
    setBookingViewData: (state, bookingViewData) => {
      state.bookingViewData = bookingViewData
    },
    setCurrentService: (state, currentService) => {
      state.currentService = currentService
    },
    setServiceFormType: (state, serviceFormType) => {
      state.serviceFormType = serviceFormType
    },
    setCurrentProperty: (state, currentProperty) => {
      state.currentProperty = currentProperty
    },
    setPropertyFormType: (state, propertyFormType) => {
      state.propertyFormType = propertyFormType
    },
    setBookingsForChart: (state, bookingsForChart) => {
      state.bookingsForChart = bookingsForChart
    },
    setBookingListWithServices: (state, bookingListWithServices) => {
      state.bookingListWithServices = bookingListWithServices
    },
    setCurrentBooking: (state, currentBooking) => {
      state.currentBooking = currentBooking
    },
    setLabels: (state, labels) => {
      state.labels = labels
    },
    setCurrentUser: (state, currentUser) => {
      state.currentUser = currentUser
    },
    setPropertiesManager: (state, propertiesManager) => {
      state.propertiesManager = propertiesManager
    },
    setUserFormType: (state, userFormType) => {
      state.userFormType = userFormType
    },
    setPricesList: (state, pricesList) => {
      state.pricesList = pricesList
    },
    setLogsList: (state, logsList) => {
      state.logsList = logsList
    },
    setUser: (state, user) => {
      state.user = user
    },
    setClients: (state, clients) => {
      state.clients = clients
    },
    setCurrentClient: (state, currentClient) => {
      state.currentClient = currentClient
    },
    setContractFormType: (state, contractFormType) => {
      state.contractFormType = contractFormType
    },
    setContractFields: (state, contractFields) => {
      state.contractFields = contractFields
    },
    setContracts: (state, contracts) => {
      state.contracts = contracts
    },
    setCurrentContract: (state, currentContract) => {
      state.currentContract = currentContract
    },
    setUsersSuper: (state, usersSuper) => {
      state.usersSuper = usersSuper
    },
    setReservations: (state, reservations) => {
      state.reservations = reservations
    },
    setNotifications: (state, notifications) => {
      state.notifications = notifications
    },
    setCurrentReservation: (state, currentReservation) => {
      state.currentReservation = currentReservation
    },
    setShowWelcome: (state, showWelcome) => {
      state.showWelcome = showWelcome
    },
    setPlans: (state, plans) => {
      state.plans = plans
    },
    setPackages: (state, packages) => {
      state.packages = packages
    },
    setCurrentPlan: (state, currentPlan) => {
      state.currentPlan = currentPlan
    },
    setPlanFormType: (state, planFormType) => {
      state.planFormType = planFormType
    },
    setPlanCounter: (state, counter) => {
      state.counter = counter
    },
    setSubscriptionData: (state, subscriptionData) => {
      state.subscriptionData = subscriptionData
    },
  },

  actions: {
    setAppRole ({ commit }, payload) {
      commit('setRole', payload.role)
    },
    setAppLanguage ({ commit }, payload) {
      commit('setLanguage', payload.language)
    },
    setAppProperties ({ commit }, payload) {
      commit('setProperties', payload.properties)
    },
    setAppUsers ({ commit }, payload) {
      commit('setUsers', payload.users)
    },
    setAppServices ({ commit }, payload) {
      commit('setServices', payload.services)
    },
    setAppApiPath ({ commit }, payload) {
      commit('setApiPath', payload.appApiPath)
    },
    setAppBookings ({ commit }, payload) {
      commit('setBookings', payload.bookings)
    },
    setAppBookingListIndexed ({ commit }, payload) {
      commit('setBookingListIndexed', payload.bookingListIndexed)
    },
    setAppBookingListByDate ({ commit }, payload) {
      commit('setBookingListByDate', payload.bookingListByDate)
    },
    setAppBookingViewData ({ commit }, payload) {
      commit('setBookingViewData', payload.bookingViewData)
    },
    setAppCurrentService ({ commit }, payload) {
      commit('setCurrentService', payload.currentService)
    },
    setAppServiceFormType ({ commit }, payload) {
      commit('setServiceFormType', payload.serviceFormType)
    },
    setAppCurrentProperty ({ commit }, payload) {
      commit('setCurrentProperty', payload.currentProperty)
    },
    setAppPropertyFormType ({ commit }, payload) {
      commit('setPropertyFormType', payload.propertyFormType)
    },
    setAppBookingsForChart ({ commit }, payload) {
      commit('setBookingsForChart', payload.bookingsForChart)
    },
    setAppBookingListWithServices ({ commit }, payload) {
      commit('setBookingListWithServices', payload.bookingListWithServices)
    },
    setAppCurrentBooking ({ commit }, payload) {
      commit('setCurrentBooking', payload.currentBooking)
    },
    setAppLabels ({ commit }, payload) {
      commit('setLabels', payload.labels)
    },
    setAppCurrentUser ({ commit }, payload) {
      commit('setCurrentUser', payload.currentUser)
    },
    setAppPropertiesManager ({ commit }, payload) {
      commit('setPropertiesManager', payload.propertiesManager)
    },
    setAppUserFormType ({ commit }, payload) {
      commit('setUserFormType', payload.userFormType)
    },
    setAppPricesList ({ commit }, payload) {
      commit('setPricesList', payload.pricesList)
    },
    setAppLogsList ({ commit }, payload) {
      commit('setLogsList', payload.logsList)
    },
    setAppUser ({ commit }, payload) {
      commit('setUser', payload.user)
    },
    setAppClients ({ commit }, payload) {
      commit('setClients', payload.clients)
    },
    setAppCurrentClient ({ commit }, payload) {
      commit('setCurrentClient', payload.currentClient)
    },
    setAppContractFormType ({ commit }, payload) {
      commit('setContractFormType', payload.contractFormType)
    },
    setAppContractFields ({ commit }, payload) {
      commit('setContractFields', payload.contractFields)
    },
    setAppContracts ({ commit }, payload) {
      commit('setContracts', payload.contracts)
    },
    setAppCurrentContract ({ commit }, payload) {
      commit('setCurrentContract', payload.currentContract)
    },
    setAppUsersSuper ({ commit }, payload) {
      commit('setUsersSuper', payload.usersSuper)
    },
    setAppReservations ({ commit }, payload) {
      commit('setReservations', payload.reservations)
    },
    setAppNotifications ({ commit }, payload) {
      commit('setNotifications', payload.notifications)
    },
    setAppCurrentReservation ({ commit }, payload) {
      commit('setCurrentReservation', payload.currentReservation)
    },
    setAppShowWelcome ({ commit }, payload) {
      commit('setShowWelcome', payload.showWelcome)
    },
    setAppPlans ({ commit }, payload) {
      commit('setPlans', payload.plans)
    },
    setAppPackages ({ commit }, payload) {
      commit('setPackages', payload.packages)
    },
    setAppCurrentPlan ({ commit }, payload) {
      commit('setCurrentPlan', payload.currentPlan)
    },
    setAppPlanFormType ({ commit }, payload) {
      commit('setPlanFormType', payload.planFormType)
    },
    setAppCounter ({ commit }, payload) {
      commit('setPlanCounter', payload.counter)
    },
    setAppSubscriptionData ({ commit }, payload) {
      commit('setSubscriptionData', payload.subscriptionData)
    },
  }
})

export default store
