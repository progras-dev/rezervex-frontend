<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-list" aria-hidden="true"></i>
          <span v-lang.bookings></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.bookingsSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <h4 class="text-success"> <span v-lang.bookingPropertySelect></span> </h4>

      <div class="form-group">
        <b-form-select v-model="currentProperty.id" :options="propertiesScoped" @input="propertyChanged()">
        </b-form-select>
      </div>

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

            <template v-slot:cell(manager)="item">
              {{ item.item.manager.first_name }} {{ item.item.manager.last_name }}
            </template>

            <template v-slot:cell(total_cost)="item">
              {{ item.item.total_cost | numberFormat }}
            </template>

            <template v-slot:cell(date)="item">
              {{ item.item.dateFormatted }}
            </template>

            <template v-slot:cell(contract)="item">
              <b-button variant="outline-success" @click="downloadContract(item.item)">
                <i class="fa fa-download"></i>
              </b-button>
            </template>

            <template v-slot:cell(invoice)="item">
              <b-button v-if="item.item.property.has_invoice === 1" variant="outline-success" @click="downloadInvoice(item.item)">
                <i class="fa fa-download"></i>
              </b-button>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="goToView(item.item, $event)" v-b-tooltip.hover title="Go to booking page">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="goToView(item.item, $event)" v-b-tooltip.hover title="Rezervasyon sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="!item.item.deleted_at && language === 'en'" variant="outline-primary actionButton" @click="goToBookingEdit(item.item, $event)" v-b-tooltip.hover title="Edit booking">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="!item.item.deleted_at && language === 'tr'" variant="outline-primary actionButton" @click="goToBookingEdit(item.item, $event)" v-b-tooltip.hover title="Rezervasyonu Güncelle">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="!item.item.deleted_at && language === 'en'" variant="outline-danger actionButton" @click="openModalRemoveBooking(item.item, $event)" v-b-tooltip.hover title="Remove booking">
                <i class="fa fa-trash"></i>
              </b-button>
              <b-button v-if="!item.item.deleted_at && language === 'tr'" variant="outline-danger actionButton" @click="openModalRemoveBooking(item.item, $event)" v-b-tooltip.hover title="Rezervasyonu Sil">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="currentItems.length === 0"> <span v-lang.noBookings></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems()">
          </b-pagination>

          <ModalRemoveBooking 
            ref="removeBookingModal"
            @modal-booking-remove-success="modalRemoveBookingSuccess" 
            @modal-booking-remove-failed="modalRemoveBookingFailed" 
            :bookingViewData="bookingToRemove"
            :user="user"
          ></ModalRemoveBooking>

          <b-modal ref="removeBookingNotAllowedModal" class="modal-info">
            <template slot="modal-header">
              <h5 class="modal-title"><span v-lang.bookingRemoval></span></h5>
            </template>
            <span v-lang.bookingRemvovalNotAllowed></span>

            <template slot="modal-footer">
              <b-btn variant="info" @click="$refs.removeBookingNotAllowedModal.hide()">
                <span class="white">OK</span>
              </b-btn>
            </template>
          </b-modal>


        </div><!--/.col-->
      </div><!--/.row-->

    </b-card>

  </div>
</template>

<script>
  import moment from 'moment'

  import router from '../router'
  import Calendar from '../components/Calendar.vue'
  import ModalRemoveBooking from '../components/Modals/bookingRemove'
  import store from '../vuex/store'
  import { labels } from '../mixins/labels'
  import { updateBookingLists } from '../mixins/updateBookingLists'
  import { downloadFile } from '../mixins/downloadFile'

  export default {
    components: { Calendar, ModalRemoveBooking },
    mixins: [labels, updateBookingLists, downloadFile],
    data() {
      return {
        okOnly: true,
        bookingToRemove: {},
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        currentProperty: {},
        bookingListScoped: [],
        propertiesScoped: [],
        searchQuery: '',
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      bookings() {
        return store.getters.getBookings
      },
      bookingListByDate() {
        return store.getters.getBookingListByDate
      },
      properties () {
        return store.getters.getProperties
      },
      user() {
        return store.getters.getUser
      },
      currentItemsFiltered() {
        return this.bookingListScoped.filter(item => {
          return item.client.full_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.manager.first_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.manager.last_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.date.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
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
              label: 'Manager',
              class: ['text-center', 'propertiesTable'],
              sortable: true,
              key: 'manager'
            },
            {
              label: 'Date',
              class: ['text-center', 'propertiesTable'],
              key: 'date',
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
              label: 'Contract',
              class: ['text-center', 'propertiesTable'],
              key: 'contract'
            },
            {
              label: 'Invoice',
              class: ['text-center', 'propertiesTable'],
              key: 'invoice'
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
              label: 'Yönetici',
              class: ['text-center', 'propertiesTable'],
              sortable: true,
              key: 'manager'
            },
            {
              label: 'Tarih',
              class: ['text-center', 'propertiesTable'],
              key: 'date',
              sortable: true
            },
            {
              label: 'Muşteri',
              class: ['text-center', 'propertiesTable'],
              key: 'client.full_name',
              sortable: true
            },
            {
              label: 'Toplam tutar',
              class: ['text-center', 'propertiesTable'],
              key: 'total_cost',
              sortable: true
            },
            {
              label: 'Sözleşme',
              class: ['text-center', 'propertiesTable'],
              key: 'contract'
            },
            {
              label: 'Senet',
              class: ['text-center', 'propertiesTable'],
              key: 'invoice'
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
    router: router,
    created() {
      this.$language = this.language
      this.initBookings()
      this.initPagination()
      this.initAlertMessage()
      this.initProperties()
    },
    methods: {
      initBookings() {
        this.bookingListScoped = [];
        for (let i = 0; i < this.bookingListByDate.length; i++) {
          let booking = {...this.bookingListByDate[i]}
          booking.dateFormatted = moment(booking.date).format('DD-MM-YYYY')
          this.bookingListScoped.push(booking)
        }

        console.log('bookingListScoped')
        console.log(this.bookingListScoped)
      },
      initAlertMessage() {
        let isAlert = this.$route.params.isAlert
        let alertType = this.$route.params.alertType
        if (isAlert) {
          this.updateCurrentItems()

          if (alertType === 'booking-update-success') {
            if (this.$language === 'en') {
              this.$toasted.show('Booking succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Güncelleme Başarılı!', {icon: 'fa-check-circle', type: 'success'})
            }
          } else if (alertType === 'booking-update-error') {
            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong when trying to update the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Rezervasyon yapılırken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          }
        }
      },
      initPagination() {
        this.totalItems = this.bookingListScoped.length
        this.currentItems = this.bookingListScoped
          .map(item => {
            if(item.deleted_at) {
              item._rowVariant = 'danger'
            }
            return {...item}
          })
          .slice(0, this.itemsPerPage)
        if (this.bookingListScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
      },
      initProperties() {
        for (let i = 0; i < this.properties.length; i++) {
          const property = {...this.properties[i]}
          this.propertiesScoped.push(property)
        }
        for (let i = 0; i < this.propertiesScoped.length; i++) {
          this.propertiesScoped[i].text = this.propertiesScoped[i].name
          this.propertiesScoped[i].value = this.propertiesScoped[i].id
        }

        let allProperty

        if (this.$language === 'en') {
          allProperty = {
            text: 'All Properties',
            value: 0,
            id: 0
          }
        } else if (this.$language === 'tr') {
          allProperty = {
            text: 'Tüm Salonlar',
            value: 0,
            id: 0
          }
        }

        this.propertiesScoped.splice(0, 0, allProperty)
        this.currentProperty = {...this.propertiesScoped[0]}
      },
      openModalRemoveBooking(booking, event) {
        event.preventDefault()
        this.bookingToRemove = {...booking}
        this.$refs.removeBookingModal.showModal()
      },
      modalRemoveBookingSuccess() {
        this.initBookings()
        this.initPagination()
        this.updateCurrentItems()

        if (this.$language === 'en') {
          this.$toasted.show('Booking successfully removed!', {icon: 'fa-check-circle', type: 'success'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Rezervasyon Silindi!', {icon: 'fa-check-circle', type: 'success'})
        }
      },
      modalRemoveBookingFailed() {
        if (this.$language === 'en') {
          this.$toasted.show('Something went wrong when trying to delete the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Rezervasyon silinirken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
        }
      },
      goToBookingEdit(booking) {
        event.preventDefault()
        store.dispatch({
          type: 'setAppCurrentBooking',
          currentBooking: booking
        })
        this.$localStorage.set('currentBooking', JSON.stringify(booking))
        router.push({name: 'bookingAdmin', params: {originRoute: 'bookingsManager', editing: true}})
      },
      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.bookingListScoped.map(item => ({...item})).slice(indexBegin, indexEnd)

        console.log('currentItems')
        console.log(this.currentItems)
      },
      propertyChanged() {
        this.searchQuery = ''
        // If is all property selected --> restore list
        if (this.currentProperty.id === 0) {
          this.bookingListScoped = this.bookingListByDate.map(item => ({...item}))
        } else {
          for (let i = 0; i < this.propertiesScoped.length; i++) {
            if (this.propertiesScoped[i].id === this.currentProperty.id) {
              this.currentProperty = {...this.propertiesScoped[i]}
            }
          }

          console.log('current property')
          console.log(this.currentProperty)

          // this.bookingListByDate = JSON.parse(this.$localStorage.get('bookingListByDate'))

          if (this.currentProperty.id !== 0) {
            let newBookingList = []

            for (let i = 0; i < this.bookingListByDate.length; i++) {
              let booking = {...this.bookingListByDate[i]}

              if (booking.property_id === this.currentProperty.id) {
                newBookingList.push(booking)
              }
            }

            console.log('new booking list')
            console.log(newBookingList)

            this.bookingListScoped = newBookingList.map(item => ({...item}))

            this.updateCurrentItems()
          }
        }

        this.initPagination()
      },

      goToView(booking, event) {
        event.preventDefault()
        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: booking
        })
        this.$localStorage.set('bookingViewData', JSON.stringify(booking))
        router.push({name: 'bookingView'})
      },
      downloadContract(booking) {
        this.$http.get(this.appApiPath + '/download_contract/' + booking.id, {responseType: 'arraybuffer'})
          .then(response => {
            this.fileDownload(response, 'Sözleşme', 'application/pdf') // mixin
          }, response => {
            console.warn('error from download_contract')
            console.log(response)
            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong when trying to download the contract', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Sözleşmeyi indirirken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      },
      downloadInvoice(booking) {
        this.currentBooking = {...booking}
        this.$http.get(this.appApiPath + '/download_invoice/' + booking.id, {responseType: 'arraybuffer'})
          .then(response => {
            this.fileDownload(response, 'Senet', 'application/pdf') // mixin
          }, response => {
            console.warn('error from download_invoice')
            console.log(response)
            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong when trying to download the invoice', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Faturayı indirirken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
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
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
