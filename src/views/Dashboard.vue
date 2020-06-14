<template>
  <div class="animated fadeIn">

    <div class="row mt25">

      <!--PENDING PAYMENTS WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': paymentsPending === 0, 'bg-warning': paymentsPending > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-money"></i>
          </div>
          <div class="widgetNumber mb-0">{{ paymentsPending }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"> <span v-lang.pendingPayments></span> </small>
        </b-card>
      </div>

      <!--TOTAL RESERVATION WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': reservations.length === 0, 'bg-warning': reservations.length > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-pencil-square-o"></i>
          </div>
          <div class="widgetNumber mb-0">{{ reservations.length }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"> <span v-lang.totalReservations></span> </small>
        </b-card>
      </div>

      <!--BOOKING THIS MONTH WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': bookingsThisMonth === 0, 'bg-success': bookingsThisMonth > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-list"></i>
          </div>
          <div class="widgetNumber mb-0">{{  bookingsThisMonth }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"> <span v-lang.bookingsThisMonth></span> </small>
        </b-card>
      </div>

      <!--INCOME THIS MONTH WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': incomeThisMonth === 0, 'bg-success': incomeThisMonth > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-money"></i>
          </div>
          <div class="widgetMoneyTotal mb-0">{{ incomeThisMonth | numberFormat }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"><span v-lang.incomeThisMonth></span></small>
        </b-card>
      </div>

      <!--BOOKINGS PREVIOUS MONTH WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': bookingsPreviousMonth === 0, 'bg-success': bookingsPreviousMonth > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-clock-o"></i>
          </div>
          <div class="widgetNumber mb-0">{{  bookingsPreviousMonth }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"> <span v-lang.bookingsPreviousMonth></span> </small>
        </b-card>
      </div>

      <!--INCOME PREVIOUS MONTH WIDGET-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': incomePreviousMonth === 0, 'bg-success': incomePreviousMonth > 0 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-clock-o"></i>
          </div>
          <div class="widgetMoneyTotal mb-0">{{ incomePreviousMonth | numberFormat }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"><span v-lang.incomePreviousMonth></span></small>
        </b-card>
      </div>

      <!--EMAIL COUNTER-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': counter.email > 20, 'bg-warning': counter.email <= 20 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-envelope"></i>
          </div>
          <div class="widgetMoneyTotal mb-1">{{ counter.email }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"><span v-lang.emailRemaining></span></small>
        </b-card>
      </div>

      <!--SMS COUNTER-->
      <div class="col-sm-6 col-md-3">
        <b-card class="widget text-white" :class="{ 'bg-primary': counter.sms > 20, 'bg-warning': counter.sms <= 20 }">
          <div class="h1 text-muted text-right mb-4">
            <i class="fa fa-mobile-alt"></i>
          </div>
          <div class="widgetMoneyTotal mb-1">{{ counter.sms }}</div>
          <small class="text-muted text-uppercase font-weight-bold widgetDescription"><span v-lang.smsRemaining></span></small>
        </b-card>
      </div>
    </div>

    <!--CHART-->
    <div>
      <div class="labelContainer">
        <div id="rectangle"></div>
        <span class="labelText">{{ labels.totalBookings }}</span>
      </div>
      <chart :data="bookingsForComponent" :options="{responsive: true, maintainAspectRatio: false, legend: { display: false }}" :height="chartHeight"></chart>
    </div>

    <!--PENDING PAYMENTS TABLE-->
    <div class="card mt25">
      <div class="card-header">
        <span class="card-text text-success tableTabTitle"><span v-lang.pendingPayments></span></span>
        <span class="tableSubtitle"> <span v-lang.pendingPaymentsInfo></span> </span>
      </div>

      <div class="card-body">

        <div class="row">
          <div class="col-md-12">
            <b-table class="table-outline table-responsive-sm mb-0" hover
                     :items="currentItemsPayments"
                     :fields="tableFieldsPayments"
                     head-variant="light"
                     responsive="md"
                     v-if="currentItemsPayments.length > 0"
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
                  <span v-if="$language === 'tr'">Pending</span>
                  <span v-if="$language === 'en'">Pending</span>
                </span>
                <span class="badge badge-success" v-if="item.item.total_cost - item.item.advance === 0">
                  <span v-if="$language === 'tr'">Complete</span>
                  <span v-if="$language === 'en'">Complete</span>
                </span>
              </template>

              <template v-slot:cell(actions)="item">
                <b-button v-if="language === 'en'" variant="outline-info" @click="goToBookingView(item.item, $event)" v-b-tooltip.hover title="Go to booking page">
                  <i class="fa fa-search"></i>
                </b-button>
                <b-button v-if="language === 'tr'" variant="outline-info" @click="goToBookingView(item.item, $event)" v-b-tooltip.hover title="Rezervasyon sayfasına git">
                  <i class="fa fa-search"></i>
                </b-button>
                <b-button v-if="language === 'en' && item.item.total_cost - item.item.advance > 0" variant="outline-success" @click="goToAddPayment(item.item, $event)" v-b-tooltip.hover title="Ödeme Ekle">
                  <i class="fa fa-plus"></i>
                </b-button>
                <b-button v-if="language === 'tr' && item.item.total_cost - item.item.advance > 0" variant="outline-success" @click="goToAddPayment(item.item, $event)" v-b-tooltip.hover title="Add payment">
                  <i class="fa fa-plus"></i>
                </b-button>
              </template>

            </b-table>

            <p class="card-text lead noItemsShorter" v-if="currentItemsPayments.length === 0"> <span v-lang.noPendingPayments></span></p>

            <b-pagination v-if="showPaginationPayments" class="mt10" size="sm" :total-rows="totalItemsPayments" v-model="currentPagePayments" :per-page="itemsPerPagePayments" @input="updateCurrentItemsPayments()">
            </b-pagination>
          </div>
        </div>
      </div>
    </div>

    <!--EXPIRING RESERVATIONS TABLE-->
    <div class="card mt25">
      <div class="card-header">
        <span class="card-text text-success tableTabTitle"><span v-lang.expiringReservations></span></span>
        <span class="tableSubtitle"> <span v-lang.expiringReservationsInfo></span> </span>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-md-12">
            <b-table class="table-outline table-responsive-sm mb-0" hover
                     :items="currentItemsReservations"
                     :fields="tableFieldsReservations"
                     head-variant="light"
                     v-if="currentItemsReservations.length > 0"
            >

              <template v-slot:cell(property)="item">
                {{ item.item.property.name }}
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
                <b-button v-if="language === 'en'" variant="outline-info actionButton" @click="goToReservation(item.item, $event)" v-b-tooltip.hover title="Go To Details">
                  <i class="fa fa-search"></i>
                </b-button>
                <b-button v-if="language === 'tr'" variant="outline-info actionButton" @click="goToReservation(item.item, $event)" v-b-tooltip.hover title="Rezervasyon sayfasına git">
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

            <p class="card-text lead noItemsShorter" v-if="currentItemsReservations.length === 0"> <span v-lang.noExpiringReservations></span></p>

            <b-pagination v-if="showPaginationReservations" class="mt10" size="sm" :total-rows="totalItemsReservations" v-model="currentPageReservations" :per-page="itemsPerPageReservations" @input="updateCurrentItemsReservations()">
            </b-pagination>

          </div>
        </div>
      </div>
    </div>


    <!--COMPLETE PAYMENT MODAL-->
    <b-modal ref="modalCompletePayment" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.completePayment></span></h5>
      </template>
      <span v-lang.alertCompletePayment></span> {{ bookingSelected.price - bookingSelected.advance | numberFormat }} ?

      <template slot="modal-footer">
        <b-btn variant="default" @click="modalCompletePaymentOnClick('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="modalCompletePaymentOnClick('COMPLETE')">
          <span v-lang.confirm></span>
        </b-btn>
      </template>
    </b-modal>

    <!--REMOVE RESERVATION MODAL-->
    <b-modal ref="removeReservationModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.reservationRemoval></span></h5>
      </template>
      <span v-lang.alertReservationRemoveAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="modalReservationOnClick('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="modalReservationOnClick('REMOVE')">
          <span v-lang.removeReservation></span>
        </b-btn>
      </template>
    </b-modal>

    <!--RESERVATION CONTINUE MODAL-->
    <b-modal ref="continueReservationModal" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.reservationContinue></span></h5>
      </template>
      <span v-lang.alertReservationContinueAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="modalReservationOnClick('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="success" @click="modalReservationOnClick('CONTINUE')">
          <span v-lang.proceedWithBooking></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router'
  import store from '../vuex/store'
  import Chart from '../components/Chart'
  import moment from 'moment'
  import miniToastr from 'mini-toastr'
  import { updateBookingLists } from '../mixins/updateBookingLists'
  import { updateNotifications } from '../mixins/updateNotifications'
  import { updateReservations } from '../mixins/updateReservations'

  miniToastr.init()

  export default {
    components: { Chart },
    mixins: [updateBookingLists, updateNotifications, updateReservations],
    data() {
      return {
        // Graph data
        bookingsForComponent: [],
        firstTime: true,
        chartHeight: 400,
        // Widget data
        paymentsPending: 0,
        bookingsThisMonth: 0,
        bookingsPreviousMonth: 0,
        incomeThisMonth: 0,
        incomePreviousMonth: 0,
        // Payments table
        totalItemsPayments: 0,
        itemsPerPagePayments: 10,
        currentPagePayments: 1,
        currentItemsPayments: [],
        showPaginationPayments: false,
        bookingListPendingPayments: [],
        bookingSelected: {},
        // Reservation table
        reservationListScoped: [],
        totalItemsReservations: 0,
        itemsPerPageReservations: 10,
        currentPageReservations: 1,
        currentItemsReservations: [],
        showPaginationReservations: false,
        reservationToRemove: {},
        indexReservationToRemove: 0,
        reservationToContinue: {},
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      showWelcome() {
        return store.getters.getShowWelcome
      },
      user() {
        return store.getters.getUser
      },
      bookingListByDate() {
        return store.getters.getBookingListByDate
      },
      properties () {
        return store.getters.getProperties
      },
      bookingsForChart () {
        return store.getters.getBookingsForChart
      },
      labels () {
        return store.getters.getLabels
      },
      reservations () {
        return store.getters.getReservations
      },
      notifications () {
        return store.getters.getNotifications
      },
      counter () {
        return store.state.counter
      },
      tableFieldsPayments() {
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
              key: 'status',
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
              label: 'Status',
              class: ['text-center', 'propertiesTable'],
              key: 'status',
            },
            {
              label: 'İşlemler',
              class: ['text-center', 'propertiesTable'],
              key: 'actions',
            },
          ]
        }
      },
      tableFieldsReservations() {
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
      }
    },
    router: router,
    created() {
      this.$language = this.language
      this.getBookingsForComponent()
      this.initAlerts()
      this.getDataForWidgets()
      this.initDataForTables()

      // console.log('counter')
      // console.log(this.counter)
      // console.log('bookingsForChart')
      // console.log(this.bookingsForChart)
    },
    mounted() {
      if (this.showWelcome) {
        this.showWelcomeMessage()
      }
    },
    methods: {
      showWelcomeMessage() {
        let message, title
        if (this.language === 'en') {
          message = 'Welcome to Rezervex'
          title = 'Hello ' + this.user.first_name + '!'
        } else if (this.language === 'tr') {
          message = 'Rezervex\'e hoşgeldiniz'
          title = 'Merhaba ' + this.user.first_name + '!'
        }

        miniToastr.success(message, title, 4000)
        store.dispatch({
          type: 'setAppShowWelcome',
          showWelcome: false
        })
      },
      initDataForTables() {
        this.initBookings()
        this.initPaginationPayments()
        this.initReservations()
        this.initPaginationReservation()
      },
      initReservations() {
        this.reservationListScoped = []
        for (let i = 0; i < this.reservations.length; i++) {
          if (this.reservations[i].daysLeft < 2) {
            const reservation = {...this.reservations[i]}
            this.reservationListScoped.push(reservation)
          }
        }
      },
      initPaginationReservation() {
        this.totalItemsReservations = this.reservationListScoped.length
        this.currentItemsReservations = this.reservationListScoped.map(item => ({...item})).slice(0, this.itemsPerPageReservations)
        if (this.reservationListScoped.length > this.itemsPerPageReservations) {
          this.showPaginationReservations = true
        }
      },
      updateCurrentItemsReservations() {
        let indexBegin = (this.currentPageReservations - 1) * this.itemsPerPageReservations
        let indexEnd = indexBegin + this.itemsPerPageReservations
        this.currentItemsReservations = this.reservationListScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      },
      initBookings() {
        this.bookingListPendingPayments = []
        let counterPaymentsPending = 0
        for (let i = 0; i < this.bookingListByDate.length; i++) {
          let booking = {...this.bookingListByDate[i]}
          booking.dateFormatted = moment(booking.date).format('DD-MM-YYYY')
          if (!booking.deleted_at && booking.total_cost - booking.advance > 0) {
            this.bookingListPendingPayments.push(booking)
            counterPaymentsPending++
          }
        }
        this.paymentsPending = counterPaymentsPending
      },
      initPaginationPayments() {
        this.totalItemsPayments = this.bookingListPendingPayments.length
        this.currentItemsPayments = []
        this.currentItemsPayments = this.bookingListPendingPayments.map(item => ({...item})).slice(0, this.itemsPerPagePayments)
        if (this.bookingListPendingPayments.length > this.itemsPerPagePayments) {
          this.showPaginationPayments = true
        }
      },
      updateCurrentItemsPayments() {
        let indexBegin = (this.currentPagePayments - 1) * this.itemsPerPagePayments
        let indexEnd = indexBegin + this.itemsPerPagePayments
        this.currentItemsPayments = this.bookingListPendingPayments.map(item => ({...item})).slice(indexBegin, indexEnd)
      },
      getDataForWidgets() {
        this.getBookingsThisMonth()
        this.getBookingsPreviousMonth()
        this.getIncomeThisMonth()
        this.getIncomePreviousMonth()
      },
      getIncomePreviousMonth() {
        let total = 0
        let previousMonth = moment().subtract(1, 'month').month() + 1
        let previousYear = moment().subtract(1, 'year').year()

        this.bookingListByDate.map(item => {
          let bookingMonth = moment(item.date).month() + 1
          let bookingYear = moment(item.date).year()
          if (bookingMonth === previousMonth && bookingYear === previousYear) {
            let bookingIncome = 0
            if (item.total_refund) {
              bookingIncome = item.advance - item.total_refund
            } else if (item.advance) {
              bookingIncome = item.advance
            }
            total += bookingIncome
          }
        })
        this.incomePreviousMonth = total
      },
      getIncomeThisMonth() {
        let total = 0
        let currentMonth = moment().month() + 1
        let currentYear = moment().year()
        this.bookingListByDate.map(item => {
          let bookingMonth = moment(item.date).month() + 1
          let bookingYear = moment(item.date).year()

          if (bookingMonth === currentMonth && bookingYear === currentYear) {
            let bookingIncome = 0
            if (item.total_refund) {
              bookingIncome = item.advance - item.total_refund
            } else if (item.advance) {
              bookingIncome = item.advance
            }
            total += bookingIncome
          }
        })
        this.incomeThisMonth = total
      },
      getBookingsPreviousMonth() {
        let oneMonthAgo = moment().subtract(1, 'month')
        for (let i = 0; i < this.bookingsForChart.length; i++) {
          let month = moment(this.bookingsForChart[i].month.date.date).month() + 1
          let year = moment(this.bookingsForChart[i].month.date.date).year()
          let previousMonth = oneMonthAgo.month() + 1
          let previousYear = oneMonthAgo.year()
          if (month === previousMonth && year === previousYear) {
            this.bookingsPreviousMonth = this.bookingsForChart[i].totalBookings
          }
        }
      },
      getBookingsThisMonth() {
        console.warn('getBookingsThisMonth')
        console.log('bookingsForChart', this.bookingsForChart)
        for (let i = 0; i < this.bookingsForChart.length; i++) {
          let month = moment(this.bookingsForChart[i].month.date.date).month() + 1
          let year = moment(this.bookingsForChart[i].month.date.date).year()
          let currentMonth = moment().month() + 1
          let currentYear = moment().year()
          if (month === currentMonth && year === currentYear) {
            this.bookingsThisMonth = this.bookingsForChart[i].totalBookings
          }
        }
      },
      initAlerts() {
        if (this.$route.params.profileUpdateSuccess) {
          if (this.language === 'en') {
            this.$toasted.show('Profile succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Profil başarıyla güncellendi!', {icon: 'fa-check-circle', type: 'success'})
          }
        }

        if (this.$route.params.passwordUpdateSuccess) {
          if (this.language === 'en') {
            this.$toasted.show('Password succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Şifre başarıyla güncellendi!', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      },
      getBookingsForComponent() {
        let finalArray = []
        let totalBookings = []
        let dataObject = {}
        finalArray.datasets = []
        finalArray.labels = []

        if (this.bookingsForChart.length > 0) {
          for (let i = 0; i < this.bookingsForChart.length; i++) {
            const booking = this.bookingsForChart[i]['totalBookings']
            totalBookings.push(booking)
            let date = moment(this.bookingsForChart[i].month.date.date)
            let label = date.format('MMM') + ' ' + date.format('YY')
            finalArray.labels.push(label)
          }
        }
        dataObject.data = totalBookings
        dataObject.label = ''
        dataObject.backgroundColor = '#f87979'
        finalArray.datasets.push(dataObject)
        this.bookingsForComponent = finalArray
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
      openModalCompletePayment(booking, event) {
        event.preventDefault()
        this.$refs.modalCompletePayment.show()
        this.bookingSelected = {...booking}
      },
      modalCompletePaymentOnClick(btn) {
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
                this.$toasted.show('Booking payment successfully updated!', {icon: 'fa-check-circle', type: 'success'})
              }

              // Update booking lists in the store
              this.updateBookings(response)

              setTimeout(() => {
                // Refresh page items
                this.initBookings()
                this.initPaginationPayments()
              }, 1000)
            }, response => {
              console.log('booking update error')
              console.log(response)
              this.$toasted.show('Something went wrong when trying to update the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
            })
        }
      },
      openModalRemoveReservation(reservation, event) {
        event.preventDefault()
        this.reservationToRemove = reservation
        for (let i = 0; i < this.reservationListScoped.length; i++) {
          if (reservation.id === this.reservations[i].id) {
            this.indexReservationToRemove = i
          }
        }
        this.$refs.removeReservationModal.show()
      },
      modalReservationOnClick(btn) {
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

              this.updateReservations(this.reservationToRemove)
              this.updateNotifications(this.reservationToRemove)
              this.updateCurrentItemsReservations()

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
      goToReservation(reservation, event) {
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
      openModalContinueReservation(reservation, event) {
        event.preventDefault()
        this.reservationToContinue = {...reservation}
        this.$refs.continueReservationModal.show()
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

<style scoped lang="scss">
  .widgetNumber {
    font-size: 1.3rem;
  }
  .widgetMoneyTotal {
    font-size: 1.5rem;
  }
  .widgetDescription {
    font-size: 0.85rem;
  }
  .card.widget {
    height: 11rem;
  }
</style>
