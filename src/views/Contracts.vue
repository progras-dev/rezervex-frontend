<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow propertiesSetupPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-file-text" aria-hidden="true"></i>
          <span v-lang.contracts></span>
        </span>
        <div class="white-text pageSubtitle"><span v-lang.contractsSubtitle></span></div>
      </div>
    </div>

    <b-card>

      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToContractForm">
            <i class="fa fa-plus"></i>
            <span v-lang.contractAdd></span>
          </button>
        </div>
      </div>

      <div class="alert alert-info" role="alert" v-if="showNewContractInfoBox">
        <i class="fa fa-warning"></i> &nbsp;
        <span v-lang.newContractInfo></span>
      </div>

      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="currentItems"
                   :fields="tableFields"
                   head-variant="light"
          >

            <template v-slot:cell(thumbnail)="item">
              <span v-if="item.item.image_path">
                <img v-if="item.item.base64" :src="item.item.base64" class="imgProperty z-depth-1" alt="" style="width: 100px;">
                <img v-else :src="appApiPath + item.item.image_path" class="imgProperty z-depth-1" alt="" style="width: 100px;">
                <!--<img :src="item.item.base64" class="z-depth-1" alt="" style="width: 50px;">-->
              </span>
              <span v-else>
                <img src="../assets/img/thumb_placeholder.png" class="z-depth-1" alt="" style="width: 50px;">
              </span>
            </template>

            <template v-slot:cell(actions)="item">
              <b-button v-if="language === 'en'" variant="outline-success actionButton" @click="goToContractView(item.item, $event)" v-b-tooltip.hover title="View Contract">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-success actionButton" @click="goToContractView(item.item, $event)" v-b-tooltip.hover title="Sözleşme sayfasına git">
                <i class="fa fa-search"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-primary actionButton" @click="goToContractEdit(item.item)" v-b-tooltip.hover title="Edit Contract">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-primary actionButton" @click="goToContractEdit(item.item)" v-b-tooltip.hover title="Güncelle">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button v-if="language === 'en'" variant="outline-danger actionButton" @click="openModalRemoveContract(item.item, $event)" v-b-tooltip.hover title="Remove Contract">
                <i class="fa fa-trash"></i>
              </b-button>
              <b-button v-if="language === 'tr'" variant="outline-danger actionButton" @click="openModalRemoveContract(item.item, $event)" v-b-tooltip.hover title="Sözleşme Sil">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>

          </b-table>

          <p class="card-text lead noItems" v-if="contractsScoped.length === 0"> <span v-lang.noContracts></span></p>

          <b-pagination v-if="showPagination" class="mt10" size="sm" :total-rows="totalItems" v-model="currentPage" :per-page="itemsPerPage" @input="updateCurrentItemsOnNewPagination()">
          </b-pagination>

        </div><!--/.col-->
      </div><!--/.row-->

    </b-card>

    <b-modal ref="modalRemoveContract" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"><span v-lang.contractRemoval></span></h5>
      </template>
      <span v-lang.contractRemovalQuestion></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="$refs.modalRemoveContract.hide()">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="contractRemove">
          <span v-lang.contractRemove></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { savePropertiesInStorage } from '../mixins/savePropertiesInStorage'

  export default {
    mixins: [saveContractsInStorage, savePropertiesInStorage],
    data() {
      return {
        totalItems: 0,
        itemsPerPage: 20,
        currentPage: 1,
        currentItems: [],
        showPagination: false,
        showNewContractInfoBox: false,
        contractsScoped: [],
        contractToRemove: {},
        indexContractToRemove: -1,
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      contracts() {
        return store.getters.getContracts
      },
      user() {
        return store.getters.getUser
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
              label: 'Modelin adı',
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
      this.initAlertMessage()
      console.log('contracts')
      console.log(this.contracts)
      for (let i = 0; i < this.contracts.length; i++) {
        let contract = {...this.contracts[i]}
        this.contractsScoped.push(contract)
      }
      this.initPagination()
    },

    methods: {
      goToContractForm() {
        this.$localStorage.set('contractFormType', 'add')
        store.dispatch({
          type: 'setAppContractFormType',
          contractFormType: 'add'
        })
        this.$router.push('contractForm')
      },
      initAlertMessage() {
        let isAlert = this.$route.params.isAlert
        let alertType = this.$route.params.alertType

        if (isAlert) {
          if (alertType === 'create-success') {
            this.showNewContractInfoBox = true
            if (this.$language === 'en') {
              this.$toasted.show('Contract model succesfully created!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Sözleşme başarıyla kayıt edildi!', {icon: 'fa-check-circle', type: 'success'})
            }
          }
        }
      },
      initPagination() {
        console.log('init pagination')
        console.log(this.contractsScoped)
        this.totalItems = this.contractsScoped.length
        this.currentItems = this.contractsScoped.map(item => ({...item})).slice(0, this.itemsPerPage)

        if (this.contractsScoped.length > this.itemsPerPage) {
          this.showPagination = true
        }
        console.log(this.currentItems)
      },
      goToContractView(contract) {
        this.$localStorage.set('currentContract', JSON.stringify(contract))
        store.dispatch({
          type: 'setAppCurrentContract',
          currentContract: contract
        })
        this.$router.push({name: 'contractView'})
      },
      goToContractEdit(contract) {
        this.$localStorage.set('currentContract', JSON.stringify(contract))
        store.dispatch({
          type: 'setAppCurrentContract',
          currentContract: contract
        })
        this.$localStorage.set('contractFormType', 'edit')
        store.dispatch({
          type: 'setAppContractFormType',
          contractFormType: 'edit'
        })
        this.$router.push({name: 'contractForm'})
      },
      openModalRemoveContract(contract) {
        this.$refs.modalRemoveContract.show()

        this.contractToRemove = {...contract}

        for (let i = 0; i < this.contractsScoped.length; i++) {
          if (contract.id === this.contractsScoped[i].id) {
            this.indexContractToRemove = i
          }
        }
      },
      contractRemove() {
        console.log(this.contractToRemove.id)
        console.log(this.indexContractToRemove)
        this.$refs.modalRemoveContract.hide()
        let formData = {
          'contract_id': this.contractToRemove.id,
          'project_id': this.user.project_id,
          'user_id': this.user.id
        }

        console.log({formData})

        this.contractsScoped.splice(this.indexContractToRemove, 1)
        this.initPagination()

        this.$http.post(this.appApiPath + '/api/contract_remove', formData)
          .then(response => {
            console.log('contract_remove api success')
            console.log(response.body)
            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)

            store.dispatch({
              type: 'setAppProperties',
              properties: response.body.data.properties
            })
            this.savePropertiesInStorage(response.body.data.properties, 'admin')

            let contractsTest = JSON.parse(this.$localStorage.get('contracts'), null)
            console.warn({contractsTest})

            if (this.$language === 'en') {
              this.$toasted.show('Contract successfully removed!', {icon: 'fa-check-circle', type: 'success'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Sözleşme Silindi!', {icon: 'fa-check-circle', type: 'success'})
            }
          }, response => {
            console.warn('error from contract_remove')
            console.log(response)

            if (this.$language === 'en') {
              this.$toasted.show('Something went wrong when trying to delete the contract', {icon: 'fa-exclamation-triangle', type: 'error'})
            } else if (this.$language === 'tr') {
              this.$toasted.show('Sözleşme silinirken bir hata oluştu', {icon: 'fa-exclamation-triangle', type: 'error'})
            }
          })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>


</style>




