<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow otherPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-clipboard-list" aria-hidden="true"></i>
          <span v-lang.logs></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.logsSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <ul class="list-group">
        <li v-for="log in currentItems" :key="log.id" class="list-group-item d-flex justify-content-between align-items-center">

          <!--LOGIN-->
          <!--<span v-if="log.type == 'login' && $language == 'en'">
            <div class="timeContainer">
              <span class="textTime">{{ log.created_at }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Made Login.
          </span>
          <span v-if="log.type == 'login' && $language == 'tr'">
            <div class="timeContainer">
              <span class="textTime">{{ log.created_at }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Giriş Yapıldı.
          </span>-->

          <!--LOGOUT-->
          <!--<span v-if="log.type == 'logout' && $language == 'en'">
            <div class="timeContainer">
              <span class="textTime">{{ log.created_at }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Made Logout.
          </span>
          <span v-if="log.type == 'logout' && $language == 'tr'">
            <div class="timeContainer">
              <span class="textTime">{{ log.created_at }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Çıkış Yapıldı.
          </span>-->

          <!--BOOKING NEW-->
          <span v-if="log.type == 'booking_new' && language == 'en'">
            <span class="badge badge-success badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Made a booking
            <span class="text-danger">{{ log.field3 }}</span>
            for the date
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            for {{ log.field6 | numberFormat }}
          </span>
          <span v-if="log.type == 'booking_new' && language == 'tr'">
            <span class="badge badge-success badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            Tarih için rezervasyon yapıldı
            <span class="text-danger">{{ log.field3 }}</span> -  {{ log.field6 | numberFormat }}
          </span>

          <!--BOOKING UPDATE-->
          <span v-if="log.type == 'booking_update' && language == 'en'">
            <span class="badge badge-info badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Updated a booking
            <span class="text-danger">{{ log.field3 }}</span>
            for the date <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
          </span>
          <span v-if="log.type == 'booking_update' && language == 'tr'">
            <span class="badge badge-info badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            Tarih için rezervasyon güncellemesi
            <span class="text-danger">{{ log.field3 }}</span>
          </span>

          <!--BOOKING REMOVE-->
          <span v-if="log.type == 'booking_remove' && language == 'en'">
            <span class="badge badge-danger badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Removed a booking
            <span class="text-danger">{{ log.field3 }}</span>
            for the date
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
          </span>
          <span v-if="log.type == 'booking_remove' && language == 'tr'">
            <span class="badge badge-danger badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            Tarih için rezervasyon güncellemesi
            <span class="text-danger">{{ log.field3 }}</span>
          </span>

          <!--PROPERTY UPDATE-->
          <span v-if="log.type == 'property_update' && language == 'en'">
            <span class="badge badge-info badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
             Update the property
            <span class="text-danger">{{ log.field2 }}</span>
          </span>
          <span v-if="log.type == 'property_update' && language == 'tr'">
            <span class="badge badge-info badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Salon bilgileri güncellendi
            <span class="text-danger">{{ log.field2 }}</span>
          </span>

          <!--NEW OFFER-->
          <span v-if="log.type == 'offer_new' && language == 'en'">
            <span class="badge badge-success badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            Made an offer
            <span class="text-danger">{{ log.field3 }}</span>
            for the date
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            for {{ log.field6 | numberFormat }}
          </span>
          <span v-if="log.type == 'offer_new' && language == 'tr'">
            <span class="badge badge-success badge-pill badgeEmpty"></span>
            <div class="timeContainer">
              <span class="textTime">{{ log.dateFormatted }}</span>
            </div>
            <span class="crimson"> {{ log.user_name }} </span>
            <span class="text-primary">{{ log.field4 }} {{ log.field5 }}</span>
            Teklif yaptı
            <span class="text-danger">{{ log.field3 }}</span> -  {{ log.field6 | numberFormat }}
          </span>

        </li>
      </ul>

      <p class="card-text lead noItems" v-if="currentItems.length === 0"> <span v-lang.noLogs></span></p>

      <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems()">
      </b-pagination>

    </b-card>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import moment from 'moment'
  import vSelect from 'vue-select'

  export default {
    components: {vSelect},
    data () {
      return {
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        logsListScoped: [],
      }
    },
    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      logsList () {
        return store.getters.getLogsList
      },
    },
    mounted () {
      this.$language = this.language
      this.initList()
      this.initPagination()
    },
    methods: {
      initList() {
        for (let i = 0; i < this.logsList.length; i++) {
          let log = {...this.logsList[i]}
          log.dateFormatted = moment(log.created_at).format('DD-MM-YYYY HH:mm')
          this.logsListScoped.push(log)
        }
        console.log('logsListScoped', this.logsListScoped)
      },
      initPagination() {
        this.totalItems = this.logsListScoped.length
        this.currentItems = this.logsListScoped.map(item => ({...item})).slice(0, this.itemsPerPage)
        if (this.logsListScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
      },
      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.logsListScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

   .badgeTime {
    color: white;
    padding: 5px;
    width: 129px;
  }

   .badgeEmpty {
     display: inline;
     margin-right: 10px;
     font-size: 6px;
     padding-left: 7px;
     vertical-align: middle;
   }

  .textTime {
    color: #777!important;
  }

  .timeContainer {
    width: 160px;
    display: inline-block
  }

</style>
