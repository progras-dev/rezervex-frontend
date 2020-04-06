<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow otherPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-chart-pie" aria-hidden="true"></i>
          <span v-lang.stats></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.statsSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <div class="row">
        <div class="col-md-6 col-sm-12">
          <h3 class="text-success"> <span v-lang.propertySelect></span> </h3>

          <div class="form-group" v-if="properties">
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
              <b-form-select id="b-form-select" v-model="currentPropertyId" :options="propertiesFormatted" @input="propertyChanged()">
              </b-form-select>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <h3 class="text-success"> <span v-lang.statsMonthYear></span> </h3>

          <div class="form-group" v-if="properties">
            <div class="input-group">
              <span class="input-group-addon mt3"><i class="fa fa-2x fa-calendar iconColor"></i></span>
              <vue-monthly-picker style="width: 88%" v-model="selectedMonth.fulldate" @monthChanged="monthChanged($event)" @yearChanged="yearChanged($event)">
              </vue-monthly-picker>
            </div>
          </div>
        </div>
      </div>


      <div class="row">
        <div class="col-md-12 mt-4 ml-0">
          <h3 class="fontWeight300"> 
            <span v-lang.propertySelected></span>: <span class="text-success mr-2">{{ currentProperty.name }} </span>
            <span class="mr-2">-</span>
            <span v-lang.periodSelected></span>:
            <span class="text-success" v-if="periodUntouched">{{ selectedYear }} </span>
            <span class="text-success" v-if="!periodUntouched && !isMonthSelected">{{ selectedYear }} </span>
            <span class="text-success" v-if="!periodUntouched && isMonthSelected">{{ selectedMonth.name }} {{ selectedYear }} </span>
          </h3>
        </div>
      </div>

      <div class="row" v-if="isYearSelected">

        <div class="col-sm-6">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-pencil-square-o bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ bookingYearCounter }}</div>
              <p class="text-uppercase font-weight-bold">
                <span v-lang.totalBookings class="normalText300"></span> <br>
                <span v-lang.period></span>:  <span class="text-success">{{ selectedYear }}</span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span>
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-money bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ totalIncomeYear | numberFormat }}</div>
              <p class="text-uppercase font-weight-bold">
                <span v-lang.totalIncome class="normalText300"></span> <br>
                <span v-lang.period></span>: <span class="text-success">{{ selectedYear }}</span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> 
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div class="row" v-if="isYearSelected">
        <div class="col-sm-6">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-line-chart bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0"><span v-if="percentageBookingsPreviousYear > 0">+</span> {{ percentageBookingsPreviousYear }} %</div>
              <p class="text-uppercase font-weight-bold">
                <span class="normalText300" v-lang.bookingsYearAmountComparision></span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> <br>
                (<span v-lang.bookingsPreviousYear></span>: <span class="text-info">{{ referenceYearBookings }}</span>)
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-line-chart bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ percentageGainPreviousYear }}</div>
              <p class="text-uppercase font-weight-bold">
                <span class="normalText300" v-lang.yearIncomeComparision></span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> <br>
                (<span v-lang.incomePreviousYear></span>: <span class="text-info">{{ referenceYearIncome }}</span>)
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div class="row">
        <div class="col-sm-6" v-if="isMonthSelected">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-pencil-square-o bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ bookingsMonthCounter }}</div>
              <p class="text-uppercase font-weight-bold">
                <span v-lang.totalBookings class="normalText300"></span> <br>
                <span v-lang.period></span>: <span class="text-success">{{ selectedMonth.name }} {{ selectedYear }}</span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span>
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6" v-if="isMonthSelected">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-money bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ totalIncomeMonth | numberFormat }}</div>
              <p class="text-uppercase font-weight-bold"> 
                <span v-lang.totalIncome class="normalText300"></span> <br>
                <span v-lang.period></span>: <span class="text-success"> {{ selectedMonth.name }} {{ selectedYear }}</span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> 
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="row">

        <div class="col-sm-6" v-if="isMonthSelected">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-line-chart bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0"> <span v-if="percentageBookingsPreviousMonth > 0">+</span> {{ percentageBookingsPreviousMonth }} %</div>
              <p class="text-uppercase font-weight-bold">
                <span v-lang.bookingsMonthAmountComparision class="normalText300"></span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> <br>
                (<span v-lang.bookingsPreviousMonth></span>: <span class="text-info">{{ referenceMonthBookings }}</span>)
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6" v-if="isMonthSelected">
          <div class="card card-inverse card-info">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-line-chart bg-primary p-1 font-2xl mr-1"></i>
              </div>
              <div class="h4 mb-0">{{ percentageGainPreviousMonth }}</div>
              <p class="text-uppercase font-weight-bold">
                <span v-lang.monthIncomeComparision class="normalText300"></span> <br>
                <span v-lang.property></span>: <span class="text-info">{{ currentProperty.name }}</span> <br>
                (<span v-lang.incomePreviousMonth></span>: <span class="text-info">{{ referenceMonthIncome | numberFormat }}</span>)
              </p>
              <div class="progress progress-white progress-xs mt-1">
                <div class="progress-bar" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </b-card>

  </div>
</template>

<script>
  import VueMonthlyPicker from '../components/VueMonthlyPicker'
  // import VueMonthlyPicker from 'vue-monthly-picker'
  import moment from 'moment'
  import store from '../vuex/store'

  export default {
    components: { VueMonthlyPicker },
    data() {
      return {
        currentProperty: {},
        selectedMonth: {},
        periodUntouched: true,
        isYearSelected: true,
        isMonthSelected: false,
        selectedYear: moment().year(),
        totalIncomeMonth: 0,
        bookingsMonthCounter: 0,
        totalIncomeYear: 0,
        bookingYearCounter: 0,
        bookingListByDateScoped: [],
        propertiesFormatted: [],
        currentPropertyId: 0,
        percentageGainPreviousYear: '',
        percentageGainPreviousMonth: '',
        percentageBookingsPreviousMonth: '',
        percentageBookingsPreviousYear: '',
        referenceYearBookings: 0,
        referenceYearIncome: 0,
        referenceMonthBookings: 0,
        referenceMonthIncome: 0,
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
    },
    created() {
      this.$language = this.language

      for (let i = 0; i < this.bookingListByDate.length; i++) {
        let booking = {...this.bookingListByDate[i]}
        this.bookingListByDateScoped.push(booking)
      }

      this.initProperties()
      this.updateYearStats()
    },

    methods: {
      initProperties() {
        for (let i = 0; i < this.properties.length; i++) {
          const property = {...this.properties[i]}
          this.propertiesFormatted.push(property)
        }

        for (let i = 0; i < this.propertiesFormatted.length; i++) {
          this.propertiesFormatted[i].text = this.propertiesFormatted[i].name
          this.propertiesFormatted[i].value = this.propertiesFormatted[i].id
        }

        let allProperty

        if (this.language === 'en') {
          allProperty = {
            text: 'All Properties',
            name: 'All Properties',
            value: 0,
            id: 0
          }
        } else if (this.language === 'tr') {
          allProperty = {
            text: 'Tüm Salonlar',
            name: 'Tüm Salonlar',
            value: 0,
            id: 0
          }
        }

        this.propertiesFormatted.splice(0, 0, allProperty)
        this.currentProperty = {...this.propertiesFormatted[0]}
        this.currentPropertyId = this.currentProperty.id
      },

      propertyChanged() {
        for (let i = 0; i < this.propertiesFormatted.length; i++) {
          if (this.propertiesFormatted[i].id === this.currentPropertyId) {
            this.currentProperty = {...this.propertiesFormatted[i]}
          }
        }

        if (this.isMonthSelected) {
          this.updateMonthStats()
        }

        if (this.isYearSelected) {
          this.updateYearStats()
        }
      },

      monthChanged(event) {
        this.periodUntouched = false
        this.isMonthSelected = true
        this.isYearSelected = false
        this.selectedMonth = {
          number: event[0],
          name: event[1],
        }

        this.selectedYear = event[2]

        this.updateMonthStats()
      },

      yearChanged(event) {
        this.periodUntouched = false
        this.isMonthSelected = false
        this.isYearSelected = true
        this.selectedYear = event[0]

        this.updateYearStats()
      },

      updateMonthStats() {
        let totalIncomeMonth = 0
        let bookingsMonthCounter = 0
        let bookingPreviousMonthCounter = 0
        this.bookingListByDateScoped = []
        let currentMonthNumber = Number(this.selectedMonth.number)
        let selectedYearNumber = Number(this.selectedYear)
        let referenceMonth
        let referenceYear = Number(this.selectedYear)
        let referenceMonthTotalIncome = 0

        // Check if selected date is in the future
        let currentYear = moment().year()
        let currentMonth = moment().month() + 1

        if (selectedYearNumber > currentYear) {
          this.percentageGainPreviousMonth = '0 %'
          console.log('future year')
          this.totalIncomeMonth = 0
          this.bookingsMonthCounter = 0
        } else if (selectedYearNumber === currentYear && currentMonthNumber > currentMonth) {
          this.percentageGainPreviousMonth = '0 %'
          console.log('future month')
          this.totalIncomeMonth = 0
          this.bookingsMonthCounter = 0
          if (currentMonthNumber > 1) {
            referenceMonth = currentMonthNumber - 1
          } else {
            referenceMonth = 12
            referenceYear--
          }
        } else {
          if (currentMonthNumber > 1) {
            referenceMonth = currentMonthNumber - 1
          } else {
            referenceMonth = 12
            referenceYear--
          }
        }

        // Get the booking related with the selected month
        for (let i = 0; i < this.bookingListByDate.length; i++) {
          let booking = {...this.bookingListByDate[i]}

          let bookingDate = moment(booking.date, 'YYYY-MM-DD')
          let bookingYear = bookingDate.year()
          let bookingMonth = Number(bookingDate.format('M'))

          if (this.currentPropertyId === 0) {
            if (bookingMonth === currentMonthNumber && bookingYear === selectedYearNumber) {
              this.bookingListByDateScoped.push(booking)

              if (booking.deleted_at) {
                totalIncomeMonth = totalIncomeMonth + (booking.advance - booking.total_refund)
              } else {
                totalIncomeMonth += booking.advance
                bookingsMonthCounter++
              }
            }

            if (referenceMonth === bookingMonth && referenceYear === bookingYear) {

              if (booking.deleted_at) {
                referenceMonthTotalIncome = referenceMonthTotalIncome + (booking.advance - booking.total_refund)
              } else {
                referenceMonthTotalIncome += booking.advance
                bookingPreviousMonthCounter++
              }
            }
          } else {
            if (bookingMonth === Number(this.selectedMonth.number) && bookingYear === Number(this.selectedYear) && booking.property_id === this.currentPropertyId) {
              this.bookingListByDateScoped.push(booking)

              if (booking.deleted_at) {
                totalIncomeMonth = totalIncomeMonth + (booking.advance - booking.total_refund)
              } else {
                totalIncomeMonth += booking.advance
                bookingsMonthCounter++
              }
            }

            if (referenceMonth === bookingMonth && referenceYear === bookingYear && booking.property_id === this.currentPropertyId) {

              if (booking.deleted_at) {
                referenceMonthTotalIncome = referenceMonthTotalIncome + (booking.advance - booking.total_refund)
              } else {
                referenceMonthTotalIncome += booking.advance
                bookingPreviousMonthCounter++
              }
            }
          }
        }
        this.totalIncomeMonth = totalIncomeMonth
        this.bookingsMonthCounter = bookingsMonthCounter
        this.referenceMonthBookings = bookingPreviousMonthCounter
        this.referenceMonthIncome = referenceMonthTotalIncome

        // Calculate percentage increase of amount of bookings
        let percentageBookings = 0
        if (bookingPreviousMonthCounter > 0) {
          percentageBookings = Math.round((bookingsMonthCounter - bookingPreviousMonthCounter) / bookingPreviousMonthCounter * 100)
        } else {
          percentageBookings = 0
          if (bookingsMonthCounter > 0 && bookingPreviousMonthCounter === 0) {
            percentageBookings = 100
          }
        }
        if (bookingsMonthCounter === bookingPreviousMonthCounter) {
          percentageBookings = 0
        }
        this.percentageBookingsPreviousMonth = percentageBookings

        // Calculate percentage increase
        let percentage
        if (totalIncomeMonth > referenceMonthTotalIncome) {
          let difference = totalIncomeMonth - referenceMonthTotalIncome
          percentage = (difference / totalIncomeMonth) * 100
        } else if (totalIncomeMonth < referenceMonthTotalIncome) {
          let difference = referenceMonthTotalIncome - totalIncomeMonth

          if (totalIncomeMonth === 0) {
            percentage = -100
          } else {
            percentage = (difference / referenceMonthTotalIncome) * 100
            percentage = percentage - (percentage * 2)
          }
        } else if (referenceMonthTotalIncome === totalIncomeMonth) {
          percentage = 0
        }

        percentage = Math.round(percentage * 100) / 100

        if (percentage > 0) {
          this.percentageGainPreviousMonth = '+ ' + percentage + ' %'
        } else {
          this.percentageGainPreviousMonth = percentage + ' %'
        }
      },

      updateYearStats() {
        let totalIncomeYear = 0
        let bookingYearCounter = 0
        let bookingReferenceYearCounter = 0
        this.bookingListByDateScoped = []
        let selectedYear = Number(this.selectedYear)
        let referenceYear = selectedYear - 1
        let referenceYearTotalIncome = 0

        for (let i = 0; i < this.bookingListByDate.length; i++) {
          let booking = {...this.bookingListByDate[i]}
          let bookingDate = moment(booking.date, 'YYYY-MM-DD')
          let bookingYear = bookingDate.year()
          
            if (this.currentProperty.id === 0) {
              if (bookingYear === selectedYear) {
                this.bookingListByDateScoped.push(booking)

                if (booking.deleted_at) {
                  totalIncomeYear = totalIncomeYear + (booking.advance - booking.total_refund)
                } else {
                  totalIncomeYear += booking.advance
                  bookingYearCounter++
                }
              }

              if (bookingYear === referenceYear) {
                if (booking.deleted_at) {
                  referenceYearTotalIncome = referenceYearTotalIncome + (booking.advance - booking.total_refund)
                } else {
                  referenceYearTotalIncome += booking.advance
                  bookingReferenceYearCounter++
                }
                
              }
            } else {
              if (bookingYear === selectedYear && booking.property_id === this.currentProperty.id) {
                this.bookingListByDateScoped.push(booking)

                if (booking.deleted_at) {
                  totalIncomeYear = totalIncomeYear + (booking.advance - booking.total_refund)
                } else {
                  totalIncomeYear += booking.advance
                  bookingYearCounter++
                }
              }

              if (bookingYear === referenceYear && booking.property_id === this.currentProperty.id) {
                if (booking.deleted_at) {
                  referenceYearTotalIncome = referenceYearTotalIncome + (booking.advance - booking.total_refund)
                } else {
                  referenceYearTotalIncome += booking.advance
                  bookingReferenceYearCounter++
                }
              }
            }
        }
        // }

        // Calculate percentage increase of amount of bookings
        let percentageBookings = 0
        if (bookingReferenceYearCounter > 0) {
          percentageBookings = Math.round((bookingYearCounter - bookingReferenceYearCounter) / bookingReferenceYearCounter * 100)
        } else {
          percentageBookings = 0
          if (bookingYearCounter > 0 && bookingReferenceYearCounter === 0) {
            percentageBookings = 100
          }
        }
        if (bookingYearCounter === bookingReferenceYearCounter) {
          percentageBookings = 0
        }
        this.percentageBookingsPreviousYear = percentageBookings
        this.referenceYearBookings = bookingReferenceYearCounter
        this.referenceYearIncome = referenceYearTotalIncome

        // Calculate percentage
        let percentage
        if (totalIncomeYear > referenceYearTotalIncome) {
          // console.log('positive')
          let difference = totalIncomeYear - referenceYearTotalIncome
          percentage = (difference / totalIncomeYear) * 100
        } else if (totalIncomeYear < referenceYearTotalIncome) {
          let difference = referenceYearTotalIncome - totalIncomeYear

          if (totalIncomeYear === 0) {
            percentage = -100
          } else {
            percentage = (difference / totalIncomeYear) * 100
            percentage = percentage - (percentage * 2)
          }
        }

        percentage = Math.round(percentage * 100) / 100

        if (!isNaN(percentage)) {
          if (percentage > 0) {
            this.percentageGainPreviousYear = '+ ' + percentage + ' %'
          } else {
            this.percentageGainPreviousYear = percentage + ' %'
          }
        } else {
          this.percentageGainPreviousYear = '0 %'
        }

        this.totalIncomeYear = totalIncomeYear
        this.bookingYearCounter = bookingYearCounter
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .periodSelectInfo {
    color: #666;
    margin-top: -8px;
  }

</style>




