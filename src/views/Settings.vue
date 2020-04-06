<template>
  <div class="animated fadeIn">

    <b-card style="margin-top: 1rem">

      <div class="col-md-12 pageTitleNoMargin settingsPages">
        <div class="flex-center pageTitleContainer">
          <span class="white pageTitle mb30">
            <i class="fa fa-cog" aria-hidden="true"></i>
            <span v-if="language === 'en'">Settings</span>
            <span v-if="language === 'tr'">Ayarlar</span>
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="languageInput">
          <span v-if="language === 'en'">Language</span>
          <span v-if="language === 'tr'">Dil</span>
        </label>
        <div class="input-group">
          <span class="input-group-addon mt3"><i class="fa fa-2x fa-globe iconColor"></i></span>
          <v-select class="inputWidthResponsive" id="languageInput" label="languageName" v-model="currentLanguage" :options="languages" @input="selectLang"></v-select>
        </div>
      </div>


    </b-card>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import vSelect from 'vue-select'

  export default {
    components: {vSelect},
    data() {
      return {
        languages: [
          { code: 'en', languageName: 'English' },
          { code: 'tr', languageName: 'Turkçe' }
        ],
        currentLanguage: {},
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      user() {
        return store.getters.getUser
      }
    },
    created () {
      this.$language = this.language
      for (let i = 0; i < this.languages.length; i++) {
        if (this.language === this.languages[i].code) {
          this.currentLanguage = this.languages[i]
        }
      }
    },
    methods: {
      selectLang() {
        console.log('currentLanguage')
        console.log(this.currentLanguage)
        this.$language = this.currentLanguage.code
        store.dispatch({
          type: 'setAppLanguage',
          language: this.currentLanguage.code
        })
        this.$localStorage.set('appLanguage', this.currentLanguage.code)
        this.updateLabels()
      },
      // Update label for chart (cannot use mixins or it has buggy behavior...)
      updateLabels() {
        let labelsObject = {}
        if (this.$language === 'en') {
          labelsObject.totalBookings = 'Total Bookings'
          store.dispatch({
            type: 'setAppLabels',
            labels: labelsObject
          })
        } else if (this.$language === 'tr') {
          labelsObject.totalBookings = 'Toplam rezervasyonlar'
          store.dispatch({
            type: 'setAppLabels',
            labels: labelsObject
          })
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
