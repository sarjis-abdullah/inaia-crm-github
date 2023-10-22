<template>
  <modal
    :show.sync="showConfirmExecute"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelConfirmExecutePayment"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("confirm_execute_payment_title") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex align-align-items-center justify-content-center"
      v-if="selectedOrderProcess"
    >
      {{ $t("confirm_execute_text") + " " +selectedOrderProcess.id + " ?" }}
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelConfirmExecutePayment()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => executePayment()"
        :disabled="isSubmitting"
      >
        {{ $t("execute_payment") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
  props: {
    showConfirmExecute: {
      type: Boolean,
      default: false,
    },
    selectedOrderProcess: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isSubmitting: false,
    };
  },
  methods: {
    cancelConfirmExecutePayment() {
      this.showConfirmExecute = false;
      this.selectedOrderProcess = null;
      this.$emit("canceled");
    },
    executePayment() {
      this.isSubmitting = true;
      const data = {
          order_process_id:this.selectedOrderProcess.id,
          order_type: this.selectedOrderProcess.order_type.name_translation_key
      }
      this.$store
        .dispatch(
          "batch-processing/retryPayment",
          data
        )
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("execute_payments_started_successfully"),
          });
          this.$emit("completed");
          this.cancelConfirmExecutePayment();
          
        })
        .catch((err) => {
          apiErrorHandler(err,this.$notify);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>