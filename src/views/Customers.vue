<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-list" aria-hidden="true"></i>
          <span v-lang.clients></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.clientsSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <div class="form-group">
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text"> <i class="fa fa-search"></i></div>
          </div>
          <input type="text" class="form-control" id="search" v-model="searchQuery" @input="updateCurrentItemsOnSearch()" :placeholder="labelSearch">
        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="currentItems"
                   :fields="tableFields"
                   head-variant="light"
                   responsive="xl"
          >
            <template v-slot:cell(has_reservation)="item">
              <span v-if="item.item.reservations.length > 0"><i class="fa fa-check text-success"></i></span>
              <span v-if="item.item.reservations.length === 0"><i class="fa fa-times" style="color: #999;"></i></span>
            </template>
            <template v-slot:cell(has_booking)="item">
              <span v-if="item.item.bookings.length > 0"><i class="fa fa-check text-success"></i></span>
              <span v-if="item.item.bookings.length === 0"><i class="fa fa-times" style="color: #999;"></i></span>
            </template>
            <template v-slot:cell(view)="item">
              <b-button variant="outline-success" @click="openClientView(item.item)">
                <i class="fa fa-search"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="clientsListScoped.length === 0"> <span v-lang.noClients></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItemsOnNewPagination()">
          </b-pagination>

        </div><!--/.col-->
      </div><!--/.row-->

    </b-card>

  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'

  export default {
    router: router,

    components: {Icon},

    data () {
      return {
        clientsListScoped: [],
        searchQuery: '',
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        labelSearch: '',
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      clients () {
        return store.getters.getClients
      },
      user () {
        return store.getters.getUser
      },
      currentItemsFiltered() {
        return this.clientsListScoped.filter(item => {
          if (item.email !== null) {
            return item.full_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.phone.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.email.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
          } else {
            return item.full_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.phone.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
          }
        })
      },
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: 'Name',
              class: ['text-center', 'propertiesTable'],
              key: 'full_name',
            },
            {
              label: 'Email',
              class: ['text-center', 'propertiesTable'],
              key: 'email',
            },
            {
              label: 'Phone',
              class: ['text-center', 'propertiesTable'],
              key: 'phone',
            },
            {
              label: 'Has Reservation',
              class: ['text-center', 'propertiesTable'],
              key: 'has_reservation',
            },
            {
              label: 'Has Booking',
              class: ['text-center', 'propertiesTable'],
              key: 'has_booking',
            },
            {
              label: 'View',
              class: ['text-center', 'propertiesTable'],
              key: 'view',
            },
          ]
        } else if (this.$language === 'tr') {
          return [
            {
              label: 'Adı',
              class: ['text-center', 'propertiesTable'],
              key: 'full_name',
            },
            {
              label: 'E-posta',
              class: ['text-center', 'propertiesTable'],
              key: 'email',
            },
            {
              label: 'Telefon',
              class: ['text-center', 'propertiesTable'],
              key: 'phone',
            },
            {
              label: 'Opsyon',
              class: ['text-center', 'propertiesTable'],
              key: 'has_reservation',
            },
            {
              label: 'Rezervasyon',
              class: ['text-center', 'propertiesTable'],
              key: 'has_booking',
            },
            {
              label: 'Açık',
              class: ['text-center', 'propertiesTable'],
              key: 'view',
            },
          ]
        }
      }
    },

    created () {
      this.$language = this.language
      this.clientsListScoped = this.clients.map(item => ({...item}))
      console.log('clientsListScoped')
      console.log(this.clientsListScoped)
      this.initLabels()
      this.initPagination()
    },

    methods: {
      initLabels() {
        if (this.language === 'tr') {
          this.labelSearch = 'Ara'
        } else if (this.language === 'en') {
          this.labelSearch = 'Search'
        }
      },
      initPagination() {
        console.log('init pagination')
        this.totalItems = this.clientsListScoped.length

        this.currentItems = this.clientsListScoped.map(item => ({...item})).slice(0, this.itemsPerPage)

        if (this.clientsListScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
        console.log(this.currentItems)
      },
      openClientView(client) {
        console.log(client)
        store.dispatch({
          type: 'setAppCurrentClient',
          currentClient: client
        })
        this.$localStorage.set('currentClient', JSON.stringify(client))
        if (this.user.role === 'admin') {
          this.$router.push({name: 'customerView-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'customerView-m'})
        }
      },
      updateCurrentItemsOnSearch() {
        console.log('update on search')
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.currentItemsFiltered.map(item => ({...item})).slice(indexBegin, indexEnd)
        this.totalItems = this.currentItemsFiltered.length

        console.log('currentItems')
        console.log(this.currentItems)
      },
      updateCurrentItemsOnNewPagination() {
        console.log('update on pagination')
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.currentItemsFiltered.map(item => ({...item})).slice(indexBegin, indexEnd)

        console.log('currentItems')
        console.log(this.currentItems)
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
