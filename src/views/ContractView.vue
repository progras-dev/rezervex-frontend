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

  </div>
</template>

<script>
  import store from '../vuex/store'
  import vSelect from 'vue-select'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { createContractPdf } from '../mixins/createContractPdf'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  export default {
    components: { vSelect },
    mixins: [saveContractsInStorage, createContractPdf],
    data() {
      return {
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
      user() {
        return store.getters.getUser
      },
    },

    created() {
      this.$language = this.language
      console.log('currentContract', this.currentContract)
    },

    methods: {
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




