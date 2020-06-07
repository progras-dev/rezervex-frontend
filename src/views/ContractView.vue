<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-file-text" aria-hidden="true"></i>
          {{ currentContract.name }}
        </span>
        <div class="white-text pageSubtitle"><span v-lang.contractInfo></span></div>
      </div>
    </div>

    <b-card>

      <div class="row mb-2">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-info btn-lg btn-block white" @click="makePreview($event)">
            <i class="fa fa-image"></i>
            <span v-lang.preview></span>
          </button>
        </div>
        <div class="col-sm-3">
          <button type="submit" class="btn btn-info btn-lg btn-block white" @click="goToContractEdit($event)">
            <i class="fa fa-edit"></i>
            <span v-lang.edit></span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-info-circle"></i>
              </div>
              <div class="h3 text-success"><span v-lang.contractInfo></span></div>
              <div>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.title></span>: {{ currentContract.title }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.subtitle></span>: {{ currentContract.subtitle }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.text></span>: {{ currentContract.text }}</p>
                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.copyright></span>: {{ currentContract.copyright }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-image"></i>
              </div>
              <div class="h3 text-success"><span v-lang.image></span></div>
              <img v-if="currentContract.image_name" :src="appApiPath + currentContract.image_path" alt="">
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.contractFields></span></div>
              <div>
                <p class="card-text lead"  v-for="(field, index) in currentContract.fields" :key="index">
                  <span v-if="language === 'tr'"> {{ field.name_tr }} </span>
                  <span v-if="language === 'en'"> {{ field.name_en }} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="card">
            <div class="card-block">
              <div class="h1 text-muted text-right mb-2">
                <i class="fa fa-list"></i>
              </div>
              <div class="h3 text-success"><span v-lang.customFields></span></div>
              <div>
                <p class="card-text lead"  v-for="(customField, index) in currentContract.custom_fields" :key="index">
                  <span> {{ customField.name }} </span>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </b-card>


    <b-modal ref="modalAssignProperties" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.assignProperties></span></h5>
      </template>
      <span v-lang.assignPropertiesInfo></span>

      <v-select multiple v-model="propertiesSelected" :options="propertiesFormatted"></v-select>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalAssignProperties.hide()">
          <span v-lang.close></span>
        </b-btn>
        <b-btn variant="success" class="white" @click="updateProperties">
          <span v-lang.update></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import vSelect from 'vue-select'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { createContractPdf } from '../mixins/createContractPdf'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  export default {
    components: { vSelect },
    mixins: [savePropertiesInStorage, saveContractsInStorage, createContractPdf],
    data() {
      return {
        propertiesSelected: [],
        propertiesFormatted: [],
        contractPropertiesScoped: [],
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      currentContract() {
        return store.getters.getCurrentContract
      },
      properties() {
        return store.getters.getProperties
      },
      user() {
        return store.getters.getUser
      },
    },

    created() {
      this.$language = this.language
      console.log('currentContract', this.currentContract)
      this.contractPropertiesScoped = this.currentContract.properties.map(item => ({...item}))
      this.initPropertiesForModal()
    },

    methods: {
      initPropertiesForModal() {
        // Format properties list
        for (let i = 0; i < this.properties.length; i++) {
          let property = {}
          property.value = this.properties[i].id
          property.label = this.properties[i].name
          this.propertiesFormatted.push(property)
          // Create array with selected properties for the select
          for (let j = 0; j < this.contractPropertiesScoped.length; j++) {
            if (property.value === this.contractPropertiesScoped[j].id) {
              this.propertiesSelected.push(property)
            }
          }
        }
      },
      goToContractEdit() {
        this.$localStorage.set('currentContract', JSON.stringify(this.currentContract))
        store.dispatch({
          type: 'setAppCurrentContract',
          currentContract: this.currentContract
        })
        this.$localStorage.set('contractFormType', 'edit')
        store.dispatch({
          type: 'setAppContractFormType',
          contractFormType: 'edit'
        })
        this.$router.push({name: 'contractForm'})
      },
      openPropertiesModal() {
        this.$refs.modalAssignProperties.show()
      },
      updateProperties() {
        this.$refs.modalAssignProperties.hide()
        let propertiesIds = []
        // Reset properties in the view
        this.contractPropertiesScoped = []
        for (let i = 0; i < this.propertiesSelected.length; i++) {
          propertiesIds.push(this.propertiesSelected[i].value)
          // Updating in the view
          let property = {}
          property.name = this.propertiesSelected[i].label
          property.id = this.propertiesSelected[i].value
          this.contractPropertiesScoped.push(property)
        }
        let formData = new FormData()
        formData.append('user_id', this.user.id)
        formData.append('contract_id', this.currentContract.id)
        formData.append('properties', JSON.stringify(propertiesIds))
        this.$http.post(this.appApiPath + '/api/contract_properties_save', formData)
          .then(response => {
            console.log('success response from contract_properties_save')
            console.log(response.body)
            console.log('tha properties contractrs')
            console.log(this.contractPropertiesScoped)

            // Update current contract
            let contractUpdated = this.currentContract
            contractUpdated.properties = this.contractPropertiesScoped
            store.dispatch({
              type: 'setAppCurrentContract',
              currentContract: contractUpdated
            })
            this.$localStorage.set('currentContract', JSON.stringify(contractUpdated))

            // Update contracts
            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)

            // Update properties
            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')

            // Display toast message
            if (this.contractPropertiesScoped.length > 0) {
              if (this.$language === 'en') {
                this.$toasted.show('Contract successfully assigned to the property!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Sözleşme Salon ile eşleştirildi!', {icon: 'fa-check-circle', type: 'success'})
              }
            } else if (this.contractPropertiesScoped.length === 0) {
              if (this.$language === 'en') {
                this.$toasted.show('Contract assignments successfully updated.', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.$language === 'tr') {
                this.$toasted.show('Eşleştirme düzenleme işlemi tamamlandı.', {icon: 'fa-check-circle', type: 'success'})
              }
            }
          }, response => {
            console.warn('error from contract_properties_save')
            console.log(response)
            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      },
      makePreview(event) {
        event.preventDefault()

        let contractData = {
          invoiceCounter: 1,
          propertyName: 'Salon adı',
          user: this.user,
          contractInfo: {
            title: this.currentContract.title,
            subtitle: this.currentContract.subtitle,
            copyright: this.currentContract.copyright,
            text: this.currentContract.text,
            fieldsArray: this.currentContract.fields,
            customFieldsArray: this.currentContract.custom_fields,
            logo: this.currentContract.base64,
          },
          clientData: {
            clientFullName: 'Müşteri adı',
            clientPhone: 'Müşteri telefon',
            clientEmail: 'Müşteri e-posta',
            groomRegion: 'Damat adı',
            groomPhone: 'Damat telefon',
            groomEmail: 'Damat e-posta',
            groomFullName: 'Damat adı',
            brideFullName: 'Gelin adı',
            brideRegion: 'Gelin yöre',
            bridePhone: 'Gelin telefon',
            brideEmail: 'Gelin e-posta',
          },
          bookingData: {
            totalCost: 1000,
            advance: 100,
            notes: 'Notlar',
            addedServices: [],
            totalGuests: 100,
            date: '10/10/2020',
            timeStart: {
              HH: 19,
              mm: 30,
            },
            timeEnd: {
              HH: 23,
              mm: 30,
            },
          }
        }

        let contractPreview = this.createContract(contractData) // mixin
        pdfMake.createPdf(contractPreview).download('sample.pdf')
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }
</style>




