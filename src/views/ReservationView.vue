<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle mb25">
          <i class="fa fa-list-alt" aria-hidden="true"></i>
          <span v-lang.reservationDetails></span>
        </span>
      </div>
    </div>

    <b-card>

      <div class="form-group row">
        <div class="col-sm-5">
          <button type="submit" class="btn btn-lg btn-block btn-info white" @click="proceedWithBooking">
            <i class="fa fa-pencil-square-o"></i>
            <span v-lang.proceedWithBooking></span>
          </button>
        </div>
      </div>


      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-calendar-check-o"></i>
              </div>
              <div class="h3 text-success"><span v-lang.date></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.date></span>: {{ currentReservation.dateFormatted }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.period></span>: {{ currentReservation.day_period }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.time></span>: {{ currentReservation.hour_start }}:{{ currentReservation.minute_start }} - {{ currentReservation.hour_end }}:{{ currentReservation.minute_end }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-user"></i>
              </div>
              <div class="h3 text-success"><span v-lang.customerInfo></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.name></span>: {{ currentReservation.client.full_name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>: {{ currentReservation.client.phone }}</p>
                <p class="card-text normalText200" v-if="currentReservation.client.email !== null"> <span class="fontWeight300" v-lang.email></span>: {{ currentReservation.client.email }}</p>
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
                <i class="fa fa-calendar"></i>
              </div>
              <div class="h3 text-success"><span v-lang.reservationInfo></span></div>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.expirationDate></span>: {{ currentReservation.expirationDateFormatted }}</p>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.daysLeft></span>: {{ currentReservation.daysLeft }}</p>
              <div class="progress progress-sm">
                <div class="progress-bar" :class="{'bg-danger': currentReservation.percentage >= 75, 'bg-warning': currentReservation.percentage >= 50, 'bg-success': currentReservation.percentage < 50}" role="progressbar" style="width: 50%" :style="{ width: currentReservation.percentage + '%' }" :aria-valuenow="currentReservation.percentage" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div>

              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-building"></i>
              </div>
              <div class="h3 text-success"><span v-lang.property></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.property></span>: {{ currentReservation.property.name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.address></span>: {{ currentReservation.property.address }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.manager></span>: {{ currentReservation.user.first_name }} {{ currentReservation.user.last_name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>: {{ currentReservation.user.phone }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.email></span>: {{ currentReservation.user.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </b-card>

  </div>
</template>

<script>
  import store from '../vuex/store'

  export default {

    data() {
      return {
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
      currentReservation() {
        return store.getters.getCurrentReservation
      },
    },

    created() {
      this.$language = this.language
    },

    methods: {
      proceedWithBooking() {
        if (this.user.role === 'admin') {
          this.$router.push({name: 'bookingAdmin', params: {continueReservation: true, reservation: this.currentReservation}})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'bookingManager', params: {continueReservation: true, reservation: this.currentReservation}})
        }
      }
    }
  }
</script>

<style>

</style>
