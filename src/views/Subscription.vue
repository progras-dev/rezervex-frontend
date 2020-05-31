<template>
  <div class="animated fadeIn">

    <b-card style="margin-top: 1rem">

      <div class="col-md-12 pageTitleNoMargin settingsPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle mb30">
            <i class="fa fa-credit-card" aria-hidden="true"></i>
            <span v-lang.subscriptions></span>
          </span>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-columns"></i>
              </div>
              <div class="h3 text-success"><span v-lang.plan></span></div>
              <div>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.plan></span>: {{ user.plan.name }} </span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.frequency></span>: {{ planFrequency }}</span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.price></span>: {{ planPrice | numberFormat }} </span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.maxUsers></span>: {{ user.plan.max_users }} </span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.maxProperties></span>: {{ user.plan.max_properties }} </span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.subscriptionDate></span>: {{ planSubsciptionDate }} </span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.nextPayment></span>: {{ planNextPayment }} </span>
              </div>
              <button class="btn btn-info white mt-2 mr-2" @click="openModalChangePricing()">
                <i class="fa fa-exchange-alt"></i>
                <span v-lang.changePaymentFrequency></span>
              </button>
              <button class="btn btn-info white mt-2" @click="openModalChangePlan()">
                <i class="fa fa-exchange-alt"></i>
                <span v-lang.changePlan></span>
              </button>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list-alt"></i>
              </div>

              <!--CHANGE PLAN-->
              <!--<div class="h3 text-success"><span v-lang.changePlan></span></div>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-exchange-alt iconColor"></i></span>
                <v-select label="name" v-model="currentPlan" :options="plans"></v-select>
              </div>
              <button class="btn btn-primary white mt10" @click="selectPlan()">
                <icon name="spinner" pulse v-if="showSpinnerChangePlan"></icon>
                <i class="fa fa-exchange-alt" v-if="!showSpinnerChangePlan"></i>
                <span v-lang.changePlan></span>
              </button>-->

              <!--UNSUBSCRIBE-->
              <div class="h3 text-success mt20"><span v-lang.deleteSubscription></span></div>
              <div class="card-text">
                <button class="btn btn-danger white mt10" @click="openModalUnsuscribe()">
                  <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerUnsubscribe"></icon>
                  <i class="fa fa-minus-circle" v-if="!showSpinnerUnsubscribe"></i>
                  <span v-lang.unsubscribe></span>
                </button>
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
                <i class="fa fa-envelope"></i>
              </div>
              <div class="h3 text-success">Emails</div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="card-text textLine"> 
                    <span class="fontWeight300" v-lang.totalRemaining></span>: {{ counter.email }} 
                  </div>
                </div>
                <div class="col-sm-6">
                  <button class="btn btn-success white" @click="openModalEmailPackages()">
                    <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerUnsubscribe"></icon>
                    <i class="fa fa-plus" v-if="!showSpinnerUnsubscribe"></i>
                    <span v-lang.buyMoreEmails></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-mobile-alt"></i>
              </div>
              <div class="h3 text-success">SMS</div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="card-text textLine"> 
                    <span class="fontWeight300" v-lang.totalRemaining></span>: {{ counter.sms }} 
                  </div>
                </div>
                <div class="col-sm-6">
                  <button class="btn btn-success white" @click="openModalSmsPackages()">
                    <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerUnsubscribe"></icon>
                    <i class="fa fa-plus" v-if="!showSpinnerUnsubscribe"></i>
                    <span v-lang.buyMoreSms></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-dollar-sign"></i>
              </div>
              <div class="h3 text-success"><span v-lang.payments></span></div>
              <div>
                <ul>
                  <li class="card-text normalText200" v-for="(payment, index) in payments" :key="index">
                    <span v-lang.date class="fontWeight300"></span>: {{ payment.startPeriod }} - 
                    <span v-lang.total class="fontWeight300"></span>: {{ payment.price | numberFormat }} - 
                    <span v-lang.status class="fontWeight300"></span>: {{ payment.status }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    </b-card>

    <b-modal ref="unsuscribeModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.deleteSubscription></span></h5>
      </template>
      <span v-lang.alertUnsubscribe></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.unsuscribeModal.hide()">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" class="white" @click="unsubscribe()">
          <span v-lang.unsubscribe></span>
        </b-btn>
      </template>
    </b-modal>

    <b-modal ref="modalSmsPackages" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.smsPackages></span> </h5>
      </template>

      <h3 class="text-success" v-if="!modalShowCreditCardForm"> <span v-lang.choosePackage></span> </h3>
      <div class="row mt-1" v-if="!modalShowCreditCardForm">
        <div :class="emailPackageColumn" v-for="smsPackage in smsPackages" :key="smsPackage.id">
          <div class="card">

            <div class="card-block">
              <div class="h3 text-success">{{ smsPackage.name }}</div>
              <div>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.totalSms></span>: {{ smsPackage.total_items }}</span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.totalCost></span>: {{ smsPackage.total_cost | numberFormat }}</span>
              </div>
              <button class="btn btn-info btn-block white mt-2" @click="showCreditCardForm(smsPackage)">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerUnsubscribe"></icon>
                <i class="fa fa-check" v-if="!showSpinnerUnsubscribe"></i>
                <span v-lang.select></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card" v-if="modalShowCreditCardForm">
        <div class="card-block">
          <form action="">
            <div class="form-group">
              <label for="inputName"><span v-lang.cardFullName></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                <input name="name" id="cardName" class="form-control lightBorders" :placeholder="labelCardHolder" v-model="cardDetail.name" :class="{'is-invalid': showCardNameError}" @input="showCardNameError = false">
              </div>
              <div class="invalid-feedback" v-if="showCardNameError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardNumber></span></label>
              <div class="input-group inner-addon right-addon">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <input :type="creditCardNumberType" name="number" id="cardNumber" class="form-control lightBorders" :placeholder="labelCardNumber" v-model="cardDetail.number" maxlength="16" :class="{'is-invalid': showCardNumberError}" @input="showCardNumberError = false">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i :class="{'fa fa-eye': showCreditCardNumber, 'fas fa-eye-slash': !showCreditCardNumber}" @click="toggleCreditCardNumberVisibility"></i>
                  </span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="showCardNumberError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardExpiry></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <vue-monthly-picker inputClass="input" v-model="cardDetail.expiry"></vue-monthly-picker>
              </div>
              <div class="invalid-feedback" v-if="showCardExpiryError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardCvc></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <input name="cvc" id="cardCvc" :type="creditCardCvcType" class="form-control lightBorders" :placeholder="labelCardCvc" v-model="cardDetail.cvc" maxlength="4" :class="{'is-invalid': showCardCvcError}" @input="showCardCvcError = false">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i :class="{'fa fa-eye': showCreditCardCvc, 'fas fa-eye-slash': !showCreditCardCvc}" @click="toggleCreditCardCvcVisibility"></i>
                  </span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="showCardCvcError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <button class="btn btn-success btn-block white mt-2" @click.prevent="buyPackage()">
              <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerPurchase"></icon>
              <i class="fa fa-check" v-if="!showSpinnerPurchase"></i>
              <span v-lang.purchase></span>
            </button>
          </form>
        </div>
      </div>
      
      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalSmsPackages.hide()">
          <span v-lang.cancel></span>
        </b-btn>
      </template>
    </b-modal>

    <b-modal ref="modalEmailPackages" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.emailPackages></span> </h5>
      </template>

      <h3 class="text-success" v-if="!modalShowCreditCardForm"> <span v-lang.choosePackage></span> </h3>
      <div class="row mt-1" v-if="!modalShowCreditCardForm">
        <div :class="emailPackageColumn" v-for="emailPackage in emailPackages" :key="emailPackage.id">
          <div class="card">

            <div class="card-block">
              <div class="h3 text-success">{{ emailPackage.name }}</div>
              <div>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.totalEmails></span>: {{ emailPackage.total_items }}</span>
                <span class="card-text textLine"> <span class="fontWeight300" v-lang.totalCost></span>: {{ emailPackage.total_cost | numberFormat }}</span>
              </div>
              <button class="btn btn-info btn-block white mt-2" @click="showCreditCardForm(emailPackage)">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerUnsubscribe"></icon>
                <i class="fa fa-check" v-if="!showSpinnerUnsubscribe"></i>
                <span v-lang.select></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card" v-if="modalShowCreditCardForm">
        <div class="card-block">
          <form action="">
            <div class="form-group">
              <label for="inputName"><span v-lang.cardFullName></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                <input name="name" id="cardName" class="form-control lightBorders" :placeholder="labelCardHolder" v-model="cardDetail.name" :class="{'is-invalid': showCardNameError}" @input="showCardNameError = false">
              </div>
              <div class="invalid-feedback" v-if="showCardNameError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardNumber></span></label>
              <div class="input-group inner-addon right-addon">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <input :type="creditCardNumberType" name="number" id="cardNumber" class="form-control lightBorders" :placeholder="labelCardNumber" v-model="cardDetail.number" maxlength="16" :class="{'is-invalid': showCardNumberError}" @input="showCardNumberError = false">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i :class="{'fa fa-eye': showCreditCardNumber, 'fas fa-eye-slash': !showCreditCardNumber}" @click="toggleCreditCardNumberVisibility"></i>
                  </span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="showCardNumberError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardExpiry></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <vue-monthly-picker inputClass="input" v-model="cardDetail.expiry"></vue-monthly-picker>
              </div>
              <div class="invalid-feedback" v-if="showCardExpiryError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <div class="form-group">
              <label for="inputName"><span v-lang.cardCvc></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-credit-card iconColor"></i></span>
                <input name="cvc" id="cardCvc" :type="creditCardCvcType" class="form-control lightBorders" :placeholder="labelCardCvc" v-model="cardDetail.cvc" maxlength="4" :class="{'is-invalid': showCardCvcError}" @input="showCardCvcError = false">
                <div class="input-group-append">
                  <span class="input-group-text">
                    <i :class="{'fa fa-eye': showCreditCardCvc, 'fas fa-eye-slash': !showCreditCardCvc}" @click="toggleCreditCardCvcVisibility"></i>
                  </span>
                </div>
              </div>
              <div class="invalid-feedback" v-if="showCardCvcError">
                <span v-lang.fieldRequired></span>
              </div>
            </div>
            <button class="btn btn-success btn-block white mt-2" @click.prevent="buyPackage()">
              <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerPurchase"></icon>
              <i class="fa fa-check" v-if="!showSpinnerPurchase"></i>
              <span v-lang.purchase></span>
            </button>
          </form>
        </div>
      </div>
      
      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalEmailPackages.hide()">
          <span v-lang.cancel></span>
        </b-btn>
      </template>
    </b-modal>

    <b-modal ref="modalChangePricing" size="lg" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.changePaymentFrequency></span></h5>
      </template>

      <p> <span class="fontWeight300" v-lang.monthlyPricing></span>:  {{ user.plan.monthly_billing | numberFormat }}</p>
      <p> <span class="fontWeight300" v-lang.yearlyPricing></span>:  {{ user.plan.yearly_billing | numberFormat }}</p>
      <p> <span class="fontWeight300" v-lang.currentPaymentFrequency></span>:  {{ planFrequency }}</p>

      <template v-if="user.payment_frequency === 'monthly'">
        <button class="btn btn-success white" @click="switchToPricingFrequency('yearly')">
          <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerSwitchPaymentFrequency"></icon>
          <i class="fa fa-exchange-alt" v-if="!showSpinnerSwitchPaymentFrequency"></i>
          <span v-lang.switchToYearlyPayment></span>
        </button>
      </template>

      <template v-else-if="user.payment_frequency === 'yearly'">
        <button class="btn btn-success white" @click="switchToPricingFrequency('monthly')">
          <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerSwitchPaymentFrequency"></icon>
          <i class="fa fa-exchange-alt" v-if="!showSpinnerSwitchPaymentFrequency"></i>
          <span v-lang.switchToMonthlyPayment></span>
        </button>
      </template>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalChangePricing.hide()">
          <span v-lang.cancel></span>
        </b-btn>
      </template>
    </b-modal>

    <b-modal ref="modalChangePlan" size="lg" class="modal-success">
      <template slot="modal-header">
        <h5 class="modal-title">Change Plan</h5>
      </template>
      Choose the plan you prefer!
      <div class="row mt-1">
        <div :class="smsPackageColumn" v-for="plan in plans" :key="plan.id">
          <div class="card">
            <div class="card-block">
              <div class="h3 text-success">{{ plan.name }}</div>
              <ul class="plans-list">
                <li><span><i class="fa fa-user mr-1"></i></span>{{ plan.max_users }} <span v-lang.users></span></li>
                <li><span><i class="fa fa-building mr-1"></i></span>{{ plan.max_properties }} <span v-lang.properties></span></li>
                <li><span><i class="fa fa-mobile-alt mr-1"></i> </span>{{ plan.total_sms }} <span v-lang.smsIncluded></span></li>
                <li><span><i class="fa fa-envelope mr-1"></i> </span>{{ plan.total_emails }} <span v-lang.emailsIncluded></span></li>
                <li><span><i class="fa fa-calendar mr-1"></i> </span>{{ plan.days_free_trial }} <span v-lang.totalDaysFreeTrial></span></li>
              </ul>
              <button class="btn btn-success white mt-1" @click="selectPlan(plan)" v-if="plan.id !== user.plan.id">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerChangePlan"></icon>
                <i class="fa fa-exchange-alt" v-if="!showSpinnerChangePlan"></i>
                <span v-lang.switchToPlan></span>
              </button>
              <h3 class="text-success" v-if="plan.id === user.plan.id"> <span v-lang.currentPlan></span> </h3>
            </div>
          </div>
        </div>
      </div>
      
      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalChangePlan.hide()">
          <span v-lang.cancel></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'

  import moment from 'moment'
  import vSelect from 'vue-select'
  import VueMonthlyPicker from 'vue-monthly-picker'

  export default {
    components: {vSelect, Icon, VueMonthlyPicker},
    mixins: [labels],
    data() {
      return {
        showSpinnerUnsubscribe: false,
        showSpinnerChangePlan: false,
        showSpinnerPurchase: false,
        cardDetail: {
          number: '',
          name: '',
          expiry: moment(),
          cvc: ''
        },
        showCardNameError: false,
        showCardNumberError: false,
        showCardExpiryError: false,
        showCardCvcError: false,
        creditCardNumberType: 'password',
        creditCardCvcType: 'password',
        showCreditCardNumber: false,
        showCreditCardCvc: false,
        showCreditCardValidationFailedAlert: false,
        showCreditCardValidationUserDataFailed: false,
        modalShowCreditCardForm: false,
        packageToBuy: null,
        showSpinnerSwitchPaymentFrequency: false,
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
      planCreationDate() {
        return ''
        // return moment(this.user.subscriptions[0].created_at).format('DD-MM-YYYY')
      },
      nextPaymentDate() {
        return ''
        // return moment(this.user.subscriptions[0].next_charge_at).format('DD-MM-YYYY')
      },
      counter () {
        return store.state.counter
      },
      smsPackages() {
        return store.getters.getSmsPackages
      },
      emailPackages() {
        return store.getters.getEmailPackages
      },
      plans() {
        return store.state.plans
      },
      subscriptionData() {
        return store.state.subscriptionData
      },
      payments() {
        const orders = this.subscriptionData.orders.map(item => {
          let status = ''
          if (item.orderStatus === 'SUCCESS') {
            if (this.language === 'tr') {
              status = 'Başarı'
            } else if (this.language === 'en') {
              status = 'Success'
            }
          } else if (item.orderStatus === 'WAITING') {
            if (this.language === 'tr') {
              status = 'Bekleme'
            } else if (this.language === 'en') {
              status = 'Waiting'
            }
          }
          return {
            price: item.price,
            startPeriod: moment(item.startPeriod).lang('tr').format('DD  MMM  YYYY'),
            endPeriod: moment(item.endPeriod).lang('tr').format('DD  MMM  YYYY'),
            status: status,
          }
        })
        return orders
      },
      smsPackageColumn() {
        switch (this.smsPackages.length) {
          case 1:
            return 'col-sm-12';
          case 2:
            return 'col-sm-6';
          case 3:
            return 'col-sm-4';
          case 4:
            return 'col-sm-3';
          default:
            return 'col-sm-4';
        }
      },
      emailPackageColumn() {
        switch (this.emailPackages.length) {
          case 1:
            return 'col-sm-12';
          case 2:
            return 'col-sm-6';
          case 3:
            return 'col-sm-4';
          case 4:
            return 'col-sm-3';
          default:
            return 'col-sm-4';
        }
      },
      planFrequency() {
        if (this.user.payment_frequency === 'yearly') {
          if (this.language === 'tr') {
            return 'Yıllık'
          } else if (this.language === 'en') {
            return 'Yearly'
          }
        } else if (this.user.payment_frequency === 'monthly') {
          if (this.language === 'tr') {
            return 'Aylık'
          } else if (this.language === 'en') {
            return 'Monthly'
          }
        }
      },
      planPrice() {
        if (this.user.payment_frequency === 'yearly') {
          return this.user.plan.yearly_billing
        } else if (this.user.payment_frequency === 'monthly') {
          return this.user.plan.monthly_billing
        }
      },
      planSubsciptionDate() {
        return moment(this.subscriptionData.createdDate).lang('tr').format('DD  MMM  YYYY')
      },
      planNextPayment() {
        let dateRaw = this.subscriptionData.orders.find(item => item.orderStatus === 'WAITING').startPeriod
        return moment(dateRaw).lang('tr').format('DD  MMM  YYYY')
      },
    },
    created () {
      this.$language = this.language
      console.log('user', this.user)
      console.log('counter', this.counter)
      console.log('subscriptionData', this.subscriptionData)
      console.log('payments', this.payments)
    },
    methods: {
      switchToPricingFrequency(newPlan) {
        console.log({newPlan})
        this.showSpinnerSwitchPaymentFrequency = true

        let newPricingPlanReferenceCode = null
        if (this.user.payment_frequency === 'monthly') {
          newPricingPlanReferenceCode = this.user.plan.yearly_reference_code
        } else if (this.user.payment_frequency === 'yearly') {
          newPricingPlanReferenceCode = this.user.plan.monthly_reference_code
        }

        let formData = new FormData()
        formData.append('user_id', this.user.id)
        formData.append('new_pricing_plan_reference_code', newPricingPlanReferenceCode)

        this.$http.post(this.appApiPath + '/api/pricing_plan_update', formData)
          .then(response => {
            this.showSpinnerSwitchPaymentFrequency = false
            console.log('pricing_plan_update api error')
            console.log(response)
          }, response => {
            this.showSpinnerSwitchPaymentFrequency = false
            console.log('pricing_plan_update api error')
            console.log(response)
          })
      },
      creditCardValidationAlertDismissed() {
        this.showCreditCardValidationFailedAlert = false;
      },
      creditCardValidationUserDataAlertDismissed() {
        this.showCreditCardValidationUserDataFailed = false;
      },
      toggleCreditCardNumberVisibility() {
        this.showCreditCardNumber = !this.showCreditCardNumber
        this.showCreditCardNumber ? this.creditCardNumberType = 'tel' : this.creditCardNumberType = 'password'
      },
      toggleCreditCardCvcVisibility() {
        this.showCreditCardCvc = !this.showCreditCardCvc
        this.showCreditCardCvc ? this.creditCardCvcType = 'tel' : this.creditCardCvcType = 'password'
      },
      showCreditCardForm(packageToBuy) {
        console.log({packageToBuy})
        this.modalShowCreditCardForm = true
        this.packageToBuy = packageToBuy
      },
      buyPackage() {
        this.showSpinnerPurchase = true
        const formData = {
          package: this.packageToBuy,
          user: this.user,
          card: this.cardDetail,
          card_expiry_year: this.cardDetail.expiry.year(),
          card_expiry_month: this.cardDetail.expiry.month() + 1,
        }
        this.$http.post(this.appApiPath + '/api/package_buy', formData)
          .then(response => {
            this.showSpinnerPurchase = false
            console.log('package_buy api success')
            console.log(response.body)

            const newCounter = {
              sms: response.body.counter.sms_counter,
              email: response.body.counter.email_counter,
            }

            store.dispatch({
              type: 'setAppCounter',
              counter: newCounter
            })
            this.$localStorage.set('counter', JSON.stringify(newCounter))

            if (this.packageToBuy.type === 'email') {
              this.$refs.modalEmailPackages.hide()
              if (response.body.paymentId) {
                if (this.$language === 'en') {
                  this.$toasted.show('The payment was successful! The total of emails available has increased.', {icon: 'fa-check-circle', type: 'success'})
                } else if (this.$language === 'tr') {
                  this.$toasted.show('Ödeme başarılı, E-Posta gönderim sayınız güncellendi.', {icon: 'fa-check-circle', type: 'success'})
                }
              } else {
                this.showPackageErrorMessage()
              }
            } else if (this.packageToBuy.type === 'sms') {
              this.$refs.modalSmsPackages.hide()
              if (response.body.paymentId) {
                if (this.$language === 'en') {
                  this.$toasted.show('The payment was successful! The total of sms available has increased.', {icon: 'fa-check-circle', type: 'success'})
                } else if (this.$language === 'tr') {
                  this.$toasted.show('Ödeme başarılı, SMS gönderim sayınız güncellendi.', {icon: 'fa-check-circle', type: 'success'})
                }
              } else {
                this.showPackageErrorMessage()
              }
            }
            
          }, response => {
            this.showSpinnerPurchase = false
            console.log('package_buy api error')
            console.log(response)
            this.$refs.modalEmailPackages.hide()
            this.$refs.modalSmsPackages.hide()
            this.showPackageErrorMessage()
          })
      },
      showPackageErrorMessage() {
        if (this.$language === 'en') {
          this.$toasted.show('Something went wrong while processing the payment.', {icon: 'fa-exclamation-triangle', type: 'error'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Ödeme işleminde bir sorun oluştu.', {icon: 'fa-exclamation-triangle', type: 'error'})
        }
      },
      openModalChangePlan() {
        this.$refs.modalChangePlan.show()
      },
      openModalChangePricing() {
        this.$refs.modalChangePricing.show()
      },
      openModalSmsPackages() {
        this.modalShowCreditCardForm = false
        this.$refs.modalSmsPackages.show()
      },
      openModalEmailPackages() {
        this.modalShowCreditCardForm = false
        this.$refs.modalEmailPackages.show()
      },
      openModalUnsuscribe() {
        this.$refs.unsuscribeModal.show()
      },
      selectPlan(plan) {
        this.showSpinnerChangePlan = false
        const formData = {
          'user': this.user,
          plan
        }
        console.log(formData)
        this.$http.post(this.appApiPath + '/api/admin_plan_change', formData)
          .then(response => {
            console.log('admin_plan_change api success')
            console.log(response.body)
            this.showSpinnerChangePlan = false
          }, response => {
            this.showSpinnerChangePlan = false
            console.log('admin_plan_change api error')
            console.log(response)

            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong while trying to change plan', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Plan değiştirirken bir hata oluştu.', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      },
      unsubscribe() {
        console.log('unsubscribe')
        this.showSpinnerUnsubscribe = true
        this.$refs.unsuscribeModal.hide()
        let formData = {
          'user_id': this.user.id,
        }
        this.$http.post(this.appApiPath + '/api/admin_unsubscribe', formData)
          .then(response => {
            console.log('admin_unsubscribe api success')
            console.log(response.body)
            this.logout()
            this.showSpinnerUnsubscribe = false
          }, response => {
            this.showSpinnerUnsubscribe = false
            console.log('admin_unsubscribe api error')
            console.log(response)

            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong while trying to unsubscribe', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('İptal işleminde bir hata oluştu.', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      },
      logout() {
        // Update user data in store with authenticated = false
        let userData = {...this.user}
        userData.authenticated = false
        store.dispatch({
          type: 'setAppUser',
          user: userData
        })
        // this.$localStorage.clear()
        this.$localStorage.remove('user')
        // Redirect to login
        this.$router.push({name: 'Login'})
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .textLine {
    font-size: 1.3rem;
    font-weight: 200;
    display: block;
    line-height: 1.8rem;
  }

  .btn i {
    margin-right: 5px;
  }

  .plans-list {
    list-style: none;
    padding: 0;

    & li {
      padding-bottom: 0.5rem;
      font-size: 1rem;
    }
  }

</style>
