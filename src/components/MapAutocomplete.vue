<template>
  <div>
    <div class="form-group">
      <label><span v-lang.address></span></label>
      <div class="input-group">
        <span class="input-group-addon mt3"><i class="fa fa-2x fa-map-marker-alt iconColor"></i></span>
        <GmapAutocomplete v-if="propertyData && language === 'en'" class="form-control borderBottom" @place_changed="setPlace" placeholder="Adress" v-model="propertyData.address"> </GmapAutocomplete>
        <GmapAutocomplete v-if="propertyData && language === 'tr'" class="form-control borderBottom" @place_changed="setPlace" placeholder="Adres" v-model="propertyData.address"> </GmapAutocomplete>
        <GmapAutocomplete v-if="!propertyData && language === 'en'" class="form-control borderBottom" @place_changed="setPlace" placeholder="Address" v-model="address"> </GmapAutocomplete>
        <GmapAutocomplete v-if="!propertyData && language === 'tr'" class="form-control borderBottom" @place_changed="setPlace" placeholder="Adres" v-model="address"> </GmapAutocomplete>
      </div>
    </div>

    <div class="form-group">
      <label>
        <span v-lang.latitude></span>: {{ lat }}
        <span v-lang.longitude></span>: {{ lng }}
      </label>
    </div>

    <div class="jumbotron jumbotron-fluid jumbotronCustom">
      <div class="container">
        <span class="bookingTabInfo">
          <i class="fa fa-info-circle bookingTabInfoIcon"></i> &nbsp;
          <span v-lang.propertyMapInfo class="bookingTabInfoText"></span>
        </span>
      </div>
    </div>

    <span class="propertySubtitle"><span v-lang.map></span></span>
    <GmapMap style="height: 300px;" :zoom="zoomLevel" :center="mapCenter" @rightclick="mapClick">
      <GmapMarker v-for="(marker, index) in markers"
                  :key="index"
                  :position="marker.position"
      />
      <GmapMarker
        v-if="this.place"
        label="★"
        :position="{
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng(),
        }"
      />
    </GmapMap>
  </div>
</template>

<script>
  import store from '../vuex/store'
  import { labels } from '../mixins/labels'
  export default {
    props: ['propertyData', 'type'],
    data() {
      return {
        markers: [],
        place: null,
        lat: '',
        lng: '',
        mapCenter: { lat: 39.299501, lng: 35.177332 },
        zoomLevel: 5,
        address: ''
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
    },
    description: 'Autocomplete',
    mixins: [labels],
    created() {
      if (this.propertyData && this.propertyData.lat && this.propertyData.lng) {
        // If there is existing data - load coordinates and setup map
        this.lat = this.propertyData.lat
        this.lng = this.propertyData.lng
        this.mapCenter.lat = this.lat
        this.mapCenter.lng = this.lng
        this.zoomLevel = 16

        this.markers.push({
          position: {
            lat: this.lat,
            lng: this.lng,
          },
          draggable: true,
          animation: google.maps.Animation.DROP
        })
      }
    },
    methods: {
      mapClick(event) {
        this.lat = event.latLng.lat()
        this.lng = event.latLng.lng()
        this.mapCenter.lat = this.lat
        this.mapCenter.lng = this.lng
        this.zoomLevel = 16
        this.$emit('mapRightClick', [event.latLng.lat(), event.latLng.lng()])
        this.markers = []
        this.markers.push({
          position: {
            lat: this.lat,
            lng: this.lng,
          },
          draggable: true,
          animation: google.maps.Animation.DROP
        })
      },
      setDescription(description) {
        this.description = description
      },
      setPlace(place) {
        this.place = {...place}
        if (this.place) {
          this.markers = []
          this.lat = this.place.geometry.location.lat()
          this.lng = this.place.geometry.location.lng()
          this.mapCenter.lat = this.lat
          this.mapCenter.lng = this.lng
          this.zoomLevel = 16
          this.$emit('setPropertyAddress', [this.place, this.lat, this.lng])
          this.markers.push({
            position: {
              lat: this.lat,
              lng: this.lng,
            }
          })
          this.place = null
        }
      },
    }
  }
</script>
