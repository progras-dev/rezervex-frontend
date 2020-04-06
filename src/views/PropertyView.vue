<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-building" aria-hidden="true"></i>
          {{ propertyNameTitle }}
        </span>
        <div class="white-text pageSubtitle"><span v-lang.propertyDetails></span></div>
      </div>
    </div>

    <div class="card cardMT">

      <div class="card-body">

        <div class="form-group row">
          <div class="col-sm-3">
            <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToPropertyEdit">
              <i class="fa fa-edit"></i>
              <span v-lang.propertyEdit></span>
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
                <div class="h3 text-success"><span v-lang.propertyDetails></span></div>
                <div>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.description></span>: {{ property.description }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.capacityGeneral></span>: {{ property.capacity_general }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.capacityWithFood></span>: {{ property.capacity_with_food }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.minimumDeposit></span>: {{ property.minimum_deposit | numberFormat }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.address></span>: {{ property.address }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.latitude></span>: {{ property.lat }}</p>
                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.longitude></span>: {{ property.lng }}</p>

                  <div class="h3 text-success mt10"><span v-lang.managers></span></div>

                  <p class="card-text normalText200 mb5"
                     v-for="(manager, index) in property.managers"
                     :key="index">
                    {{ manager.first_name }} {{ manager.last_name }}
                  </p>
                  <div class="h3 text-success mt10"><span v-lang.seasons></span></div>

                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.highSeasons></span>:
                    <span v-for="(season, index) in highSeasonMonthsNames" :key="index">{{season}}<span v-if="highSeasonMonthsNames.length !== index + 1">, </span></span>
                  </p>

                  <p class="card-text normalText200"> <span class="fontWeight300" v-lang.lowSeasons></span>:
                    <span v-for="(season, index) in lowSeasonMonthsNames" :key="index">{{season}}<span v-if="lowSeasonMonthsNames.length !== index + 1">, </span></span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">

                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-money"></i>
                </div>


                <div class="h3 text-success"><span v-lang.defaultPrices></span></div>

                <b-tabs class="mt25">
                  <b-tab :title="String(yearCurrent)" active>
                    <div class="h3 text-success"><span v-lang.highSeason></span></div>
                    <div class="row">
                      <div class="col-md-3">
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.dayPrice></span></label>
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.nightPrice></span></label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.workingDays></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_working_days_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_working_days_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.friday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_friday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_friday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.saturday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_saturday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_saturday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.sunday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_sunday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_high_season_sunday_night | numberFormat }}
                      </div>
                    </div>

                    <div class="h3 text-success mt25"><span v-lang.lowSeason></span></div>
                    <div class="row">
                      <div class="col-md-3">
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.dayPrice></span></label>
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.nightPrice></span></label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.workingDays></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_working_days_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_working_days_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.friday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_friday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_friday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.saturday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_saturday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_saturday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.sunday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_sunday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_current_year[0].default_price_low_season_sunday_night | numberFormat }}
                      </div>
                    </div>
                  </b-tab>
                  <b-tab :title="String(yearNext)">
                    <div class="h3 text-success"><span v-lang.highSeason></span></div>
                    <div class="row">
                      <div class="col-md-3">
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.dayPrice></span></label>
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.nightPrice></span></label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.workingDays></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_working_days_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_working_days_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.friday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_friday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_friday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.saturday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_saturday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_saturday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.sunday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_sunday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_high_season_sunday_night | numberFormat }}
                      </div>
                    </div>

                    <div class="h3 text-success mt25"><span v-lang.lowSeason></span></div>
                    <div class="row">
                      <div class="col-md-3">
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.dayPrice></span></label>
                      </div>
                      <div class="col-md-4">
                        <label> <span v-lang.nightPrice></span></label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.workingDays></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_working_days_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_working_days_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.friday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_friday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_friday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.saturday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_saturday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_saturday_night | numberFormat }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3">
                        <span class="priceLabel" v-lang.sunday></span>
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_sunday_day | numberFormat }}
                      </div>
                      <div class="col-md-4 price">
                        {{ property.default_prices_next_year[0].default_price_low_season_sunday_night | numberFormat }}
                      </div>
                    </div>
                  </b-tab>
                </b-tabs>

              </div>
            </div>
          </div>

        </div>


        <div class="row">

          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">

                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-file-text"></i>
                </div>

                <div class="h3">
                  <span v-lang.contract class="text-success"></span>
                  <span class="text-success">:</span>
                  <span class="fontWeight300" v-lang.noContracts v-if="!property.contract_id"></span>
                  <span class="fontWeight300" v-if="property.contract_id"> {{ property.contract.name }}</span>
                </div>

                

                <button v-if="property.contract_id" type="submit" class="btn btn-info btn-block white" @click="makePreview($event)">
                  <i class="fa fa-image"></i>
                  <span v-lang.preview></span>
                </button>

                <button v-if="!property.contract_id" type="submit" class="btn btn-info btn-block white" @click="openContractModal()">
                  <i class="fa fa-plus-circle"></i>
                  <span v-lang.assignContract></span>
                </button>

                <button v-if="property.contract_id" type="submit" class="btn btn-info btn-block white" @click="openContractModal()">
                  <i class="fa fa-plus-circle"></i>
                  <span v-lang.updateContract></span>
                </button>

                <div class="h3 text-success" style="margin-top: 20px"><span v-lang.invoice></span></div>

                <p class="card-text normalText200">
                  <span class="fontWeight300" v-lang.invoceRequire></span>:
                  <span v-if="property.has_invoice" v-lang.yes></span>
                  <span v-if="!property.has_invoice" v-lang.no></span>
                </p>

                <button v-if="property.has_invoice" type="submit" class="btn btn-info btn-block white" @click="invoicePreview($event)">
                  <i class="fa fa-image"></i>
                  <span v-lang.preview></span>
                </button>

              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">

                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-map"></i>
                </div>

                <div class="h3 text-success"><span v-lang.map></span></div>

                <gmap-map v-if="property.lat && property.lng" class="locationMap" :zoom="zoomLevel" :center="mapCenter">
                  <GmapMarker v-for="(marker, index) in markers"
                              :key="index"
                              :position="marker.position"
                  />
                </gmap-map>

                <p class="card-text normalText200" v-if="!property.lat && !property.lng"> <span v-lang.noMap></span></p>

              </div>
            </div>
          </div>

        </div>

        <div class="row">

          <div class="col-sm-12">
            <div class="card">
              <div class="card-block">
                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-image"></i>
                </div>
                <div class="h3 text-success"><span v-lang.propertyImages></span></div>
                <div v-if="property.images" class="container">

                  <div class="image" v-for="(image, index) in property.images" :key="index">
                    <!--<img :src="image.base64">-->
                    <img v-if="image.base64" :src="image.base64">
                    <img v-if="!image.base64" :src="appApiPath + '/thumbs/' + image.name">
                  </div>

                </div>

                <p class="card-text normalText200" v-if="!property.images"> <span v-lang.noImages></span></p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <b-modal ref="modalAssignContract" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.assignContract></span></h5>
      </template>
      <span v-lang.assignContractInfo></span>

      <v-select v-model="contractSelected" :options="contractsFormatted"></v-select>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalAssignContract.hide()">
          <span v-lang.close></span>
        </b-btn>
        <b-btn variant="success" class="white" @click="contractAssign">
          <span v-lang.assign></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'
  import vSelect from 'vue-select'
  import moment from 'moment'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { createContractPdf } from '../mixins/createContractPdf'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  export default {
    router: router,

    components: { vSelect },
    mixins: [savePropertiesInStorage, saveContractsInStorage, createContractPdf],

    data () {
      return {
        zoomLevel: 15,
        contractSelected: {},
        contractsFormatted: [],
        lowSeasonArray: [],
        highSeasonArray: [],
        lowSeasonMonthsNames: [],
        highSeasonMonthsNames: [],
        yearCurrent: '',
        yearNext: '',
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      property() {
        return store.getters.getCurrentProperty
      },
      user() {
        return store.getters.getUser
      },
      contracts() {
        return store.getters.getContracts
      },
      mapCenter() {
        return { lat: this.property.lat, lng: this.property.lng }
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      markers() {
        return [{
          position: {
            lat: parseFloat(this.mapCenter.lat),
            lng: parseFloat(this.mapCenter.lng),
          }
        }]
      },
      propertyNameTitle() {
        return this.property.name[0].toUpperCase() + this.property.name.substring(1)
      }
    },

    created () {
      this.$language = this.language
      this.yearCurrent = moment().year()
      this.yearNext = moment().add(1, 'year').year()
      this.initMonths()
      this.initContracts()
      this.initContractSelected()
    },

    methods: {
      initMonths() {
        this.lowSeasonArray = JSON.parse(this.property.low_season_months)
        this.highSeasonArray = JSON.parse(this.property.high_season_months)
        this.lowSeasonMonthsNames = this.monthGetNames(this.lowSeasonArray)
        this.highSeasonMonthsNames = this.monthGetNames(this.highSeasonArray)
      },
      goToPropertyEdit () {
        console.log('go to edit')
        let propertyToEdit = {...this.property}

        propertyToEdit.lat = parseFloat(this.property.lat)
        propertyToEdit.lng = parseFloat(this.property.lng)

        this.$localStorage.set('currentProperty', JSON.stringify(propertyToEdit))
        store.dispatch({
          type: 'setAppCurrentProperty',
          currentProperty: propertyToEdit
        })

        this.$localStorage.set('propertyFormType', 'edit')
        store.dispatch({
          type: 'setAppPropertyFormType',
          propertyFormType: 'edit'
        })

        if (this.user.role === 'manager') {
          router.push({name: 'propertyForm-m'})
        } else if (this.user.role === 'admin') {
          router.push({name: 'propertyForm-o'})
        }
      },
      monthGetNames(array) {
        let names = []
        for (let i = 0; i < array.length; i++) {
          if (array[i] === 1) {
            if (this.language === 'tr') {
              names.push('Ocak')
            } else if (this.language === 'en') {
              names.push('January')
            }
          }
          if (array[i] === 2) {
            if (this.language === 'tr') {
              names.push('Şubat')
            } else if (this.language === 'en') {
              names.push('February')
            }
          }
          if (array[i] === 3) {
            if (this.language === 'tr') {
              names.push('Mart')
            } else if (this.language === 'en') {
              names.push('March')
            }
          }
          if (array[i] === 4) {
            if (this.language === 'tr') {
              names.push('Nisan')
            } else if (this.language === 'en') {
              names.push('April')
            }
          }
          if (array[i] === 5) {
            if (this.language === 'tr') {
              names.push('Mayıs')
            } else if (this.language === 'en') {
              names.push('May')
            }
          }
          if (array[i] === 6) {
            if (this.language === 'tr') {
              names.push('Haziran')
            } else if (this.language === 'en') {
              names.push('June')
            }
          }
          if (array[i] === 7) {
            if (this.language === 'tr') {
              names.push('Temmuz')
            } else if (this.language === 'en') {
              names.push('July')
            }
          }
          if (array[i] === 8) {
            if (this.language === 'tr') {
              names.push('Ağustos')
            } else if (this.language === 'en') {
              names.push('August')
            }
          }
          if (array[i] === 9) {
            if (this.language === 'tr') {
              names.push('Eylül')
            } else if (this.language === 'en') {
              names.push('September')
            }
          }
          if (array[i] === 10) {
            if (this.language === 'tr') {
              names.push('Ekim')
            } else if (this.language === 'en') {
              names.push('October')
            }
          }
          if (array[i] === 11) {
            if (this.language === 'tr') {
              names.push('Kasım')
            } else if (this.language === 'en') {
              names.push('November')
            }
          }
          if (array[i] === 1) {
            if (this.language === 'tr') {
              names.push('Aralık')
            } else if (this.language === 'en') {
              names.push('December')
            }
          }
        }
        return names
      },
      initContracts() {
        for (let i = 0; i < this.contracts.length; i++) {
          let contract = {}
          contract.value = this.contracts[i].id
          contract.label = this.contracts[i].name
          this.contractsFormatted.push(contract)
        }
      },
      initContractSelected() {
        if (this.property.contract_id && this.property.contract) {
          this.contractSelected.value = this.property.contract_id
          this.contractSelected.label = this.property.contract.name
        } else {
          this.contractSelected = {...this.contractsFormatted[0]}
        }
      },
      openContractModal() {
        this.$refs.modalAssignContract.show()
      },
      contractAssign() {
        this.$refs.modalAssignContract.hide()
        let contract = {}
        for (let i = 0; i < this.contracts.length; i++) {
          if (this.contractSelected.value === this.contracts[i].id) {
            contract = {...this.contracts[i]}
          }
        }

        let formData = new FormData()
        formData.append('property_id', this.property.id)
        formData.append('contract_id', contract.id)
        formData.append('user_id', this.user.id)
        this.$http.post(this.appApiPath + '/api/property_contract_save', formData)
          .then(response => {
            console.log('success response from property_contract_save')
            console.log(response.body)

            // Update contracts
            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)
            // Update properties
            let properties = response.body.data.properties
            if (this.user.role === 'admin') {
              store.dispatch({
                type: 'setAppProperties',
                properties: properties
              })
              this.savePropertiesInStorage(properties, 'admin')
            } else if (this.user.role === 'manager') {
              store.dispatch({
                type: 'setAppPropertiesManager',
                propertiesManager: properties
              })
              this.savePropertiesInStorage(properties, 'manager')
            }

            // Update current property
            for (let i = 0; i < properties.length; i++) {
              if (properties[i].id === this.property.id) {
                store.dispatch({
                  type: 'setAppCurrentProperty',
                  currentProperty: properties[i]
                })
                this.$localStorage.set('currentProperty', JSON.stringify(properties[i]))
              }
            }
            // Display toast
            if (response.body.data.result) {
              if (this.language === 'en') {
                this.$toasted.show('Contract successfully assigned to the property!', {icon: 'fa-check-circle', type: 'success'})
              } else if (this.language === 'tr') {
                this.$toasted.show('Sözleşme Salon ile eşleştirildi!', {icon: 'fa-check-circle', type: 'success'})
              }
            }
          }, response => {
            console.warn('error from property_contract_save')
            console.log(response)
            if (this.language === 'en') {
              this.$toasted.show('Something went wrong', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.language === 'tr') {
              this.$toasted.show('Bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      },
      makePreview() {
        event.preventDefault()

        let contractData = {
          invoiceCounter: 1,
          propertyName: 'Salon adı',
          user: this.user,
          contractInfo: {
            title: this.property.contract.title,
            subtitle: this.property.contract.subtitle,
            copyright: this.property.contract.copyright,
            text: this.property.contract.text,
            fieldsArray: this.property.contract.fields,
            logo: this.property.contract.base64,
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
      contractPreviewOLD(event) {
        event.preventDefault()

        let contract = {
          footer: [
            {text: this.currentProperty.contract.copyright, alignment: 'center', fontSize: 10}
          ],
          content: [],
          styles: {
            header: {
              fontSize: 22,
              bold: true,
            },
            emptyLine: {
              fontSize: 20,
            },
            date: {
              italics: false,
              alignment: 'right',
              margin: [0, 5, 79, 0]
            },
            mt10: {
              margin: [0, 10, 0, 0]
            },
            tableExample: {
              margin: [0, 5, 0, 5],
            },
          }
        }

        if (this.property.contract.base64) {
          contract.content.push({columns: [
            {
              width: 120,
              // height: 90,
              image: this.property.contract.base64,
            },

            {
              width: '*',
              text: [
                {text: '   ' + '\n', style: 'emptyLine'},
                {text: '   ' + '\n', style: 'emptyLine'},
                {text: this.property.contract.title + '\n', style: 'header'},
                {text: this.property.contract.subtitle, fontSize: 16}
              ],
              margin: [30, 0, 0, 0]
            }
          ]})
        } else {
          contract.content.push({
            text: [
              {text: '   ' + '\n', style: 'emptyLine'},
              {text: '   ' + '\n', style: 'emptyLine'},
              {text: this.property.contract.title + '\n', style: 'header'},
              {text: this.property.contract.subtitle, fontSize: 16}
            ]
          })
        }

        var contentArray = []

        if (this.language === 'tr') {
          contentArray.push({ text: 'tarih: ', style: 'date' })
        } else if (this.language === 'en') {
          contentArray.push({ text: 'date: ', style: 'date' })
        }

        for (let i = 0; i < this.property.contract.fields.length; i++) {
          let field = {...this.property.contract.fields[i]}
          if (field.identifier === 'manager_name') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                margin: [0, 10, 0, 0]
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                margin: [0, 10, 0, 0]
              }
            ]})
          }

          if (field.identifier === 'manager_phone') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'manager_address') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'client_name') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'client_phone') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'client_email') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'property_name') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'wedding_date') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'wedding_time') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'bride_name') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'bride_region') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'bride_phone') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_name') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_place') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'groom_phone') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'total_guests') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'services') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'notes') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '   ',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'total_cost') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':',
                style: 'mt10'
              },
              {
                width: '*',
                text: '₺ 0,00',
                decoration: 'underline',
                decorationStyle: 'dotted',
                style: 'mt10'
              }
            ]})
          }

          if (field.identifier === 'advance') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '₺ 0,00',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }

          if (field.identifier === 'remaining') {
            contentArray.push({columns: [
              {
                width: 130,
                text: this.language === 'tr' ? field.name_tr + ':' : field.name_en + ':'
              },
              {
                width: '*',
                text: '₺ 0,00',
                decoration: 'underline',
                decorationStyle: 'dotted',
              }
            ]})
          }
        }

        contract.content.push({
          style: 'tableExample',
          table: {
            widths: [500],
            body: [
              [
                contentArray
              ]
            ]
          },
          layout: {
            hLineColor: function () {
              return '#555'
            },
            vLineColor: function () {
              return '#555'
            },
            paddingLeft: function () { return 15 },
            paddingRight: function () { return 10 },
            paddingTop: function () { return 10 },
            paddingBottom: function () { return 10 },
          }
        })

        if (this.property.contract.text) {
          contract.content.push({
            style: 'tableExample',
            table: {
              widths: [500],
              body: [
                [
                  {text: this.property.contract.text}
                ]
              ]
            },
            layout: {
              hLineColor: function () {
                return '#555'
              },
              vLineColor: function () {
                return '#555'
              },
              paddingLeft: function () { return 15 },
              paddingRight: function () { return 10 },
              paddingTop: function () { return 10 },
              paddingBottom: function () { return 10 },
            }
          })
        }

        console.log('contract')
        console.log(contract)

        pdfMake.createPdf(contract).download('sample.pdf')
      },
      invoicePreview(event) {
        event.preventDefault()
        var invoice = {
          footer: [
            {text: '', alignment: 'center'}
          ],
          content: [],
          styles: {
            header: {
              fontSize: 22,
              bold: true
            },
            date: {
              italics: false,
              alignment: 'right',
              margin: [0, 30, 79, 0]
            },
            mt10: {
              margin: [0, 10, 0, 0]
            },
            mt5: {
              margin: [0, 5, 0, 0]
            },
            tableExample: {
              margin: [0, 5, 0, 15],
              color: '#3F51B5',
              fontSize: 11
            },
            tableExampleNoMargin: {
              margin: [0, 5, 0, 5],
              color: '#3F51B5',
              fontSize: 11
            },
            tableHeader: {
              fontSize: 12,
            },
            tablePrices: {
              // margin: [5, 5, 5, 5],
              color: '#3F51B5',
              fontSize: 8
            }
          }
        }

        invoice.content.push({columns: [
          {
            width: 75,
            height: 280,
            margin: [0, 0, 0, 0],
            image: 'data:image/jpeg;base64,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',
          },

          {
            style: 'tableExample',
            table: {
              width: 'auto',
              body: [
                [
                  [
                    {
                      table: {
                        widths: [99, 99, 99, 99],
                        body: [
                          [
                            {text: 'Vade', alignment: 'center', decoration: 'underline'},
                            {text: 'Ödeme Tarihi', alignment: 'center', decoration: 'underline'},
                            {text: 'Türk Lirasi', alignment: 'center', decoration: 'underline'},
                            {text: 'No', alignment: 'center', decoration: 'underline'}
                          ],
                          [
                            {text: '         ', decoration: 'underline', alignment: 'center'},
                            {text: '         ', decoration: 'underline', alignment: 'center'},
                            {text: '         ', decoration: 'underline', alignment: 'center'},
                            {text: '         ', decoration: 'underline', alignment: 'center'}
                          ]
                        ]
                      },
                      layout: 'noBorders'
                    },

                    {
                      text: 'İşbu emre muarrer ___________________ mukabilinde ____________________ tarihinde',
                      margin: [0, 10, 0, 0]
                    },
                    {
                      text: 'Bay ______________________________________________ veyahat emrühavale _________',
                      style: 'mt5'
                    },
                    {
                      text: 'yukarıda yazılı yalnız ___________________________________________________ T. Lirası',
                      style: 'mt5'
                    },
                    {
                      text: 'ödeyeceği _____ bedeyi ahzolunmuştur. İşbu bönö vadesinde ödenmediği takdirde',
                      style: 'mt5'
                    },
                    {
                      text: 'muteakip bonoların da muacceliyet kesbedeceğini, ihtilaf vukuunda _____________',
                      style: 'mt5'
                    },
                    {
                      text: 'mahkemelerinin selahiyetini şimdiden kabul eyler ____',
                      style: 'mt5'
                    },
                    {
                      text: 'Ödeyecek ___________________________________________',
                      style: 'mt5'
                    },
                    {
                      text: '_____________________________________________________',
                      style: 'mt5'
                    },
                    {
                      text: '_____________________________________________________',
                      style: 'mt5'
                    },
                    {
                      text: 'Kefili ________________________________________________',
                      style: 'mt5'
                    },
                    {
                      text: '_____________________________________________________',
                      style: 'mt5'
                    }
                  ]
                ]
              ]
            },
            layout: {
              hLineColor: function () { return '#3F51B5' },
              vLineColor: function () { return '#3F51B5' },
              paddingLeft: function () { return 10 },
              paddingRight: function () { return 10 },
              paddingTop: function () { return 10 },
              paddingBottom: function () { return 10 },
            }
          }
        ]})

        invoice.content.push({
          style: 'tableExampleNoMargin',
          table: {
            widths: [350, '*'],
            body: [
              [
                [
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'Adı Soyadı'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'T.C: Kimlik No'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                        style: 'mt5'
                      }
                    ]
                  },
                  {
                    columns: [
                      {
                        width: 80,
                        text: 'Adresi'
                      },
                      {
                        width: '*',
                        text: ' : ____________________________________________________',
                        style: 'mt5'
                      }
                    ]
                  },
                  {text: '_____________________________________________________________________', style: 'mt5'},
                  {text: '_____________________________________________________________________', style: 'mt5'},
                  {
                    columns: [
                      {
                        width: 180,
                        text: 'Tel1 ____________________________',
                        style: 'mt5'
                      },
                      {
                        width: 180,
                        text: 'Tel2 ____________________________',
                        style: 'mt5'
                      }
                    ]
                  }
                ],
                [
                  {text: 'Senet No. __________'},
                  {text: '____________________'},
                  {text: 'Satiş Tarihi', margin: [0, 10, 0, 0], alignment: 'center'},
                  {text: '____ / ____ / 201__', margin: [0, 15, 0, 0], alignment: 'center'}
                ]
              ]
            ]
          },
          layout: {
            hLineColor: function () { return '#3F51B5' },
            vLineColor: function () { return '#3F51B5' },
            paddingLeft: function () { return 10 },
            paddingRight: function () { return 10 },
            paddingTop: function () { return 10 },
            paddingBottom: function () { return 10 },
          }
        })

        invoice.content.push({
          style: 'tablePrices',
          table: {
            widths: [35, 100, 50, 25, 55, 55, 55, 51],
            heights: 5,
            headerRows: 2,
            body: [
              [
                {text: 'SATILAN MALIN', colSpan: 3, alignment: 'center', border: [true, true, true, true]},
                {},
                {},
                {text: 'ÖDEMELERİN', colSpan: 5, alignment: 'center', border: [true, true, true, true]},
                {},
                {},
                {},
                {}
              ],
              [
                {text: 'ADEDİ', alignment: 'center', border: [true, true, true, true]},
                {text: 'ÜRÜN KODU', alignment: 'center', border: [true, true, false, true]},
                {text: 'FİYATI', alignment: 'center', border: [false, true, true, true]},
                {text: 'SİRA', alignment: 'center', border: [true, true, true, true]},
                {text: 'TARİHİ', alignment: 'center', border: [true, true, true, true]},
                {text: 'MİKTARI', alignment: 'center', border: [true, true, true, true]},
                {text: 'TARİH', alignment: 'center', border: [true, true, false, true]},
                {text: 'İMZA', alignment: 'center', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 1 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 2 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 3 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 4 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 5 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 6 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 7 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 8 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 9 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 10 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 11 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 12 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 13 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 14 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ],
              [
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]},
                {text: ' 15 ', border: [true, true, true, true], alignment: 'center'},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, true, true]},
                {text: '   ', border: [true, true, false, true]},
                {text: '   ', border: [false, true, true, true]}
              ]
            ]
          },
          layout: {
            defaultBorder: false,
            hLineColor: function () { return '#3F51B5' },
            vLineColor: function () { return '#3F51B5' },
            paddingLeft: function () { return 5 },
            paddingRight: function () { return 5 },
            paddingTop: function () { return 5 },
            paddingBottom: function () { return 5 },
          }
        })

        console.log('invoice')
        console.log(invoice)

        pdfMake.createPdf(invoice).download('invoice.pdf')
      },
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .locationMap {
    height: 300px;
  }
  .image {
    float: left;
    width: 33.333%;
    padding: .75rem;
    margin-bottom: 2rem;
    border: 0;
  }
  .image > img {
    margin-bottom: .75rem;
    width: 100%;
  }
  .priceLabel {
    font-size: 0.95rem;
    font-weight: 300;
  }
  .price {
    font-size: 0.95rem;
    font-weight: 400;
  }
  .btn i {
    margin-right: 5px;
  }
</style>
