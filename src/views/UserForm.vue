<template>
  <div class="animated fadeIn">

    <div class="card" style="margin-top: 1rem">

      <div class="card-block">

        <div class="container">

          <div class="col-md-12 pageTitleRowInCard usersPages" v-if="userFormType === 'add'">
            <div class="flex-center pageTitleContainer">
              <span class="white pageTitle">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span v-lang.addUser></span>
              </span>
              <div class="white-text pageSubtitle"><span v-lang.infoAddUser></span></div>
            </div>
          </div>

          <div class="col-md-12 pageTitleRowInCard usersPages" v-if="userFormType === 'edit'">
            <div class="flex-center pageTitleContainer">
              <span class="white pageTitle">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span v-lang.editUser></span>
              </span>
              <div class="white-text pageSubtitle"><span v-lang.infoEditUser></span></div>
            </div>
          </div>

          <form>

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


            <div class="form-group" v-if="userFormType === 'add'">
              <label for="inputManagers"><span v-lang.role></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-address-card iconColor"></i></span>
                <select class="form-control" id="inputManagers" v-model="role">
                  <option v-for="(role, index) in roles" :key="index" :value="role"> {{ role }} </option>
                </select>
              </div>
            </div>

            <div class="form-group" v-if="userFormType === 'edit'">
              <label for="inputManagersEdit"><span v-lang.role></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-address-card iconColor"></i></span>
                <select class="form-control" id="inputManagersEdit" v-model="user.role">
                  <option  v-for="(role, index) in roles" :key="index" :value="role"> {{ role }} </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="inputDeposit"><span v-lang.minimumDeposit></span></label>
              <div class="input-group mb-2">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-lira-sign iconColor"></i></span>
                <div class="input-group-prepend">
                  <div class="input-group-text"> ₺</div>
                </div>
                <input v-if="userFormType === 'add'" type="number" class="form-control" :placeholder="labelMinimumDeposit" id="inputDeposit" v-model="minimumDeposit">
                <input v-if="userFormType === 'edit'" type="number" class="form-control" :placeholder="labelMinimumDeposit" id="inputDeposit" v-model="user.minimum_deposit">
              </div>
            </div>

            <div class="form-group" v-if="userFormType === 'add'">
              <label for="inputEmail"><span v-lang.email></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-envelope iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.userEmail.$error}" :placeholder="labelEmail" id="inputEmail" v-model="userEmail" @input="resetEmailErrorMessage" @blur="emailVerify">
              </div>
              <div class="invalid-feedback" v-if="!$v.userEmail.required && $v.userEmail.$dirty">
                <span v-lang.emailRequired></span>
              </div>
              <div class="invalid-feedback" v-if="!$v.userEmail.email && $v.userEmail.$dirty">
                <span v-lang.emailValid></span>
              </div>
              <div class="invalid-feedback" v-if="emailAlreadyInUse">
                <span v-lang.emailAlreadyInUse></span>
              </div>
            </div>




            <div class="form-group" v-if="userFormType === 'add'">
              <label for="inputPhone"><span v-lang.phone></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
                <input class="form-control" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" id="inputPhone" v-model="newUser.phone">
              </div>
            </div>

            <div class="form-group" v-if="userFormType === 'edit'">
              <label for="inputPhoneEdit"><span v-lang.phone></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-phone iconColor"></i></span>
                <input class="form-control" type="tel" v-mask="'(###) ### ## ##'" :placeholder="'(###) ### ## ##'" id="inputPhoneEdit" v-model="user.phone">
              </div>
            </div>



            <div class="form-group" v-if="role === 'manager' && userFormType === 'add'">
              <label for="inputDiscount"><span v-lang.maxDiscountAllowed></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-percentage iconColor"></i></span>
                <input class="form-control" :placeholder="labelMaxDiscount" id="inputDiscount" v-model="discount">
              </div>
            </div>

            <div class="form-group" v-if="role === 'manager' && userFormType === 'edit'">
              <label for="inputDiscount2"><span v-lang.maxDiscountAllowed></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-percentage iconColor"></i></span>
                <input class="form-control" :placeholder="labelMaxDiscount" id="inputDiscount2" v-model="user.max_discount">
              </div>
            </div>


            <div class="form-group row" style="margin-top: 45px;" v-if="userFormType === 'add'">
              <div class="col-sm-3">
                <button type="submit" class="btn btn-lg btn-block btn-success white buttonMain" @click="createUser($event)">
                  <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                  <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                  <span v-lang.userCreate></span>
                </button>
              </div>
            </div>

            <div class="form-group row" style="margin-top: 45px;" v-if="userFormType === 'edit'">
              <div class="col-sm-3">
                <button type="submit" class="btn btn-lg btn-block btn-success white buttonMain" @click="updateUser($event)">
                  <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                  <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                  <span v-lang.userUpdate></span>
                </button>
              </div>
            </div>

          </form>


        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { required, email } from 'vuelidate/lib/validators'
  import 'vue-awesome/icons/spinner'
  import { labels } from '../mixins/labels'
  import { mask } from 'vue-the-mask'

  export default {
    router: router,
    components: {Icon},
    directives: {mask},
    mixins: [labels],
    data () {
      return {
        user: {},
        newUser: {},
        firstName: '',
        lastName: '',
        userEmail: '',
        minimumDeposit: 0,
        roles: ['manager', 'admin'],
        showSpinner: false,
        discount: 3,
        role: '',
        emailAlreadyInUse: false
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      userFormType() {
        return store.getters.getUserFormType
      },
      admin() {
        return store.getters.getUser
      },
      currentUser() {
        return store.getters.getCurrentUser
      },
    },
    validations: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      userEmail: {
        required, email
      },
      validationGroup: ['firstName', 'lastName', 'userEmail']
    },
    created () {
      this.$language = this.language
      if (this.userFormType === 'add') {
        this.role = 'manager'
      } else if (this.userFormType === 'edit') {
        this.user = {...this.currentUser}
        this.firstName = this.user.first_name
        this.lastName = this.user.last_name
        this.userEmail = this.user.email
      }
    },
    methods: {
      createUser(event) {
        event.preventDefault()

        if (this.$v.$invalid || this.emailAlreadyInUse) {
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.userEmail.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinner = true
          let formData = {
            'first_name': this.firstName,
            'last_name': this.lastName,
            'email': this.userEmail,
            'phone': this.newUser.phone,
            'minimum_deposit': this.minimumDeposit,
            // 'address': this.newUser.address,
            'role': this.role,
            'max_discount': this.discount,
            'admin_id': this.admin.id
          }

          this.$http.post(this.appApiPath + '/api/user_add', formData)
            .then(response => {
              console.log('user add response')
              console.log(response.body)

              this.showSpinner = false

              store.dispatch({
                type: 'setAppUsers',
                users: response.body.data.users
              })
              this.$localStorage.set('users', JSON.stringify(response.body.data.users))

              router.push({name: 'users', params: {isAlert: true, alertType: 'user-create-success'}})
            }, response => {
              console.log('user add error')
              console.log(response)

              this.showSpinner = false
            })
        }
      },
      updateUser(event) {
        event.preventDefault()

        if (this.$v.$invalid) {
          this.$v.firstName.$touch()
          this.$v.lastName.$touch()
          this.$v.userEmail.$touch()

          if (this.language === 'en') {
            this.$toasted.show('Please fill in the required fields', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          this.showSpinner = true

          let formData = {
            'user_id': this.user.id,
            'first_name': this.firstName,
            'last_name': this.lastName,
            'email': this.userEmail,
            'phone': this.user.phone,
            // 'address': this.user.address,
            'role': this.user.role,
            'minimum_deposit': this.user.minimum_deposit,
            'max_discount': this.user.max_discount,
            'admin_id': this.admin.id
          }

          this.$http.post(this.appApiPath + '/api/user_update', formData)
            .then(response => {
              console.log('user update response')
              console.log(response.body)

              this.showSpinner = false

              store.dispatch({
                type: 'setAppUsers',
                users: response.body.data.users
              })
              this.$localStorage.set('users', JSON.stringify(response.body.data.users))

              router.push({name: 'users', params: {isAlert: true, alertType: 'user-update-success'}})
            }, response => {
              console.log('user update error')
              console.log(response)

              this.showSpinner = false
            })
        }
      },
      resetEmailErrorMessage() {
        console.log('reset error message')
        this.emailAlreadyInUse = false
        this.$v.$reset()
      },
      emailVerify() {
        this.$v.userEmail.$touch()
        if (!this.$v.userEmail.$invalid) {
          console.log('email valid - call email_unique API')
          let formData = {
            'email': this.userEmail,
          }
          this.$http.post(this.appApiPath + '/api/register_email_unique_verify', formData)
            .then(response => {
              console.log('register_email_unique_verify api success')
              console.log(response.body)
              if (response.body.data.user) {
                this.emailAlreadyInUse = true
              } else if (!response.body.data.user) {
                this.emailAlreadyInUse = false
              }
            }, response => {
              this.showSpinner = false
              console.log('register_email_unique_verify api error')
              console.log(response)
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
