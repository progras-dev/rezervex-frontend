<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-user" aria-hidden="true"></i>
          <span v-lang.client></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.clientInfo></span></div>
      </div>
    </div>

    <b-card>

      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-user"></i>
              </div>
              <div class="h3 text-success"><span v-lang.clientInfo></span></div>
              <div>
                <p class="card-text normalText200">
                  <span class="fontWeight300" v-lang.name></span>: {{ currentClient.full_name }}
                  <span class="fontWeight300" v-lang.phone style="margin-left: 20px"></span>: {{ currentClient.phone }}
                  <span class="fontWeight300" v-lang.email style="margin-left: 20px"></span>: {{ currentClient.email }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.reservationInfo></span></div>
                <span v-if="currentClient.reservations.length > 0">
                  <div class="mb30" v-for="(reservation, index) in currentClient.reservations" :key="reservation.id">
                    <p class="card-text normalText200">
                      <span class="fontWeight300" v-lang.date></span>: {{ dateReservationFormatted(index) }} -
                      <span class="type" v-if="currentClient.reservations[0].day_period == 'day' && language === 'en'"> {{ reservation.day_period }}</span>
                      <span class="type" v-if="currentClient.reservations[0].day_period == 'day' && language === 'tr'"> Gün</span>
                      <span class="type" v-if="currentClient.reservations[0].day_period == 'night' && language === 'en'"> {{ reservation.day_period }}</span>
                      <span class="type" v-if="currentClient.reservations[0].day_period == 'night' && language === 'tr'"> Gece</span>
                    </p>
                    <p class="card-text normalText200">
                      <span class="fontWeight300" v-lang.expirationDate></span>: {{ expirationDateReservationFormatted(index) }}
                    </p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.manager></span>: {{ reservationManagerName(index) }}</p>
                    <p class="card-text normalText200">
                      <span class="fontWeight300" v-lang.property></span>: {{ reservationPropertyName(index) }}</p>
                  </div>
              </span>
                <span v-if="currentClient.reservations.length === 0">
                <p class="card-text lead noItems"> <span v-lang.noReservations></span></p>
              </span>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.bookingData></span></div>
                <span v-if="currentClient.bookings.length > 0">
                  <div class="mb30" v-for="(booking, index) in currentClient.bookings" :key="booking.id">
                    <p class="card-text normalText200">
                      <span class="fontWeight300" v-lang.date></span>: {{ dateBookingFormatted(index) }} -
                      <span class="type" v-if="booking.type == 'day' && language === 'en'"> {{ booking.type }}</span>
                      <span class="type" v-if="booking.type == 'day' && language === 'tr'"> Gün</span>
                      <span class="type" v-if="booking.type == 'night' && language === 'en'"> {{ booking.type }}</span>
                      <span class="type" v-if="booking.type == 'night' && language === 'tr'"> Gece</span>
                    </p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.time></span>: {{ booking.hour_start }}:{{ booking.minute_start }} - {{ booking.hour_end }}:{{ booking.minute_end }}</p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalGuests></span>: {{ booking.total_guests }}</p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.property></span>: {{ bookingPropertyName(index) }}</p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.groom></span>: {{ booking.groom_fullname }} </p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.bride></span>: {{ booking.bride_fullname }} </p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.manager></span>: {{ bookingManagerName(index) }}</p>
                    <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalCost></span>: {{ booking.total_cost | numberFormat }}</p>
                    <b-button variant="outline-success" class="btn btn-block" @click="downloadContract(booking)">
                        <i class="fa fa-download mr-2"></i>
                        <span v-lang.download></span>
                    </b-button>
                  </div>
                </span>
              <span v-if="currentClient.bookings.length === 0">
                <p class="card-text lead noItems"> <span v-lang.noBookings></span></p>
              </span>
            </div>
          </div>
        </div>
      </div>

    </b-card>

  </div>
</template>

<script>
  import moment from 'moment'

  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { downloadFile } from '../mixins/downloadFile'

  export default {
    router: router,
    components: {Icon},
    mixins: [downloadFile],
    data () {
      return {
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      currentClient () {
        return store.getters.getCurrentClient
      },
      properties () {
        return store.getters.getProperties
      },
      users () {
        return store.getters.getUsers
      }
    },
    created () {
      this.$language = this.language
      console.log('currentClient', this.currentClient)
    },
    methods: {
      dateReservationFormatted (index) {
        return moment(this.currentClient.reservations[index].date).format('DD-MM-YYYY')
      },
      expirationDateReservationFormatted (index) {
        return moment(this.currentClient.reservations[index].expiration_date).format('DD-MM-YYYY')
      },
      reservationPropertyName(index) {
        let property
        for (let i = 0; i < this.properties.length; i++) {
          if (this.currentClient.reservations[index].property_id === this.properties[i].id) {
            property = {...this.properties[i]}
          }
        }
        return property.name
      },
      reservationManagerName(index) {
        let manager
        for (let i = 0; i < this.users.length; i++) {
          if (this.currentClient.reservations[index].user_id === this.users[i].id) {
            manager = {...this.users[i]}
          }
        }
        if (manager) {
          return manager.first_name + ' ' + manager.last_name
        } else {
          return ''
        }
      },
      bookingPropertyName(index) {
        let property
        for (let i = 0; i < this.properties.length; i++) {
          if (this.currentClient.bookings[index].property_id === this.properties[i].id) {
            property = {...this.properties[i]}
          }
        }
        return property.name
      },
      bookingManagerName(index) {
        let manager
        console.log(this.currentClient.bookings[index].manager_id)
        for (let i = 0; i < this.users.length; i++) {
          if (this.currentClient.bookings[index].manager_id === this.users[i].id) {
            manager = {...this.users[i]}
          }
        }
        if (manager) {
          return manager.first_name + ' ' + manager.last_name
        } else {
          return ''
        }
      },
      dateBookingFormatted (index) {
        return moment(this.currentClient.bookings[index].date).format('DD-MM-YYYY')
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
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
