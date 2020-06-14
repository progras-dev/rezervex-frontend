<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-users" aria-hidden="true"></i>
          <span v-lang.users></span>
        </span>
        <div class="white-text pageSubtitle"> <span v-lang.usersOverview></span> </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <b-table class="table-outline table-responsive-sm mb-0" hover
                 :items="currentItems"
                 :fields="tableFields"
                 head-variant="light"
        >

          <template v-slot:cell(confirmed)="item">
            <template v-if="item.item.confirmed">
              <i class="fa fa-check"></i>
            </template>
            <template v-else>
              <i class="fa fa-times"></i>
            </template>
          </template>

          <template v-slot:cell(actions)="item">
            <b-button v-if="language === 'en'" variant="outline-success" class="actionButton" @click="goToUserView(item.item, $event)" v-b-tooltip.hover title="Go to User page">
              <i class="fa fa-search"></i>
            </b-button>
            <b-button v-if="language === 'tr'" variant="outline-success" class="actionButton" @click="goToUserView(item.item, $event)" v-b-tooltip.hover title="Kullanıcı sayfasına git">
              <i class="fa fa-search"></i>
            </b-button>
          </template>

          <template v-slot:cell(cloak)="item">
            <b-button variant="outline-success" @click="cloak(item.item)">
              <i class="fa fa-user"></i>
            </b-button>
          </template>

        </b-table>

        <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems()">
        </b-pagination>

      </div>
    </div>

  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { initReservations } from '../mixins/initReservations'

  export default {
    mixins: [savePropertiesInStorage, saveContractsInStorage, initReservations],
    data() {
      return {
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        usersScoped: [],
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      users() {
        return store.getters.getUsersSuper
      },
      tableFields() {
        return [
          {
            label: 'First Name',
            class: 'text-center',
            key: 'first_name',
            sortable: true
          },
          {
            label: 'First Name',
            class: 'text-center',
            key: 'last_name',
            sortable: true
          },
          {
            label: 'Manager',
            class: 'text-center',
            key: 'manager',
          },
          {
            label: 'Email',
            class: 'text-center',
            key: 'email',
            sortable: true
          },
          {
            label: 'Confirmed',
            class: 'text-center',
            key: 'confirmed',
            sortable: true
          },
          {
            label: 'Actions',
            class: ['text-center', 'usersTable'],
            key: 'actions',
          },
          {
            label: 'Cloak',
            class: 'text-center',
            key: 'cloak',
          },
        ]
      }
    },
    router: router,
    created() {
      this.$language = this.language
      this.usersScoped = this.users.map(item => ({...item}))
      this.initPagination()
    },
    methods: {
      initPagination() {
        this.totalItems = this.usersScoped.length
        this.currentItems = this.usersScoped.map(item => ({...item})).slice(0, this.itemsPerPage)

        if (this.usersScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
      },
      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage
        this.currentItems = this.usersScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      },
      goToUserView(user, event) {
        console.log(user)
        event.preventDefault()

        this.$localStorage.set('currentUser', JSON.stringify(user))
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: user
        })
        router.push({path: '/s/userView'})
      },
      cloak(user) {
        let formData = {
          'user_id': user.id,
        }

        this.$http.post(this.appApiPath + '/api/cloak', formData).then(response => {
          console.log('api cloak okay - data response')
          console.log(response.body)

          // Add custom data to reservations
          this.initReservations(response.body.data.reservations)

          let userData = response.body.data.userData
          userData.authenticated = true
          store.dispatch({
            type: 'setAppUser',
            user: userData
          })
          this.$localStorage.set('user', JSON.stringify(userData))

          store.dispatch({
            type: 'setAppProperties',
            properties: response.body.data.properties
          })
          this.savePropertiesInStorage(response.body.data.properties, 'admin')

          store.dispatch({
            type: 'setAppUsers',
            users: response.body.data.users
          })
          this.$localStorage.set('users', JSON.stringify(response.body.data.users))

          store.dispatch({
            type: 'setAppPricesList',
            pricesList: response.body.data.prices
          })
          this.$localStorage.set('pricesList', JSON.stringify(response.body.data.prices))

          store.dispatch({
            type: 'setAppServices',
            services: response.body.data.serviceList
          })
          this.$localStorage.set('services', JSON.stringify(response.body.data.serviceList))

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
            type: 'setAppBookingsForChart',
            bookingsForChart: response.body.data.bookingsForChart
          })
          this.$localStorage.set('bookingsForChart', JSON.stringify(response.body.data.bookingsForChart))

          store.dispatch({
            type: 'setAppBookingListByDate',
            bookingListByDate: response.body.data.bookingListByDate
          })
          this.$localStorage.set('bookingListByDate', JSON.stringify(response.body.data.bookingListByDate))

          store.dispatch({
            type: 'setAppBookingListWithServices',
            bookingListWithServices: response.body.data.bookingListWithServices
          })
          this.$localStorage.set('bookingListWithServices', JSON.stringify(response.body.data.bookingListWithServices))

          store.dispatch({
            type: 'setAppLogsList',
            logsList: response.body.data.logsList
          })
          this.$localStorage.set('logsList', JSON.stringify(response.body.data.logsList))

          store.dispatch({
            type: 'setAppReservations',
            reservations: response.body.data.reservations
          })
          this.$localStorage.set('reservations', response.body.data.reservations)

          store.dispatch({
            type: 'setAppRole',
            role: response.body.data.user.role
          })
          this.$localStorage.set('role', response.body.data.user.role)

          store.dispatch({
            type: 'setAppClients',
            clients: response.body.data.clients
          })
          this.$localStorage.set('clients', JSON.stringify(response.body.data.clients))

          if (response.body.data.user.role === 'manager') {
            store.dispatch({
              type: 'setAppPropertiesManager',
              propertiesManager: response.body.data.propertiesManager
            })
            this.savePropertiesInStorage(response.body.data.propertiesManager, 'manager')

            router.push({name: 'managerDashboard'})
          } else if (response.body.data.user.role === 'admin') {
            store.dispatch({
              type: 'setAppContractFields',
              contractFields: response.body.data.contractFields
            })
            this.$localStorage.set('contractFields', JSON.stringify(response.body.data.contractFields))

            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)

            router.push({name: 'dashboard'})
          }
        }, response => {
          console.log('cloak api error')
          console.log(response)
        })
      }
    }
  }
</script>

<style>
</style>
