<template>
  <div class="animated fadeIn">

    <div class="col-md-12 pageTitleRow bookingPages">
      <div class="flex-center pageTitleContainer">
        <span class="white pageTitle">
          <i class="fa fa-bookmark" aria-hidden="true"></i>
          <span v-lang.plans></span>
        </span>
        <div class="white-text pageSubtitle"> <span v-lang.plansSetup></span> </div>
      </div>
    </div>

    <b-card>
      <div class="form-group row">
        <div class="col-sm-3">
          <button type="submit" class="btn btn-lg btn-block btn-info white buttonMain" @click="goToPlanForm">
            <i class="fa fa-plus"></i>
            <span v-lang.planAdd></span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <b-table class="table-outline table-responsive-sm mb-0" hover
                   :items="plans"
                   :fields="tableFields"
                   head-variant="light"
          >
            <template v-slot:cell(monthly_billing)="item">
              {{item.item.monthly_billing | numberFormat}}
            </template>
            <template v-slot:cell(yearly_billing)="item">
              {{item.item.yearly_billing | numberFormat}}
            </template>
            <template v-slot:cell(days_free_trial)="item">
              {{item.item.days_free_trial}} <span v-lang.days></span>
            </template>
            <template v-slot:cell(actions)="item">
              <b-button variant="outline-primary actionButton" @click="goToPlanEdit(item.item)" v-b-tooltip.hover title="Edit Plan">
                <i class="fa fa-edit"></i>
              </b-button>
              <b-button variant="outline-danger actionButton" @click="openModalRemovePlan(item.item, $event)" v-b-tooltip.hover title="Remove Plan">
                <i class="fa fa-trash"></i>
              </b-button>
            </template>
            
          </b-table>
        </div>
      </div>

    </b-card> 

    <b-modal ref="removePlanModal" class="modal-danger">
      <template slot="modal-header">
        <h5 class="modal-title"> <span v-lang.planRemoval></span> </h5>
      </template>

      <span v-lang.planRemovalQuestion></span>

      <template slot="modal-footer">
        <b-btn variant="default" @click="clickModalBtn('CANCEL')">
          <span v-lang.cancel></span>
        </b-btn>
        <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
          <span v-lang.planRemoveButton></span>
        </b-btn>
      </template>
    </b-modal>
  </div>
</template>

<script>
  import router from '../router/index.js'
  import store from '../vuex/store'

  export default {
    data () {
      return {
        planToRemove: null,
      }
    },

    computed: {
      language () {
        return store.getters.getLanguage
      },
      appApiPath () {
        return store.getters.getApiPath
      },
      plans () {
        return store.state.plans
      },
      tableFields() {
        return [
          {
            label: 'Name',
            class: ['text-center', 'propertiesTable'],
            key: 'name',
          },
          {
            label: 'Max Users',
            class: ['text-center', 'propertiesTable'],
            key: 'max_users',
          },
          {
            label: 'Max Properties',
            class: ['text-center', 'propertiesTable'],
            key: 'max_properties',
          },
          {
            label: 'Monthly Billing',
            class: ['text-center', 'propertiesTable'],
            key: 'monthly_billing',
          },
          {
            label: 'Yearly Billing',
            class: ['text-center', 'propertiesTable'],
            key: 'yearly_billing',
          },
          {
            label: 'Free Trial',
            class: ['text-center', 'propertiesTable'],
            key: 'days_free_trial',
          },
          {
            label: 'SMS Included',
            class: ['text-center', 'propertiesTable'],
            key: 'total_sms',
          },
          {
            label: 'Email Included',
            class: ['text-center', 'propertiesTable'],
            key: 'total_emails',
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

      let isAlert = this.$route.params.isAlert
      let alertType = this.$route.params.alertType

      if (isAlert) {
        if (alertType === 'update-success') {
          if (this.language === 'en') {
            this.$toasted.show('Plan succesfully updated!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Plan başarıyla güncellendi', {icon: 'fa-check-circle', type: 'success'})
          }
        } else if (alertType === 'create-success') {
          if (this.language === 'en') {
            this.$toasted.show('Plan succesfully created!', {icon: 'fa-check-circle', type: 'success'})
          } else if (this.language === 'tr') {
            this.$toasted.show('Yeni plan Sisteme Eklendi!', {icon: 'fa-check-circle', type: 'success'})
          }
        }
      }
    },

    methods: {
      goToPlanEdit (plan) {
        console.log('goToEdit')
        console.log(plan)

        this.$localStorage.set('planFormType', plan)
        store.dispatch({
          type: 'setAppCurrentPlan',
          currentPlan: plan
        })

        this.$localStorage.set('planFormType', 'edit')
        store.dispatch({
          type: 'setAppPlanFormType',
          planFormType: 'edit'
        })

        router.push({name: 'planForm'})
      },
      openModalRemovePlan(plan, event) {
        event.preventDefault()
        this.planToRemove = {...plan}
        this.$refs.removePlanModal.show()
      },
      clickModalBtn: function (btn) {
        if (btn === 'CANCEL') {
          this.$refs.removePlanModal.hide()
        } else if (btn === 'REMOVE') {
          let formData = {
            'id': this.planToRemove.id,
          }

          this.$refs.removePlanModal.hide()

          this.$http.delete(this.appApiPath + `/api/plans/${this.planToRemove.id}`, formData)
            .then(response => {
              console.log('remove success')
              console.log(response.body)

              this.$toasted.show('Plan successfully removed!', {icon: 'fa-check-circle', type: 'success'})

              store.dispatch({
                type: 'setAppPlans',
                plans: response.body.plans
              })
            }, response => {
              console.log('remove error')
              console.log(response)
            })
        }
      },
      goToPlanForm(event) {
        event.preventDefault();

        this.$localStorage.set('planFormType', 'add')
        store.dispatch({
          type: 'setAppPlanFormType',
          planFormType: 'add'
        })

        router.push({name: 'planForm'});
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
