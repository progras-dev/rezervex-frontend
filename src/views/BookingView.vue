<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle mb30">
          <i class="fa fa-id-card" aria-hidden="true"></i>
          <span v-lang.bookingsDetails></span>
        </span>
      </div>
    </div>

    <b-card :class="{'-deleted': bookingViewData.deleted_at}">

      <div class="form-group" v-if="!bookingViewData.deleted_at">
        <button type="button" class="btn btn-lg btn-info white buttonMain mb5" @click="goToBookingEdit($event)">
          <i class="fa fa-edit"></i>
          <span v-lang.edit></span>
        </button>
        <button type="button" class="btn btn-lg btn-info white buttonMain mb5" @click="goToAddPayment($event)" v-if="bookingViewData.total_cost - bookingViewData.advance > 0">
          <i class="fa fa-money"></i>
          <span v-lang.paymentAdd></span>
        </button>
        <button type="button" class="btn btn-lg btn-danger white buttonMain mb5" @click="openModalBookingDelete($event)">
          <i class="fa fa-trash"></i>
          <span v-lang.bookingRemove></span>
        </button>
      </div>


      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.bookingData></span></div>
              <div>
                <p class="card-text redText" v-if="bookingViewData && bookingViewData.deleted_at">
                  <i class="fa fa-warning"></i>
                  &nbsp;<span v-lang.bookingDeleted></span>
                </p>
                <p class="card-text normalText200 redText" v-if="bookingViewData && bookingViewData.deleted_at">
                  <span class="normalText300" v-lang.refund></span>:
                  {{ bookingViewData.total_refund | numberFormat }}
                </p>
                <p class="card-text normalText200">
                  <span class="fontWeight300" v-lang.date></span>: {{ bookingViewData.date }} -
                  <span class="type" v-if="bookingViewData.type == 'day' && language === 'en'"> {{ bookingViewData.type }}</span>
                  <span class="type" v-if="bookingViewData.type == 'day' && language === 'tr'"> Gün</span>
                  <span class="type" v-if="bookingViewData.type == 'night' && language === 'en'"> {{ bookingViewData.type }}</span>
                  <span class="type" v-if="bookingViewData.type == 'night' && language === 'tr'"> Gece</span>
                </p>

                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.time></span>: {{ bookingViewData.hour_start }}:{{ bookingViewData.minute_start }} - {{ bookingViewData.hour_end }}:{{ bookingViewData.minute_end }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalGuests></span>: {{ bookingViewData.total_guests }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.property></span>: {{ bookingViewData.property.name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.manager></span>: {{ bookingViewData.manager.first_name }} {{ bookingViewData.manager.last_name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.bookingCost></span>: {{ bookingViewData.price | numberFormat }}</p>

                <div class="h3 text-success" style="margin-top: 13px;"><span v-lang.notes></span></div>
                <p class="card-text normalText200" v-if="bookingViewData.notes === '' || !bookingViewData.notes"> <span v-lang.noNotes></span> </p>
                <p class="card-text normalText200" v-if="bookingViewData.notes !== ''"> {{ bookingViewData.notes }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-user"></i>
              </div>
              <div class="h3 text-success"><span v-lang.customerInfo></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.name></span>: {{ bookingViewData.client.full_name }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>: {{ bookingViewData.client.phone }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.customerEmail></span>: {{ bookingViewData.client.email }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.groom></span>: {{ bookingViewData.groom_fullname }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>: {{ bookingViewData.groom_phone }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.groomEmail></span>: {{ bookingViewData.groom_email }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.region></span>: {{ bookingViewData.groom_region }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.bride></span>: {{ bookingViewData.bride_fullname }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.phone></span>:  {{ bookingViewData.bride_phone }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.region></span>:  {{ bookingViewData.bride_region }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.brideEmail></span>: {{ bookingViewData.bride_email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-money"></i>
              </div>
              <div class="h3 text-success"><span v-lang.cost></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalCost></span>: {{ bookingViewData.total_cost | numberFormat }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.advance></span>: {{ bookingViewData.advance | numberFormat }}</p>
                <p class="card-text normalText200" :class="{'text-success': totalDue <= 0}"> <span class="fontWeight300" v-lang.totalDue :class="{'text-success': totalDue <= 0}"></span>: {{ totalDue | numberFormat }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.status></span>:
                  <span class="badge badge-danger" v-if="bookingViewData.deleted_at">
                    <span v-if="$language === 'tr'">Silindi</span>
                    <span v-if="$language === 'en'">Deleted</span>
                  </span>
                  <span class="badge badge-warning" v-if="!bookingViewData.deleted_at && totalDue > 0">
                    <span v-if="$language === 'tr'">Onayda</span>
                    <span v-if="$language === 'en'">Pending</span>
                  </span>
                  <span class="badge badge-success" v-if="!bookingViewData.deleted_at && totalDue <= 0">
                    <span v-if="$language === 'tr'">Ödemeyi tamamla</span>
                    <span v-if="$language === 'en'">Complete</span>
                  </span>
                </p>
              </div>
              <div class="h3 text-success mt10"><span v-lang.payments></span></div>
              <ul>
                <li class="paymentBlock" v-for="payment in bookingPayments" :key="payment.id">
                  {{ payment.total  | numberFormat }} <span class="paymentDescription">{{ payment.description }}</span> <br>
                  <span class="paymentDescription">{{ payment.dateFormatted }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-tags"></i>
              </div>
              <div class="h3 text-success"><span v-lang.services></span></div>
              <div v-if="bookingServices.length > 0">
                <p class="card-text normalText200" v-for="service in bookingServices" :key="service.id">
                  <template v-if="service.type === 'fixed'">  
                    <span class="fontWeight300">{{ service.name }}</span> 
                    {{ service.cost  | numberFormat }} 
                  </template>
                  <template v-if="service.type === 'flexible'">
                    <span class="fontWeight300">{{ service.name }}</span> 
                    {{ service.cost  | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.cost * bookingViewData.total_guests | numberFormat }}
                  </template>
                  <!-- <span v-if="service.type === 'fixed'">  <span class="fontWeight300">{{ service.name }}</span> {{ service.cost  | numberFormat }} </span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && bookingViewData.total_guests <= 100" > <span class="fontWeight300">{{ service.name }}</span>   {{ service.cost1 | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.cost1 * bookingViewData.total_guests | numberFormat }}</span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && bookingViewData.total_guests > 100 && bookingViewData.total_guests <= 250" >  <span class="fontWeight300">{{ service.name }}</span> {{ service.cost2 | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.cost2 * bookingViewData.total_guests | numberFormat }}</span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && bookingViewData.total_guests > 250 && bookingViewData.total_guests <= 500" >  <span class="fontWeight300">{{ service.name }}</span> {{ service.cost3 | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.cost3 * bookingViewData.total_guests | numberFormat }}</span>
                  <span v-if="service.type === 'flexible' && service.range_type === 'default' && bookingViewData.total_guests > 500" >  <span class="fontWeight300">{{ service.name }}</span> {{ service.cost4 | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.cost4 * bookingViewData.total_guests | numberFormat }}</span>
                  <span  v-if="service.type === 'flexible' && service.range_type === 'custom'">
                    <span class="fontWeight300">{{ service.name }}</span>
                      <span v-for="rangeData in service.range_costs" :key="rangeData.id">
                        <span v-if="bookingViewData.total_guests >= rangeData.min && bookingViewData.total_guests <= rangeData.max">
                          {{ rangeData.cost | numberFormat }}
                          (<span v-lang.total></span>: {{ rangeData.cost | numberFormat }} * {{ bookingViewData.total_guests }} = {{ rangeData.cost * bookingViewData.total_guests | numberFormat }} )
                        </span>
                      </span>
                      <span v-if="bookingViewData.total_guests > service.range_costs[service.range_costs.length - 1].max">
                        {{ service.range_costs[service.range_costs.length - 1].cost | numberFormat }}
                        (<span v-lang.total></span>: {{ service.range_costs[service.range_costs.length - 1].cost | numberFormat }} * {{ bookingViewData.total_guests }} = {{ service.range_costs[service.range_costs.length - 1].cost * bookingViewData.total_guests | numberFormat }} )
                      </span>
                  </span> -->
                </p>
              </div>
              <div v-if="bookingServices.length === 0">
                <p class="card-text normalText200"> <span v-lang.noServices></span></p>
              </div>
              <div style="margin-top: 18px;">
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.totalExtras></span>: {{ bookingViewData.total_cost - bookingViewData.price | numberFormat  }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </b-card>

    <ModalRemoveBooking 
      ref="removeBookingModal"
      @modal-booking-remove-success="modalRemoveBookingSuccess" 
      @modal-booking-remove-failed="modalRemoveBookingFailed" 
      :bookingViewData="bookingViewData"
      :user="user"
    ></ModalRemoveBooking>

  </div>
</template>

<script>
  import moment from 'moment'

  import router from '../router/index.js'
  import store from '../vuex/store'
  import { updateBookingLists } from '../mixins/updateBookingLists'
  import { labels } from '../mixins/labels'
  import Icon from 'vue-awesome/components/Icon'
  import ModalRemoveBooking from '../components/Modals/bookingRemove'

  export default {
    router: router,
    mixins: [labels, updateBookingLists],
    components: {Icon, ModalRemoveBooking},
    data () {
      return {
        bookingServices: [],
        bookingPayments: [],
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      bookingViewData() {
        return store.getters.getBookingViewData
      },
      bookingListWithServices() {
        return store.getters.getBookingListWithServices
      },
      serviceList() {
        return store.getters.getServices
      },
      user () {
        return store.getters.getUser
      },
      totalDue() {
        return this.bookingViewData.total_cost - this.bookingViewData.advance
      }
    },
    created () {
      this.$language = this.language
      console.log('bookingViewData')
      console.log(this.bookingViewData)

      this.initAlerts()
      this.initBookingData()
    },
    methods: {
      initBookingData() {
        console.warn('initBookingData')
        let bookingServices = []
        let bookingPayments = []
        for (let i = 0; i < this.bookingListWithServices.length; i++) {
          if (this.bookingListWithServices[i].id === this.bookingViewData.id) {
            // Payments - cloning array
            bookingPayments = this.bookingListWithServices[i].payments.map(item => ({...item}))
            // Services - cloning array
            let tempServices = this.bookingListWithServices[i].services.map(item => ({...item}))
            for (let j = 0; j < tempServices.length; j++) {
              for (let x = 0; x < this.serviceList.length; x++) {
                if (this.serviceList[x].id === tempServices[j].service_id) {
                  console.log(this.serviceList[x])
                  let service = {...this.serviceList[x]}
                  service.cost = tempServices[j].cost
                  bookingServices.push(service)
                }
              }
            }
          }
        }

        this.bookingPayments = bookingPayments.map(item => ({...item}))
        this.bookingServices = bookingServices.map(item => ({...item}))

        this.bookingPayments.forEach(item => {
          item.dateFormatted = moment(item.date).format('DD-MM-YYYY HH:mm')
        })

        console.log('bookingServices')
        console.log(this.bookingServices)
        console.log('bookingPayments')
        console.log(this.bookingPayments)
      },
      initAlerts() {
        let isAlert = this.$route.params.isAlert
        let alertType = this.$route.params.alertType
        if (isAlert) {
          if (alertType === 'booking-update-success') {
            if (this.$language === 'en') {
              this.$toasted.show('Booking succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Reservasyon başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
            }
          } else if (alertType === 'booking-create-success') {
            if (this.language === 'en') {
              this.$toasted.show('Booking succesfully created!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.language === 'tr') {
              this.$toasted.show('Rezervasyon başarıyla kayıt edildi!', {icon: 'fa-check-circle', type: 'success'})
            }
          }
        }
      },
      openModalBookingDelete(event) {
        event.preventDefault()
        console.log('bookingViewData', this.bookingViewData)
        this.$refs.removeBookingModal.showModal()
      },
      modalRemoveBookingSuccess(response) {
        let currentBooking = response.body.data.bookingListByDate.find(item => item.id === this.bookingViewData.id)
        console.log({currentBooking})

        store.dispatch({
          type: 'setAppBookingViewData',
          bookingViewData: currentBooking
        })
        this.$localStorage.set('bookingViewData', JSON.stringify(currentBooking))

        if (this.$language === 'en') {
          this.$toasted.show('Booking successfully removed!', {icon: 'fa-check-circle', type: 'success'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Rezervasyon Silindi!', {icon: 'fa-check-circle', type: 'success'})
        }
      },
      modalRemoveBookingFailed() {
        if (this.$language === 'en') {
          this.$toasted.show('Something went wrong when trying to delete the booking', {icon: 'fa-exclamation-triangle', type: 'error'})
        } else if (this.$language === 'tr') {
          this.$toasted.show('Rezervasyon silinirken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
        }
      },
      goToBookingEdit(event) {
        event.preventDefault()
        this.updateStore()
        router.push({name: 'bookingAdmin', params: {originRoute: 'bookingsView', editing: true}})
      },
      goToAddPayment(event) {
        event.preventDefault()
        this.updateStore()
        if (this.user.role === 'admin') {
          this.$router.push({name: 'paymentForm-o'})
        } else if (this.user.role === 'manager') {
          this.$router.push({name: 'paymentForm-m'})
        }
      },
      updateStore() {
        store.dispatch({
          type: 'setAppCurrentBooking',
          currentBooking: this.bookingViewData
        })
        this.$localStorage.set('currentBooking', JSON.stringify(this.bookingViewData))
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .type {
    text-transform:capitalize;
  }
  .paymentBlock {
    margin-left: 8px;
    font-size: 1.3rem;
    font-weight: 300;
    line-height: 16px;
    margin-bottom: 6px;
  }
  .paymentDescription {
    font-size: 0.9rem;
  }
  .card.-deleted {
    & .card-body {
      background-color: #f29b9b;
    }
  }
</style>
