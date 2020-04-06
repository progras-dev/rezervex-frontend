<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-bookmark" aria-hidden="true"></i>
          <span v-lang.extraPackages></span>
        </span>
        <div class="white-text pageSubtitle"> <span v-lang.packagesSetup></span> </div>
      </div>
    </div>

    <b-card>
      <div class="form-group row">
        <div class="col-sm-6">
          <button type="submit" class="btn btn-lg btn-info white buttonMain" @click="goToPackageForm">
            <i class="fa fa-plus"></i>
            <span v-lang.packageAdd></span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="packages"
                   :fields="tableFields"
                   head-variant="light"
          >

            <template v-slot:cell(total_cost)="item">
              {{ item.item.total_cost | numberFormat }}
            </template>

            <template v-slot:cell(actions)="item">
              <b-button variant="outline-danger actionButton" @click="openModalRemovePackage(item.item, $event)" v-b-tooltip.hover title="Remove Package">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>
            
          </b-table>
        </div>
      </div>

    </b-card>

    <b-modal ref="removePackageModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.packageRemoval></span> </h5>
      </template>

      <span v-lang.packageRemovalQuestion></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
          <span v-lang.packageRemoveButton></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import router from '../router/index.js'

  export default {
    data () {
      return {
        packageToRemove: null,
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      packages () {
        return store.state.packages
      },
      tableFields() {
        return [
          {
            label: 'Name',
            class: ['text-center', 'propertiesTable'],
            key: 'name',
          },
          {
            label: 'Type',
            class: ['text-center', 'propertiesTable'],
            key: 'type',
          },
          {
            label: 'Total Items',
            class: ['text-center', 'propertiesTable'],
            key: 'total_items',
          },
          {
            label: 'Total Cost',
            class: ['text-center', 'propertiesTable'],
            key: 'total_cost',
          },
          {
            label: 'Actions',
            class: ['text-center', 'propertiesTable'],
            key: 'actions',
          },
        ]
      }
    },

    created () {
      this.$language = this.language
      console.log('extra packages')

      let isAlert = this.$route.params.isAlert
      let alertType = this.$route.params.alertType

      if (isAlert) {
        if (alertType === 'edit-success') {
          if (this.language === 'en') {
            this.$toasted.show('Package succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Package başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
          }
        } else if (alertType === 'create-success') {
          if (this.language === 'en') {
            this.$toasted.show('Package succesfully created!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Yeni Package Sisteme Eklendi!', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      }

      console.log(this.packages)
    },
    methods: {
      openModalRemovePackage(item, event) {
        event.preventDefault()
        this.packageToRemove = {...item}
        this.$refs.removePackageModal.show()
      },
      goToPackageForm(event) {
        event.preventDefault();
        router.push({name: 'packageForm'});
      },
      clickModalBtn: function (btn) {
        if (btn === 'CANCEL') {
          this.$refs.removePackageModal.hide()
        } else if (btn === 'REMOVE') {
          let formData = {
            'id': this.packageToRemove.id,
          }

          this.$refs.removePackageModal.hide()

          this.$http.post(this.appApiPath + '/api/package_remove', formData)
            .then(response => {
              console.log('remove success')
              console.log(response.body)

              this.$toasted.show('Package successfully removed!', {icon: 'fa-check-circle', type: 'success'})

              store.dispatch({
                type: 'setAppPackages',
                packages: response.body.packages
              })
            }, response => {
              console.log('remove error')
              console.log(response)
            })
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
