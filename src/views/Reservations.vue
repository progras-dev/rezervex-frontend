<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-tasks" aria-hidden="true"></i>
          <span v-lang.reservations></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.reservationsSubtitle></span></div>
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

            <template v-slot:cell(property)="item">
              {{ item.value.name }}
            </template>

            <template v-slot:cell(client)="item">
              <span v-if="item.value"> {{ item.value.full_name }} </span>
            </template>

            <template v-slot:cell(validity)="item">
              <div class="progress progress-xs">
                <div class="progress-bar" :class="{'bg-danger': item.item.percentage > 75, 'bg-warning': item.item.percentage >= 50, 'bg-success': item.item.percentage < 50}" role="progressbar" style="width: 50%" :style="{ width: item.item.percentage + '%' }" :aria-valuenow="item.item.percentage" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div class="small text-muted">
                {{ item.item.daysLeft }}
                <span v-lang.daysLeft v-if="item.item.daysLeft > 1"></span>
                <span v-lang.dayLeft v-if="item.item.daysLeft < 2"></span>
              </div>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="openModalContinueReservation(item.item, $event)" v-b-tooltip.hover title="Proceed With Booking">
                <i class="fa fa-pencil-square-o"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="openModalContinueReservation(item.item, $event)" v-b-tooltip.hover title="Rezervasyon ekranına devam et">
                <i class="fa fa-pencil-square-o"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-info actionButton" @click="goToDetails(item.item, $event)" v-b-tooltip.hover title="Go To Details">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-info actionButton" @click="goToDetails(item.item, $event)" v-b-tooltip.hover title="Rezervasyon sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-danger actionButton" @click="openModalRemoveReservation(item.item, $event)" v-b-tooltip.hover title="Remove Reservation">
                <i class="fa fa-trash"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-danger actionButton" @click="openModalRemoveReservation(item.item, $event)" v-b-tooltip.hover title="Opsiyonu kaldır">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="currentItems.length === 0"> <span v-lang.noReservations></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems()">
          </b-pagination>

        </div>
      </div>

    </b-card>

    <b-modal ref="removeReservationModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.reservationRemoval></span></h5>
      </template>
      <span v-lang.alertReservationRemoveAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
          <span v-lang.removeReservation></span>
        </b-btn>
      </template>
    </b-modal>

    <b-modal ref="continueReservationModal" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.reservationContinue></span></h5>
      </template>
      <span v-lang.alertReservationContinueAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="success" @click="clickModalBtn('CONTINUE')">
          <span class="white" v-lang.proceedWithBooking></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import { labels } from '../mixins/labels'
  import { updateReservations } from '../mixins/updateReservations'
  import { updateNotifications } from '../mixins/updateNotifications'

  export default {

    mixins: [labels, updateReservations, updateNotifications],

    data() {
      return {
        reservationToRemove: {},
        reservationToContinue: {},
        indexReservationToRemove: 0,
        reservationListScoped: [],
        searchQuery: '',
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
      }
    },

    computed: {
      language() {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      properties () {
        return store.getters.getProperties
      },
      user() {
        return store.getters.getUser
      },
      reservations() {
        return store.getters.getReservations
      },
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: 'Property',
              class: ['text-center', 'propertiesTable'],
              key: 'property',
            },
            {
              label: 'Date',
              class: ['text-center', 'propertiesTable'],
              key: 'dateFormatted',
            },
            {
              label: 'Day period',
              class: ['text-center', 'propertiesTable'],
              key: 'day_period',
            },
            {
              label: 'Customer',
              class: ['text-center', 'propertiesTable'],
              key: 'client',
            },
            {
              label: 'Validity',
              class: ['text-center', 'propertiesTable'],
              key: 'validity',
            },
            {
              label: 'Expiration date',
              class: ['text-center', 'propertiesTable'],
              key: 'expirationDateFormatted',
            },
            {
              label: 'Actions',
              class: ['text-center', 'propertiesTable'],
              key: 'actions',
            },
          ]
        } else if (this.$language === 'tr') {
          return [
            {
              label: 'Salon',
              class: ['text-center', 'propertiesTable'],
              key: 'property',
            },
            {
              label: 'Tarih',
              class: ['text-center', 'propertiesTable'],
              key: 'dateFormatted',
            },
            {
              label: 'Dönemlik',
              class: ['text-center', 'propertiesTable'],
              key: 'day_period',
            },
            {
              label: 'Müşteri',
              class: ['text-center', 'propertiesTable'],
              key: 'client',
            },
            {
              label: 'Geçerlilik',
              class: ['text-center', 'propertiesTable'],
              key: 'validity',
            },
            {
              label: 'Sonlanma Tarihi',
              class: ['text-center', 'propertiesTable'],
              key: 'expirationDateFormatted',
            },
            {
              label: 'İşlemler',
              class: ['text-center', 'propertiesTable'],
              key: 'actions',
            },
          ]
        }
      },
      currentItemsFiltered() {
        return this.reservationListScoped.filter(item => {
          return item.property.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.dateFormatted.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.day_period.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1 || item.client.full_name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1
        })
      },
    },

    router: router,

    created() {
      this.$language = this.language
      this.reservationListScoped = this.reservations.map(item => ({...item}))
      this.initPagination()
      let isAlert = this.$route.params.isAlert
      let alertType = this.$route.params.alertType

      if (isAlert) {
        if (alertType === 'reservation-create-success') {
          if (this.language === 'en') {
            this.$toasted.show('Reservation successfully created and stored!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Rezervasyon başarıyla gerçekleştirildi', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      }
    },

    methods: {
      initPagination() {
        this.totalItems = this.reservationListScoped.length
        this.currentItems = this.reservationListScoped.map(item => ({...item})).slice(0, this.itemsPerPage)
        if (this.reservationListScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
      },
      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage
        this.currentItems = this.reservationListScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      },
      updateCurrentItemsOnSearch() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage
        this.currentItems = this.currentItemsFiltered.map(item => ({...item})).slice(indexBegin, indexEnd)
        this.totalItems = this.currentItemsFiltered.length
      },
      openModalRemoveReservation(reservation, event) {
        event.preventDefault()
        this.reservationToRemove = {...reservation}
        for (let i = 0; i < this.reservationListScoped.length; i++) {
          if (reservation.id === this.reservations[i].id) {
            this.indexReservationToRemove = i
          }
        }
        this.$refs.removeReservationModal.show()
      },
      clickModalBtn(btn) {
        if (btn === 'CANCEL') {
          this.$refs.removeReservationModal.hide()
          this.$refs.continueReservationModal.hide()
        } else if (btn === 'REMOVE') {
          this.reservationListScoped.splice(this.indexReservationToRemove, 1)

          let formData = {
            'reservation_id': this.reservationToRemove.id,
            'user_id': this.user.id,
          }

          this.$http.post(this.appApiPath + '/api/reservation_remove', formData)
            .then(response => {
              console.log('remove success')
              console.log(response.body)

              // this.updateReservations(this.reservationToRemove)
              this.updateNotifications(this.reservationToRemove)
              this.updateCurrentItems()

              this.$localStorage.set('reservations', JSON.stringify(response.body.data.reservations))
              store.dispatch({
                type: 'setAppReservations',
                reservations: response.body.data.reservations
              })

              if (this.$language === 'en') {
                this.$toasted.show('Reservation successfully removed!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Opsiyon başarıyla kaldırıldı!', {icon: 'fa-check-circle', type: 'success'})
              }
            }, response => {
              console.log('remove error')
              console.log(response)
            })

          this.$refs.removeReservationModal.hide()
        } else if (btn === 'CONTINUE') {
          if (this.user.role === 'admin') {
            router.push({name: 'bookingAdmin', params: {continueReservation: true, reservation: this.reservationToContinue}})
          } else if (this.user.role === 'manager') {
            router.push({name: 'bookingManager', params: {continueReservation: true, reservation: this.reservationToContinue}})
          }
        }
      },
      openModalContinueReservation(reservation, event) {
        event.preventDefault()
        this.reservationToContinue = {...reservation}
        this.$refs.continueReservationModal.show()
      },
      goToDetails(reservation, event) {
        event.preventDefault()
        this.$localStorage.set('currentReservation', JSON.stringify(reservation))
        store.dispatch({
          type: 'setAppCurrentReservation',
          currentReservation: reservation
        })

        if (this.user.role === 'admin') {
          this.$router.push({name: 'reservation-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'reservation-m'})
        }
      },
    }
  }
</script>

<style>

</style>
