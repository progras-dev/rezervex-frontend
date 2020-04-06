<template>
  <div class="animated fadeIn">

    <b-card style="margin-top: 1rem">

      <div class="col-md-12 pageTitleNoMargin settingsPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle">
            <i class="fa fa-user" aria-hidden="true"></i>
            <span v-lang.profileEdit></span>
          </span>
          <div class="white-text pageSubtitle"><span v-lang.profileEditInfo></span></div>
        </div>
      </div>

      <div class="form-group">
        <label for="inputName"><span v-lang.firstName></span></label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
          <input class="form-control" :class="{'is-invalid': $v.firstName.$error}" :placeholder="labelFirstName" id="inputName" v-model="firstName" @input="$v.firstName.$touch()">
        </div>
        <div class="invalid-feedback" v-if="!$v.firstName.required && $v.firstName.$dirty">
          <span v-lang.firstNameRequired></span>
        </div>
      </div>


      <div class="form-group">
        <label for="inputName2"><span v-lang.lastName></span></label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-user iconColor"></i></span>
          <input class="form-control" :class="{'is-invalid': $v.lastName.$error}" :placeholder="labelLastName" id="inputName2" v-model="lastName" @input="$v.lastName.$touch()">
        </div>
        <div class="invalid-feedback" v-if="!$v.lastName.required && $v.lastName.$dirty">
          <span v-lang.lastNameRequired></span>
        </div>
      </div>


      <div class="form-group">
        <label for="inputEmail"><span v-lang.email></span></label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
          <input type="text" class="form-control" :class="{'is-invalid': $v.email.$error}" :placeholder="labelEmail" id="inputEmail" v-model="email" @input="$v.email.$touch()">
        </div>
        <div class="invalid-feedback" v-if="!$v.email.required && $v.email.$dirty">
          <span v-lang.emailRequired></span>
        </div>
        <div class="invalid-feedback" v-if="!$v.email.email && $v.email.$dirty">
          <span v-lang.emailValid></span>
        </div>
      </div>


      <div class="form-group">
        <label for="inputAddress"><span v-lang.address></span></label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marker-alt iconColor"></i></span>
          <input class="form-control" :placeholder="labelAddress" id="inputAddress" v-model="userScoped.address">
        </div>
      </div>


      <div class="form-group">
        <label for="inputPhone"><span v-lang.phone></span></label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
          <input class="form-control" :placeholder="labelPhone" id="inputPhone" v-model="userScoped.phone">
        </div>
      </div>


      <div class="alert alert-danger" role="alert" v-if="$v.$invalid && formSubmitted">
        <i class="fa fa-exclamation-triangle"></i>
        <span v-lang.fillInRequiredFields></span>
      </div>

      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-success btn-lg btn-block buttonMain white" style="margin-left: 10px; margin-top: 10px" @click="profileUpdate($event)">
            <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
            <i class="fa fa-check-circle" v-if="!showSpinner"></i>
            <span v-lang.update></span>
          </button>
        </div>
      </div>

    </b-card>

  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import { required, email } from 'vuelidate/lib/validators'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'

  export default {
    router: router,
    mixins: [labels],
    components: { Icon },

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
    },

    data() {
      return {
        userScoped: {},
        showSpinner: false,
        formSubmitted: false,
        firstName: '',
        lastName: '',
        email: '',
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
      }
    },

    created () {
      console.log('user data')
      console.log(this.user)
      this.$language = this.language
      this.userScoped = {...this.user}
      this.firstName = this.userScoped.first_name
      this.lastName = this.userScoped.last_name
      this.email = this.userScoped.email
    },

    methods: {
      profileUpdate() {
        this.formSubmitted = true

        if (this.$v.$invalid) {
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.email.$touch()
        } else {
          this.showSpinner = true

          let postData = new FormData()
          postData.append('id', this.userScoped.id)
          postData.append('first_name', this.firstName)
          postData.append('last_name', this.lastName)
          postData.append('email', this.email)
          postData.append('address', this.userScoped.address)
          postData.append('phone', this.userScoped.phone)

          this.$http.post(this.appApiPath + '/api/profile_update', postData)
            .then(response => {
              console.log('profile update success')
              console.log(response.body)

              this.showSpinner = false

              let userData = response.body.data.userData
              userData.authenticated = true
              store.dispatch({
                type: 'setAppUser',
                user: userData
              })
              this.$localStorage.set('user', JSON.stringify(userData))

              router.push({ name: 'dashboard', params: { profileUpdateSuccess: true } })
            }, response => {
              console.warn('profile update error')
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
