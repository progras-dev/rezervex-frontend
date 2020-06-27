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
        <div class="col-md-3">
          <div class="row">
            <div class="col-sm-12">
              <h3 class="text-success"> <span v-lang.propertySelect></span> </h3>

              <div class="form-group" v-if="properties">
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                  <b-form-select id="b-form-select" v-model="currentPropertyId" :options="propertiesFormatted" @change="getCurrentBookings">
                  </b-form-select>
                </div>
              </div>
            </div>
            <div class="col-sm-12 mt-2">
              <h5 class="text-success"> <span v-lang.colorsInfo></span> </h5>
              <div>
                <div class="legendBlock">
                  <span class="squareToday"></span>
                  <span class="card-text"><span v-lang.today class="legendText"></span></span>
                </div>
                <div class="legendBlock">
                  <span class="squareNote"></span>
                  <span class="card-text"><span v-lang.note class="legendText"></span></span>
                </div>
                <div class="legendBlock">
                  <span class="squareDay"></span>
                  <span class="card-text"><span v-lang.booking class="legendText"></span> <span v-lang.day class="legendText"></span></span>
                </div>
                <div class="legendBlock">
                  <span class="squareNight"></span>
                  <span class="card-text"><span v-lang.booking class="legendText"></span> <span v-lang.night class="legendText"></span></span>
                </div>
                <div class="legendBlock">
                  <span class="squareReservation"></span>
                  <span class="card-text"><span v-lang.reservation class="legendText"></span></span>
                </div>
              </div>
            </div>
          </div>
          <div class="row mt20">
            <div class="col-sm-12">
              <h3 class="text-success"> <span v-lang.addNote></span> </h3>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputText"><span v-lang.text></span></label>
                <div class="input-group">
                  <textarea rows="5" class="form-control lightBorders" v-model.trim="note.title" id="inputText"></textarea>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputStartDate"> <span v-lang.date></span> </label>
                <div class="input-group">
                  <b-form-datepicker id="inputStartDate" v-model="note.startDate" locale="tr-TR" label-no-date-selected="Tarih seçilmedi"></b-form-datepicker>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <button type="submit" class="btn btn-success btn-lg btn-block white" @click="addNote">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                <i class="fa fa-plus" v-if="!showSpinner"></i>
                &nbsp;<span v-lang.add></span>
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="calendarWrapper">
            <calendar-view
              :show-date="showDate"
              :events="currentEvents"
              locale="tr"
              class="theme-default">
              <calendar-view-header
                slot="header"
                slot-scope="t"
                :header-props="t.headerProps"
                @input="setShowDate" />
              <div slot="event" slot-scope="props"
                  :class="['cv-event', {'-day': props.event.originalEvent.type === 'day', '-night': props.event.originalEvent.type === 'night', '-reservation': props.event.originalEvent.isReservation, '-note': props.event.originalEvent.isNote }, ...props.event.classes]"
                  :key="props.event.id"
                  @click="eventClicked(props.event)">
                  <div class="event-slot" v-if="props.event.originalEvent.isBooking || props.event.originalEvent.isReservation">   
                    <p class="mb-1"><i class="fa fa-user-tie iconColor"></i> {{ props.event.originalEvent.client.full_name }}</p>
                    <p class="mb-1"><i class="fa fa-mobile-alt iconColor"></i> {{ props.event.originalEvent.client.phone }}</p>
                    <p class="mb-1">
                      <i class="fa fa-sun faDayNight iconColor" v-if="props.event.originalEvent.type === 'day'"></i> 
                      <i class="fa fa-moon faDayNight iconColor" v-if="props.event.originalEvent.type === 'night'"></i> 
                      {{ props.event.originalEvent.hour_start }}:{{ props.event.originalEvent.minute_start }} - {{ props.event.originalEvent.hour_end }}:{{ props.event.originalEvent.minute_end }}
                    </p>
                  </div>
                  <div class="event-slot"  v-if="props.event.originalEvent.isNote">
                    <p class="mb-1"> {{ props.event.originalEvent.title }}</p>
                  </div>
              </div>
            </calendar-view>
          </div>
        </div>
      </div>
      
    </b-card>

  </div>
</template>

<script>
  import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
	require("vue-simple-calendar/static/css/default.css")
  
  import store from '../vuex/store'

  export default {

    components: {CalendarView, CalendarViewHeader},

    data() {
      return {
        showDate: new Date(),
        currentProperty: {},
        currentPropertyId: 0,
        currentTimePeriod: 'day',
        note: {
          title: '',
          startDate: '',
          endDate: '',
        },
        showSpinner: false,
        dayBookings: [],
        nightBookings: [],
        reservationsFiltered: [],
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
      calendarNotes() {
        return store.state.calendarNotes
      },
      currentEvents() {
        return [...this.dayBookings, ...this.nightBookings, ...this.reservationsFiltered, ...this.calendarNotes]
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
    },

    methods: {
      addNote() {
        let formData = {
          'project_id': this.user.project_id,
          'title': this.note.title,
          'start_date': this.note.startDate,
          'end_date': this.note.startDate,
        }

        this.$http.post(this.appApiPath + '/api/note_add', formData)
          .then(response => {
            console.log('note_add response')
            console.log(response.body)
            this.note = {}
            let calendarNotes = response.body.notes
            calendarNotes.map(item => {
              item.startDate = item.start_date
              item.isNote = true
              return item
            })
            store.commit('setCalendarNotes', calendarNotes)
          })
          
      },
      setShowDate(d) {
				this.showDate = d;
      },
      initProperties() {
        this.currentProperty = {...this.propertiesFormatted[0]}
        this.currentPropertyId = this.currentProperty.id
      },
      getCurrentBookings() {
        if (this.bookings[this.currentPropertyId]) {
          this.dayBookings = this.bookings[this.currentPropertyId]['day'].map(booking => {
            booking.startDate = booking.date
            booking.isBooking = true
            booking.isReservation = false
            booking.title = `${booking.groom_fullname}. \n ${booking.total_guests}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
          this.nightBookings = this.bookings[this.currentPropertyId]['night'].map(booking => {
            booking.startDate = booking.date
            booking.isBooking = true
            booking.isReservation = false
            booking.title = `${booking.groom_fullname}. \n ${booking.total_guests}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
        }
        this.reservationsFiltered = this.reservations
          .filter(reservation => reservation.property_id === this.currentPropertyId)
          .map(reservation => {
            reservation.startDate = reservation.date
            reservation.type = reservation.day_period
            reservation.isBooking = false
            reservation.isReservation = true
            return reservation
          })
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
$note: #ffb0b7;
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

.cv-event.-note {
  background-color: $note;
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


.legendBlock {
  margin-right: 10px;
  margin-bottom: 3px;
}

.legendText {
  font-weight: 300;
  font-size: 0.8rem;
  color: #777;
  vertical-align: super;
  margin-left: 5px;
}

.squareToday {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: $today;
}

.squareNote {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: $note;
}

.squareDay {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: $day;
}

.squareNight {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: $night;
}

.squareReservation {
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: $reservation;
}

.faDayNight {
  font-size: 1.3rem;
}


</style>
