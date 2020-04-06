<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-calendar-alt" aria-hidden="true"></i>
          <span v-lang.calendar></span>
        </span>
      </div>
    </div>

    <b-card>
      <div class="row">
        <div class="col-md-4 col-sm-12">
          <h3 class="text-success"> <span v-lang.propertySelect></span> </h3>

          <div class="form-group" v-if="properties">
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
              <b-form-select id="b-form-select" v-model="currentPropertyId" :options="propertiesFormatted" @change="getCurrentBookings">
              </b-form-select>
            </div>
          </div>
        </div>
        <div class="col-md-8 col-sm-12 mt-2">
          <h5 class="text-success"> <span v-lang.colorsInfo></span> </h5>
          <div class="legend">
            <span class="legendBlock">
              <div class="squareToday"></div>
              <p class="card-text"><span v-lang.today class="legendText"></span></p>
            </span>
            <span class="legendBlock">
              <div class="squareDay"></div>
              <p class="card-text"><span v-lang.booking class="legendText"></span> <span v-lang.day class="legendText"></span></p>
            </span>
            <span class="legendBlock">
              <div class="squareNight"></div>
              <p class="card-text"><span v-lang.booking class="legendText"></span> <span v-lang.night class="legendText"></span></p>
            </span>
            <span class="legendBlock">
              <div class="squareReservation"></div>
              <p class="card-text"><span v-lang.reservation class="legendText"></span></p>
            </span>
          </div>
        </div>
      </div>

      <div class="calendarWrapper">
        <calendar-view
          :show-date="showDate"
          :events="currentEvents"
          locale="tr"
          class="theme-default holiday-us-traditional holiday-us-official">
          <calendar-view-header
            slot="header"
            slot-scope="t"
            :header-props="t.headerProps"
            @input="setShowDate" />
          <div slot="event" slot-scope="props"
              :class="['cv-event', {'-day': props.event.originalEvent.type === 'day', '-night': props.event.originalEvent.type === 'night', '-reservation': props.event.originalEvent.isReservation }, ...props.event.classes]"
              :key="props.event.id"
              @click="eventClicked(props.event)">
              <div class="event-slot">   
                <p class="mb-1"><i class="fa fa-user-tie iconColor"></i> {{ props.event.originalEvent.client.full_name }}</p>
                <p class="mb-1"><i class="fa fa-mobile-alt iconColor"></i> {{ props.event.originalEvent.client.phone }}</p>
                <p class="mb-1">
                  <i class="fa fa-sun faDayNight iconColor" v-if="props.event.originalEvent.type === 'day'"></i> 
                  <i class="fa fa-moon faDayNight iconColor" v-if="props.event.originalEvent.type === 'night'"></i> 
                  {{ props.event.originalEvent.hour_start }}:{{ props.event.originalEvent.minute_start }} - {{ props.event.originalEvent.hour_end }}:{{ props.event.originalEvent.minute_end }}
                </p>
              </div>
          
          </div>
        </calendar-view>
      </div>
    </b-card>

  </div>
</template>

<script>
  import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
	require("vue-simple-calendar/static/css/default.css")
  require("vue-simple-calendar/static/css/holidays-us.css")
  
  import store from '../vuex/store'

  export default {

    components: {CalendarView, CalendarViewHeader},

    data() {
      return {
        showDate: new Date(),
        currentProperty: {},
        currentPropertyId: 0,
        currentTimePeriod: 'day',
        currentEvents: [],
      }
    },

    computed: {
      language() {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      user() {
        return store.getters.getUser
      },
      bookings() {
        return store.state.bookings
      },
      reservations() {
        return store.state.reservations
      },
      properties() {
        return store.state.properties
      },
      clients() {
        return store.state.clients
      },
      propertiesFormatted() {
        return this.properties.map(item => {
          item.text = item.name
          item.value = item.id
          return item
        })
      },
    },

    created() {
      this.$language = this.language
      this.initProperties()
      this.getCurrentBookings()
      console.log('reservations', this.reservations)
    },

    updated() {
      console.log('bookings', this.bookings[this.currentPropertyId])
      console.log('currentEvents', this.currentEvents)
    },

    methods: {
      setShowDate(d) {
				this.showDate = d;
      },
      initProperties() {
        this.currentProperty = {...this.propertiesFormatted[0]}
        this.currentPropertyId = this.currentProperty.id
      },
      getCurrentBookings() {
        let dayBookings = []
        let nightBookings = []
        let reservations = []

        if (this.bookings[this.currentPropertyId]) {
          dayBookings = this.bookings[this.currentPropertyId]['day'].map(booking => {
            booking.startDate = booking.date
            booking.isBooking = true
            booking.isReservation = false
            booking.title = `${booking.groom_fullname}. \n ${booking.total_guests}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
          nightBookings = this.bookings[this.currentPropertyId]['night'].map(booking => {
            booking.startDate = booking.date
            booking.isBooking = true
            booking.isReservation = false
            booking.title = `${booking.groom_fullname}. \n ${booking.total_guests}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
        }
        reservations = this.reservations
          .filter(reservation => reservation.property_id === this.currentPropertyId)
          .map(reservation => {
            reservation.startDate = reservation.date
            reservation.type = reservation.day_period
            reservation.isBooking = false
            reservation.isReservation = true
            return reservation
          })
        this.currentEvents = [...dayBookings, ...nightBookings, ...reservations]
        console.log('currentEvents', this.currentEvents)
      },
      toggleDayNight() {
        if (this.currentTimePeriod === 'day') {
          this.currentTimePeriod = 'night'
        } else if (this.currentTimePeriod === 'night') {
          this.currentTimePeriod = 'day'
        }
      },
      eventClicked(event) {
        console.log({event})
        if (event.originalEvent.isBooking) {
          store.dispatch({
            type: 'setAppBookingViewData',
            bookingViewData: event.originalEvent
          })
          this.$localStorage.set('bookingViewData', JSON.stringify(event.originalEvent))
          this.$router.push({name: 'bookingView'})
        } else if (event.originalEvent.isReservation) {
          console.log('isReservation')
          this.$localStorage.set('currentReservation', JSON.stringify(event.originalEvent))
          store.dispatch({
            type: 'setAppCurrentReservation',
            currentReservation: event.originalEvent
          })

          if (this.user.role === 'admin') {
            this.$router.push({name: 'reservation-o'})
          } else if (this.user.role === 'manager') {
            this.$router.push({name: 'reservation-m'})
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
$today: #FCFF7F;
$day: #bbf7f5;
$night: #b0b0fc;
$reservation: #ffd27a;

.calendarWrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  min-height: 900px;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
.dayNighText {
  font-size: 1.5rem;
}
.cv-event {
  margin-top: 1.5rem;
  overflow: scroll;
}
.cv-event:hover {
  cursor: pointer;
  background-color: #ededff;
  border-color: #ededff;
}

.cv-event.-day {
  background-color: $day;
}

.cv-event.-night {
  background-color: $night;
}

.cv-event.-reservation {
  background-color: $reservation;
}

@for $i from 1 through 31 {
  .cv-event.offset#{$i} + .cv-event.offset#{$i} {
    margin-top: 6rem;
  }
}

.legend {
  display: flex;
  justify-content: space-between;
}

.legendBlock {
  display: inline-block;
  float: left;
  width: 100%;
  margin-right: 10px;
  margin-bottom: 3px;
}

.legendText {
  font-weight: 300;
  font-size: 0.8rem;
  color: #777;
  vertical-align: sub;
  margin-left: 5px;
}

.squareToday {
  width: 30px;
  height: 30px;
  background-color: $today;
  float: left;
}

.squareDay {
  width: 30px;
  height: 30px;
  background-color: $day;
  float: left;
}

.squareNight {
  width: 30px;
  height: 30px;
  background-color: $night;
  float: left;
}

.squareReservation {
  width: 30px;
  height: 30px;
  background-color: $reservation;
  float: left;
}

.faDayNight {
  font-size: 1.3rem;
}


</style>
