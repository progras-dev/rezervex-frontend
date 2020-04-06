<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-tags" aria-hidden="true"></i>
          <span v-lang.serviceList></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.servicesSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToServiceForm">
            <i class="fa fa-plus"></i>
            <span v-lang.serviceAdd></span>
          </button>
        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="currentItems"
                   :fields="tableFields"
                   head-variant="light"
          >


            <template v-slot:cell(thumbnail)="item">
              <span v-if="item.item.images.length > 0">
                <img :src="appApiPath + item.item.images[0].path" class="imgProperty z-depth-1" alt="" style="width: 50px;">
              </span>
                <span v-else>
                <img src="../assets/img/thumb_placeholder.png" class="z-depth-1" alt="" style="width: 50px;">
              </span>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="goToServiceView(item.item, $event)" v-b-tooltip.hover title="Go to service page">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="goToServiceView(item.item, $event)" v-b-tooltip.hover title="Hizmet sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-primary actionButton" @click="goToServiceEdit(item.item, $event)" v-b-tooltip.hover title="Edit Service">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-primary actionButton" @click="goToServiceEdit(item.item, $event)" v-b-tooltip.hover title="Hizmet Güncelle">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-danger actionButton" @click="openRemoveModal(item.item, $event)" v-b-tooltip.hover title="Remove Service">
                <i class="fa fa-trash"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-danger actionButton" @click="openRemoveModal(item.item, $event)" v-b-tooltip.hover title="Hizmet Sil">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>


          </b-table>

          <p class="card-text lead noItems" v-if="currentItems.length === 0"> <span v-lang.noServices></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItems">
          </b-pagination>

          <b-modal ref="serviceRemoveModal" class="modal-danger">
            <template slot="modal-header">
              <h5 class="modal-title"> <span v-lang.serviceRemove></span> </h5>
            </template>

            <span v-lang.alertServiceRemoveAsk></span>

            <template slot="modal-footer">
              <b-btn variant="default" @click="clickModalBtn('CANCEL')">
                <span v-lang.cancel></span>
              </b-btn>
              <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
                <span v-lang.serviceRemove></span>
              </b-btn>
            </template>
          </b-modal>

        </div>
      </div>

    </b-card>

  </div>
</template>

<script>
  import router from '../router'
  import moment from 'moment'
  import store from '../vuex/store'

  export default {
    name: 'Services',
    data () {
      return {
        servicesScoped: [],
        totalItems: 0,
        itemsPerPage: 10,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        indexToRemove: -1,
      }
    },

    computed: {
      services () {
        return store.getters.getServices
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
      tableFields() {
        if (this.$language === 'en') {
          return [
            {
              label: 'Image',
              class: ['text-center', 'propertiesTable'],
              key: 'thumbnail',
            },
            {
              label: 'Name',
              class: ['text-center', 'propertiesTable'],
              key: 'name',
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
              class: ['text-center', 'propertiesTable'],
              key: 'thumbnail',
            },
            {
              label: 'Adı',
              class: ['text-center', 'propertiesTable'],
              key: 'name',
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

    created() {
      this.$language = this.language
      if (this.$route.params.createSuccess) {
        if (this.language === 'en') {
          this.$toasted.show('Service succesfully created!', {icon: 'fa-check-circle', type: 'success'})
        } else if (this.language === 'tr') {
          this.$toasted.show('Yeni hizmet eklendi!', {icon: 'fa-check-circle', type: 'success'})
        }
      }

      if (this.$route.params.updateSuccess) {
        if (this.language === 'en') {
          this.$toasted.show('Service succesfully updated', {icon: 'fa-check-circle', type: 'success'})
        } else if (this.language === 'tr') {
          this.$toasted.show('Hizmet başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
        }
      }
      this.servicesScoped = this.services.map(item => ({...item}))
      this.initPagination()
    },

    methods: {
      initPagination() {
        this.totalItems = this.servicesScoped.length
        this.currentItems = this.servicesScoped.map(item => ({...item})).slice(0, this.itemsPerPage)
        if (this.servicesScoped.length > this.itemsPerPage) this.showPagination = true

        for (let i = 0; i < this.servicesScoped.length; i++) {
          this.servicesScoped[i].ago = moment(this.servicesScoped[i].created_at).fromNow()
        }
      },

      goToServiceForm(event) {
        event.preventDefault()

        this.$localStorage.set('serviceFormType', 'add')
        store.dispatch({
          type: 'setAppServiceFormType',
          serviceFormType: 'add'
        })

        if (this.user.role === 'admin') {
          router.push({ name: 'serviceForm-o' })
        } else if (this.user.role === 'manager') {
          router.push({ name: 'serviceForm-m' })
        }
      },

      goToService(service) {
        router.push({ name: 'service', params: { service } })
      },

      goToServiceEdit(service, event) {
        event.preventDefault()

        this.$localStorage.set('currentService', JSON.stringify(service))
        store.dispatch({
          type: 'setAppCurrentService',
          currentService: service
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

      updateCurrentItems() {
        let indexBegin = (this.currentPage - 1) * this.itemsPerPage
        let indexEnd = indexBegin + this.itemsPerPage

        this.currentItems = this.servicesScoped.map(item => ({...item})).slice(indexBegin, indexEnd)
      },

      openRemoveModal(service, event) {
        event.preventDefault()
        this.serviceToRemove = {...service}

        for (let i = 0; i < this.servicesScoped.length; i++) {
          if (service.id === this.servicesScoped[i].id) {
            this.indexToRemove = i
          }
        }
        // this.indexToRemove = index
        this.$refs.serviceRemoveModal.show()
      },

      clickModalBtn: function (btn) {
        if (btn === 'CANCEL') {
          this.$refs.serviceRemoveModal.hide()
        } else if (btn === 'REMOVE') {
          if (this.indexToRemove > -1) {
            this.servicesScoped.splice(this.indexToRemove, 1)

            this.initPagination()

            store.dispatch({
              type: 'setAppServices',
              services: this.servicesScoped
            })

            this.$localStorage.set('services', JSON.stringify(this.servicesScoped))

            let formData = {
              'id': this.serviceToRemove.id,
              'user_id': this.user.id
            }

            this.$http.post(this.appApiPath + '/api/service_remove', formData)
              .then(response => {
                console.log('remove success')
                console.log(response.body)

                if (this.language === 'en') {
                  this.$toasted.show('Service successfully removed!', {icon: 'fa-check-circle', type: 'success'})
                } else if (this.language === 'tr') {
                  this.$toasted.show('Hizmet Silindi!', {icon: 'fa-check-circle', type: 'success'})
                }

                store.dispatch({
                  type: 'setAppServices',
                  services: response.body.data.services
                })
                this.$localStorage.set('properties', JSON.stringify(response.body.data.services))
              }, response => {
                console.log('remove error')
                console.log(response)
              })
          }
          this.$refs.serviceRemoveModal.hide()
        }
      },

      goToServiceView(service, event) {
        event.preventDefault()

        this.$localStorage.set('currentService', JSON.stringify(service))
        store.dispatch({
          type: 'setAppCurrentService',
          currentService: service
        })

        if (this.user.role === 'admin') {
          router.push({name: 'serviceView-o'})
        } else if (this.user.role === 'manager') {
          router.push({name: 'serviceView-m'})
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page-link, .pagination-datatables li a, .pagination li a {
    color: red!important;
  }

</style>
