<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow otherPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-mobile" aria-hidden="true"></i>
          SMS
        </span>
        <div class="white-text pageSubtitle"><span v-lang.smsManageSubtitle></span></div>
      </div>
    </div>

    <div class="card cardMT">

      <div class="card-body">
        <div class="row">
          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">
                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-users"></i>
                </div>
                <div class="h3 text-success"><span v-lang.clients></span></div>

                <div class="jumbotron jumbotron-fluid jumbotronCustom">
                  <div class="container">
                    <span class="bookingTabInfo">
                      <i class="fa fa-info-circle bookingTabInfoIcon"></i>
                      <span v-lang.smsInfoText></span>
                    </span>
                  </div>
                </div>

                <div class="form-check" v-for="(option, index) in customerListOptions" :key="index">
                  <input
                    type="radio"
                    class="form-check-input"
                    name="exampleRadios"
                    :id="option.value"
                    :value="option.value"
                    :checked="customerListType === option.value"
                    @input="customerListTypeChanged(option.value)"
                  >
                  <label class="form-check-label" :for="option.value">
                    {{ option.text }}
                  </label>
                </div>

                <v-select multiple v-model="selectedCustomers" :options="clientListFormatted" @input="clientSelected"></v-select>

                <div class="invalid-feedback" v-if="showErrorNoCustomersSelected">
                  <span v-lang.customersRequired></span>
                </div>

                <div class="h3 text-success mt20"><span v-lang.selectedCustomers></span></div>


                <b-table class="table-responsive-sm mb-0"
                         :bordered="false"
                         :items="selectedCustomers"
                         :fields="tableFields"
                         v-if="showTable"
                >

                  <template v-slot:cell(has_booking)="item">
                    <span v-if="item.item.bookings.length > 0"><i class="fa fa-check text-success"></i></span>
                    <span v-if="item.item.bookings.length === 0"><i class="fa fa-minus-circle" style="color: #999;"></i></span>
                  </template>

                </b-table>

              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">
                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-mobile"></i>
                </div>
                <div class="h3 text-success"><span v-lang.smsForm></span></div>

                <div class="form-group">
                  <label for="inputMessage"><span v-lang.message></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                    <textarea
                      rows="5"
                      class="form-control lightBorders"
                      :class="{'is-invalid': $v.message.$error}"
                      v-model="message"
                      :placeholder="labelMessage"
                      id="inputMessage"
                      @input="$v.message.$touch()"
                      @keydown="onKeyDown"
                    ></textarea>
                  </div>
                  <small class="form-text text-muted"> <span v-lang.remainingChars></span> {{ 140 - message.length }} </small>
                  <div class="invalid-feedback" v-if="!$v.message.required && $v.message.$dirty">
                    <span v-lang.messageRequired></span>
                  </div>
                </div>

                <div class="form-group row mt25">
                  <div class="col-sm-11 offset-md-1">
                    <button type="submit" class="btn btn-info btn-lg btn-block white" @click="messageSend($event)">
                      <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                      <i class="fa fa-check-circle mr-1" v-if="!showSpinner"></i>
                      <span v-lang.sendMessage></span>
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
</template>

<script>
  import store from '../vuex/store'
  import vSelect from 'vue-select'
  import { labels } from '../mixins/labels'
  import Icon from 'vue-awesome/components/Icon'
  import { required, maxLength } from 'vuelidate/lib/validators'

  export default {
    components: { vSelect, Icon },
    mixins: [ labels ],
    data () {
      return {
        clientListFormatted: [],
        selectedCustomers: null,
        message: '',
        showSpinner: false,
        showTable: false,
        customerListType: 'all',
        showErrorNoCustomersSelected: false
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      user () {
        return store.getters.getUser
      },
      clients () {
        return store.getters.getClients
      },
      customerListOptions () {
        if (this.language === 'tr') {
          return [
            { text: 'Tüm Müşteriler', value: 'all' },
            { text: 'Rezervasyonu olmayanlar', value: 'without' },
            { text: 'Rezervasyonu olanlar', value: 'with' }
          ]
        } else if (this.language === 'en') {
          return [
            { text: 'All Customers', value: 'all' },
            { text: 'Without booking', value: 'without' },
            { text: 'With booking', value: 'with' }
          ]
        }
      },
      tableFields() {
        if (this.language === 'en') {
          return [
            {
              label: 'Name',
              class: ['text-center', 'propertiesTable'],
              key: 'full_name',
            },
            {
              label: 'Phone',
              class: ['text-center', 'propertiesTable'],
              key: 'phone',
            },
            {
              label: 'Has Booking',
              class: ['text-center', 'propertiesTable'],
              key: 'has_booking',
            },
          ]
        } else if (this.language === 'tr') {
          return [
            {
              label: 'Adı',
              class: ['text-center', 'propertiesTable'],
              key: 'full_name',
            },
            {
              label: 'Telefon',
              class: ['text-center', 'propertiesTable'],
              key: 'phone',
            },
            {
              label: 'Rezervasyon',
              class: ['text-center', 'propertiesTable'],
              key: 'has_booking',
            },
          ]
        }
      }
    },
    watch: {
      selectedCustomers: function () {
        if (this.selectedCustomers.length === 0) {
          this.showTable = false
        }
      }
    },
    validations: {
      message: {
        required,
        maxLength: maxLength(140)
      },
    },
    created () {
      this.$language = this.language
      this.initClients()
    },
    methods: {
      initClients() {
        this.clientListFormatted = []
        for (let i = 0; i < this.clients.length; i++) {
          let client = {...this.clients[i]}
          client.value = this.clients[i].id
          client.label = this.clients[i].full_name
          this.clientListFormatted.push(client)
        }
      },
      clientSelected() {
        this.showErrorNoCustomersSelected = false
        if (this.selectedCustomers.length > 0) {
          this.showTable = true
        }
      },
      onKeyDown(event) {
        if (this.message.length >= 140) {
          event.preventDefault()
        }
      },
      customerListTypeChanged(type) {
        this.customerListType = type
        this.updateCustomerList(type)
      },
      updateCustomerList(type) {
        let filteredArray = []
        this.initClients()
        if (type !== 'all') {
          for (let i = 0; i < this.clientListFormatted.length; i++) {
            if (type === 'without') {
              if (this.clientListFormatted[i].bookings.length === 0) {
                filteredArray.push({...this.clientListFormatted[i]})
              }
            } else if (type === 'with') {
              if (this.clientListFormatted[i].bookings.length > 0) {
                filteredArray.push({...this.clientListFormatted[i]})
              }
            }
          }
          this.clientListFormatted = filteredArray.map(item => ({...item}))
        }
      },
      messageSend() {
        if (!this.selectedCustomers) {
          this.showErrorNoCustomersSelected = true
        } else if (this.$v.$invalid) {
          this.$v.message.$touch()
        } else {
          this.showErrorNoCustomersSelected = false
          this.showSpinner = true
          let customersIds = []

          for (let i = 0; i < this.selectedCustomers.length; i++) {
            customersIds.push(this.selectedCustomers[i].id)
          }

          const formData = {
            'customers_ids': customersIds,
            'message': this.message,
            'user_id': this.user.id
          }

          this.$http.post(this.appApiPath + '/api/sms_send', formData)
            .then(response => {
              console.log('sms_send success')
              console.log(response.body)

              this.showSpinner = false

              if (this.$language === 'en') {
                this.$toasted.show('Sms sent successfully', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Sms sent successfully', {icon: 'fa-check-circle', type: 'success'})
              }
            }, response => {
              console.log('sms_send error')
              console.log(response)

              this.showSpinner = false

              if (this.$language === 'en') {
                this.$toasted.show('Something went wrong sending the sms', {icon: 'fa-exclamation-triangle', type: 'error'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Something went wrong sending the sms', {icon: 'fa-exclamation-triangle', type: 'error'})
              }
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
