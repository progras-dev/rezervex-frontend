<template>
  <div class="app flex-row align-items-center pageContainer">
   <div class="container">
     <div class="row justify-content-center">
       <div class="col-lg-8">
         <b-alert variant="success mt25" :show="showAlertVerificationSuccess">
          <h4 class="alert-heading"><span v-lang.verificationSuccessTitle></span></h4>
          <p>
            <i class="fa fa-check alert-icon"></i><span v-lang.verificationSuccessText></span>
          </p>
        </b-alert>
         <div class="card-group mb-4">
           <div class="card p-4">
             <div class="card-body">
               <h1><span v-lang.signIn></span></h1>
               <p class="text-muted"> <span v-lang.signInAccount></span> </p>
               <div class="input-group mb-3">
                 <span class="input-group-addon mt3"><i class="icon-user"></i></span>
                 <input type="text" id="input-email" class="form-control lightBorders" placeholder="Email" v-model="email" @input="removeErrorMessages" v-on:keyup.enter="loginSubmit()">
               </div>
               <div class="input-group mb-4">
                 <span class="input-group-addon mt3"><i class="icon-lock"></i></span>
                 <input type="password" id="input-password" class="form-control lightBorders" placeholder="Password" v-model="password" @input="removeErrorMessages" v-on:keyup.enter="loginSubmit()">
               </div>
               <div class="alert alert-danger" role="alert" v-if="emailNotFound">
                 <i class="fa fa-exclamation-triangle"></i>
                 <span v-lang.emailNotFound></span>
               </div>
               <div class="alert alert-danger" role="alert" v-if="wrongPassword">
                 <i class="fa fa-exclamation-triangle"></i>
                 <span v-lang.wrongPassword></span>
               </div>
               <div class="alert alert-danger" role="alert" v-if="emailNotConfirmed">
                 <i class="fa fa-exclamation-triangle"></i>
                 <span v-lang.emailNotConfirmed></span>
               </div>
               <div class="alert alert-danger" role="alert" v-if="subscriptionCancelled">
                 <i class="fa fa-exclamation-triangle"></i>
                 <span v-lang.subscriptionCancelled></span>
               </div>
               <div class="row">
                 <div class="col-6">
                   <button type="button" id="login-button" class="btn btn-primary px-4" @click="loginSubmit">
                     <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                     <i class="fas fa-sign-in-alt loginIconCustom" v-if="!showSpinner"></i>
                     <span v-lang.signIn class="btnSignIntext"></span>
                   </button>
                 </div>
                 <div class="col-6 text-right">
                   <button type="button" class="btn btn-link px-0" @click="goToPasswordForgotView">
                     <i class="fa fa-key"></i>
                     <span v-lang.forgetPassword></span>
                   </button>
                 </div>
               </div>
             </div>
           </div>
           <div class="card text-white bg-primary py-5">
             <div class="card-body text-center">
               <div>
                 <img src="../assets/img/logo.png" class="logoFrontPage" alt="">
                 <h2><span v-lang.register></span></h2>
                 <p> <span v-lang.registerSubtitle></span> </p>
                 <button type="button" class="btn btn-primary active mt-3" @click="goToRegister">
                   <i class="fa fa-user-plus"></i>
                   <span v-lang.registerNow></span>
                 </button>
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
  import store from '../vuex/store'
  import Icon from 'vue-awesome/components/Icon'
  import { ChatManager, TokenProvider } from '@pusher/chatkit'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { initReservations } from '../mixins/initReservations'
  export default {
    mixins: [savePropertiesInStorage, saveContractsInStorage, initReservations],
    components: { Icon },
    data() {
      return {
        email: '',
        password: '',
        showSpinner: false,
        emailNotFound: false,
        wrongPassword: false,
        emailNotConfirmed: false,
        subscriptionCancelled: false,
        showAlertVerificationSuccess: false,
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
    created() {
      console.warn('app api path');
      console.log(this.appApiPath);
      this.initAppLanguage()
      this.checkVerifySuccess()
      document.addEventListener('keyup', this.enterKeyOnClick)

      if (this.$route.params.passwordUpdateSuccess) {
        if (this.language === 'en') {
          this.$toasted.show('Password succesfully updated! You can now login with the new password', {icon: 'fa-check-circle', type: 'success', position: 'top-center', duration: 4000})
        } else if (this.language === 'tr') {
          this.$toasted.show('Şifre başarıyla güncellendi! Yeni şifreyle giriş yapabilirsiniz', {icon: 'fa-check-circle', type: 'success', position: 'top-center', duration: 4000})
        }
      }
      // this.initChat()
    },
    destroyed() {
      document.removeEventListener('keyup', this.enterKeyOnClick)
    },

    methods: {
      checkVerifySuccess() {
        const verify = this.$route.query.verify;
        console.log({verify});
        if (verify === 'success') {
          this.showAlertVerificationSuccess = true;
        }
      },
      initChat() {
        const tokenProvider = new TokenProvider({
          url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/c11f29cf-7137-4cca-b5ac-f367bb545e99/token'
        })

        const chatManager = new ChatManager({
          instanceLocator: 'v1:us1:c11f29cf-7137-4cca-b5ac-f367bb545e99',
          userId: 'new_user',
          tokenProvider: tokenProvider
        })

        console.log({tokenProvider})
        console.log({chatManager})

        chatManager
          .connect()
          .then(currentUser => {
            console.log('Connected as user ', currentUser)
            // Subscribe to room
            currentUser.subscribeToRoom({
              roomId: currentUser.rooms[0].id,
              hooks: {
                onNewMessage: message => {
                  console.log('Received new message:' + message.text)
                }
              }
            })
            // Send message
            currentUser.sendMessage({
              text: 'hello from app',
              roomId: currentUser.rooms[0].id
            })
            // Fetch messages
            currentUser.fetchMessages({
              roomId: 10833407,
              direction: 'older',
              limit: 100,
            })
              .then(messages => {
                // do something with the messages
                console.log('room message history')
                console.log({messages})
              })
              .catch(err => {
                console.log(`Error fetching messages: ${err}`)
              })
            // Get joinable rooms
            currentUser.getJoinableRooms()
              .then(rooms => {
                // do something with the rooms
                console.log('joinable rooms')
                console.log({rooms})
              })
              .catch(err => {
                console.log(`Error getting joinable rooms: ${err}`)
              })
          })
          .catch(error => {
            console.error('error:', error)
          })
      },
      enterKeyOnClick(event) {
        // If the key is Enter then call the login function
        if (event.keyCode === 13) {
          this.loginSubmit()
        }
      },
      initAppLanguage() {
        let appLanguage = this.$localStorage.get('appLanguage')

        if (appLanguage === null) {
          this.$language = 'tr'
          this.$localStorage.set('appLanguage', 'tr')
        } else {
          this.$language = appLanguage
        }

        store.dispatch({
          type: 'setAppLanguage',
          language: this.$language
        })
      },
      loginSubmit() {
        this.showSpinner = true
        let formData = {
          'email': this.email,
          'password': this.password
        }

        this.$http.post(this.appApiPath + '/api/login_submit', formData).then(response => {
          console.log('api login okay - data response')
          console.log(response.body)

          this.showSpinner = false

          if (!response.body.data.response) {
            if (response.body.message === 'email_not_found') {
              this.emailNotFound = true
            } else if (response.body.message === 'password_wrong') {
              this.wrongPassword = true
            } else if (response.body.message === 'not_confirmed') {
              this.emailNotConfirmed = true
            } else if (response.body.message === 'subscription_cancelled') {
              this.subscriptionCancelled = true
            }
          } else if (response.body.data.level === 'superadmin') {
            let userData = {}
            userData.authenticated = true
            userData.id = 0
            userData.role = 'superadmin'
            userData.name = 'superadmin'
            store.dispatch({
              type: 'setAppUser',
              user: userData
            })
            this.$localStorage.set('user', JSON.stringify(userData))

            store.dispatch({
              type: 'setAppUsersSuper',
              usersSuper: response.body.data.users
            })
            this.$localStorage.set('usersSuper', JSON.stringify(response.body.data.users))

            store.dispatch({
              type: 'setAppPlans',
              plans: response.body.data.plans
            })
            this.$localStorage.set('plans', JSON.stringify(response.body.data.plans))

            store.dispatch({
              type: 'setAppPackages',
              packages: response.body.data.packages
            })
            this.$localStorage.set('packages', JSON.stringify(response.body.data.packages))

            this.$router.push({name: 'superadminDashboard'})
          } else {
            // Add custom data to reservations
            this.initReservations(response.body.data.reservations)

            let userData = response.body.data.userData
            userData.authenticated = true
            store.dispatch({
              type: 'setAppUser',
              user: userData
            })
            this.$localStorage.set('user', JSON.stringify(userData))

            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')

            store.dispatch({
              type: 'setAppUsers',
              users: response.body.data.users
            })
            this.$localStorage.set('users', JSON.stringify(response.body.data.users))

            store.dispatch({
              type: 'setAppPricesList',
              pricesList: response.body.data.prices
            })
            this.$localStorage.set('pricesList', JSON.stringify(response.body.data.prices))

            store.dispatch({
              type: 'setAppServices',
              services: response.body.data.serviceList
            })
            this.$localStorage.set('services', JSON.stringify(response.body.data.serviceList))

            store.dispatch({
              type: 'setAppBookings',
              bookings: response.body.data.bookingList
            })
            this.$localStorage.set('bookingList', JSON.stringify(response.body.data.bookingList))

            store.dispatch({
              type: 'setAppBookingListIndexed',
              bookingListIndexed: response.body.data.bookingListIndexed
            })
            this.$localStorage.set('bookingListIndexed', JSON.stringify(response.body.data.bookingListIndexed))

            store.dispatch({
              type: 'setAppBookingsForChart',
              bookingsForChart: response.body.data.bookingsForChart
            })
            this.$localStorage.set('bookingsForChart', JSON.stringify(response.body.data.bookingsForChart))

            store.dispatch({
              type: 'setAppBookingListByDate',
              bookingListByDate: response.body.data.bookingListByDate
            })
            this.$localStorage.set('bookingListByDate', JSON.stringify(response.body.data.bookingListByDate))

            store.dispatch({
              type: 'setAppBookingListWithServices',
              bookingListWithServices: response.body.data.bookingListWithServices
            })
            this.$localStorage.set('bookingListWithServices', JSON.stringify(response.body.data.bookingListWithServices))

            store.dispatch({
              type: 'setAppLogsList',
              logsList: response.body.data.logsList
            })
            this.$localStorage.set('logsList', JSON.stringify(response.body.data.logsList))

            store.dispatch({
              type: 'setAppClients',
              clients: response.body.data.clients
            })
            this.$localStorage.set('clients', JSON.stringify(response.body.data.clients))

            let calendarNotes = response.body.data.calendar_notes
            calendarNotes.map(item => {
              item.startDate = item.start_date
              item.isNote = true
              return item
            })

            store.commit('setCalendarNotes', calendarNotes)
            this.$localStorage.set('calendarNotes', JSON.stringify(calendarNotes))

            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)

            store.dispatch({
              type: 'setAppShowWelcome',
              showWelcome: true
            })

            const counter = {
              sms: response.body.data.sms_counter,
              email: response.body.data.email_counter,
            }

            store.dispatch({
              type: 'setAppCounter',
              counter: counter
            })
            this.$localStorage.set('counter', JSON.stringify(counter))

            store.dispatch({
              type: 'setAppPackages',
              packages: response.body.data.packages
            })
            this.$localStorage.set('packages', JSON.stringify(response.body.data.packages))

            store.dispatch({
              type: 'setAppPlans',
              plans: response.body.data.plans
            })
            this.$localStorage.set('plans', JSON.stringify(response.body.data.plans))
            

            this.$http.post(this.appApiPath + '/api/user_get_subscription_data', {user_id: userData.id}).then(response => {
              console.log('user_get_subscription_data api success')
              console.log(response)

              store.dispatch({
                type: 'setAppSubscriptionData',
                subscriptionData: response.body.subscriptionData
              })
              this.$localStorage.set('subscriptionData', JSON.stringify(response.body.subscriptionData))
            }, response => {
              console.log('user_get_subscription_data api error')
              console.log(response)
            });

            if (response.body.data.user.role === 'manager') {
              store.dispatch({
                type: 'setAppPropertiesManager',
                propertiesManager: response.body.data.propertiesManager
              })
              this.savePropertiesInStorage(response.body.data.propertiesManager, 'manager')
            } else if (response.body.data.user.role === 'admin') {
              store.dispatch({
                type: 'setAppContractFields',
                contractFields: response.body.data.contractFields
              })
              this.$localStorage.set('contractFields', JSON.stringify(response.body.data.contractFields))
            }

            this.$router.push({name: 'dashboard'})
          }
        }, response => {
          console.log('login api error')
          console.log(response)
          if (this.$language === 'en') {
            this.$toasted.show('Something went wrong while trying to login', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Giriş yapılırken bir hata oluştu.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
          this.showSpinner = false
        })
      },
      goToRegister() {
        console.log('go to register')
        this.$router.push({name: 'register'})
      },
      removeErrorMessages() {
        this.emailNotFound = false
        this.wrongPassword = false
        this.emailNotConfirmed = false
      },
      goToPasswordForgotView() {
        console.log('go to password forgot')
        this.$router.push({name: 'passwordForgot'})
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .btn i {
    margin-right: 5px;
  }

  .btnSignIntext {
    vertical-align: text-bottom;
  }

  .pageContainer {
    background: url(../assets/img/bgtest.jpg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }

  .logoFrontPage {
    width: 56%;
    margin-top: -32px;
  }

  .loginIconCustom {
    vertical-align: text-top;
    margin-top: 1px;
  }
</style>

