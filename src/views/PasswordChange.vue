<template>
  <div class="animated fadeIn">

    <b-card style="margin-top: 1rem">

      <div class="col-md-12 pageTitleNoMargin settingsPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle mb30">
            <i class="fa fa-key" aria-hidden="true"></i>
            <span v-lang.changePassword></span>
          </span>
        </div>
      </div>

      <form>

        <div class="form-group">
          <label for="inputOldPassword"><span v-lang.oldPassword></span></label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
            <input type="password" id="inputOldPassword" class="form-control lightBorders" :placeholder="labelOldPassword" v-model="oldPassword" @input="$v.oldPassword.$touch()" :class="{'is-invalid': $v.oldPassword.error}">
          </div>
          <div class="invalid-feedback" v-if="!$v.oldPassword.required && $v.oldPassword.$dirty">
            <span v-lang.oldPasswordRequired></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputNewPassword"><span v-lang.newPassword></span></label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
            <input type="password" id="inputNewPassword" class="form-control lightBorders" :placeholder="labelNewPassword" v-model="newPassword" @input="$v.newPassword.$touch()" :class="{'is-invalid': $v.newPassword.error}">
          </div>
          <div class="invalid-feedback" v-if="!$v.newPassword.required && ($v.newPassword.$dirty || formSubmitted)">
            <span v-lang.newPasswordRequired></span>
          </div>
          <div class="invalid-feedback" v-if="!$v.newPassword.minLength && formSubmitted">
            <span v-lang.passwordLengthMin6></span>
          </div>
        </div>

        <div class="form-group">
          <label for="inputPasswordConfirmation"><span v-lang.passwordConfirmation></span></label>
          <div class="input-group">
            <span class="input-group-addon mt3"><i class="fa fa-2x fa-key iconColor"></i></span>
            <input type="password" id="inputPasswordConfirmation" class="form-control lightBorders" :placeholder="labelNewPassword" v-model="passwordConfirmation" @input="$v.passwordConfirmation.$touch()" :class="{'is-invalid': $v.passwordConfirmation.error}">
          </div>
          <div class="invalid-feedback" v-if="!$v.passwordConfirmation.required && ($v.passwordConfirmation.$dirty || formSubmitted)">
            <span v-lang.passwordConfirmationRequired></span>
          </div>
          <div class="invalid-feedback" v-if="!$v.passwordConfirmation.minLength && formSubmitted">
            <span v-lang.passwordLengthMin6></span>
          </div>
          <div class="invalid-feedback" v-if="showErrorNotEqual">
            <span v-lang.passwordConfirmationEqual></span>
          </div>
        </div>

      </form>

      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-info btn-lg btn-block white buttonMain" @click="passwordUpdate($event)">
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
  import { required, minLength } from 'vuelidate/lib/validators'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'

  export default {
    router: router,
    components: { Icon },
    mixins: [labels],

    validations: {
      oldPassword: {
        required
      },
      newPassword: {
        required,
        minLength: minLength(6)
      },
      passwordConfirmation: {
        required,
        minLength: minLength(6)
      }
    },

    data() {
      return {
        oldPassword: '',
        newPassword: '',
        passwordConfirmation: '',
        showSpinner: false,
        formSubmitted: false,
        showErrorNotEqual: false,
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
      this.$language = this.language
    },

    methods: {
      passwordUpdate() {
        console.log(this.oldPassword)
        console.log(this.newPassword)
        console.log(this.passwordConfirmation)
        this.formSubmitted = true

        if (this.$v.$invalid) {
          this.$v.oldPassword.$touch()
          this.$v.newPassword.$touch()
          this.$v.passwordConfirmation.$touch()
        } else {
          if (this.passwordConfirmation !== this.newPassword) {
            this.showErrorNotEqual = true
          } else {
            this.showSpinner = true

            let postData = new FormData()
            postData.append('password_old', this.oldPassword)
            postData.append('password_new', this.newPassword)
            postData.append('email', this.user.email)
            postData.append('id', this.user.id)

            this.$http.post(this.appApiPath + '/api/password_update', postData)
              .then(response => {
                console.log('password update success')
                console.log(response.body)

                this.showSpinner = false

                if (response.body.data.result) {
                  router.push({ name: 'dashboard', params: { passwordUpdateSuccess: true } })
                } else {
                  if (response.body.message === 'password_wrong') {
                    if (this.$language === 'en') {
                      this.$toasted.show('The old password is not correct.', {icon: 'fa-exclamation-triangle', type: 'error'})
                    } else if (this.$language === 'tr') {
                      this.$toasted.show('Eski şifre yanlış.', {icon: 'fa-exclamation-triangle', type: 'error'})
                    }
                  }
                }
              }, response => {
                console.warn('password update error')
                console.log(response)

                this.showSpinner = false
              })
          }
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
