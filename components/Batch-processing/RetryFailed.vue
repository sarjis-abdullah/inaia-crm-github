<template>
  <modal
    :show.sync="showConfirmComplete"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelConfirmComplete"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("retry_confirm_batch_complete_title") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex align-align-items-center justify-content-center"
      v-if="selectedOrderProcess"
    >
      {{ $t("retry_confirm_batch_complete_text") + " " +selectedOrderProcess.id + " ?" }}
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelConfirmComplete()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => retryComplete()"
        :disabled="isSubmitting"
      >
        {{ $t("retry_last_failed") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import {
  isOrderGoldPurchase,
  isOrderGoldPurchaseInterval,
  isOrderGoldSale,
} from "../../helpers/order";
import { formatDateToApiFormat } from "../../helpers/helpers";
export default {
  props: {
    showConfirmComplete: {
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
    isOrderGoldPurchase,
    isOrderGoldPurchaseInterval,
    isOrderGoldSale,
    cancelConfirmComplete() {
      this.showConfirmComplete = false;
      this.selectedOrderProcess = null;
      this.$emit("canceled");
    },
    retryComplete() {
      this.isSubmitting = true;
      const data = {
          order_process_id:this.selectedOrderProcess.id,
          gold_price_date: this.selectedDate?formatDateToApiFormat(this.selectedDate):formatDateToApiFormat(new Date()),
          order_type: this.selectedOrderProcess.order_type.name_translation_key
      }
      this.$store
        .dispatch(
          "batch-processing/retryFailed",
          this.selectedOrderProcess.id
        )
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("retry_order_batch_completed_successfully"),
          });
          this.cancelConfirmComplete();
          this.$emit("completed");
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("retry_order_batch_completed_unsuccessfully"),
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>