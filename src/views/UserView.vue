<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow usersPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-user" aria-hidden="true"></i>
          <span v-lang.userData></span>
        </span>
      </div>
    </div>

    <b-card>

      <div class="form-group row" v-if="!isSuperAdminDashboard">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToUserEdit($event)">
            <i class="fa fa-edit"></i>
            <span v-lang.editUser></span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-user"></i>
              </div>
              <div class="h3 text-success"><span v-lang.userData></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.name></span>: {{ user.first_name }} {{ user.last_name }}</p>
                <!--<p class="card-text normalText200"> <span class="fontWeight300" v-lang.address></span>: {{ user.address }}</p>-->
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>: {{ user.phone }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.email></span>: {{ user.email }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.country></span>: {{ user.country }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.city></span>: {{ user.city }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.address></span>: {{ user.address }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.zipCode></span>: {{ user.zip_code }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.documentId></span>: {{ user.document_id }} </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6" v-if="user.role === 'manager'">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-building"></i>
              </div>
              <div class="h3 text-success"><span v-lang.propertiesData></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.maxDiscount></span>: {{ user.max_discount }}% </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.minimumDeposit></span>: {{ user.minimum_deposit }}₺ </p>
              </div>

              <div class="h4 text-success mt25"><span v-lang.userProperties></span></div>
              <p class="card-text normalText200" v-for="property in userProperties" :key="property.id"> {{ property.name }} </p>
            </div>
          </div>
        </div>
        <div class="col-sm-6" v-if="user.role === 'admin'">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-building"></i>
              </div>
              <div class="h3 text-success"><span v-lang.companyData></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.companyTitle></span>: {{ user.company_title }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.brandTitle></span>: {{ user.brand_title }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.taxOffice></span>: {{ user.tax_office }} </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="isSuperAdminDashboard">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-credit-card"></i>
              </div>
              <div class="h3 text-success"><span v-lang.subscriptionData></span></div>

              <div class="h3 text-success"><span v-lang.plan></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.plan></span>: {{ user.plan.name }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.frequency></span>: {{ planFrequency }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.price></span>: {{ planPrice | numberFormat }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.maxUsers></span>: {{ user.plan.max_users }} </p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.maxProperties></span>: {{ user.plan.max_properties }} </p>
              </div>
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

  export default {
    router: router,
    components: {},
    data() {
      return {
        userProperties: [],
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
        return store.getters.getCurrentUser
      },
      properties() {
        return store.getters.getProperties
      },
      isSuperAdminDashboard() {
        return this.$route.path.slice(0,2) === '/s'
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
    },
    created () {
      this.$language = this.language

      let tempArray = []
      if (this.properties) {
        for (let i = 0; i < this.properties.length; i++) {
          if (this.user.properties) {
            for (let j = 0; j < this.user.properties.length; j++) {
              if (this.properties[i].id === this.user.properties[j].property_id) {
                const property = {...this.properties[i]}
                tempArray.push(property)
              }
            }
          }
        }
      }
      this.userProperties = tempArray.map(item => ({...item}))
    },
    methods: {
      goToUserEdit(event) {
        event.preventDefault()

        this.$localStorage.set('userFormType', 'edit')
        store.dispatch({
          type: 'setAppUserFormType',
          userFormType: 'edit'
        })

        this.$localStorage.set('currentUser', JSON.stringify(this.user))
        store.dispatch({
          type: 'setAppCurrentUser',
          currentUser: this.user
        })
        router.push({name: 'userForm'})
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
