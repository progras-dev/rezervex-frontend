<template>
  <div class="animated fadeIn">

    <b-card style="margin-top: 1rem">

      <div class="col-md-12 pageTitleRow bookingPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle mb30">
            <i class="fa fa-money" aria-hidden="true"></i>
            <span v-lang.paymentAdd></span>
          </span>
        </div>
      </div>


      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-money"></i>
              </div>
              <!--PAYMENT FORM BLOCK-->
              <div class="h3 text-success"><span v-lang.paymentAdd></span></div>
              <form>
                <div class="form-group">
                  <label for="inputName"><span v-lang.total></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                    <input type="number" class="form-control" :class="{'is-invalid': $v.currentPayment.$error}" :placeholder="labelTotal" id="inputName" v-model="currentPayment" @input="$v.currentPayment.$touch()" @blur="checkAmount()">
                  </div>
                  <div class="invalid-feedback" v-if="!$v.currentPayment.required && $v.currentPayment.$dirty">
                    <span v-lang.totalRequired></span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="inputDescription"><span v-lang.description></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                    <textarea rows="5" class="form-control lightBorders" v-model.trim="description" :placeholder="labelDescription" id="inputDescription"></textarea>
                  </div>
                </div>


                <div class="form-group row mt25">
                  <button type="submit" class="btn btn-success btn-lg btn-block white buttonAddPayment" :disabled="bookingData.total_cost - bookingData.advance <= 0" @click="paymentAdd($event)">
                    <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                    <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                    <span v-lang.paymentAdd></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!--BOOKING INFO BLOCK-->
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.bookingData></span></div>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.date></span>: {{ bookingData.date }} - {{ bookingData.type }} </p>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.client></span>: {{ bookingData.client_name }} </p>
              <!--<p class="card-text normalText200"> <span class="fontWeight300" v-lang.property></span>: {{ bookingData.property_name }} </p>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalGuests></span>: {{ bookingData.total_guests }} </p>-->
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalCost></span>: {{ bookingData.total_cost | numberFormat }}</p>
              <p class="card-text normalText200"> <span class="fontWeight300" v-lang.advance></span>: {{ bookingData.advance | numberFormat }}</p>
              <p class="card-text normalText200" :class="{'text-success': totalDue <= 0, 'orangeColor': totalDue > 0}"> <span v-lang.totalDue style="font-weight: 300"></span>: {{ totalDue | numberFormat }}</p>

              <div class="h3 text-success mt10"><span v-lang.payments></span></div>
              <ul>
                <li class="paymentBlock" v-for="(payment, index) in bookingPayments" :key="index">
                  {{ payment.total  | numberFormat }} <span class="paymentDescription">{{ payment.description }}</span> <br>
                  <span class="paymentDescription">{{ payment.dateFormatted }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>


    </b-card>

  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'
  import { updateBookingLists } from '../mixins/updateBookingLists'
  import { required } from 'vuelidate/lib/validators'
  import moment from 'moment'

  export default {
    router: router,
    mixins: [labels, updateBookingLists],
    components: { Icon },

    validations: {
      currentPayment: {
        required
      },
    },

    data() {
      return {
        showSpinner: false,
        currentPayment: '',
        description: '',
        bookingPayments: [],
        amountValidation: true
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      user() {
        return store.getters.getUser
      },
      bookingData() {
        return store.getters.getCurrentBooking
      },
      bookingListWithServices() {
        return store.getters.getBookingListWithServices
      },
      totalDue() {
        let totalDue = this.bookingData.total_cost - this.bookingData.advance - this.currentPayment
        if (totalDue > 0) {
          return totalDue
        } else {
          return 0
        }
      },
    },

    created () {
      this.$language = this.language
      // console.log('bookingData')
      // console.log(this.bookingData)
      this.initPayments()
    },

    methods: {
      initPayments() {
        let bookingPayments
        for (let i = 0; i < this.bookingListWithServices.length; i++) {
          if (this.bookingListWithServices[i].id === this.bookingData.id) {
            // Payments
            bookingPayments = this.bookingListWithServices[i].payments.map(item => ({...item}))
          }
        }

        for (let i = 0; i < bookingPayments.length; i++) {
          bookingPayments[i].dateFormatted = moment(bookingPayments[i].date).format('DD-MM-YYYY HH:MM')
        }

        this.bookingPayments = bookingPayments.map(item => ({...item}))
        console.log('bookingPayments')
        console.log(this.bookingPayments)
      },
      checkAmount() {
        console.log('currentPayment: ' + this.currentPayment)
        let totalDueBooking = this.bookingData.total_cost - this.bookingData.advance
        console.log({totalDueBooking})
        console.log(totalDueBooking - this.currentPayment)
        if (this.currentPayment <= 0) {
          if (this.language === 'en') {
            this.$toasted.show('The payment must be bigger than 0', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('The payment must be bigger than 0', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          this.currentPayment = 0
          this.amountValidation = false
        } else if (totalDueBooking - this.currentPayment < 0) {
          if (this.language === 'en') {
            this.$toasted.show('The payment cannot exceed the total due', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('The payment cannot exceed the total due', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          this.currentPayment = totalDueBooking
        }
      },
      paymentAdd(event) {
        event.preventDefault()
        if (this.$v.$invalid) {
          this.$v.currentPayment.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else if (this.amountValidation) {
          this.showSpinner = true

          let formData = {
            'total': this.currentPayment,
            'description': this.description,
            'booking_id': this.bookingData.id,
            'user_id': this.user.id
          }

          this.$http.post(this.appApiPath + '/api/payment_add', formData)
            .then(response => {
              console.log('payment_add response')
              console.log(response.body)

              this.showSpinner = false
              this.currentPayment = 0

              let bookingData = {...this.bookingData}
              bookingData.advance = response.body.data.booking.advance

              store.dispatch({
                type: 'setAppCurrentBooking',
                currentBooking: bookingData
              })
              this.$localStorage.set('currentBooking', JSON.stringify(bookingData))

              this.updateBookings(response)
              this.initPayments()

              if (this.$language === 'en') {
                this.$toasted.show('Booking succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Reservasyon başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
              }
              // router.push({name: 'bookingView', params: {isAlert: true, alertType: 'payment-create-success'}})
            }, response => {
              console.log('payment_add error')
              console.log(response)

              this.showSpinner = false
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .paymentBlock {
    margin-left: 8px;
    font-size: 1.3rem;
    font-weight: 300;
    line-height: 16px;
  }
  .paymentDescription {
    font-size: 0.9rem;
  }

  .buttonAddPayment {
    margin-left: 15px;
    margin-right: 15px;
  }
  .orangeColor {
    color: #FF851B;
  }

  .btn i {
    margin-right: 5px;
  }

</style>
