<template>
  <b-modal ref="removeBookingModal" class="modal-danger">
    <template slot="modal-header">
      <h5 class="modal-title"><span v-lang.bookingRemoval></span></h5>
    </template>
    <p class="card-text normalText200"> 
      <span v-lang.alertBookingRemove></span>
    </p>
    
    <p class="card-text normalText200"> 
      <span v-lang.totalPaid></span>: 
      <span class="fontWeight300">{{ bookingViewData.advance | numberFormat }}</span> 
    </p>

    <p class="card-text normalText200"> 
      <span v-lang.totalRefund></span>: 
      <span ref="span1" class="fontWeight300" v-if="!showTotalRefund">{{ bookingViewData.total_refund | numberFormat }}</span> 
      <span ref="span2" class="fontWeight300" v-if="showTotalRefund">{{ totalRefund | numberFormat }}</span> 
    </p>

    <div class="form-group" v-if="bookingViewData.advance">
      <label for="inputRefund"><span v-lang.refund></span></label>
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          <div class="input-group-text"> ₺</div>
        </div>
        <input type="number" class="form-control" :placeholder="labelTotalRefund" id="inputRefund" v-model.number="totalRefund">
        <small class="form-text"><span v-lang.refundBookingInfo></span></small>
      </div>
    </div>

    <template slot="modal-footer">
      <b-btn variant="default" @click="clickModalBtn('CANCEL')">
        <span v-lang.cancel></span>
      </b-btn>
      <b-btn variant="danger" @click="clickModalBtn('REMOVE')">
        <icon name="spinner" class="iconSpinner" pulse v-if="showSpinnerBookingDelete"></icon>
        <span v-lang.bookingRemove></span>
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import Icon from 'vue-awesome/components/Icon'
import { updateBookingLists } from '../../mixins/updateBookingLists'
import { labels } from '../../mixins/labels'
export default {
  name: 'ModalRemoveBooking',
  components: {Icon},
  mixins: [labels, updateBookingLists],
  props: {
    bookingViewData: Object,
    user: Object,
  },
  data() {
    return {
      showSpinnerBookingDelete: false,
      showTotalRefund: false,
      totalRefund: 0,
    }
  },
  computed: {
    language () {
      return this.$store.getters.getLanguage
    },
    appApiPath() {
      return this.$store.getters.getApiPath
    },
  },
  methods: {
    clickModalBtn(action) {
      console.log('from the modal')
      console.log({action})
      this.$refs.removeBookingModal.hide()
      if (this.totalRefund > this.bookingViewData.advance) {
        if (this.language === 'en') {
          this.$toasted.show('The total refund cannot be higher than the deposit paid. Please enter a different amount.', {icon: 'fa-exclamation-triangle', type: 'error'})
        } else if (this.language === 'tr') {
          this.$toasted.show('Kalan miktar, borçtan fazla olamaz', {icon: 'fa-exclamation-triangle', type: 'error'})
        }
        this.totalRefund = 0
      } else {
        this.showSpinnerBookingDelete = true
        let formData = new FormData()
        formData.append('booking_id', this.bookingViewData.id)
        formData.append('refund', this.totalRefund)
        formData.append('user_id', this.user.id)

        this.$http.post(this.appApiPath + '/api/booking_remove', formData)
          .then(response => {
            console.log('booking_refund success')
            console.log(response.body)
            this.showSpinnerBookingDelete = false
            this.showTotalRefund = true
            this.updateBookings(response) // mixin
            this.$emit('modal-booking-remove-success', response)
          }, response => {
            console.log('booking_refund error')
            console.log(response)
            this.showSpinnerBookingDelete = false
            this.$emit('modal-booking-remove-failed')
          })
      }
    },
    showModal() {
      this.$refs.removeBookingModal.show()
    },
    hideModal() {
      this.$refs.removeBookingModal.hide()
    },
  },
}
</script>
