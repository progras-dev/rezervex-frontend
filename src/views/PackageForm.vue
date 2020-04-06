<template>
  <div class="animated fadeIn">

    <b-card>

      <div class="col-md-12 pageTitleRowInCard bookingPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle pb-3">
            <i class="fa fa-plus-circle" aria-hidden="true"></i>
           <span v-lang.packageAdd></span>
          </span>
        </div>
      </div>

      <form>

        <div class="form-group">
          <label for="inputName"> <span v-lang.packageType></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-box-open iconColor"></i></span>
            <v-select class="flex-fill" v-model="packageType" :options="typesListFormatted" :clearable="false" :searchable="false"></v-select>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.packageName></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-bookmark iconColor"></i></span>
            <input class="form-control" :class="{'is-invalid': $v.packageName.$error}" placeholder="Plan Name" id="packageName" v-model="packageName" @input="$v.packageName.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.packageName.required && $v.packageName.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.totalNumberItems></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-list-alt iconColor"></i></span>
            <input type="number" class="form-control" :class="{'is-invalid': $v.packageTotalItems.$error}" placeholder="Plan Name" id="packageTotalItems" v-model="packageTotalItems" @input="$v.packageTotalItems.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.packageTotalItems.required && $v.packageTotalItems.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputName"> <span v-lang.totalCost></span> </label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
            <input type="number" class="form-control" :class="{'is-invalid': $v.packageCost.$error}" placeholder="Plan Name" id="packageCost" v-model="packageCost" @input="$v.packageCost.$touch()">
          </div>
          <div class="invalid-feedback" v-if="!$v.packageCost.required && $v.packageCost.$dirty">
            <span v-lang.fieldRequired></span>
          </div>
        </div>
        

        <div class="form-group row" style="margin-top: 45px;">
          <div class="col-sm-3">
            <button type="submit" class="btn btn-lg btn-block btn-success white buttonMain" @click="createPlan($event)">
              <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
              <i class="fa fa-check-circle" v-if="!showSpinner"></i>
              <span v-lang.packageCreate></span>
            </button>
          </div>
        </div>
        

      </form>

    </b-card>

  </div>
</template>

<script>
  import vSelect from 'vue-select'
  import Icon from 'vue-awesome/components/Icon'
  import router from '../router/index.js'
  import store from '../vuex/store'
  import { labels } from '../mixins/labels'
  import { required } from 'vuelidate/lib/validators'

  export default {
    router: router,
    mixins: [labels],
    components: { Icon, vSelect },

    data() {
      return {
        showSpinner: false,
        packageName: '',
        packageTotalItems: 0,
        packageCost: 0,
        packageType: null,
        typesListFormatted: [
          {
            value: 'sms',
            label: 'Sms'
          },
          {
            value: 'email',
            label: 'Email'
          }
        ],
      }
    },

    validations: {
      packageName: {
        required
      },
      packageTotalItems: {
        required
      },
      packageCost: {
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
    },

    created () {
      this.$language = this.language
      this.packageType = {...this.typesListFormatted[0]};
    },

    methods: {
      createPlan(event) {
        event.preventDefault()

        if (this.$v.$invalid) {
          this.$v.packageName.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          console.log(this.packageName);
          console.log(this.packageTotalItems);
          console.log(this.packageCost);
          console.log(this.packageType.value);
          this.showSpinner = true

          let formData = {
            'type': this.packageType.value,
            'name': this.packageName,
            'total_items': this.packageTotalItems,
            'total_cost': this.packageCost,
          }

          this.$http.post(this.appApiPath + '/api/package_add', formData)
            .then(response => {
              console.log('package add response')
              console.log(response.body)
              this.showSpinner = false

              store.dispatch({
                type: 'setAppPackages',
                packages: response.body.packages
              })
              this.$localStorage.set('packages', JSON.stringify(response.body.packages))

              router.push({ name: 'packages', params: { isAlert: true, alertType: 'create-success' } })
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
