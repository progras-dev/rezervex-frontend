<template>
  <div>

    <nav class="navbar navbar-dark bg-primary">
      <a class="navbar-brand" href="http://www.rezervex.com/"> <img src="../assets/img/logo.png" alt="" style="width: 96px;"> </a>
    </nav>

    <div v-if="view === 'register_form'">
      <div class="app flex-row align-items-center">
        <div class="container">
          <div class="justify-content-center">
            <form-wizard
              title=""
              subtitle=""
              color="#79C447"
              @on-change="updateTab"
              ref="wizard"
              :start-index.sync="stepIndex"
            >

              <!-- <button class="btn btn-success white confirmButton" slot="finish">
                <i v-if="!showSpinner" class="fa fa-check-circle buttonIcon"></i>
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon> -->
                <!--lang bug - don't change-->
                <!-- <span v-if="language === 'en'">Confirm registration</span>
                <span v-if="language === 'tr'">Kayıt Onaylama</span>
              </button> -->

              <button class="btn btn-success white confirmButton" slot="prev">
                <i class="fa fa-chevron-left buttonIcon"></i>
                <span v-lang.previous></span>
              </button>

              <button class="btn btn-success white confirmButton" slot="next">
                <span v-lang.next></span>
                <i class="fa fa-chevron-right buttonIcon"></i>
              </button>

              <!--TAB 1 - USER DATA-->
              <tab-content :title="userData" icon="fa fa-user" :before-change="validateUserTab">
                <b-card>

                  <div slot="header">
                    <span class="card-text text-success tab-title"><span v-lang.userData></span></span>
                  </div>

                  <form action="">
                    <div class="form-group">
                      <label for="inputName"><span v-lang.firstName></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                        <input id="inputName" class="form-control lightBorders" :placeholder="labelFirstName" v-model="firstName" @input="$v.firstName.$touch()" :class="{'is-invalid': !$v.firstName.required && (userTabSubmitted || $v.firstName.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.firstName.required && userTabSubmitted">
                        <span v-lang.firstNameRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputLastName"><span v-lang.lastName></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
                        <input id="inputLastName" class="form-control lightBorders" :placeholder="labelLastName" v-model="lastName" @input="$v.lastName.$touch()" :class="{'is-invalid': !$v.lastName.required && (userTabSubmitted || $v.lastName.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.lastName.required && userTabSubmitted">
                        <span v-lang.lastNameRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputEmail"><span v-lang.email></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
                        <input
                          type="email"
                          id="inputEmail"
                          class="form-control lightBorders"
                          :placeholder="labelEmail"
                          v-model="email"
                          @input="emailValidate = false"
                          @blur="emailVerify"
                          :class="{'is-invalid': (!$v.email.required || !$v.email.email || !emailIsUnique) && (userTabSubmitted || emailValidate)}"
                        >
                      </div>
                      <div class="invalid-feedback" v-if="!$v.email.required && (userTabSubmitted || emailValidate )">
                        <span v-lang.emailRequired></span>
                      </div>
                      <div class="invalid-feedback" v-if="!$v.email.email && $v.email.required && (userTabSubmitted || emailValidate )">
                        <span v-lang.emailValid></span>
                      </div>
                      <div class="invalid-feedback" v-if="!emailIsUnique && emailValidate && $v.email.required">
                        <span v-lang.emailAlreadyInUse></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputPassword"><span v-lang.password></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
                        <input type="password" id="inputPassword" class="form-control lightBorders" :placeholder="labelPassword" v-model.trim="password" @input="checkPasswordEqual" @blur="$v.password.$touch()" :class="{'is-invalid': (!$v.password.required || !$v.password.minLength) && (userTabSubmitted || $v.password.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.password.required && (userTabSubmitted || $v.password.$error)">
                        <span v-lang.passwordRequired></span>
                      </div>
                      <div class="invalid-feedback" v-if="!$v.password.minLength && (userTabSubmitted || $v.password.$error)">
                        <span v-lang.passwordLengthMin6></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputPasswordConfirm"><span v-lang.passwordConfirmation></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
                        <input type="password" id="inputPasswordConfirm" class="form-control lightBorders" :placeholder="labelPasswordConfirmation" v-model.trim="passwordConfirmation" @input="checkPasswordEqual" :class="{'is-invalid': (!$v.passwordConfirmation.required || passwordNotEqual) && userTabSubmitted}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.passwordConfirmation.required && userTabSubmitted">
                        <span v-lang.passwordConfirmationRequired></span>
                      </div>
                      <div class="invalid-feedback" v-if="passwordNotEqual && userTabSubmitted">
                        <span v-lang.passwordConfirmationEqual></span>
                      </div>
                    </div>

                  </form>
                </b-card>
              </tab-content>

              <!--TAB 2 - ADDRESS -->
              <tab-content :title="addressTitle" icon="fa fa-map-marker-alt" :before-change="validateAddressTab">
                <b-card>

                  <div slot="header">
                    <span class="card-text text-success tab-title"><span v-lang.address></span></span>
                  </div>

                  <form action="">

                    <div class="form-group">
                      <label for="inputName"><span v-lang.companyTitle></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                        <input id="company-title" class="form-control lightBorders" :placeholder="labelCompanyTitle" v-model="companyTitle">
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.brandTitle></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
                        <input id="brand-title" class="form-control lightBorders" :placeholder="labelBrandTitle" v-model="brandTitle">
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputPhone"><span v-lang.phone></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
                        <div class="input-group-prepend">
                          <span class="input-group-text" id="basic-addon1">{{selectedCountry.dial_code}}</span>
                        </div>
                        <input id="inputPhone" class="form-control lightBorders" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" v-model="phone" @input="$v.phone.$touch()" :class="{'is-invalid': !$v.phone.required && (addressTabSubmitted || $v.phone.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.phone.required && addressTabSubmitted">
                        <span v-lang.phoneRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.country></span></label>
                      <div class="input-group">
                        <div class="input-group-addon mt3"><i class="fa fa-2x fa-globe-americas iconColor"></i></div>
                        <v-select v-model="selectedCountry" class="country-select" :options="countries" @input="countrySelectOnChange"></v-select>
                      </div>
                      <div class="invalid-feedback" v-if="showCountryError">
                        <span v-lang.countryRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.city></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-signs iconColor"></i></span>
                        <input id="city" class="form-control lightBorders" :placeholder="labelCity" v-model="city" @input="$v.city.$touch()" :class="{'is-invalid': !$v.city.required && (addressTabSubmitted || $v.city.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.city.required && addressTabSubmitted">
                        <span v-lang.cityRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.address></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marker-alt iconColor"></i></span>
                        <input id="address" class="form-control lightBorders" :placeholder="labelAddress" v-model="address" @input="$v.address.$touch()" :class="{'is-invalid': !$v.address.required && (addressTabSubmitted || $v.address.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.address.required && addressTabSubmitted">
                        <span v-lang.addressRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.zipCode></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marked-alt iconColor"></i></span>
                        <input id="zipCode" class="form-control lightBorders" :placeholder="labelZipCode" v-model="zipCode" @input="$v.zipCode.$touch()" :class="{'is-invalid': !$v.zipCode.required && (addressTabSubmitted || $v.zipCode.$error)}">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.zipCode.required && addressTabSubmitted">
                        <span v-lang.zipCodeRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.documentId></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-id-card iconColor"></i></span>
                        <input 
                          type="number" 
                          id="documentId" 
                          class="form-control lightBorders" 
                          :placeholder="labelDocumentId" 
                          v-model="documentId"
                          maxlength="11"
                          @blur="$v.documentId.$touch()"
                          oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                          :class="{'is-invalid': (!$v.documentId.required || !$v.documentId.minLength || !$v.documentId.maxLength) && (cardTabSubmitted || $v.documentId.$error)}"
                        />
                      </div>
                      <small class="form-text text-muted"> <span v-lang.requiredForPayment></span>  </small>
                      <div class="invalid-feedback" v-if="!$v.documentId.required && addressTabSubmitted">
                        <span v-lang.documentIdRequired></span>
                      </div>
                      <div class="invalid-feedback" v-if="!$v.documentId.minLength && addressTabSubmitted">
                        <span v-lang.lengthMin11></span>
                      </div>
                      <div class="invalid-feedback" v-if="!$v.documentId.maxLength && addressTabSubmitted">
                        <span v-lang.lengthMax11></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputName"><span v-lang.taxOffice></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-id-card iconColor"></i></span>
                        <input id="tax-office" class="form-control lightBorders" :placeholder="labelTaxOffice" v-model="taxOffice">
                      </div>
                    </div>

                  </form>

                </b-card>
              </tab-content>

              <!--TAB 3 - PLANS -->
              <tab-content :title="pricingTitle" icon="fa fa-columns" :before-change="validatePlansTab">
                <b-card>
                  <div slot="header">
                    <span class="card-text text-success tab-title"><span v-lang.pricing></span></span>
                  </div>
                  <div id="generic_price_table">
                  <section>
                    <div class="container">

                      <div>
                        <span class="payment-frequency mr-2"> <span v-lang.monthly></span> </span> 
                        <toggle-button 
                          class="toggleDayNight" 
                          @change="changePaymentFrequency" 
                          :width="70" 
                          :height="40" 
                          :color="{checked: '#2ECC71', unchecked: '#2ECC71'}"/> 
                        <span class="payment-frequency ml-2"> <span v-lang.yearly></span> </span> 
                      </div>

                      <!--BLOCK ROW START-->
                      <div class="row">
                        <div :class="planColumns" v-for="plan in plans" :key="plan.id">

                          <!--PRICE CONTENT START-->
                          <div class="generic_content clearfix" :class="{'active': activePlan.reference_code === plan.reference_code}" @click="planSelect(plan)">

                            <!--HEAD PRICE DETAIL START-->
                            <div class="generic_head_price clearfix">

                              <!--HEAD CONTENT START-->
                              <div class="generic_head_content clearfix">

                                <!--HEAD START-->
                                <div class="head_bg"></div>
                                <div class="head">
                                  <h1>{{ plan.name }}</h1>
                                </div>
                                <!--//HEAD END-->

                              </div>
                              <!--//HEAD CONTENT END-->

                              <!--PRICE START-->
                              <div class="generic_price_tag clearfix" v-if="paymentFrequency === 'monthly'">
                                <span class="price">
                                  <span class="sign">₺</span>
                                  <span class="currency">{{ plan.monthly_billing | numberFormat }}</span>
                                  <span class="month">/<span v-lang.month></span></span>
                                </span>
                              </div>
                              <div class="generic_price_tag clearfix" v-if="paymentFrequency === 'yearly'">
                                <span class="price">
                                  <span class="sign">₺</span>
                                  <span class="currency">{{ plan.yearly_billing | numberFormat }}</span>
                                  <span class="month">/<span v-lang.year></span></span>
                                </span>
                              </div>
                              <!--//PRICE END-->

                            </div>
                            <!--//HEAD PRICE DETAIL END-->

                            <!--FEATURE LIST START-->
                            <div class="generic_feature_list">
                              <ul>
                                <li><span><i class="fa fa-user"></i></span>{{ plan.max_users }} <span v-lang.users></span></li>
                                <li><span><i class="fa fa-building"></i></span>{{ plan.max_properties }} <span v-lang.properties></span></li>
                                <li><span><i class="fa fa-mobile-alt"></i> </span>{{ plan.total_sms }} <span v-lang.smsIncluded></span></li>
                                <li><span><i class="fa fa-envelope"></i> </span>{{ plan.total_emails }} <span v-lang.emailsIncluded></span></li>
                                <li><span><i class="fa fa-calendar"></i> </span>{{ plan.days_free_trial }} <span v-lang.totalDaysFreeTrial></span></li>
                              </ul>
                            </div>
                            <!--//FEATURE LIST END-->

                            <!--BUTTON START-->
                            <div class="generic_price_btn clearfix">
                              <a class="" @click="planSelect(plan)"><span v-lang.select></span></a>
                            </div>
                            <!--//BUTTON END-->

                          </div>
                          <!--//PRICE CONTENT END-->

                        </div>
                      </div>
                      <!--//BLOCK ROW END-->

                    </div>
                  </section>
                </div>
                </b-card>
              </tab-content>

              <!--TAB 5 - CARD -->
              <tab-content :title="paymentDataTitle" icon="fa fa-credit-card" :before-change="validateCardTab">
                <b-card>
                  <div slot="header">
                    <span class="card-text text-success tab-title"><span v-lang.paymentData></span></span>
                  </div>

                  <div class="d-flex flex-center flex-column" v-if="showLoadingForm">
                    <icon name="spinner" class="iconSpinnerSuccess" pulse width="64" height="64"></icon>
                    <h3 class="loadingText">
                      <span v-lang.loadingSecureForm></span>
                    </h3>
                  </div>

                  <div class="d-flex flex-center flex-column" v-if="showErrorIyzipay">
                    <h3 class="text-danger">
                      <span v-if="language === 'tr'">Ödeme formu alınırken bir hata oluştu</span>
                      <span v-if="language === 'en'">An error occurred while retrieving the payment form</span>
                    </h3>
                  </div>

                  <div id = "iyzipay-checkout-form" class = "responsive"> </div>

                </b-card>
              </tab-content>
            </form-wizard>
          </div>
        </div>
      </div>
    </div>

    <div v-if="view === 'confirmation'">
      <div class="app flex-row align-items-center">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="card-group mb-4">
                <div class="card p-4">
                  <div class="card-body">
                    <h1 class="text-success confirmationMessage"> <i class="fa fa-check-circle fa-3x"></i> </h1>
                    <h2 class="text-success confirmationMessage">
                      <!--Bug fix don't change-->
                      <span v-if="language === 'tr'">Kayıt işlemi başarıyla gerçekleştirildi.</span>
                      <span v-if="language === 'en'">The registration has been successful</span>
                    </h2>
                    <p class="card-text lead confirmationMessage"> <span v-lang.registrationSuccessSubtitle></span> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  // import iyzipayForm from '../assets/iyzipay.html'
  // var iyziJSTag, iyziInit, iyziSubscriptionInit
  import store from '../vuex/store'
  import { mask } from 'vue-the-mask'
  import Icon from 'vue-awesome/components/Icon'
  import { required, email, minLength, maxLength } from 'vuelidate/lib/validators'
  import {FormWizard, TabContent} from 'vue-form-wizard'
  import 'vue-form-wizard/dist/vue-form-wizard.min.css'
  import vSelect from 'vue-select'
  // import Card from 'vue-credit-card/src/components/Card'
  import VueMonthlyPicker from 'vue-monthly-picker'
  import moment from 'moment'

  import { labels } from '../mixins/labels'
  import countries from '../_countries'

  export default {
    components: {FormWizard, TabContent, Icon, vSelect, VueMonthlyPicker},
    directives: { mask },
    data() {
      return {
        countries: [],
        initial: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        city: '',
        address: '',
        zipCode: '',
        phone: '',
        taxOffice: '',
        brandTitle: '',
        companyTitle: '',
        selectedCountry: {},
        documentId: '',
        showSpinner: false,
        showLoadingForm: false,
        showErrorIyzipay: false,
        userTabSubmitted: false,
        addressTabSubmitted: false,
        cardTabSubmitted: false,
        passwordNotEqual: false,
        emailValidate: false,
        emailIsUnique: false,
        view: 'register_form',
        stepIndex: 0,
        activePlan: {},
        showCountryError: false,
        // cardDetail: defaultProps,
        // showCardNameError: false,
        // showCardNumberError: false,
        // showCardExpiryError: false,
        // showCardCvcError: false,
        // creditCardNumberType: 'password',
        // creditCardCvcType: 'password',
        // showCreditCardNumber: false,
        // showCreditCardCvc: false,
        // showCreditCardValidationFailedAlert: false,
        // showCreditCardValidationUserDataFailed: false,
        selectedMonth: moment(),
        plans: [],
        paymentFrequency: 'monthly',
        iyzipayFormGenerated: false,
      }
    },
    mixins: [labels],
    validations: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      email: {
        required, email
      },
      phone: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      },
      passwordConfirmation: {
        required
      },
      city: {
        required
      },
      address: {
        required
      },
      documentId: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11)
      },
      zipCode: {
        required
      },
    },
    computed: {
      appApiPath() {
        return store.getters.getApiPath
      },
      language() {
        return store.getters.getLanguage
      },
      cardExpirationDate() {
        return moment(this.cardDetail.expiry).format('MM / YY')
      },
      planColumns() {
        switch (this.plans.length) {
          case 2:
            return 'col-md-6';
          case 3:
            return 'col-md-4';
          case 4:
            return 'col-md-3';
          default:
            return 'col-md-4';
        }
      },
      userData() {
        if (this.$language === 'en') {
          return 'User Info'
        } else if (this.$language === 'tr') {
          return 'Kullanıcı Bilgisi'
        }
      },
      addressTitle() {
        if (this.$language === 'en') {
          return 'Address'
        } else if (this.$language === 'tr') {
          return 'Adres'
        }
      },
      passwordTitle() {
        if (this.$language === 'en') {
          return 'Password'
        } else if (this.$language === 'tr') {
          return 'Şifre'
        }
      },
      pricingTitle() {
        if (this.$language === 'en') {
          return 'Pricing'
        } else if (this.$language === 'tr') {
          return 'Fiyatlandırma'
        }
      },
      paymentDataTitle() {
        if (this.$language === 'en') {
          return 'Payment Data'
        } else if (this.$language === 'tr') {
          return 'Ödeme Verileri'
        }
      },
      confirmationTitle() {
        if (this.$language === 'en') {
          return 'Confirmation'
        } else if (this.$language === 'tr') {
          return 'Onay Sekmesi'
        }
      },
    },

    created() {
      this.$language = this.language
      if (this.language === 'tr') {
        this.countries = countries.tr
        this.selectedCountry = {label: 'Türkiye', value: 'TR', dial_code: '+90'}
      } else if (this.language === 'en') {
        this.countries = countries.en
        this.selectedCountry = {label: 'Turkey', value: 'TR', dial_code: '+90'}
      }
      this.getPlans()
    },
    methods: {
      getIyzipayForm() {
        let formData = {
          'first_name': this.firstName,
          'last_name': this.lastName,
          'email': this.email,
          'phone_prefix': this.selectedCountry.dial_code,
          'phone': this.phone,
          'document_id': this.documentId,
          'password': this.password,
          'city': this.city,
          'address': this.address,
          'zip_code': this.zipCode,
          'country': this.selectedCountry.label,
          'plan_id': this.activePlan.id,
          'payment_frequency': this.paymentFrequency,
          'plan_reference_code': this.activePlan.reference_code,
          'plan_pricing_reference_code': this.activePlan.pricingReferenceCode,
          'plan_status': this.activePlan.status,
          'tax_office': this.taxOffice,
          'brand_title': this.brandTitle,
          'company_title': this.companyTitle,
        }

        this.$http.post(this.appApiPath + '/api/get_iyzipay_form', formData)
          .then(function (response) {
            console.log(response);
            let iyzipayResponseRawArray = response.body.form.split(/[:,]+/)
            console.log(iyzipayResponseRawArray)

           try {
              // find token position - then calculate index for other items
              let tokenIndex = iyzipayResponseRawArray.findIndex(item => item === 'token')
              console.log({tokenIndex})
              iyziInit.currency = iyzipayResponseRawArray[tokenIndex - 1].slice(1,-1)
              iyziInit.token = iyzipayResponseRawArray[tokenIndex + 1].slice(1,-1)
              iyziInit.price = Number(iyzipayResponseRawArray[tokenIndex + 3])
              iyziInit.locale = iyzipayResponseRawArray[tokenIndex + 5].slice(1,-1)

              // find buyerName position 
              let buyerNameIndex = iyzipayResponseRawArray.findIndex(item => item === 'buyerName')
              console.log({buyerNameIndex})
              iyziInit.buyerName = iyzipayResponseRawArray[buyerNameIndex + 1].slice(1,-1)
              iyziInit.buyerSurname = iyzipayResponseRawArray[buyerNameIndex + 3].slice(1,-1)

              // find gsmNumber position 
              let gsmNumberIndex = iyzipayResponseRawArray.findIndex(item => item === 'gsmNumber')
              console.log({gsmNumberIndex})
              iyziInit.gsmNumber = iyzipayResponseRawArray[gsmNumberIndex + 1].slice(1,-1)
              iyziInit.email = iyzipayResponseRawArray[gsmNumberIndex + 3].slice(1,-1)
              console.log({iyziInit})

              // find intervalCount position 
              let intervalCountIndex = iyzipayResponseRawArray.findIndex(item => item === 'intervalCount' || item.slice(1,-1) === 'intervalCount')
              console.log({intervalCountIndex})
              iyziSubscriptionInit.daysOfTrialPeriod = iyzipayResponseRawArray[intervalCountIndex - 1].slice(1,-1)
              iyziSubscriptionInit.intervalCount = iyzipayResponseRawArray[intervalCountIndex + 1].slice(1,-1)
              iyziSubscriptionInit.subscriptionState = iyzipayResponseRawArray[intervalCountIndex + 3].slice(1,-1)
              iyziSubscriptionInit.interval = iyzipayResponseRawArray[intervalCountIndex + 5].slice(1,-1)
              iyziSubscriptionInit.pricingPlanPrice = iyzipayResponseRawArray[intervalCountIndex + 7].split('}}')[0].slice(1,-1)
              console.log({iyziSubscriptionInit});

              iyziInit.createTag();
              setTimeout(() => {
                this.showLoadingForm = false
                this.iyzipayFormGenerated = true
              }, 500);
            }
            catch(error) {
              console.log('an error occurred while setting up iyzipay global object')
              console.error(error);
              this.showLoadingForm = false
              this.showErrorIyzipay = true
            }
          })
          .catch(function (error) {
            console.log(error);
            this.showLoadingForm = false
            this.showErrorIyzipay = true
          })
      },
      changePaymentFrequency() {
        if (this.paymentFrequency === 'monthly') {
          this.paymentFrequency = 'yearly'
        } else if (this.paymentFrequency === 'yearly') {
          this.paymentFrequency = 'monthly'
        }
      },
      getPlans() {
        this.$http.get(this.appApiPath + '/api/plans')
          .then(function (response) {
            console.log(response);
            this.plans = response.body.plans.map(item => ({...item}))
            // init activePlan
            this.activePlan = {...this.plans[0]}
          })
          .catch(function (error) {
            console.log(error);
          })
      },
      // creditCardValidationAlertDismissed() {
      //   this.showCreditCardValidationFailedAlert = false;
      // },
      // creditCardValidationUserDataAlertDismissed() {
      //   this.showCreditCardValidationUserDataFailed = false;
      // },
      // toggleCreditCardNumberVisibility() {
      //   this.showCreditCardNumber = !this.showCreditCardNumber
      //   this.showCreditCardNumber ? this.creditCardNumberType = 'tel' : this.creditCardNumberType = 'password'
      // },
      // toggleCreditCardCvcVisibility() {
      //   this.showCreditCardCvc = !this.showCreditCardCvc
      //   this.showCreditCardCvc ? this.creditCardCvcType = 'tel' : this.creditCardCvcType = 'password'
      // },
      validateUserTab() {
        this.$v.firstName.$touch()
        this.$v.lastName.$touch()
        this.$v.email.$touch()
        this.$v.password.$touch()
        this.$v.passwordConfirmation.$touch()
        this.emailValidate = true
        this.userTabSubmitted = true

        if (!this.emailIsUnique || this.$v.firstName.$invalid || this.$v.lastName.$invalid || this.$v.email.$invalid || this.$v.password.$invalid || this.$v.passwordConfirmation.$invalid) {
          this.showSpinner = false
          return false
        } else if (this.password !== this.passwordConfirmation) {
          this.passwordNotEqual = true
        } else if (this.emailIsUnique && !this.$v.firstName.$invalid && !this.$v.lastName.$invalid && !this.$v.email.$invalid || !this.$v.password.$invalid && !this.$v.passwordConfirmation.$invalid) {
          // this.cardDetail.name = this.firstName + ' ' + this.lastName
          return true
        }
      },
      validateAddressTab() {
        this.$v.phone.$touch()
        this.$v.city.$touch()
        this.$v.address.$touch()
        this.$v.zipCode.$touch()
        this.$v.documentId.$touch()
        this.addressTabSubmitted = true

        if (!this.selectedCountry) {
          this.showCountryError = true
        }

        if (this.$v.phone.$invalid || this.$v.city.$invalid || this.$v.address.$invalid || this.$v.zipCode.$invalid || this.$v.documentId.$invalid || !this.selectedCountry) {
          this.showSpinner = false
          return false
        } else if (!this.$v.phone.$invalid && !this.$v.city.$invalid && !this.$v.address.$invalid && !this.$v.zipCode.$invalid && !this.$v.documentId.$invalid && this.selectedCountry) {
          this.showCountryError = false
          return true
        }
      },
      validatePlansTab() {
        if (this.paymentFrequency === 'monthly') {
          this.activePlan.pricingReferenceCode = this.activePlan.monthly_reference_code
        } else if (this.paymentFrequency === 'yearly') {
          this.activePlan.pricingReferenceCode = this.activePlan.yearly_reference_code
        }
        console.log(this.activePlan)
        if (!this.iyzipayFormGenerated) {
          this.showLoadingForm = true
          this.showErrorIyzipay = false
          this.getIyzipayForm()
        }
        return true
      },
      validateCardTab() {
        this.cardTabSubmitted = true

        // Check if credit card number is empty, is long less than 15 chars, is an integer
        if (this.cardDetail.number === null || this.cardDetail.number === '' || this.cardDetail.number.length < 15 || Number.isInteger(this.cardDetail.number)) {
          this.showCardNumberError = true
        } else {
          this.showCardNumberError = false
        }
        if (this.cardDetail.name === null || this.cardDetail.name === '') {
          this.showCardNameError = true
        } else {
          this.showCardNameError = false
        }
        if (this.cardDetail.expiry === null || this.cardDetail.expiry === '') {
          this.showCardExpiryError = true
        } else {
          this.showCardExpiryError = false
        }
        if (this.cardDetail.cvc === null || this.cardDetail.cvc === '') {
          this.showCardCvcError = true
        } else {
          this.showCardCvcError = false
        }

        if ( this.showCardNumberError || this.showCardNameError || this.showCardExpiryError || this.showCardCvcError) {
          return false
        } else {
          return true
        }  
      },
      planSelect(plan) {
        this.activePlan = {...plan}
      },
      countrySelectOnChange() {
        if (this.selectedCountry) {
          this.showCountryError = false
        } else {
          this.showCountryError = true
        }
      },
      updateTab() {
        this.showCreditCardValidationFailedAlert = false;
        this.showCreditCardValidationUserDataFailed = false;
      },
      checkPasswordEqual() {
        if (this.password === this.passwordConfirmation) {
          this.passwordNotEqual = false
        }
      },
      emailVerify () {
        this.$v.email.$touch()
        this.emailValidate = true
        this.emailIsUnique = true
        if (!this.$v.email.$invalid) {
          let formData = {
            'email': this.email,
          }
          this.$http.post(this.appApiPath + '/api/register_email_unique_verify', formData)
            .then(response => {
              if (response.body.data.user) {
                this.emailIsUnique = false
              } else {
                this.emailIsUnique = true
              }
            }, response => {
              console.log(response);
              this.showSpinner = false
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .card-text i {
    margin-right: 8px;
  }

  .summaryText {
    font-size: 1.1rem;
    font-weight: 200;
    line-height: 1.1rem;
  }
  /* ======================== */
  /*   Pricing table   	*/
  /* ========================	*/
  @import url(https://fonts.googleapis.com/css?family=Lato:400,100,100italic,300,300italic,400italic,700italic,700,900italic,900);
  @import url(https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,700,800,900);
  @import url(https://fonts.googleapis.com/css?family=Raleway:400,100,200,300,500,600,700,800,900);
  body{background-color:#eee;}

  #generic_price_table{
    // background-color: #f0eded;
  }

  /*PRICE COLOR CODE START*/
  #generic_price_table .generic_content{
    background-color: #fff;
  }

  #generic_price_table .generic_content .generic_head_price{
    background-color: #f6f6f6;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content .head_bg{
    border-color: #e4e4e4 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #e4e4e4;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content .head span{
    color: #525252;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .sign{
    color: #414141;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .currency{
    color: #414141;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .cent{
    color: #414141;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .month{
    color: #414141;
  }

  #generic_price_table .generic_content .generic_feature_list ul li{
    color: #a7a7a7;
  }

  #generic_price_table .generic_content .generic_feature_list ul li span{
    color: #414141;
  }
  #generic_price_table .generic_content .generic_feature_list ul li:hover{
    background-color: #E4E4E4;
    border-left: 5px solid #2ECC71;
  }

  #generic_price_table .generic_content .generic_price_btn a{
    border: 1px solid #2ECC71;
    color: #2ECC71;
  }

  #generic_price_table .generic_content.active .generic_head_price .generic_head_content .head_bg,
  #generic_price_table .generic_content:hover .generic_head_price .generic_head_content .head_bg{
    border-color: #2ECC71 rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) #2ECC71;
    color: #fff;
  }

  #generic_price_table .generic_content:hover .generic_head_price .generic_head_content .head span,
  #generic_price_table .generic_content.active .generic_head_price .generic_head_content .head span{
    color: #fff;
  }

  #generic_price_table .generic_content:hover .generic_price_btn a,
  #generic_price_table .generic_content.active .generic_price_btn a{
    background-color: #2ECC71;
    color: #fff;
  }
  #generic_price_table{
    margin: 20px 0 20px 0;
    font-family: 'Raleway', sans-serif;
  }
  .row .table{
    padding: 28px 0;
  }

  /*PRICE BODY CODE START*/

  #generic_price_table .generic_content{
    overflow: hidden;
    position: relative;
    text-align: center;
  }

  #generic_price_table .generic_content .generic_head_price {
    margin: 0 0 20px 0;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content{
    margin: 0 0 50px 0;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content .head_bg{
    border-style: solid;
    border-width: 90px 1411px 23px 399px;
    position: absolute;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content .head{
    padding-top: 40px;
    position: relative;
    z-index: 1;
  }

  #generic_price_table .generic_content .generic_head_price .generic_head_content .head span{
    font-family: "Raleway",sans-serif;
    font-size: 28px;
    font-weight: 400;
    letter-spacing: 2px;
    margin: 0;
    padding: 0;
    text-transform: uppercase;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag{
    padding: 0 0 20px;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price{
    display: block;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .sign{
    display: inline-block;
    font-family: "Lato",sans-serif;
    font-size: 28px;
    font-weight: 400;
    vertical-align: middle;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .currency{
    font-family: "Lato",sans-serif;
    font-size: 60px;
    font-weight: 300;
    letter-spacing: -2px;
    line-height: 60px;
    padding: 0;
    vertical-align: middle;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .price .cent{
    display: inline-block;
    font-family: "Lato",sans-serif;
    font-size: 24px;
    font-weight: 400;
    vertical-align: bottom;
  }

  #generic_price_table .generic_content .generic_head_price .generic_price_tag .month{
    font-family: "Lato",sans-serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 3px;
    vertical-align: bottom;
  }

  #generic_price_table .generic_content .generic_feature_list ul{
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #generic_price_table .generic_content .generic_feature_list ul li{
    font-family: "Lato",sans-serif;
    font-size: 18px;
    padding: 15px 0;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table .generic_content .generic_feature_list ul li:hover{
    transition: all 0.3s ease-in-out 0s;
    -moz-transition: all 0.3s ease-in-out 0s;
    -ms-transition: all 0.3s ease-in-out 0s;
    -o-transition: all 0.3s ease-in-out 0s;
    -webkit-transition: all 0.3s ease-in-out 0s;

  }
  #generic_price_table .generic_content .generic_feature_list ul li .fa{
    padding: 0 10px;
  }
  #generic_price_table .generic_content .generic_price_btn{
    margin: 20px 0 32px;
  }

  #generic_price_table .generic_content .generic_price_btn a{
    border-radius: 50px;
    -moz-border-radius: 50px;
    -ms-border-radius: 50px;
    -o-border-radius: 50px;
    -webkit-border-radius: 50px;
    display: inline-block;
    font-family: "Lato",sans-serif;
    font-size: 18px;
    outline: medium none;
    padding: 12px 30px;
    text-decoration: none;
    text-transform: uppercase;
  }

  #generic_price_table .generic_content,
  #generic_price_table .generic_content:hover,
  #generic_price_table .generic_content .generic_head_price .generic_head_content .head_bg,
  #generic_price_table .generic_content:hover .generic_head_price .generic_head_content .head_bg,
  #generic_price_table .generic_content .generic_head_price .generic_head_content .head h2,
  #generic_price_table .generic_content:hover .generic_head_price .generic_head_content .head h2,
  #generic_price_table .generic_content .price,
  #generic_price_table .generic_content:hover .price,
  #generic_price_table .generic_content .generic_price_btn a,
  #generic_price_table .generic_content:hover .generic_price_btn a{
    transition: all 0.3s ease-in-out 0s;
    -moz-transition: all 0.3s ease-in-out 0s;
    -ms-transition: all 0.3s ease-in-out 0s;
    -o-transition: all 0.3s ease-in-out 0s;
    -webkit-transition: all 0.3s ease-in-out 0s;
  }
  @media (max-width: 320px) {
  }

  @media (max-width: 767px) {
    #generic_price_table .generic_content{
      margin-bottom:75px;
    }
  }
  @media (min-width: 768px) and (max-width: 991px) {
    #generic_price_table .col-md-3{
      float:left;
      width:50%;
    }

    #generic_price_table .col-md-4{
      float:left;
      width:50%;
    }

    #generic_price_table .generic_content{
      margin-bottom:75px;
    }
  }
  @media (min-width: 992px) and (max-width: 1199px) {
  }
  @media (min-width: 1200px) {
  }
  #generic_price_table_home{
    font-family: 'Raleway', sans-serif;
  }

  .text-center h1,
  .text-center h1 a{
    color: #7885CB;
    font-size: 30px;
    font-weight: 300;
    text-decoration: none;
  }
  .demo-pic{
    margin: 0 auto;
  }
  .demo-pic:hover{
    opacity: 0.7;
  }

  #generic_price_table_home ul{
    margin: 0 auto;
    padding: 0;
    list-style: none;
    display: table;
  }
  #generic_price_table_home li{
    float: left;
  }
  #generic_price_table_home li + li{
    margin-left: 10px;
    padding-bottom: 10px;
  }
  #generic_price_table_home li a{
    display: block;
    width: 50px;
    height: 50px;
    font-size: 0px;
  }
  #generic_price_table_home .blue{
    background: #3498DB;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .emerald{
    background: #2ECC71;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .grey{
    background: #7F8C8D;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .midnight{
    background: #34495E;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .orange{
    background: #E67E22;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .purple{
    background: #9B59B6;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .red{
    background: #E74C3C;
    transition:all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .turquoise{
    background: #1ABC9C;
    transition: all 0.3s ease-in-out 0s;
  }

  #generic_price_table_home .blue:hover,
  #generic_price_table_home .emerald:hover,
  #generic_price_table_home .grey:hover,
  #generic_price_table_home .midnight:hover,
  #generic_price_table_home .orange:hover,
  #generic_price_table_home .purple:hover,
  #generic_price_table_home .red:hover,
  #generic_price_table_home .turquoise:hover{
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    transition: all 0.3s ease-in-out 0s;
  }
  #generic_price_table_home .divider{
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    padding: 20px;
  }
  #generic_price_table_home .divider span{
    width: 100%;
    display: table;
    height: 2px;
    background: #ddd;
    margin: 50px auto;
    line-height: 2px;
  }
  #generic_price_table_home .itemname{
    text-align: center;
    font-size: 50px ;
    padding: 50px 0 20px ;
    border-bottom: 1px solid #ddd;
    margin-bottom: 40px;
    text-decoration: none;
    font-weight: 300;
  }
  #generic_price_table_home .itemnametext{
    text-align: center;
    font-size: 20px;
    padding-top: 5px;
    text-transform: uppercase;
    display: inline-block;
  }
  #generic_price_table_home .footer{
    padding:40px 0;
  }

  .price-heading{
    text-align: center;
  }
  .price-heading h1{
    color: #666;
    margin: 0;
    padding: 0 0 50px 0;
  }
  .demo-button {
    background-color: #333333;
    color: #ffffff;
    display: table;
    font-size: 20px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 50px;
    outline-color: -moz-use-text-color;
    outline-style: none;
    outline-width: medium ;
    padding: 10px;
    text-align: center;
    text-transform: uppercase;
  }
  .bottom_btn{
    background-color: #333333;
    color: #ffffff;
    display: table;
    font-size: 28px;
    margin: 60px auto 20px;
    padding: 10px 25px;
    text-align: center;
    text-transform: uppercase;
  }
  .demo-button:hover{
    background-color: #666;
    color: #FFF;
    text-decoration:none;

  }
  .bottom_btn:hover{
    background-color: #666;
    color: #FFF;
    text-decoration:none;
  }

  // Icon inside credit card input
  .inner-addon {
    position: relative;
  }

  .inner-addon .iconEye {
    position: absolute;
    padding: 10px;
    pointer-events: none;
  }

  .right-addon .iconEye { right: 0px;}
  .right-addon input { padding-right: 30px; }

  // Country v-select
  .country-select {
    flex-grow: 1;
  }

  .tab-title {
    font-size: 1.8rem;
    font-weight: 400;
  }

  // Override card-header (tab title)
  .card-header {
    padding-top: 1.25rem;
    padding-bottom: 1rem;
  }

  .payment-frequency {
    font-size: 1.5rem;
  }

  .loadingText {
    color: #999;
  }
</style>

