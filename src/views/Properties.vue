<template>
  <div class="animated fadeIn">


    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-building" aria-hidden="true"></i>
          <span v-lang.propertiesList></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.propertiesSubtitle></span></div>
      </div>
    </div>


    <b-card>

      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToPropertyForm">
            <i class="fa fa-plus"></i>
            <span v-lang.propertyAdd></span>
          </button>
        </div>
      </div>



      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="propertiesScoped"
                   :fields="tableFields"
                   head-variant="light"
          >
            <template v-slot:cell(thumbnail)="item">
              <span v-if="item.item.images.length > 0">
                <img :src="appApiPath + '/thumbs/' + item.item.images[0].name" class="imgProperty z-depth-1" alt="" style="width: 100px;">
                <!--<img :src="item.item.images[0].base64" class="z-depth-1" alt="" style="width: 50px;">-->
              </span>
              <span v-else>
                <img src="../assets/img/thumb_placeholder.png" class="z-depth-1" alt="" style="width: 50px;">
              </span>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="goToPropertyView(item.item, $event)" v-b-tooltip.hover title="Go to Property page">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="goToPropertyView(item.item, $event)" v-b-tooltip.hover title="Salon sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="openMapModal(item.item, $event)" v-b-tooltip.hover title="Open Map">
                <i class="fa fa-map-marker-alt"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="openMapModal(item.item, $event)" v-b-tooltip.hover title="Haritayı Aç">
                <i class="fa fa-map-marker-alt"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-primary actionButton" @click="goToPropertyEdit(item.item)" v-b-tooltip.hover title="Edit Property">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-primary actionButton" @click="goToPropertyEdit(item.item)" v-b-tooltip.hover title="Güncelle">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'en' && user.role === 'admin'" variant="outline-danger actionButton" @click="openModalRemoveProperty(item.item, $event)" v-b-tooltip.hover title="Remove Property">
                <i class="fa fa-trash"></i>
              </b-button>
              <b-button v-if="language === 'tr' && user.role === 'admin'" variant="outline-danger actionButton" @click="openModalRemoveProperty(item.item, $event)" v-b-tooltip.hover title="Salonu Sil">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="propertiesScoped.length === 0"> <span v-lang.noProperties></span></p>

        </div><!--/.col-->
      </div><!--/.row-->


    </b-card>

    <b-modal ref="removePropertyModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.propertyRemove></span> </h5>
      </template>

      <span v-lang.alertPropertyRemoveAsk></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
          <span v-lang.propertyRemove></span>
        </b-btn>
      </template>
    </b-modal>


    <b-modal ref="removePropertyNotAllowedModal" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.propertyRemove></span></h5>
      </template>
      <span v-lang.propertyRemvovalNotAllowed></span>

      <template slot="modal-footer">
        <b-btn variant="info" @click="$refs.removePropertyNotAllowedModal.hide()">
          <span class="white">OK</span>
        </b-btn>
      </template>
    </b-modal>


    <b-modal v-if="language === 'en'" title="Map" ref="mapModal" @shown="refreshMap" :hide-footer="true" class="modal-info">
      <gmap-map class="locationMap" :zoom="zoomLevel" :center="mapCenter">
        <GmapMarker v-for="(marker, index) in markers"
                    :key="index"
                    :position="marker.position"
        />
      </gmap-map>
    </b-modal>

    <b-modal v-if="language === 'tr'" title="Harita" ref="mapModal" @shown="refreshMap" :hide-footer="true" class="modal-info">
      <gmap-map class="locationMap" :zoom="zoomLevel" :center="mapCenter">
        <GmapMarker v-for="(marker, index) in markers"
                    :key="index"
                    :position="marker.position"
        />
      </gmap-map>
    </b-modal>



  </div>
</template>

<script>
  import Vue from 'vue'
  import router from '../router'
  import Simplert from 'vue2-simplert'
  import store from '../vuex/store'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'
  import { saveCurrentPropertyInStorage } from '../mixins/saveCurrentPropertyInStorage'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'

  export default {
    components: { Simplert },
    mixins: [savePropertiesInStorage, saveCurrentPropertyInStorage, saveContractsInStorage],
    data() {
      return {
        propertiesScoped: [],
        propertyToRemove: {},
        indexToRemove: -1,
        showAlertPropertyRemoved: false,
        zoomLevel: 15,
        mapCenter: { lat: 39.299501, lng: 35.177332 },
        markers: [],
      }
    },
    computed: {
      properties () {
        return store.getters.getProperties
      },
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      user() {
        return store.getters.getUser
      },
      bookings() {
        return store.getters.getBookingListByDate
      },
      reservations() {
        return store.getters.getReservations
      },
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: 'Image',
              class: ['text-center', 'propertiesTable', 'imageColumn'],
              key: 'thumbnail',
            },
            {
              label: 'Name',
              class: ['text-center', 'propertiesTable'],
              key: 'name',
            },
            {
              label: 'Address',
              class: ['text-center', 'propertiesTable'],
              key: 'address',
            },
            {
              label: 'Actions',
              class: ['text-center', 'propertiesTable'],
              key: 'actions',
            },
          ]
        } else if (this.$language === 'tr') {
          return [
            {
              label: 'Resim',
              class: ['text-center', 'propertiesTable', 'imageColumn'],
              key: 'thumbnail',
            },
            {
              label: 'Adı',
              class: ['text-center', 'propertiesTable'],
              key: 'name',
            },
            {
              label: 'Adres',
              class: ['text-center', 'propertiesTable'],
              key: 'address',
            },
            {
              label: 'İşlemler',
              class: ['text-center', 'propertiesTable'],
              key: 'actions',
            },
          ]
        }
      }
    },
    router: router,
    created() {
      this.$language = this.language
      let isAlert = this.$route.params.isAlert
      let alertType = this.$route.params.alertType

      console.log('properties', this.properties)

      if (isAlert) {
        if (alertType === 'edit-success') {
          if (this.language === 'en') {
            this.$toasted.show('Property succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Salon başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
          }
        } else if (alertType === 'create-success') {
          if (this.language === 'en') {
            this.$toasted.show('Property succesfully created!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Yeni Salon Sisteme Eklendi!', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      }

      this.$language = this.language
      this.propertiesScoped = this.properties.map(item => ({...item}))
    },
    methods: {
      goToPropertyForm (event) {
        event.preventDefault()
        this.$localStorage.set('propertyFormType', 'add')
        store.dispatch({
          type: 'setAppPropertyFormType',
          propertyFormType: 'add'
        })

        if (this.user.role === 'manager') {
          router.push({name: 'propertyForm-m'})
        } else if (this.user.role === 'admin') {
          router.push({name: 'propertyForm-o'})
        }
      },
      goToPropertyEdit (property) {
        console.log('goToEdit')
        console.log(property)
        property.lat = parseFloat(property.lat)
        property.lng = parseFloat(property.lng)

        store.dispatch({
          type: 'setAppCurrentProperty',
          currentProperty: property
        })
        this.saveCurrentPropertyInStorage(property)

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
      openModalRemoveProperty(property, event) {
        event.preventDefault()

        // Check if the property has bookings or reservations
        let hasBookings = false
        let hasReservations = false

        for (let i = 0; i < this.bookings.length; i++) {
          if (this.bookings[i].property_id === property.id) {
            hasBookings = true
          }
        }

        for (let i = 0; i < this.reservations.length; i++) {
          if (this.reservations[i].property_id === property.id) {
            hasReservations = true
          }
        }

        if (hasBookings || hasReservations) {
          this.$refs.removePropertyNotAllowedModal.show()
        } else {
          this.propertyToRemove = {...property}

          for (let i = 0; i < this.propertiesScoped.length; i++) {
            if (property.id === this.propertiesScoped[i].id) {
              this.indexToRemove = i
            }
          }
          this.$refs.removePropertyModal.show()
        }
      },
      openMapModal(property, event) {
        event.preventDefault()
        this.markers = []
        this.mapCenter.lat = parseFloat(property.lat)
        this.mapCenter.lng = parseFloat(property.lng)

        this.markers.push({
          position: {
            lat: parseFloat(this.mapCenter.lat),
            lng: parseFloat(this.mapCenter.lng),
          }
        })
        this.$refs.mapModal.show()
      },
      clickModalBtn: function (btn) {
        if (btn === 'CANCEL') {
          this.$refs.removePropertyModal.hide()
        } else if (btn === 'REMOVE') {
          if (this.indexToRemove > -1) {
            this.propertiesScoped.splice(this.indexToRemove, 1)

            store.dispatch({
              type: 'setAppProperties',
              properties: this.propertiesScoped
            })
            this.savePropertiesInStorage(this.propertiesScoped, 'admin')
            if (this.$language === 'en') {
              this.$toasted.show('Property successfully removed!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Salon Silindi', {icon: 'fa-check-circle', type: 'success'})
            }

            let formData = {
              'id': this.propertyToRemove.id,
              'user_id': this.user.id,
            }

            this.$http.post(this.appApiPath + '/api/property_remove', formData)
              .then(response => {
                console.log('remove success')
                console.log(response.body)

                // Update contracts
                store.dispatch({
                  type: 'setAppContracts',
                  contracts: response.body.data.contracts
                })
                this.saveContractsInStorage(response.body.data.contracts)
                this.savePropertiesInStorage(response.body.data.properties)
              }, response => {
                console.log('remove error')
                console.log(response)
              })
          }
          this.$refs.removePropertyModal.hide()
        }
      },
      hideAlertRemoved() {
        this.showAlertPropertyRemoved = false
      },
      refreshMap() {
        console.log('refreshing the map')
        Vue.$gmapDefaultResizeBus.$emit('resize')
      },
      goToPropertyView(property) {
        store.dispatch({
          type: 'setAppCurrentProperty',
          currentProperty: property
        })
        this.saveCurrentPropertyInStorage(property)

        if (this.user.role === 'manager') {
          router.push({name: 'propertyView-m'})
        } else if (this.user.role === 'admin') {
          router.push({name: 'propertyView-o'})
        }
      }
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .actionButton {
    width: 40px;
  }

  .locationMap {
    height: 300px;
  }
</style>
