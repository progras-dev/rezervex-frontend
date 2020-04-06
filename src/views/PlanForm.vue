<template>
  <div class="animated fadeIn">

    <b-card>

      <div class="col-md-12 pageTitleRowInCard bookingPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle pb-3" v-if="planFormType === 'add'">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            <span v-lang.planAdd></span>
          </span>
          <span class="white pageTitle pb-3" v-if="planFormType === 'edit'">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
            <span v-lang.planEdit></span>
          </span>
        </div>
      </div>

      <form>

        <div class="form-group">
          <label for="inputName"> <span v-lang.planName></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-bookmark iconColor"></i></span>
            <input class="form-control" :class="{'is-invalid': $v.planName.$error}" placeholder="Plan Name" id="planName" v-model="planName" @input="$v.planName.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planName.required && $v.planName.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.maxUsers></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-users iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planMaxUsers.$error}" placeholder="Max users" id="planMaxUsers" v-model="planMaxUsers" @input="$v.planMaxUsers.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planMaxUsers.required && $v.planMaxUsers.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.maxProperties></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-building iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planMaxProperties.$error}" placeholder="Max properties" id="planMaxProperties" v-model="planMaxProperties" @input="$v.planMaxProperties.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planMaxProperties.required && $v.planMaxProperties.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.monthlyBilling></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planMonthlyBilling.$error}" placeholder="Monthly billing" id="planMonthlyBilling" v-model="planMonthlyBilling" @input="$v.planMonthlyBilling.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planMonthlyBilling.required && $v.planMonthlyBilling.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.yearlyBilling></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planYearlyBilling.$error}" placeholder="Yearly billing" id="planYearlyBilling" v-model="planYearlyBilling" @input="$v.planYearlyBilling.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planYearlyBilling.required && $v.planYearlyBilling.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.totalDaysFreeTrial></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-calendar iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planDaysFreeTrial.$error}" placeholder="Total days free trial" id="planDaysFreeTrial" v-model="planDaysFreeTrial" @input="$v.planDaysFreeTrial.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planDaysFreeTrial.required && $v.planDaysFreeTrial.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.totalSmsIncluded></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-mobile-alt iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planTotalSms.$error}" placeholder="Total days free trial" id="planTotalSms" v-model="planTotalSms" @input="$v.planTotalSms.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planTotalSms.required && $v.planTotalSms.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"><span v-lang.totalEmailIncluded></span></label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
            <input class="form-control" type="number" :class="{'is-invalid': $v.planTotalEmails.$error}" placeholder="Total days free trial" id="planTotalEmails" v-model="planTotalEmails" @input="$v.planTotalEmails.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.planTotalEmails.required && $v.planTotalEmails.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group row" style="margin-top: 45px;">
          <div class="col-sm-3">
            <button v-if="planFormType === 'add'" type="submit" class="btn btn-lg btn-block btn-success white buttonMain" @click="createPlan($event)">
              <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
              <i class="fa fa-check-circle" v-if="!showSpinner"></i>
              <span v-lang.planCreate></span>
            </button>
            <button v-if="planFormType === 'edit'" type="submit" class="btn btn-success btn-lg btn-block white buttonMain" @click="updatePlan($event)">
              <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
              <i class="fa fa-check-circle" v-if="!showSpinner"></i>
              <span v-lang.planUpdate></span>
            </button>
          </div>
        </div>
        

      </form>

    </b-card>

  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'
  import { required } from 'vuelidate/lib/validators'

  export default {
    router: router,
    mixins: [labels],
    components: { Icon },

    data() {
      return {
        showSpinner: false,
        planName: '',
        planMaxUsers: 10,
        planMaxProperties: 10,
        planMonthlyBilling: 10,
        planYearlyBilling: 100,
        planDaysFreeTrial: 0,
        planTotalSms: 100,
        planTotalEmails: 100,
        planData: {}
      }
    },

    validations: {
      planName: {
        required
      },
      planMaxUsers: {
        required
      },
      planMaxProperties: {
        required
      },
      planMonthlyBilling: {
        required
      },
      planYearlyBilling: {
        required
      },
      planDaysFreeTrial: {
        required
      },
      planTotalSms: {
        required
      },
      planTotalEmails: {
        required
      },
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      planFormType() {
        return store.state.planFormType
      },
      currentPlan() {
        return store.state.currentPlan
      },
    },

    created () {
      this.$language = this.language
      console.log(this.planFormType)
      console.log(this.currentPlan)
      if (this.planFormType === 'edit') {
        this.initEditing()
      }
    },

    methods: {
      initEditing() {
        this.planData = this.currentPlan
        this.planName = this.planData.name
        this.planMaxUsers = this.planData.max_users
        this.planMaxProperties = this.planData.max_properties
        this.planMonthlyBilling = this.planData.monthly_billing
        this.planYearlyBilling = this.planData.yearly_billing
        this.planDaysFreeTrial = this.planData.days_free_trial
        this.planTotalSms = this.planData.total_sms
        this.planTotalEmails = this.planData.total_emails
      },
      updatePlan(event) {
        event.preventDefault()
        this.sendAPI('edit',`/api/plans/${this.planData.id}`)
      },
      createPlan(event) {
        event.preventDefault()
        this.sendAPI('add','/api/plan_add')
      },
      sendAPI(type, url) {
        if (this.$v.$invalid) {
          this.$v.planName.$touch()
          this.$v.planMaxUsers.$touch()
          this.$v.planMaxProperties.$touch()
          this.$v.planMonthlyBilling.$touch()
          this.$v.planYearlyBilling.$touch()
          this.$v.planDaysFreeTrial.$touch()
          this.$v.planTotalSms.$touch()
          this.$v.planTotalEmails.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinner = true

          let formData = {
            'plan_name': this.planName,
            'max_users': this.planMaxUsers,
            'max_properties': this.planMaxProperties,
            'monthly_billing': this.planMonthlyBilling,
            'yearly_billing': this.planYearlyBilling,
            'days_free_trial': this.planDaysFreeTrial,
            'total_sms': this.planTotalSms,
            'total_emails': this.planTotalEmails,
          }

          if (type === 'edit') {
            formData.id = this.planData.id
          }

          this.$http.post(this.appApiPath + url, formData)
            .then(response => {
              console.log('plan add response')
              console.log(response.body)
              this.showSpinner = false

              store.dispatch({
                type: 'setAppPlans',
                plans: response.body.plans
              })
              this.$localStorage.set('plans', JSON.stringify(response.body.plans))

              if (type === 'add') {
                router.push({ name: 'plans', params: { isAlert: true, alertType: 'create-success' } })
              } else if(type === 'edit') {
                router.push({ name: 'plans', params: { isAlert: true, alertType: 'update-success' } })
              }
              
            }, response => {
              console.log('plan add error')
              console.log(response)
              this.showSpinner = false
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
