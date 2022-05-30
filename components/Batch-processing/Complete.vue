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
      <h5 class="modal-title">{{ $t("confirm_batch_complete_title") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex align-align-items-center justify-content-center"
      v-if="selectedOrderProcess && isOrderGoldSale(selectedOrderProcess)"
    >
      {{ $t("confirm_batch_complete_text") + selectedOrderProcess.id + " ?" }}
    </div>
    <div
      class="d-flex flex-column align-align-items-center justify-content-center"
      v-if="
        selectedOrderProcess &&
        (isOrderGoldPurchase(selectedOrderProcess) ||
          isOrderGoldPurchaseInterval(selectedOrderProcess))
      "
    >
      <DatePicker v-model="selectedDate" class="mt-3" @change="getBatchProcessPreview"/>
      <div class="list-group list-group-flush mt-3" v-if="batchProcessPreview">
        <detail-list-item :title="$t('gold_price_date')"
          ><div slot="value">
            {{ $d(new Date(batchProcessPreview.gold_price_date), "short") }}
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_price')"
          ><div slot="value">
            <i18n-n :value="batchProcessPreview.gold_price_raw / 100"></i18n-n>
            €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('trading_gold_price')"
          ><div slot="value">
            <i18n-n
              :value="batchProcessPreview.gold_price_trading / 100"
            ></i18n-n>
            €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_amount')"
          ><div slot="value">
            <i18n-n :value="batchProcessPreview.gold_amount / 1000"></i18n-n> g
          </div></detail-list-item
        >
        <detail-list-item :title="$t('money_amount')"
          ><div slot="value">
            <i18n-n :value="batchProcessPreview.money_amount / 100"></i18n-n> €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('number_of_order')"
          ><div slot="value">
            {{ batchProcessPreview.total_orders_count }}
          </div></detail-list-item
        >
      </div>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelConfirmComplete()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => markAsComplete()"
        :disabled="isSubmitting || !batchProcessPreview || batchProcessPreview.total_orders_count == 0"
      >
        {{ $t("mark_as_complete") }}
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
import { DatePicker } from "element-ui";
import { formatDateToApiFormat } from "../../helpers/helpers";
import DetailListItem from "@/components/common/DetailListItem.vue";
export default {
  components: {
    DatePicker,
    DetailListItem
  },
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
      selectedDate: null,
      batchProcessPreview: null,
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
    getBatchProcessPreview() {
      this.isSubmitting = true;
      const data = {
        gold_price_date: formatDateToApiFormat(this.selectedDate),
        order_process_id: this.selectedOrderProcess.id,
        order_type: this.selectedOrderProcess.order_type.name_translation_key
      };
      this.$store
        .dispatch("batch-processing/previewNewBatch", data)
        .then((res) => {
          this.batchProcessPreview = res;
        })
        .catch((err) => {
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("this_date_has_not_goldprice"),
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    markAsComplete() {
      this.isSubmitting = true;
      const data = {
          order_process_id:this.selectedOrderProcess.id,
          gold_price_date: this.selectedDate?formatDateToApiFormat(this.selectedDate):formatDateToApiFormat(new Date()),
          order_type: this.selectedOrderProcess.order_type.name_translation_key
      }
      this.$store
        .dispatch(
          "batch-processing/markAsComplete",
          data
        )
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("order_batch_completed_successfully"),
          });
          this.cancelConfirmComplete();
          this.$emit("completed");
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("order_batch_completed_unsuccessfully"),
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>