<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-tag" aria-hidden="true"></i>
          {{ serviceNameTitle }}
        </span>
        <div class="white-text pageSubtitle"><span v-lang.serviceDetails></span></div>
      </div>
    </div>

    <div class="card cardMT">

      <div class="card-body">

        <div class="form-group row">
          <div class="col-sm-4">
            <button type="submit" class="btn btn-lg btn-block btn-info white" @click="goToServiceEdit">
              <i class="fa fa-edit"></i>
              <span v-lang.serviceEdit></span>
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
                <div class="h3 text-success"><span v-lang.info></span></div>

                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.description></span>: {{ service.description }}</p>

                <p class="card-text normalText200"> <span class="fontWeight300" v-lang.type></span>: {{ service.type }}</p>

                <p class="card-text normalText200">
                  <span class="fontWeight300" v-lang.cost></span>:
                  <span v-if="service.type == 'fixed'"> {{ service.cost | numberFormat }} </span>
                  <ul class="card-text normalText200 costList" v-if="service.type == 'flexible' && service.range_type === 'default'">

                    <li><span class="fontWeight300">1 - 100 <span v-lang.guest></span>:</span> {{ service.cost1 | numberFormat }} </li>
                    <li><span class="fontWeight300">101 - 250 <span v-lang.guest></span>:</span> {{ service.cost2 | numberFormat }} </li>
                    <li><span class="fontWeight300">251 - 500 <span v-lang.guest></span>:</span> {{ service.cost3 | numberFormat }} </li>
                    <li><span class="fontWeight300">> 500 <span v-lang.guest></span>:</span> {{ service.cost4 | numberFormat }} </li>

                  </ul>

                  <ul class="card-text normalText200 costList" v-if="service.type == 'flexible' && service.range_type === 'custom'">

                    <li v-for="(rangeData, index) in service.range_costs" :key="index">
                      <span class="fontWeight300">{{ rangeData.min }} - {{ rangeData.max }} <span v-lang.guest></span>:</span> {{ rangeData.cost | numberFormat }}
                    </li>

                  </ul>
                </p>

              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="card">
              <div class="card-block">
                <div class="h1 text-muted text-right mb-2">
                  <i class="fa fa-image"></i>
                </div>
                <div class="h3 text-success"><span v-lang.serviceImages></span></div>
                <div class="container">

                  <div class="image" v-for="(image, index) in service.images" :key="index">
                    <img :src="appApiPath + image.path" alt="Service image">
                  </div>

                  <p class="card-text normalText200" v-if="service.images.length === 0"> <span v-lang.noImages></span></p>

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
  import router from '../router/index.js'
  import store from '../vuex/store'

  export default {
    router: router,

    components: {},

    data () {
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
      service() {
        return store.getters.getCurrentService
      },
      user() {
        return store.getters.getUser
      },
      serviceNameTitle() {
        return this.service.name[0].toUpperCase() + this.service.name.substring(1)
      }
    },

    created () {
      this.$language = this.language
    },

    methods: {
      goToServiceEdit(event) {
        event.preventDefault()

        this.$localStorage.set('currentService', JSON.stringify(this.service))
        store.dispatch({
          type: 'setAppCurrentService',
          currentService: this.service
        })

        this.$localStorage.set('serviceFormType', 'edit')
        store.dispatch({
          type: 'setAppServiceFormType',
          serviceFormType: 'edit'
        })

        if (this.user.role === 'admin') {
          router.push({ name: 'serviceForm-o' })
        } else if (this.user.role === 'manager') {
          router.push({ name: 'serviceForm-m' })
        }
      },

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

  .costList {
    list-style-type: none;
    padding: 0;
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
  serviceField {
    color: #53756D!important;
    font-size: 1.4rem;
  }



</style>
