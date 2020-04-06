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
                  <h2 class="text-primary"><span v-lang.enterEmail></span></h2>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope"></i></span>
                    <input type="text" class="form-control lightBorders" placeholder="Email" v-model="email" v-on:keyup.enter="submitEmail()">
                  </div>
                  <div class="row" style="margin-top: 15px;">
                    <div class="col-6">
                      <button type="button" class="btn btn-primary btn-block px-4" @click="submitEmail">
                        <i class="fa fa-envelope" v-if="!showSpinner"></i>
                        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
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
  /* import '../assets/css/login.css' */
  export default {
    data() {
      return {
        email: '',
        showSpinner: false,
        emailNotFound: false,
      }
    },

    computed: {
      appApiPath() {
        return store.getters.getApiPath
      },
      language () {
        return store.getters.getLanguage
      },
    },

    router: router,

    components: { Icon },

    created() {
      this.$language = this.language
      document.addEventListener('keyup', this.enterPressedFromAnywhere)
    },
    destroyed() {
      document.removeEventListener('keyup', this.enterPressedFromAnywhere)
    },

    methods: {
      removeErrorMessages() {
        this.emailNotFound = false
      },
      submitEmail() {
        console.log('password forgot')
        console.log(this.email)
        this.showSpinner = true
        let formData = {
          'email': this.email,
        }
        this.$http.post(this.appApiPath + '/api/password_forgot', formData)
          .then(response => {
            console.log('password_forgot api success')
            console.log(response.body)
            this.showSpinner = false

            if (this.language === 'en') {
              this.$toasted.show('An email has been to your address. Please confirm the email and reset the password', {icon: 'fa-check-circle', type: 'success', duration: 5000})
            } else if (this.language === 'tr') {
              this.$toasted.show('An email has been to your address. Please confirm the email and reset the password', {icon: 'fa-check-circle', type: 'success', duration: 5000})
            }
          }, response => {
            this.showSpinner = false
            console.log('password_forgot api error')
            console.log(response)
            this.showSpinner = false

            if (response.body.message === 'email_not_found') {
              if (this.language === 'en') {
                this.$toasted.show('The inserted email doesn\'t seem to be registered with us.', {icon: 'fa-check-circle', type: 'error'})
              } else if (this.language === 'tr') {
                this.$toasted.show('Email bulunamadı\n', {icon: 'fa-check-circle', type: 'error'})
              }
            } else {
              if (this.language === 'en') {
                this.$toasted.show('Something went wrong', {icon: 'fa-check-circle', type: 'error'})
              } else if (this.language === 'tr') {
                this.$toasted.show('Bir hata oluştu', {icon: 'fa-check-circle', type: 'error'})
              }
            }
          })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

</style>

