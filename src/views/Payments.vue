<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle mb30">
          <i class="fa fa-money" aria-hidden="true"></i>
          <span v-lang.payments></span>
        </span>
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


      <button class="btn btn-info white" @click="filterList('pending')" style="margin-bottom: 10px;" v-if="listShowType === 'all' && currentItems.length > 0">
        <i class="fa fa-search-minus mr5"></i>
        <!--Fix bıg - don't change-->
        <span v-if="$language === 'tr'">Onay bekleyenleri göster</span>
        <span v-if="$language === 'en'">Show only pending</span>
      </button>

      <button class="btn btn-info white" @click="filterList('all')" style="margin-bottom: 10px;" v-if="listShowType === 'pending' && currentItems.length > 0">
        <i class="fa fa-search-plus mr5"></i>
        <span v-if="$language === 'tr'">Hepsi</span>
        <span v-if="$language === 'en'">Show all</span>
      </button>

      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="currentItems"
                   :fields="tableFields"
                   head-variant="light"
                   responsive="lg"
          >

            <template v-slot:cell(manager)="item">
              {{ item.item.manager_first_name }} {{ item.item.manager_last_name }}
            </template>

            <template v-slot:cell(total_cost)="item">
              {{ item.item.total_cost | numberFormat }}
            </template>

            <template v-slot:cell(advance)="item">
              {{ item.item.advance | numberFormat }}
            </template>

            <template v-slot:cell(remainder)="item">
              {{ item.item.total_cost - item.item.advance | numberFormat }}
            </template>

            <template v-slot:cell(status)="item">
              <span class="badge badge-warning" v-if="item.item.total_cost - item.item.advance > 0">
                <!--Fix bıg - don't change-->
                <span v-if="$language === 'tr'">Onayda</span>
                <span v-if="$language === 'en'">Pending</span>
              </span>
              <span class="badge badge-success" v-if="item.item.total_cost - item.item.advance === 0">
                <span v-if="$language === 'tr'">Ödemeyi tamamla</span>
                <span v-if="$language === 'en'">Complete</span>
              </span>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-info" class="actionButton" @click="goToBookingView(item.item, $event)" v-b-tooltip.hover title="Go to booking page">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-info" class="actionButton"  @click="goToBookingView(item.item, $event)" v-b-tooltip.hover title="Rezervasyon sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'en' && item.item.total_cost - item.item.advance > 0" variant="outline-success" class="actionButton"  @click="goToAddPayment(item.item, $event)" v-b-tooltip.hover title="Ödeme Ekle">
                <i class="fa fa-plus"></i>
              </b-button>
              <b-button v-if="language === 'tr' && item.item.total_cost - item.item.advance > 0" variant="outline-success" class="actionButton"  @click="goToAddPayment(item.item, $event)" v-b-tooltip.hover title="Add payment">
                <i class="fa fa-plus"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="currentItems.length === 0"> <span v-lang.noBookings></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems()">
          </b-pagination>

        </div>
      </div>

    </b-card>

    <b-modal ref="modalCompletePayment" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.completePayment></span></h5>
      </template>
      <span v-lang.alertCompletePayment></span> {{ bookingSelected.price - bookingSelected.advance | numberFormat }} ?

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('COMPLETE')">
          <span v-lang.confirm></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import moment from 'moment'
  import { labels } from '../mixins/labels'
  import { updateBookingLists } from '../mixins/updateBookingLists'

  export default {
    mixins: [labels, updateBookingLists],
    data () {
      return {
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        bookingListScoped: [],
        searchQuery: '',
        bookingSelected: {},
        listShowType: 'all',
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      user () {
        return store.getters.getUser
      },
      bookingListByDate() {
        return store.getters.getBookingListByDate
      },
      currentItemsFiltered() {
        return this.bookingListScoped.filter(item => {
          return item.property_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.client_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.manager_first_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.manager_last_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.date.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        })
      },
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: 'Property',
              class: ['text-center', 'propertiesTable'],
              key: 'property.name',
              sortable: true
            },
            {
              label: 'Date',
              class: ['text-center', 'propertiesTable'],
              key: 'dateFormatted',
              sortable: true
            },
            {
              label: 'Client',
              class: ['text-center', 'propertiesTable'],
              key: 'client.full_name',
              sortable: true
            },
            {
              label: 'Total cost',
              class: ['text-center', 'propertiesTable'],
              key: 'total_cost',
              sortable: true
            },
            {
              label: 'Remainder',
              class: ['text-center', 'propertiesTable'],
              key: 'remainder',
              sortable: true
            },
            {
              label: 'Status',
              class: ['text-center', 'propertiesTable'],
              key: 'status'
            },
            {
              label: 'Actions',
              class: ['text-center', 'propertiesTable'],
              key: 'actions'
            },
          ]
        } else if (this.$language === 'tr') {
          return [
            {
              label: 'Salon',
              class: ['text-center', 'propertiesTable'],
              key: 'property.name',
              sortable: true
            },
            {
              label: 'Tarih',
              class: ['text-center', 'propertiesTable'],
              key: 'dateFormatted',
              sortable: true
            },
            {
              label: 'Muşteri',
              class: ['text-center', 'propertiesTable'],
              key: 'client.full_name',
              sortable: true
            },
            {
              label: 'Toplam Fiyat',
              class: ['text-center', 'propertiesTable'],
              key: 'total_cost',
              sortable: true
            },
            {
              label: 'Kalan Bakiye',
              class: ['text-center', 'propertiesTable'],
              key: 'remainder',
              sortable: true
            },
            {
              label: 'Durum',
              class: ['text-center', 'propertiesTable'],
              key: 'status'
            },
            {
              label: 'İşlemler',
              class: ['text-center', 'propertiesTable'],
              key: 'actions'
            },
          ]
        }
      }
    },

    created () {
      this.$language = this.language
      // console.log(this.bookingListByDate)
      this.initBookings()
      this.initPagination()
    },

    methods: {
      initBookings() {
        this.bookingListScoped = []
        for (let i = 0; i < this.bookingListByDate.length; i++) {
          let booking = {...this.bookingListByDate[i]}
          booking.dateFormatted = moment(booking.date).format('DD-MM-YYYY')
          this.bookingListScoped.push(booking)
        }
      },
      initPagination() {
        this.totalItems = this.bookingListScoped.length
        this.currentItems = []
        this.currentItems = this.bookingListScoped.map(item => ({...item})).slice(0, this.itemsPerPage)
        if (this.bookingListScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
        console.log(this.currentItems)
      },
      updateCurrentItemsOnSearch() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.currentItemsFiltered.map(item => ({...item})).slice(indexBegin, indexEnd)
        this.totalItems = this.currentItemsFiltered.length
      },
      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage
        this.currentItems = this.bookingListScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      },
      filterList(type) {
        this.listShowType = type
        if (this.listShowType === 'pending') {
          let newList = []
          for (let i = 0; i < this.bookingListScoped.length; i++) {
            let booking = {...this.bookingListScoped[i]}
            if (booking.total_cost - booking.advance > 0) {
              newList.push(booking)
            }
          }
          this.bookingListScoped = newList.map(item => ({...item}))
        } else if (this.listShowType === 'all') {
          this.initBookings()
        }
        this.initPagination()
      },
      clickModalBtn(btn) {
        this.$refs.modalCompletePayment.hide()
        if (btn === 'COMPLETE') {
          // Update the booking
          let formData = {
            'booking_id': this.bookingSelected.id,
            'advance': this.bookingSelected.total_cost,
            'user_id': this.user.id
          }
          this.$http.post(this.appApiPath + '/api/booking_update_price', formData)
            .then(response => {
              console.log('booking update response')
              console.log(response.body)

              if (this.$language === 'en') {
                this.$toasted.show('Booking payment successfully updated!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Rezervasyon ödemesi güncellendi!', {icon: 'fa-check-circle', type: 'success'})
              }

              // Update booking lists in the store
              this.updateBookings(response)

              setTimeout(() => {
                // Refresh page items
                this.initBookings()
                this.initPagination()
              }, 1000)
            }, response => {
              console.log('booking update error')
              console.log(response)
              this.$toasted.show('Something went wrong when trying to update the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
            })
        }
      },
      goToBookingView(booking, event) {
        event.preventDefault()
        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: booking
        })
        this.$localStorage.set('bookingViewData', JSON.stringify(booking))
        this.$router.push({name: 'bookingView'})
      },
      goToAddPayment(booking, event) {
        event.preventDefault()
        store.dispatch({
          type: 'setAppCurrentBooking',
          currentBooking: booking
        })
        this.$localStorage.set('currentBooking', JSON.stringify(booking))
        if (this.user.role === 'admin') {
          this.$router.push({name: 'paymentForm-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'paymentForm-m'})
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
