<template>
  <div class="animated fadeIn">

    <div class="card" style="margin-top: 1rem">

      <div class="card-block">

        <div class="container">

          <div class="col-md-12 pageTitleRowInCard propertiesSetupPages" v-if="serviceFormType === 'add'">
            <div class="flex-center pageTitleContainer">
              <span class="white pageTitle">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span v-lang.serviceAdd></span>
              </span>
              <div class="white-text pageSubtitle"><span v-lang.infoAddService></span></div>
            </div>
          </div>

          <div class="col-md-12 pageTitleRowInCard propertiesSetupPages" v-if="serviceFormType === 'edit'">
            <div class="flex-center pageTitleContainer">
              <div class="white pageTitle">
                <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                <span v-lang.serviceEdit></span>
              </div>
              <div class="white-text pageSubtitle"><span v-lang.infoEditService></span></div>
            </div>
          </div>

          <form  enctype="multipart/form-data">


            <div class="form-group">
              <label for="inputName"><span v-lang.name></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-tag iconColor"></i></span>
                <input type="text" class="form-control" :class="{'is-invalid': $v.name.$error}" id="inputName" :placeholder="labelName" v-model="name" @input="$v.name.$touch()">
              </div>
              <div class="invalid-feedback" v-if="!$v.name.required && $v.name.$dirty">
                <span v-lang.nameRequired></span>
              </div>
            </div>

            <div class="form-group">
              <label for="inputDescription"><span v-lang.description></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-edit iconColor"></i></span>
                <textarea rows="5" class="form-control lightBorders" v-model.trim="description" id="inputDescription" :placeholder="labelDescription"></textarea>
              </div>
            </div>

            <div class="form-group">
              <label for="inputTypeSelect"><span v-lang.type></span></label>
              <div class="input-group">
                <span class="input-group-addon mt3"><i class="fa fa-2x fa-id-card iconColor"></i></span>
                <select class="form-control" id="inputTypeSelect" v-model="type" @change="typeChanged(type)">
                  <option value="fixed" selected> <span v-lang.fixed></span> </option>
                  <option value="flexible"> <span v-lang.flexible></span> </option>
                </select>
              </div>
            </div>



            <div v-if="type === 'fixed'">
              <div class="form-group">
                <label for="inputCostFixed"><span v-lang.cost></span></label>
                <div class="input-group">
                  <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                  <div class="input-group-prepend">
                    <div class="input-group-text"> ₺ </div>
                  </div>
                  <input type="number" class="form-control" :class="{ 'is-invalid': (costValidationFailed && formSubmitted) }" id="inputCostFixed" :placeholder="labelCost" v-model="cost" @input="costInputType">
                </div>
                <div class="invalid-feedback" v-if="costValidationFailed && formSubmitted">
                  <span v-lang.costRequired></span>
                </div>
              </div>
            </div>



            <!--DEFAULT PRICE RANGE-->
            <span v-if="rangeType === 'default'">
              <div v-if="type === 'flexible'">
                <div class="form-group">
                  <label for="inputCostDefault1"><span v-lang.cost100></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                    <div class="input-group-prepend">
                      <div class="input-group-text"> ₺ </div>
                    </div>
                    <input type="number" class="form-control" :class="{ 'is-invalid': (cost1ValidationFailed && formSubmitted) }" id="inputCostDefault1" :placeholder="labelCost" v-model="cost1" @input="cost1InputType">
                  </div>
                  <div class="invalid-feedback" v-if="cost1ValidationFailed && formSubmitted">
                    <span v-lang.fieldRequired></span>
                  </div>
                </div>
              </div>

              <div v-if="type === 'flexible'">
                <div class="form-group">
                  <label for="inputCostDefault2"><span v-lang.cost250></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                    <div class="input-group-prepend">
                      <div class="input-group-text"> ₺ </div>
                    </div>
                    <input type="number" class="form-control" :class="{ 'is-invalid': (cost2ValidationFailed && formSubmitted) }" id="inputCostDefault2" :placeholder="labelCost" v-model="cost2" @input="cost2InputType">
                  </div>
                  <div class="invalid-feedback" v-if="cost2ValidationFailed && formSubmitted">
                    <span v-lang.fieldRequired></span>
                  </div>
                </div>
              </div>

               <div v-if="type === 'flexible'">
                <div class="form-group">
                  <label for="inputCostDefault3"><span v-lang.cost500></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                    <div class="input-group-prepend">
                      <div class="input-group-text"> ₺ </div>
                    </div>
                    <input type="number" class="form-control" :class="{ 'is-invalid': (cost3ValidationFailed && formSubmitted) }" id="inputCostDefault3" :placeholder="labelCost" v-model="cost3" @input="cost3InputType">
                  </div>
                  <div class="invalid-feedback" v-if="cost3ValidationFailed && formSubmitted">
                    <span v-lang.fieldRequired></span>
                  </div>
                </div>
              </div>

              <div v-if="type === 'flexible'">
                <div class="form-group">
                  <label for="inputCostDefault4"><span v-lang.cost1000></span></label>
                  <div class="input-group">
                    <span class="input-group-addon mt3"><i class="fa fa-2x fa-money iconColor"></i></span>
                    <div class="input-group-prepend">
                      <div class="input-group-text"> ₺ </div>
                    </div>
                    <input type="number" class="form-control" :class="{ 'is-invalid': (cost4ValidationFailed && formSubmitted) }" id="inputCostDefault4" :placeholder="labelCost" v-model="cost4" @input="cost4InputType">
                  </div>
                  <div class="invalid-feedback" v-if="cost4ValidationFailed && formSubmitted">
                    <span v-lang.fieldRequired></span>
                  </div>
                </div>
              </div>

            </span>

            <!--CUSTOM PRICE RANGE-->
            <span v-if="rangeType === 'custom'">

              <div class="row justify-content-md-center">
                <div class="col-sm-8">
                  <div class="alert alert-danger" role="alert" v-if="(customCostsArray.length === 0 && formSubmitted)">
                    <i class="fa fa-exclamation-triangle"></i>
                    <span v-lang.insertMinOneRage></span>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm">
                  <div class="input-group">
                     <div class="input-group-prepend">
                       <div class="input-group-text"> <i class="fa fa-user iconInput"></i> <span v-lang.min></span></div>
                     </div>
                    <input type="number" class="form-control form-control-md lightBordersFull" readonly v-model="min" placeholder="Min" aria-label="Min" aria-describedby="basic-addon1">
                  </div>
                </div>
                <div class="col-sm">
                  <div class="input-group">
                     <div class="input-group-prepend">
                       <div class="input-group-text"> <i class="fa fa-user iconInput"></i> <span v-lang.max></span></div>
                     </div>
                    <input type="number" class="form-control form-control-md lightBordersFull" v-model="max" placeholder="Max" aria-label="Max" aria-describedby="basic-addon2">
                  </div>
                </div>
                <div class="col-sm">
                  <div class="input-group">
                     <div class="input-group-prepend">
                       <div class="input-group-text"> ₺ </div>
                     </div>
                    <input type="number" class="form-control form-control-md lightBordersFull" v-model="customCost">
                  </div>
                </div>
                <div class="col-sm">
                  <button type="submit" class="btn btn-info white" @click="rangeCreate($event)">
                    <i class="fa fa-plus"></i> <span v-lang.addRange></span>
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-8">
                  <ul class="customRangeList">
                    <li class="card-text lead" v-for="(customCost, index) in customCostsArray" :key="index"> <span v-lang.min></span>: {{ customCost.min }} - <span v-lang.max></span>: {{ customCost.max }} - <span v-lang.cost></span>: {{ customCost.cost | numberFormat }} </li>
                  </ul>
                </div>
                <div class="col-sm-4">
                  <button type="submit" class="btn btn-danger white" style="margin-top: 29px;" @click="resetRange($event)" v-if="customCostsArray.length > 0">
                    <i class="fa fa-trash"></i> <span v-lang.rangeReset></span>
                  </button>
                </div>
              </div>

            </span>


            <div>
              <span class="formSubtitle"><span v-lang.images></span></span>
              <div class="md-form">
                <vue-dropzone
                  ref="myVueDropzone"
                  id="dropzoneAdd"
                  class="customDropzone"
                  :options="dzOptions"
                  v-on:vdropzone-success="imageAdded"
                  v-on:vdropzone-removed-file="imageRemoved"
                  v-on:vdropzone-complete="dropzoneComplete"
                  v-on:vdropzone-error="dropzoneError"
                  v-on:vdropzone-max-files-exceeded="maxSizeFileReached"
                  v-on:vdropzone-drop="drozoneDrop"
                  v-on:vdropzone-upload-progress="uploadProgress"
                ></vue-dropzone>
                <small class="form-text text-muted"><span v-lang.maxFiles></span>: 3 - <span v-lang.maxFilesize></span>: 10Mb</small>
              </div>
            </div>


            <div class="form-group row mt-4 ml-1" v-if="serviceFormType === 'add'">
              <button type="submit" class="btn btn-success btn-lg white" @click="serviceAdd($event)">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                <span v-lang.serviceCreate></span>
              </button>
            </div>


            <div class="form-group row mt-4 ml-1" v-if="serviceFormType === 'edit'">
              <button type="submit" class="btn btn-success btn-lg white" @click="serviceUpdate($event)">
                <icon name="spinner" class="iconSpinner" pulse v-if="showSpinner"></icon>
                <i class="fa fa-check-circle" v-if="!showSpinner"></i>
                <span v-lang.serviceEdit></span>
              </button>
            </div>


          </form>


        </div>
      </div>
    </div>

    <b-modal ref="modalServiceRange" class="modal-info">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.serviceRangePrices></span> </h5>
      </template>

      <p class="card-text lead">
        <span v-lang.alertServiceRangePrices1></span>

        <ul>
          <li> 0 - 100 </li>
          <li> 101 - 250 </li>
          <li> 251 - 500 </li>
          <li> > 500 </li>
        </ul>

        <span v-lang.alertServiceRangePrices2></span>
      </p>

      <template slot="modal-footer">
        <b-btn variant="success" style="color:white" @click="selectRangeType('default')">
          <span v-lang.useDefaultRange></span>
        </b-btn>
        <b-btn variant="info" style="color:white" @click="selectRangeType('custom')">
          <span v-lang.createCustomRange></span>
        </b-btn>
      </template>
    </b-modal>

  </div>
</template>

<script>
  import router from '../router'
  import Icon from 'vue-awesome/components/Icon'
  import { required } from 'vuelidate/lib/validators'
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  import store from '../vuex/store'
  import { labels } from '../mixins/labels'

  export default {
    name: 'serviceForm',
    components: { Icon, vueDropzone: vue2Dropzone },
    mixins: [labels],
    validations: {
      name: {
        required
      }
    },
    data () {
      return {
        showSpinner: false,
        name: '',
        description: '',
        type: 'fixed',
        cost: '',
        cost1: '',
        cost2: '',
        cost3: '',
        cost4: '',
        costValidationFailed: false,
        cost1ValidationFailed: false,
        cost2ValidationFailed: false,
        cost3ValidationFailed: false,
        cost4ValidationFailed: false,
        formSubmitted: false,
        imagesToUpload: [],
        editSetupComplete: false,
        imagesToRemove: [],
        dzOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          addRemoveLinks: true,
          destroyDropzone: false,
          headers: { 'My-Awesome-Header': 'header value' },
          maxFiles: 3,
          maxFilesize: 10,
        },
        rangeType: '',
        min: 0,
        max: 0,
        customCost: 0,
        customCostsArray: []
      }
    },
    computed: {
      language() {
        return store.getters.getLanguage
      },
      appApiPath() {
        return store.getters.getApiPath
      },
      services() {
        return store.getters.getServices
      },
      serviceToEdit() {
        return store.getters.getCurrentService
      },
      serviceFormType() {
        return store.getters.getServiceFormType
      },
      user() {
        return store.getters.getUser
      },
    },
    created() {
      this.$language = this.language

      if (this.$language === 'tr') {
        this.dzOptions.dictDefaultMessage = '<i class="fa fa-file-upload"></i> Resimleri buraya bırak'
      } else if (this.$language === 'en') {
        this.dzOptions.dictDefaultMessage = '<i class="fa fa-file-upload"></i> Drop images here'
      }
      if (this.serviceFormType === 'edit') {
        this.initEditing()
      }
    },
    methods: {
      initEditing() {
        this.name = this.serviceToEdit.name
        this.description = this.serviceToEdit.description
        this.type = this.serviceToEdit.type
        this.rangeType = this.serviceToEdit.range_type

        if (this.type === 'fixed') {
          this.cost = this.serviceToEdit.cost
        } else if (this.type === 'flexible') {
          if (this.rangeType === 'default') {
            this.cost = this.serviceToEdit.cost
            this.cost1 = this.serviceToEdit.cost1
            this.cost2 = this.serviceToEdit.cost2
            this.cost3 = this.serviceToEdit.cost3
            this.cost4 = this.serviceToEdit.cost4
          } else if (this.rangeType === 'custom') {
            this.customCostsArray = this.serviceToEdit.range_costs.map(item => ({...item}))
            let previousMax = this.customCostsArray[this.customCostsArray.length - 1].max
            this.min = previousMax + 1
            this.max = this.min + 1
          }
        }
        setTimeout(() => {
          for (var i = 0; i < this.serviceToEdit.images.length; i++) {
            let image = {...this.serviceToEdit.images[i]}
            this.$refs.myVueDropzone.manuallyAddFile({
              name: image.name, size: image.size, type: 'image', image_id: image.id
            }, this.appApiPath + image.path)
          }
          this.editSetupComplete = true
        }, 100)
      },
      initCost() {
        if (this.type === 'flexible' && this.rangeType === 'default') {
          this.cost = [ this.cost1, this.cost2, this.cost3, this.cost4 ]

          if (this.cost1 === '') {
            this.cost1ValidationFailed = true
            this.costValidationFailed = true
          }

          if (this.cost2 === '') {
            this.cost2ValidationFailed = true
            this.costValidationFailed = true
          }

          if (this.cost3 === '') {
            this.cost3ValidationFailed = true
            this.costValidationFailed = true
          }

          if (this.cost4 === '') {
            this.cost4ValidationFailed = true
            this.costValidationFailed = true
          }
        } else if (this.type === 'flexible' && this.rangeType === 'custom') {
          if (this.customCostsArray.length === 0) {
            this.costValidationFailed = true
          }
        } else if (this.type === 'fixed') {
          if (this.cost === '') {
            this.costValidationFailed = true
          }
        }
      },
      showAlertError() {
        if (this.language === 'en') {
          this.$toasted.show('Please fill in the required fields', {
            icon: 'fa-exclamation-triangle',
            type: 'error'
          })
        } else if (this.language === 'tr') {
          this.$toasted.show('Gerekli alanlari doldurunuz.', {
            icon: 'fa-exclamation-triangle',
            type: 'error'
          })
        }
      },
      serviceAdd(event) {
        event.preventDefault()
        this.formSubmitted = true

        if (this.$v.$invalid) {
          this.$v.name.$touch()
          this.showAlertError()
        } else {
          this.initCost()
          if (this.costValidationFailed) {
            this.showAlertError()
          } else {
            this.showSpinner = true
            let postData = new FormData()
            postData.append('name', this.name)
            postData.append('description', this.description)
            postData.append('cost', JSON.stringify(this.cost))
            postData.append('total_images', this.imagesToUpload.length)
            postData.append('type', this.type)
            postData.append('range_costs', JSON.stringify(this.customCostsArray))
            postData.append('range_type', this.rangeType)
            postData.append('user_id', this.user.id)

            for (let i = 0; i < this.imagesToUpload.length; i++) {
              postData.append('image' + i, this.imagesToUpload[i])
            }

            this.$http.post(this.appApiPath + '/api/service_add', postData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              console.log('service add success')
              console.log(response.body)

              this.showSpinner = false

              store.dispatch({
                type: 'setAppServices',
                services: response.body.data.serviceList
              })

              this.$localStorage.set('services', JSON.stringify(response.body.data.serviceList))

              if (this.user.role === 'admin') {
                router.push({ name: 'services-o', params: { createSuccess: true } })
              } else if (this.user.role === 'manager') {
                router.push({ name: 'services-m', params: { createSuccess: true } })
              }
            }, response => {
              console.warn('service add error')
              console.log(response)

              this.showSpinner = false
            })
          }
        }
      },
      serviceUpdate(event) {
        event.preventDefault()
        this.formSubmitted = true

        if (this.$v.$invalid) {
          this.$v.name.$touch()
          this.showAlertError()
        } else {
          this.initCost()
          this.costValidationFailed = false
          if (this.costValidationFailed) {
            this.showAlertError()
          } else {
            this.showSpinner = true

            let postData = new FormData()
            postData.append('service_id', this.serviceToEdit.id)
            postData.append('name', this.name)
            postData.append('description', this.description)
            postData.append('type', this.type)
            postData.append('cost', JSON.stringify(this.cost))
            postData.append('total_images', this.imagesToUpload.length)
            postData.append('range_costs', JSON.stringify(this.customCostsArray))
            postData.append('range_type', this.rangeType)
            postData.append('images_to_remove', JSON.stringify(this.imagesToRemove))
            postData.append('user_id', this.user.id)

            for (let i = 0; i < this.imagesToUpload.length; i++) {
              postData.append('image' + i, this.imagesToUpload[i])
            }

            this.$http.post(this.appApiPath + '/api/service_update', postData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              console.log('service update success')
              console.log(response.body)

              this.showSpinner = false

              store.dispatch({
                type: 'setAppServices',
                services: response.body.data.serviceList
              })
              this.$localStorage.set('services', JSON.stringify(response.body.data.serviceList))

              if (this.user.role === 'admin') {
                console.log('going to admin ser')
                router.push({name: 'services-o', params: {updateSuccess: true}})
              } else if (this.user.role === 'manager') {
                console.log('going to manager ser')
                router.push({name: 'services-m', params: {updateSuccess: true}})
              }
            }, response => {
              console.warn('service update error')
              console.log(response)
              this.showSpinner = false
            })
          }
        }
      },
      imageAdded(file) {
        if (this.serviceFormType === 'add' || (this.serviceFormType === 'edit' && this.editSetupComplete)) {
          this.imagesToUpload.push(file)
        }
      },
      imageRemoved(file) {
        if (this.serviceFormType === 'add') {
          let index = this.imagesToUpload.indexOf(file)
          if (index > -1) {
            this.imagesToUpload.splice(index, 1)
          }
        } else if (this.serviceFormType === 'edit') {
          this.imagesToRemove.push({...file})
        }
      },
      costInputType() {
        this.costValidationFailed = false
      },
      cost1InputType() {
        this.cost1ValidationFailed = false
        this.checkFlexibleValidation()
      },
      cost2InputType() {
        this.cost2ValidationFailed = false
        this.checkFlexibleValidation()
      },
      cost3InputType() {
        this.cost3ValidationFailed = false
        this.checkFlexibleValidation()
      },
      cost4InputType() {
        this.cost4ValidationFailed = false
        this.checkFlexibleValidation()
      },
      checkFlexibleValidation() {
        if (this.cost1 !== '' && this.cost2 !== '' && this.cost3 !== '' && this.cost4 !== '') {
          this.costValidationFailed = false
        }
      },
      dropzoneComplete(file) {
        console.log('dropzone complete')
        console.log(file)
      },
      dropzoneError(file, message, xhr) {
        console.log('dropzone error')
        console.log(file)
        console.log(message)
        console.log(xhr)
      },
      maxSizeFileReached(file) {
        console.log('max size reeached')
        console.log(file)
      },
      drozoneDrop(event) {
        console.log('tha drop')
        console.log(event)
      },
      uploadProgress(file, progress, bytesSent) {
        console.log('upload progress')
        console.log(file)
        console.log(progress)
        console.log(bytesSent)
      },
      typeChanged(type) {
        if (type === 'flexible') {
          this.$refs.modalServiceRange.show()
        }
      },
      selectRangeType(rangeType) {
        this.rangeType = rangeType
        this.$refs.modalServiceRange.hide()
      },
      rangeCreate(event) {
        event.preventDefault()
        this.min = Number(this.min)
        this.max = Number(this.max)
        this.customCost = Number(this.customCost)

        if (this.max <= this.min) {
          // invalid - show alert
          if (this.language === 'en') {
            this.$toasted.show('The max value must be bigger than the minimum', {icon: 'fa-exclamation-triangle', type: 'error'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Maksimum değer minimumdan büyük olmalı.', {icon: 'fa-exclamation-triangle', type: 'error'})
          }
        } else {
          let customData = {
            min: this.min,
            max: this.max,
            cost: this.customCost
          }

          this.customCostsArray.push(customData)
          this.min = this.max + 1
          this.max += 2
          this.customCost = 0
        }
      },
      resetRange(event) {
        event.preventDefault()
        this.customCostsArray = []
        this.min = 0
        this.min = 0
        this.customCost = 0
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .btn i {
    margin-right: 5px;
  }

  i.prefix {
    color: #555;
  }

  .customRangeList {
    margin-left: 46px;
    margin-top: 36px;
  }


</style>



