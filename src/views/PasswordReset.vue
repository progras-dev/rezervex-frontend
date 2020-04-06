<template>

  <div>

    <nav class="navbar navbar-dark bg-primary">
      <a class="navbar-brand" href="http://www.rezervex.com/"> <img src="../assets/img/logo.png" alt="" style="width: 96px;"> </a>
    </nav>


    <div class="app flex-row align-items-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card-group mb-4" style="margin-top: -100px;">
              <div class="card p-4">
                <div class="card-body">
                  <h2 class="text-primary"><span v-lang.resetPassword></span></h2>


                  <form action="">
                    <div class="form-group">
                      <label for="inputPassword"><span v-lang.password></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
                        <input id="inputPassword" class="form-control lightBorders" :placeholder="labelPassword" v-model="password" :class="{'is-invalid': !$v.password.required && (formSubmitted ||$v.password.$error)}" @input="resetPasswordEqualError">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.password.required && (formSubmitted ||$v.password.$error )">
                        <span v-lang.passwordRequired></span>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="inputPasswordConfirm"><span v-lang.passwordConfirmation></span></label>
                      <div class="input-group">
                        <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
                        <input id="inputPasswordConfirm" class="form-control lightBorders" :placeholder="labelPasswordConfirmation" v-model="password" :class="{'is-invalid': (!$v.passwordConfirmation.required || passwordNotEqual) && (formSubmitted || passwordNotEqual)}" @input="resetPasswordEqualError" @blur="checkPasswordEqual">
                      </div>
                      <div class="invalid-feedback" v-if="!$v.passwordConfirmation.required && formSubmitted">
                        <span v-lang.passwordConfirmationRequired></span>
                      </div>
                      <div class="invalid-feedback" v-if="passwordNotEqual && (formSubmitted || passwordNotEqual)">
                        <span v-lang.passwordConfirmationEqual></span>
                      </div>
                    </div>
                  </form>

                  <div class="form-group row mt25">
                    <div class="col-sm-6">
                      <button type="submit" class="btn btn-info btn-lg btn-block white" @click="submitPassword">
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                        <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                        <span v-lang.submit></span>
                      </button>
                    </div>
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
  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { required } from 'vuelidate/lib/validators'
  /* import '../assets/css/login.css' */
  export default {
    data() {
      return {
        email: '',
        showSpinner: false,
        emailNotFound: false,
        token: '',
        password: '',
        passwordConfirmation: '',
        formSubmitted: false,
        passwordNotEqual: false,
        labelPassword: '',
        labelPasswordConfirmation: '',
      }
    },

    computed: {
      appApiPath() {
        return store.getters.getApiPath
      },
      language() {
        return store.getters.getLanguage
      },
    },

    validations: {
      password: {
        required
      },
      passwordConfirmation: {
        required
      },
    },

    router: router,

    components: { Icon },

    created() {
      this.$language = this.language
      this.initLabels()
      this.email = this.$route.params.email
      this.token = this.$route.params.token
    },

    methods: {
      initLabels() {
        if (this.language === 'en') {
          this.labelPassword = 'Password'
          this.labelPasswordConfirmation = 'Password Confirmation'
        } else if (this.language === 'tr') {
          this.labelPassword = 'Şifre'
          this.labelPasswordConfirmation = 'Şifre onayı'
        }
      },
      submitPassword() {
        this.formSubmitted = true
        if (this.$v.$invalid) {
          console.log('validation invalid')
          this.showSpinner = false
        } else if (this.password !== this.passwordConfirmation) {
          console.log('password not equal')
          this.passwordNotEqual = true
          this.showSpinner = false
        } else {
          console.log('validation valid')
          this.passwordNotEqual = false
          let formData = {
            'password': this.password,
            'email': this.email,
            'token': this.token,
          }
          this.$http.post(this.appApiPath + '/api/password_reset', formData)
            .then(response => {
              console.log('password_forgot api success')
              console.log(response.body)
              this.showSpinner = false

              if (response.body.data.checkToken) {
                if (response.body.data.resultUpdate) {
                  router.push({ name: 'Login', params: { passwordUpdateSuccess: true } })
                } else {
                  if (this.language === 'en') {
                    this.$toasted.show('Something went wrong trying to update the password', {icon: 'fa-check-circle', type: 'error'})
                  } else if (this.language === 'tr') {
                    this.$toasted.show('Bir hata oluştu', {icon: 'fa-check-circle', type: 'error'})
                  }
                }
              } else {
                if (this.language === 'en') {
                  this.$toasted.show('Something went wrong trying to update the password', {icon: 'fa-check-circle', type: 'error'})
                } else if (this.language === 'tr') {
                  this.$toasted.show('Bir hata oluştu', {icon: 'fa-check-circle', type: 'error'})
                }
              }
            }, response => {
              this.showSpinner = false
              console.log('password_forgot api error')
              console.log(response)
              this.showSpinner = false

              if (this.language === 'en') {
                this.$toasted.show('Something went wrong trying to update the password', {icon: 'fa-check-circle', type: 'error'})
              } else if (this.language === 'tr') {
                this.$toasted.show('Bir hata oluştu', {icon: 'fa-check-circle', type: 'error'})
              }
            })
        }
      },
      checkPasswordEqual() {
        console.log('checking')
        if (this.password === this.passwordConfirmation) {
          this.passwordNotEqual = false
        } else {
          this.passwordNotEqual = true
        }
        console.log('passwordNotEqual')
        console.log(this.passwordNotEqual)
      },
      resetPasswordEqualError() {
        if (this.password === this.passwordConfirmation) {
          this.passwordNotEqual = false
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>

