<template>
  <div class="animated fadeIn">

    <div class="card" style="margin-top: 1rem">

      <div class="card-block">

        <div class="container">

          <form enctype="multipart/form-data">

            <div class="col-md-12 pageTitleRowInCard propertiesSetupPages" v-if="contractFormType === 'add'">
              <div class="flex-center pageTitleContainer">
                <span class="white pageTitle">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                  <span v-lang.contractAdd></span>
                </span>
                <div class="white-text pageSubtitle"><span v-lang.infoAddContract></span></div>
              </div>
            </div>

            <div class="col-md-12 pageTitleRowInCard propertiesSetupPages" v-if="contractFormType === 'edit'">
              <div class="flex-center pageTitleContainer">
                <span class="white pageTitle">
                  <i class="fa fa-edit" aria-hidden="true"></i>
                  <span v-lang.contractEdit></span>
                </span>
                <div class="white-text pageSubtitle"><span v-lang.infoEditContract></span></div>
              </div>
            </div>


            <div class="form-group">
              <label for="inputName"><span v-lang.contractModelName></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-tag iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.name.$error}" id="inputName" :placeholder="labelModelName" v-model="name" @input="$v.name.$touch()">
              </div>
              <small class="form-text text-muted"><span v-lang.contractNameInfo></span></small>
              <div class="invalid-feedback" v-if="!$v.name.required && $v.name.$dirty">
                <span v-lang.nameRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inputTitle"><span v-lang.title></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-file-text iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.title.$error}" id="inputTitle" :placeholder="labelModelTitle" v-model="title" @input="$v.title.$touch()">
              </div>
              <small class="form-text text-muted"><span v-lang.contractTitleInfo></span></small>
              <div class="invalid-feedback" v-if="!$v.title.required && $v.title.$dirty">
                <span v-lang.titleRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inpuSubtitle"><span v-lang.subtitle></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-file-text iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.title.$error}" id="inpuSubtitle" :placeholder="labelModelSubtitle" v-model="contractData.subtitle" @input="$v.title.$touch()">
              </div>
              <small class="form-text text-muted"><span v-lang.contractSubtitleInfo></span></small>
            </div>


            <div>
              <span class="formSubtitle"><span v-lang.logo></span></span>
              <div class="md-form">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzoneAdd"
                  class="customDropzone"
                  :destroyDropzone="false"
                  :options="dzOptions"
                  v-on:vdropzone-success="imageAdded"
                  v-on:vdropzone-removed-file="imageRemoved"
                ></vue-dropzone>
                <small class="form-text text-muted"><span v-lang.maxFiles></span>: 1 - <span v-lang.maxFilesize></span>: 10Mb</small>
              </div>
            </div>

            <div class="form-group" style="margin-top: 30px;">
              <label for="inputManagers"><span v-lang.fields></span></label>
              <select multiple class="form-control" id="inputManagers" v-model="selectedFields" style="min-height: 150px;">
                <option v-for="(field, index) in contractFieldsScoped" :key="index" :value="field" selected>
                  <span v-if="language === 'tr'">{{ field.name_tr }}</span>
                  <span v-if="language === 'en'">{{ field.name_en }}</span>
                </option>
              </select>
              <small class="form-text text-muted"> <span v-lang.selectMultipleFields></span>Choose the fields that will appear in the contract. You can select multiple fields using CMD + click. </small>
            </div>


            <!--<div class="mt25" style="width: 25%;">
              <button type="submit" class="btn btn-info btn-block white" @click="fieldAdd($event)">
                <i class="fa fa-plus-circle"></i>
                <span v-lang.fieldAdd></span>
              </button>

              <div style="margin-top: 15px;">
                <p class="card-text lead"  v-for="(field, index) in addedFields">
                  <i class="fa fa-trash-o text-danger fieldRemoveIcon" @click="fieldRemove(field, index)" data-toggle="tooltip" data-placement="top" title="Remove field"></i>
                  <span v-if="language === 'tr'"> {{ field.name_tr }} </span>
                  <span v-if="language === 'en'"> {{ field.name_en }} </span>
                </p>
              </div>
            </div>-->


            <div class="form-group" style="margin-top: 40px;">
              <label for="inputText"><span v-lang.text></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                <textarea rows="5" class="form-control lightBorders" v-model.trim="contractData.text" id="inputText"></textarea>
              </div>
              <small class="text-muted"><span v-lang.contractTextInfo></span></small>
            </div>


            <div class="form-group">
              <label for="inputCopyright"><span v-lang.copyright></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-file-text iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.title.$error}" id="inputCopyright" :placeholder="labelCopyrightText" v-model="contractData.copyright" @input="$v.title.$touch()">
              </div>
              <small class="form-text text-muted"><span v-lang.contractCopyrightInfo></span></small>
            </div>



            <div class="form-group row">
              <button type="submit" class="btn btn-info btn-lg white buttonMain" style="margin-right: 10px; margin-bottom: 5px" @click="makePreview($event)">
                <i class="fa fa-image"></i>
                <span v-lang.preview></span>
              </button>
              <button type="submit" class="btn btn-success btn-lg white buttonMain" style="margin-bottom: 5px" @click="contractCreate($event)">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                <span v-lang.createContract v-if="contractFormType === 'add'"></span>
                <span v-lang.updateContract v-if="contractFormType === 'edit'"></span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import store from '../vuex/store'
  import { required } from 'vuelidate/lib/validators'
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  import Icon from 'vue-awesome/components/Icon'
  import { labels } from '../mixins/labels'
  import { saveContractsInStorage } from '../mixins/saveContractsInStorage'
  import { createContractPdf } from '../mixins/createContractPdf'
  import pdfMake from 'pdfmake/build/pdfmake'
  import pdfFonts from 'pdfmake/build/vfs_fonts'
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  export default {
    components: { vueDropzone: vue2Dropzone, Icon },
    mixins: [labels, saveContractsInStorage, createContractPdf],

    data() {
      return {
        title: '',
        name: '',
        contractData: {
          subtitle: '',
          text: '',
          copyright: ''
        },
        contractFieldsScoped: [],
        selectedFields: [],
        currentField: {},
        addedFields: [],
        showSpinner: false,
        formSubmitted: false,
        imagesToUpload: [],
        imageToUpload: {},
        dzOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          addRemoveLinks: true,
          destroyDropzone: false,
          headers: { 'My-Awesome-Header': 'header value' },
          acceptedFiles: 'image/jpeg, image/png, image/jpg',
          maxFiles: 1,
          maxFilesize: 10,
        },
        hasImage: false
      }
    },

    validations: {
      title: {
        required
      },
      name: {
        required
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      contractFormType() {
        return store.getters.getContractFormType
      },
      contractFields() {
        return store.getters.getContractFields
      },
      currentContract() {
        return store.getters.getCurrentContract
      },
      user() {
        return store.getters.getUser
      },
    },

    created() {
      this.$language = this.language
      for (let i = 0; i < this.contractFields.length; i++) {
        let contractFields = {...this.contractFields[i]}
        this.contractFieldsScoped.push(contractFields)
      }
      console.log('currentContract')
      console.log(this.currentContract)
      console.log('contractFieldsScoped')
      console.log(this.contractFieldsScoped)
      this.currentField = {...this.contractFieldsScoped[0]}
      this.initDropzoneLabels()

      if (this.contractFormType === 'edit') {
        this.initEditing()
      }
    },

    methods: {
      initDropzoneLabels() {
        if (this.$language === 'tr') {
          this.dzOptions.dictDefaultMessage = '<i class="fa fa-cloud-upload-alt"></i> Resimleri buraya bırak'
        } else if (this.$language === 'en') {
          this.dzOptions.dictDefaultMessage = '<i class="fa fa-cloud-upload-alt"></i> Drop images here'
        }
      },
      initEditing() {
        this.name = this.currentContract.name
        this.title = this.currentContract.title
        this.contractData.subtitle = this.currentContract.subtitle
        this.contractData.text = this.currentContract.text
        this.contractData.copyright = this.currentContract.copyright
        this.contractData.base64 = this.currentContract.base64

        for (let i = 0; i < this.currentContract.fields.length; i++) {
          for (let j = 0; j < this.contractFieldsScoped.length; j++) {
            if (this.currentContract.fields[i].id === this.contractFieldsScoped[j].id) {
              let contractFieldsScoped = {...this.contractFieldsScoped[j]}
              this.selectedFields.push(contractFieldsScoped)
            }
          }
        }

        if (this.currentContract.image_path) {
          setTimeout(() => {
            // load the base64 to avoid bug with cache (some previous cached image can be loaded instead of the current one)
            if (this.currentContract.base64) {
              this.$refs.myVueDropzone.manuallyAddFile({
                name: this.currentContract.image_name, size: this.currentContract.image_size, type: 'image'
              }, this.currentContract.base64)
            } else {
              let logoPath = this.appApiPath + this.currentContract.image_path
              console.log({logoPath})
              this.$refs.myVueDropzone.manuallyAddFile({
                name: this.currentContract.image_name, size: this.currentContract.image_size, type: 'image'
              }, logoPath)
            }
          }, 100)
        }
      },
      fieldAdd(event) {
        event.preventDefault()
        if (this.contractFieldsScoped.length > 0) {
          if (this.currentField) {
            let currentField = {...this.currentField}
            this.addedFields.push(currentField)

            let index = this.contractFieldsScoped.indexOf(this.currentField)
            if (index > -1) {
              this.contractFieldsScoped.splice(index, 1)
              this.currentField = {...this.contractFieldsScoped[0]}
            }
          }
        }
        this.addedFields.sort(this.sortArray)
      },
      sortArray(a, b) {
        if (a.id < b.id) {
          return -1
        }
        if (a.id > b.id) {
          return 1
        }
        return 0
      },
      fieldRemove(field, index) {
        console.log(index)

        if (index > -1) {
          this.addedFields.splice(index, 1)
          this.contractFieldsScoped.push(field)
        }
      },
      imageAdded(file) {
        console.log({file})
        if (this.contractFormType === 'edit') {
          let formData = new FormData()
          formData.append('image', file)
          formData.append('image_name', file.name)
          formData.append('image_size', file.size)
          formData.append('image_data', JSON.stringify(file))
          formData.append('contract_id', this.currentContract.id)
          formData.append('user_id', this.user.id)

          this.$http.post(this.appApiPath + '/api/contract_image_add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log('success response from contract_image_add')
            console.log(response.body)
            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)
          }, response => {
            console.warn('error from contract_image_add')
            console.log(response)
          })
        } else if (this.contractFormType === 'add') {
          this.imageToUpload = file
          this.hasImage = true
        }
      },
      imageRemoved() {
        if (this.contractFormType === 'edit') {
          let formData = new FormData()
          formData.append('contract_id', this.currentContract.id)

          this.$http.post(this.appApiPath + '/api/contract_image_remove', formData).then(response => {
            console.log('contract_image_remove success')
            console.log(response.body)
            store.dispatch({
              type: 'setAppContracts',
              contracts: response.body.data.contracts
            })
            this.saveContractsInStorage(response.body.data.contracts)
          }, response => {
            console.warn('contract_image_remove error')
            console.log(response)
          })
        } else if (this.contractFormType === 'add') {
          this.imageToUpload = {}
          this.hasImage = true
        }
      },
      contractCreate(event) {
        event.preventDefault()
        this.formSubmitted = true
        console.log(this.imageToUpload)
        if (this.$v.$invalid) {
          console.log('validation failed')
          this.$v.title.$touch()
          this.$v.name.$touch()
          if (this.$language === 'en') {
            this.$toasted.show('Please fill in the required fields.', {icon: 'fa-check-circle', type: 'error'})
          } else if (this.$language === 'tr') {
            this.$toasted.show('Gerekli alanlari doldurunuz.', {icon: 'fa-check-circle', type: 'error'})
          }
        } else {
          console.log('validation passed')
          this.showSpinner = true
          console.log(this.title)
          console.log(this.contractData)
          console.log(this.selectedFields)

          let formData = new FormData()
          formData.append('project_id', this.user.project_id)
          formData.append('name', this.name)
          formData.append('title', this.title)
          formData.append('subtitle', this.contractData.subtitle)
          formData.append('text', this.contractData.text)
          formData.append('copyright', this.contractData.copyright)
          formData.append('fields', JSON.stringify(this.selectedFields))

          if (this.contractFormType === 'add') {
            formData.append('has_image', this.hasImage)
            console.log('hasImage')
            console.log(this.hasImage)
            if (this.hasImage) {
              formData.append('image', this.imageToUpload)
              formData.append('image_name', this.imageToUpload.name)
              formData.append('image_size', this.imageToUpload.size)
              formData.append('imageForBase64', JSON.stringify(this.imageToUpload))
            }
            this.$http.post(this.appApiPath + '/api/contract_add', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              console.log('success response from contract_add')
              console.log(response.body)

              this.showSpinner = false
              store.dispatch({
                type: 'setAppContracts',
                contracts: response.body.data.contracts
              })
              this.saveContractsInStorage(response.body.data.contracts)
              this.$router.push({name: 'contracts', params: { isAlert: true, alertType: 'create-success' }})
            }, response => {
              console.warn('error from contract_add')
              console.log(response)
              this.showSpinner = false
            })
          } else if (this.contractFormType === 'edit') {
            formData.append('contract_id', this.currentContract.id)
            this.$http.post(this.appApiPath + '/api/contract_edit', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              console.log('success response from contract_add')
              console.log(response.body)

              this.showSpinner = false
              store.dispatch({
                type: 'setAppContracts',
                contracts: response.body.data.contracts
              })
              this.saveContractsInStorage(response.body.data.contracts)
              this.$router.push({name: 'contracts', params: { isAlert: true, alertType: 'create-success' }})
            }, response => {
              console.warn('error from contract_add')
              console.log(response)
              this.showSpinner = false
            })
          }
        }
      },
      makePreview() {
        event.preventDefault()

        console.log(this.selectedFields)
        console.log(this.imageToUpload)

        let contractData = {
          invoiceCounter: 1,
          propertyName: 'Salon adı',
          user: this.user,
          contractInfo: {
            title: this.title,
            subtitle: this.contractData.subtitle,
            copyright: this.contractData.copyright,
            text: this.contractData.text,
            fieldsArray: this.selectedFields,
            logo: this.imageToUpload.dataURL,
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
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

  .fieldRemoveIcon {
    color: crimson;
  }

  .fieldRemoveIcon:hover {
    pointer: cursor;
  }

  .md-helper-text {
    display: block;
    color: rgba(0,0,0,.54);
    height: 20px;
    position: absolute;
    bottom: -10px;
    left: 46px;
    font-size: 12px;
    transition: .3s cubic-bezier(.4,0,.2,1);
  }

  .bottom19 {
    bottom: 19px!important;
  }


</style>




