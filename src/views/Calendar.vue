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
            <div class="col-sm-12" v-if="!isSuperAdmin">
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
                  <textarea rows="5" class="form-control lightBorders" v-model.trim="newNote.title" id="inputText"></textarea>
                </div>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group">
                <label for="inputStartDate"> <span v-lang.date></span> </label>
                <div class="input-group">
                  <b-form-datepicker id="inputStartDate" v-model="newNote.startDate" locale="tr-TR" label-no-date-selected="Tarih seçilmedi"></b-form-datepicker>
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
              class="theme-default"
              eventContentHeight="2.5em"
              @click-event="onClickItem"
            >
              <calendar-view-header
                slot="header"
                slot-scope="t"
                :header-props="t.headerProps"
                @input="setShowDate" 
              />
              <!-- <div slot="event" slot-scope="props"
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
                  <div class="event-slot" v-if="props.event.originalEvent.isNote">
                    <p class="mb-1"> {{ props.event.originalEvent.title }}</p>
                  </div>
              </div> -->
            </calendar-view>
          </div>
        </div>
      </div>
      
    </b-card>

    <b-modal ref="dateItemModal" class="modal-info" ok-only ok-title="Tamam">
      <template slot="modal-header">
        <h5 class="modal-title text-success font-weight-bold">
          <span v-lang.note v-if="isNote"></span>
          <span v-lang.booking v-if="isBooking"></span>
          <span v-lang.reservation v-if="isReservation"></span>
        </h5>
        <button type="button"
            class="close"
            @click="$refs.dateItemModal.hide()">
          <span>x</span>
        </button>
      </template>
      <template v-if="isBooking">
        <p><i class="fa fa-user text-primary"></i> <span v-lang.client style="margin-left: 5px"></span>: {{ booking.client.full_name }}</p>
        <p><i class="fa fa-clock text-primary"></i> <span v-lang.time style="margin-left: 5px"></span>: {{ bookingTime }} | {{ booking.type }}</p>
        <p><i class="fa fa-users text-primary"></i> <span v-lang.totalGuests style="margin-left: 5px"></span>: {{ booking.total_guests }}</p>
        <p><i class="fa fa-money text-primary"></i> <span v-lang.cost style="margin-left: 5px"></span>: {{ booking.total_cost | numberFormat }}</p>
        <p><i class="fa fa-edit text-primary"></i> <span v-lang.notes style="margin-left: 5px"></span>: {{ booking.notes }}</p>
      </template>
      <template v-if="isReservation">
        <p><i class="fa fa-user text-primary"></i> <span v-lang.client style="margin-left: 5px"></span>: {{ reservation.client.full_name }}</p>
        <p><i class="fa fa-clock text-primary"></i> <span v-lang.time style="margin-left: 5px"></span>: {{ reservationTime }} | {{reservation.type}}</p>
        <p><i class="fa fa-edit text-primary"></i> <span v-lang.notes style="margin-left: 5px"></span>: {{ reservation.notes }}</p>
        <p><i class="fa fa-calendar text-primary"></i> <span v-lang.expirationDate style="margin-left: 5px"></span>: {{ reservation.expirationDateFormatted }}</p>
      </template>
      <template v-if="isNote">
        {{ modalContent }}
      </template>

      <template slot="modal-footer">
        <button type="button" class="btn btn-primary white" @click="goToBooking" v-if="isBooking">
          <span v-lang.goToBookingPage></span>
        </button>
        <button type="button" class="btn btn-primary white" @click="goToReservation" v-if="isReservation">
          <span v-lang.goToReservation></span>
        </button>
        <button type="button" class="btn btn-danger white" @click="noteRemove" v-if="showNoteRemoveButton">
          <span v-lang.remove></span>
        </button>
        <button type="button" class="btn btn-info white" @click="$refs.dateItemModal.hide()" v-if="isNote && note.is_superadmin !== 'x'">
          <span v-lang.okay></span>
        </button>
      </template>
    </b-modal>

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
        newNote: {
          title: '',
          startDate: '',
          endDate: '',
        },
        showSpinner: false,
        dayBookings: [],
        nightBookings: [],
        reservationsFiltered: [],
        modalContent: '',
        isBooking: false,
        isReservation: false,
        isNote: false,
        booking: {},
        bookingTime: '',
        reservation: {},
        reservationTime: '',
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
      users () {
        return store.state.users
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
      isSuperAdmin() {
        return this.$route.name === 'calendar-s'
      },
      showNoteRemoveButton() {
        if (this.isNote && this.note.is_superadmin !== 'x') {
          return true
        } else if (this.isNote && this.note.is_superadmin === 'x' && this.isSuperAdmin) {
          return true
        } else {
          return false
        }
      }
    },

    created() {
      this.$language = this.language
      this.initProperties()
      this.getCurrentBookings()
      console.log('isSuperAdmin', this.isSuperAdmin)
    },

    methods: {
      noteRemove() {
        console.log(this.note)
        this.$http.delete( `${this.appApiPath}/api/notes/${this.note.id}`)
          .then(response => {
            console.log('note_add response')
            console.log(response.body)
            this.$refs.dateItemModal.hide()
            this.note = {
              title: '',
              startDate: '',
              endDate: '',
            }
            let calendarNotes = response.body.notes
            calendarNotes.map(item => {
              item.startDate = item.start_date
              item.isNote = true
              item.title = 'NOT: ' + item.title
              return item
            })
            store.commit('setCalendarNotes', calendarNotes)
            this.$localStorage.set('calendarNotes', JSON.stringify(calendarNotes))
          })
      },
      goToReservation() {
        this.$localStorage.set('currentReservation', JSON.stringify(this.reservation))
        store.dispatch({
          type: 'setAppCurrentReservation',
          currentReservation: this.reservation
        })

        if (this.user.role === 'admin') {
          this.$router.push({name: 'reservation-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'reservation-m'})
        }
      },
      goToBooking() {
        console.log(this.booking)
        store.dispatch({
            type: 'setAppBookingViewData',
            bookingViewData: this.booking
          })
          this.$localStorage.set('bookingViewData', JSON.stringify(this.booking))
          this.$router.push({name: 'bookingView'})
      },
      getEventTime(event) {
        return `${event.hour_start}:${event.minute_start} - ${event.hour_end}:${event.minute_end}`
      },
      onClickItem(item, event) {
        console.warn('onClickItem')
        console.log({item})
        console.log({event})
        this.$refs.dateItemModal.show()
        if (item.originalEvent.isNote) {
          this.isNote = true
          this.isBooking = false
          this.isReservation = false
          this.note = item.originalEvent
          this.modalContent = item.originalEvent.title.slice(4)
        } else if (item.originalEvent.isBooking) {
          this.isNote = false
          this.isBooking = true
          this.isReservation = false
          this.booking = item.originalEvent
          this.bookingTime = this.getEventTime(this.booking)
        } else if (item.originalEvent.isReservation) {
          this.isNote = false
          this.isBooking = false
          this.isReservation = true
          this.reservation = item.originalEvent
          this.reservationTime = this.getEventTime(this.reservation)
        }
        
      },
      addNote() {
        let managerType = ''
        this.isSuperAdmin ? managerType = 'superadmin' : managerType = 'manager'
        console.log({managerType})
        let formData = {
          'project_id': this.user.project_id,
          'title': this.newNote.title,
          'start_date': this.newNote.startDate,
          'end_date': this.newNote.startDate,
          'manager_type': managerType
        }

        this.$http.post(this.appApiPath + '/api/note_add', formData)
          .then(response => {
            console.log('note_add response')
            console.log(response.body)
            this.newNote = {}
            let calendarNotes = response.body.notes
            calendarNotes.map(item => {
              item.startDate = item.start_date
              item.isNote = true
              item.title = 'NOT: ' + item.title
              return item
            })
            store.commit('setCalendarNotes', calendarNotes)
            this.$localStorage.set('calendarNotes', JSON.stringify(calendarNotes))
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
            booking.property = this.currentProperty
            booking.manager = this.users.find(user => user.id === booking.manager_id)
            booking.title = `REZERVASYON: ${booking.groom_fullname}. \n ${booking.hour_start}:${booking.minute_start}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
          this.nightBookings = this.bookings[this.currentPropertyId]['night'].map(booking => {
            booking.startDate = booking.date
            booking.isBooking = true
            booking.isReservation = false
            booking.property = this.currentProperty
            booking.manager = this.users.find(user => user.id === booking.manager_id)
            booking.title = `REZERVASYON: ${booking.groom_fullname}. \n ${booking.hour_start}:${booking.minute_start}`
            booking.client = this.clients.find(client => client.id === booking.client_id)
            return booking
          })
        }
        this.reservationsFiltered = this.reservations
          .filter(reservation => reservation.property_id === this.currentPropertyId)
          .map(reservation => {
            console.log({reservation})
            reservation.startDate = reservation.date
            reservation.type = reservation.day_period
            reservation.isBooking = false
            reservation.isReservation = true
            reservation.title = `OPSYON: ${reservation.client.full_name}. \n ${reservation.hour_start}:${reservation.minute_start}`
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
