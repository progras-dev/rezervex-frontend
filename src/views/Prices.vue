<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-list" aria-hidden="true"></i>
          <span v-lang.prices></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.pricesRangesSelect></span></div>
      </div>
    </div>

    <form-wizard title="" subtitle="" color="#79C447">

      <button class="btn btn-success white confirmButton" slot="next">
        <span v-lang.next></span>
        <i class="fa fa-chevron-right buttonIcon"></i>
      </button>

      <button class="btn btn-success white confirmButton" slot="prev">
        <i class="fa fa-chevron-left buttonIcon"></i>
        <span v-lang.previous></span>
      </button>

      <button style="display: none" slot="finish">

      </button>


      <tab-content :title="chooseProperty" icon="fa fa-building" :before-change="validateFirstStep">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.propertySelect></span></span>
          </div>

          <div class="form-group" v-if="properties">
            <b-form-select v-model="currentPropertyId" :options="propertiesFormatted" class="mb-3" @input="propertyChanged()">
            </b-form-select>
          </div>

          <div class="alert alert-warning" role="alert" v-if="properties.length === 0">
            <i class="fa fa-warning"></i> &nbsp;
            <span v-lang.createPropertyFirst></span>
          </div>

        </b-card>

      </tab-content>


      <tab-content :title="setPrices" icon="fa fa-money" :before-change="validateSecondStep">

        <b-card>
          <div slot="header">
            <span class="card-text text-success bookingTabTitle"><span v-lang.setPrices></span></span>
          </div>

          <div class="row" v-if="properties.length > 0">
            <div class="col-md-6">
              <calendar ref="range"
                        :daysSelected="daysSelected"
                        :range-status="0"
                        class="event-calendar"
                        :value="value"
                        :disabled-days-of-week="disabled"
                        :format="format"
                        :clear-button="clear"
                        :placeholder="placeholder"
                        :pane="1"
                        :has-input="false"
                        :on-day-click="onDayClick"
                        :change-pane="changePane">
                <template v-if="events">
                  <div class="event" v-for="(dayPrice, index) in events" :key="index" :slot="dayPrice.date">
                    <!-- Note -->
                    <span class="calendarEventSpan" v-if="calendarNotesForCalendar[dayPrice.date]" style="color: #111">
                      <template v-for="note in calendarNotesForCalendar[dayPrice.date]">{{note.title}}</template>
                    </span>
                    <!-- Price -->
                    <span class="calendarEventSpan" v-if="Object.keys(pricesArray).length === 0">{{ dayPrice.price | numberFormat }}</span>
                    <span class="calendarEventSpan" v-if="Object.keys(pricesArray).length > 0 && pricesArray[dayPeriod][dayPrice.date]">{{ pricesArray[dayPeriod][dayPrice.date].price | numberFormat }}</span>
                    <span class="calendarEventSpan" v-if="Object.keys(pricesArray).length > 0 && !pricesArray[dayPeriod][dayPrice.date] && defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason]">{{ defaultPricesData[dayPrice.date.substring(0, 4)][currentMonthSeason][dayPeriod][dayPrice.type] | numberFormat }}</span>
                  </div>
                </template>
              </calendar>
            </div>
            <div class="col-md-6 calendarPadding">

              <div id="infoText">
                <p class="card-text">
                  <span v-lang.pricesInfoText1></span> <br>
                  <span v-lang.pricesInfoText2></span> <br>
                  <span v-lang.pricesInfoText3></span>
                </p>
              </div>
              <div id="legend">
                <div class="legendBlock">
                  <div id="blueSquare"></div>
                  <p class="card-text"><span v-lang.selectedDays class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div id="greenSquare"></div>
                  <p class="card-text"><span v-lang.weekend class="legendText"></span></p>
                </div>
                <div class="legendBlock">
                  <div id="yellowSquare"></div>
                  <p class="card-text"><span v-lang.today class="legendText"></span></p>
                </div>
              </div>

              <button class="btn btn-warning btn-sm white mt20" @click="resetSelection()">
                <i class="fa fa-power-off buttonIcon"></i>
                <span v-lang.resetSelection></span>
              </button>

              <p class="infoRight" style="margin-bottom: 4px; margin-top: 20px;"><span v-lang.dayNightSelect></span></p>
              <div>
                <h4 class="card-text text-success">
                  <!--<span class="chooseDayNightTitle"> <span v-lang.dateSelect></span> </span>-->
                  <toggle-button v-if="language == 'en'" class="toggleDayNight" @change="changeDayPeriod" :labels="{checked: 'Night', unchecked: 'Day'}" :width="150" :height="40" :color="{checked: '#1E314F', unchecked: '#27D8E8'}"/>
                  <toggle-button v-if="language == 'tr'" class="toggleDayNight" @change="changeDayPeriod" :labels="{checked: 'Gece', unchecked: 'Gün'}" :width="150" :height="40" :color="{checked: '#1E314F', unchecked: '#27D8E8'}"/>
                </h4>
              </div>

              <p class="infoRight"><span v-lang.setPrice></span></p>

              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text"> ₺ </div>
                </div>
                <input type="number" class="form-control lightBordersFull" v-model.trim="currentPrice" :placeholder="labelPrice" :aria-label="labelPrice" aria-describedby="basic-addon1">
                <span class="input-group-btn">
                  <button class="btn btn-success white" type="button" @click="setPrice">
                    <i v-if="!showSpinner" class="fa fa-check buttonIcon"></i>
                    <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                    <span v-lang.set></span>
                  </button>
                </span>
              </div>

            </div>
          </div>

        </b-card>

      </tab-content>

    </form-wizard>

  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import Calendar from '../components/Calendar.vue'
  import Moment from 'moment'
  import { extendMoment } from 'moment-range'
  import Icon from 'vue-awesome/components/Icon'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import { setupDefaultPrices } from '../mixins/setupDefaultPrices'

  const moment = extendMoment(Moment)

  export default {

    components: { Calendar, Icon, FormWizard, TabContent },
    mixins: [setupDefaultPrices],

    data() {
      return {
        disabled: [],
        value: '',
        today: new Date(),
        date: '',
        dateBegin: '',
        dateEnd: '',
        events: [],
        format: 'yyyy-MM-dd',
        clear: true,
        currentPrice: 0,
        defaultPrice: 3000,
        currentPropertyId: '',
        currentProperty: {},
        placeholder: 'placeholder is displayed when value is null or empty',
        isDateBeginSelected: false,
        isRangeSelected: false,
        dayPeriod: 'day',
        datePeriodTouched: false,
        pricesArray: [],
        showDaySpinner: false,
        showNightSpinner: false,
        showAlertError: false,
        alertErrorMessage: '',
        dayEvents: [], // temp
        nightEvents: [], // temp
        propertiesFormatted: [],
        showSpinner: false,
        dateBeginFormatted: '',
        dateEndFormatted: '',
        lowSeasonArray: [],
        highSeasonArray: [],
        currentMonthSeason: '',
        currentMonth: '',
        defaultPricesData: {},
        daysSelected: [],
        labelPrice: '',
        yearCurrent: '',
        yearNext: '',
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      properties () {
        return store.getters.getProperties
      },
      pricesListFull () {
        return store.getters.getPricesList
      },
      user() {
        return store.getters.getUser
      },
      chooseProperty() {
        if (this.$language === 'en') {
          return 'Choose the property'
        } else if (this.$language === 'tr') {
          return 'Salon Seçin'
        }
      },
      setPrices() {
        if (this.$language === 'en') {
          return 'Set Prices'
        } else if (this.$language === 'tr') {
          return 'Fiyatla'
        }
      },
      calendarNotesForCalendar() {
        let notes = []
        store.state.calendarNotes.forEach(item => {
          notes[item.start_date] = []
          notes[item.start_date].push(item)
        })
        return notes
      },
    },

    router: router,

    created() {
      this.$language = this.language
      this.initLabels()
      // setup current month season
      let month = moment().month() + 1
      this.getCurrentMonthSeason(month)

      if (this.properties.length > 0) {
        this.currentProperty = {...this.properties[0]}
        this.currentPropertyId = this.currentProperty.id
        this.initPropertiesFormatted()
        this.date = this.today.getDate() + '/' + this.today.getMonth() + '/' + this.today.getFullYear()
        if (Object.keys(this.pricesListFull).length > 0) {
          this.pricesArray = this.pricesListFull[this.currentPropertyId]
        }
      }
      this.setupDefaultPrices(this.currentProperty)
    },

    methods: {
      initLabels() {
        if (this.language === 'tr') {
          this.labelPrice = 'Fiyat'
        } else if (this.language === 'en') {
          this.labelPrice = 'Price'
        }
      },
      calculateDayType(date) {
        let dayName = moment(date).format('dddd')
        let dayType

        if (dayName === 'Monday' || dayName === 'Tuesday' || dayName === 'Wednesday' || dayName === 'Thursday') {
          dayType = 'working_day'
        } else if (dayName === 'Friday') {
          dayType = 'friday'
        } else if (dayName === 'Saturday') {
          dayType = 'saturday'
        } else if (dayName === 'Sunday') {
          dayType = 'sunday'
        }
        return dayType
      },
      getCurrentMonthSeason(month) {
        if (this.lowSeasonArray.length > 0) {
          for (let i = 0; i < this.lowSeasonArray.length; i++) {
            if (month === this.lowSeasonArray[i]) {
              this.currentMonthSeason = 'low'
            }
          }
        }

        if (this.highSeasonArray.length > 0) {
          for (let i = 0; i < this.highSeasonArray.length; i++) {
            if (month === this.highSeasonArray[i]) {
              this.currentMonthSeason = 'high'
            }
          }
        }
      },
      initPropertiesFormatted() {
        let finalArray = []
        if (this.properties.length > 0) {
          for (let i = 0; i < this.properties.length; i++) {
            let property = {}
            property.value = this.properties[i].id
            property.text = this.properties[i].name
            finalArray.push(property)
          }
          this.propertiesFormatted = finalArray
        }
      },

      isDate (v) {
        if (v instanceof Date) {
          return true
        }
        return false
      },
      stringify (v) {
        if (!this.isDate(v)) return null
        return v.getFullYear() + '-' + this.filled(v.getMonth() * 1 + 1) + '-' + this.filled(v.getDate())
      },
      filled (v) {
        return String(v).replace(/^(\d)$/, '0$1')
      },

      onDayClick (date, dateFormatted) {
        let today = moment().format('YYYY-MM-DD')
        let isPastDate = moment(dateFormatted).isBefore(today)

        if (isPastDate) {
          if (this.$language === 'en') {
            this.$toasted.show('You have selected a past date', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Geçiş tarih seçtiniz!', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          let alreadyInArray = false

          for (let i = 0; i < this.daysSelected.length; i++) {
            if (this.daysSelected[i].date === dateFormatted) {
              alreadyInArray = true
            }
          }

          // If already in database - remove
          if (alreadyInArray) {
            this.daysSelected = this.daysSelected.filter(date => date.date !== dateFormatted)
          } else {
            // Otherwise add the array
            let dateObject = {date: dateFormatted}
            this.daysSelected.push(dateObject)
          }
        }
      },

      resetSelection() {
        this.daysSelected = []
      },

      changePane (year, month, pane) {
        this.currentMonth = month
        this.events = []
        this.events = this.getEventContent(year, month, pane)
      },

      getDayCount (year, month) {
        const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        if (month === 1) {
          if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            return 29
          }
        }
        return dict[month]
      },

      getEventContent (year, month, pane) {
        const data = []
        for (let p = 0; p < pane; p++) {
          let date = new Date(year, month + p)
          let monthCounts = this.getDayCount(date.getFullYear(), date.getMonth())

          // Getting current season
          this.getCurrentMonthSeason(month + 1)

          for (let i = 1; i <= monthCounts; i++) {
            let datePrice = this.stringify(new Date(year, month + p, i))
            // Retrieving day type
            let dayType = this.calculateDayType(datePrice)

            data.push({
              date: datePrice,
              content: this.defaultPrice,
              type: dayType
            })
          }
        }
        return data
      },

      setPrice() {
        this.showSpinner = true
        let dates = []

        for (let i = 0; i < this.daysSelected.length; i++) {
          let date = this.daysSelected[i].date
          dates.push(date)
        }

        let formData = {
          'dates': dates,
          'price': this.currentPrice,
          'property_id': this.currentProperty.id,
          'type': this.dayPeriod,
          'user_id': this.user.id,
        }

        this.$http.post(this.appApiPath + '/api/price_set', formData).then(response => {
          console.log('set prices response')
          console.log(response.body)

          this.showDaySpinner = false
          this.showNightSpinner = false
          this.showSpinner = false

          store.dispatch({
            type: 'setAppPricesList',
            pricesList: response.body.data.propertyPrices
          })
          this.$localStorage.set('pricesList', JSON.stringify(response.body.data.propertyPrices))
          // this.pricesListFull = response.body.propertyPrices

          this.pricesArray = {...this.pricesListFull[this.currentProperty.id]}

          // reset the selection
          this.daysSelected = []

          if (this.$language === 'en') {
            this.$toasted.show('The price has been succesfully set', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Yeni Fiyatlama Kayıt Edildi', {icon: 'fa-check-circle', type: 'success'})
          }

          this.resetSelection()
        }, response => {
          console.log('set prices error')
          console.log(response)

          this.showDaySpinner = false
          this.showNightSpinner = false
          this.showSpinner = false

          if (this.$language === 'en') {
            this.$toasted.show('Something went wrong while trying to set the price', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Rezervasyon yapılırken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
          }

          this.resetSelection()
        })
      },

      propertyChanged() {
        console.log('property changed')

        for (let i = 0; i < this.properties.length; i++) {
          if (this.properties[i].id === this.currentPropertyId) {
            this.currentProperty = {...this.properties[i]}
          }
        }

        this.lowSeasonArray = JSON.parse(this.currentProperty.low_season_months)
        this.highSeasonArray = JSON.parse(this.currentProperty.high_season_months)

        this.setupDefaultPrices(this.currentProperty)

        this.pricesArray = {...this.pricesListFull[this.currentPropertyId]}
      },

      changeDayPeriod() {
        if (this.dayPeriod === 'day') {
          this.dayPeriod = 'night'
        } else if (this.dayPeriod === 'night') {
          this.dayPeriod = 'day'
        }
      },

      validateFirstStep() {
        this.lowSeasonArray = JSON.parse(this.currentProperty.low_season_months)
        this.highSeasonArray = JSON.parse(this.currentProperty.high_season_months)
        this.events = this.getEventContent(this.today.getFullYear(), this.today.getMonth(), 1)

        if (Object.keys(this.currentProperty).length > 0) {
          return true
        } else {
          if (this.$language === 'en') {
            this.$toasted.show('Please select a property', {icon: 'fa-check-circle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Salon Seçiniz', {icon: 'fa-check-circle', type: 'error'})
          }
          return false
        }
      },
      validateSecondStep() {
        console.log('seco d step')
        return true
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

  .event-calendar {
    margin-top: 10px;
    margin-bottom: 20px;
    .datepicker-popup{
      z-index: 0;
    }
    .datepicker-body{
      .event{
        color: #E56700;
        margin-top: 8px;
      }
      /*.event:hover{
        background-color: transparent;
      }*/
      .low{
        color: red;
        font-weight: bold;
      }
      .calendarEventSpan {
        display: block;
        background-color: transparent;
      }
      .datepicker-monthRange span{
        width: 100px;
        height: 100px;
        vertical-align: middle;
        line-height: 100px;
        // font-weight: 600;
      }
    }
  }

  .toggleDayNight {
    font-size: 16px;
  }

  .chooseDayNightTitle {
    vertical-align: sub;
  }

  #legend {
    display: block;
    clear: left;
  }

  #blueSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(86,182,255,0.5);
    float: left;
  }

  #yellowSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(250,255,0,0.5);
    float: left;
  }

  #greenSquare {
    width: 30px;
    height: 30px;
    background-color: rgba(193, 255, 203, 0.4);
    float: left;
  }

  .legendBlock {
    display: inline-block;
    float: left;
    width: 130px;
    margin-right: 10px;
    margin-top: 14px;
  }

  .legendText {
    font-weight: 300;
    font-size: 0.8rem;
    color: #777;
    vertical-align: sub;
    margin-left: 5px;
  }

  #infoText {
    display: block;
    clear: left;
    font-weight: 300;
    font-size: 0.8rem;
    color: #777;
    margin-top: 8px;
  }

  .infoRight {
    color: #777;
    font-weight: 300;
    font-size: 0.9rem;
    margin-top: 12px;
    margin-bottom: 8px;
  }

  .vue-form-wizard .wizard-tab-content {
    padding: 19px 20px 10px;
  }




</style>
