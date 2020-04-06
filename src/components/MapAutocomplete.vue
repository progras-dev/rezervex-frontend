<template>
  <div>

    <!--<div class="col-md-12 mb-r">
      <div class="md-form">
        <md-field>
          <i class="fa fa-map-marker prefix" :class="{'active': type === 'edit'}"></i>
          <GmapAutocomplete v-if="propertyData" class="form-control borderBottom" @place_changed="setPlace" placeholder="" v-model="propertyData.address"> </GmapAutocomplete>
          <GmapAutocomplete v-if="!propertyData" class="form-control borderBottom" @place_changed="setPlace" placeholder="" v-model="address"> </GmapAutocomplete>
          <label class="active"><span v-lang.address></span></label>
        </md-field>
      </div>
    </div>-->


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

    <!--<div class="col-md-12 mb-r">
      <div class="md-form">
        &lt;!&ndash;<i class="fa fa-map prefix" :class="{'active': type === 'edit'}"></i>&ndash;&gt;
        <i class="fa fa-map prefix"></i>
        <div>
          <span> <span v-lang.latitude></span>: {{ lat }}</span>
          <span> <span v-lang.longitude></span>: {{ lng }}</span>
        </div>
        <p style="margin-left:49px; margin-top: 10px;"><small> <span v-lang.markerRightClickInfo></span> </small></p>

        <GmapMap style="height: 300px; margin-left:49px;" :zoom="zoomLevel" :center="mapCenter" @rightclick="mapClick">
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
    </div>
-->






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

        // console.log('markers', this.markers)
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

        // GEOCODE
        /* this.$http.post('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + event.latLng.lat() + ',' + event.latLng.lng() + '&key=AIzaSyDlYPmmGrL52t7ecUgE_HXrnqwaJcqHGpo', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
          }
        })
          .then(response => {
            // console.log('success response from property_image_add')
            // console.log(response.body)
            this.address = response.body.results[0].formatted_address
            this.markers = []

            this.lat = event.latLng.lat()
            this.lng = event.latLng.lng()

            this.mapCenter.lat = this.lat
            this.mapCenter.lng = this.lng
            this.zoomLevel = 16

            this.$emit('mapRightClick', [this.address, event.latLng.lat(), event.latLng.lng()])

            this.markers.push({
              position: {
                lat: this.lat,
                lng: this.lng,
              },
              draggable: true,
            })
          }, response => {
            console.warn('error from property_image_add')
            console.log(response)
          }) */
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
