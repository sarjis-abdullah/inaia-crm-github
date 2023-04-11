<template>
  <modal
    :show.sync="showConfirmSell"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelConfirmSell"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("confirm_batch_sell_title") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex flex-column align-align-items-center justify-content-center"
    >
      <DatePicker v-model="selectedDate" class="mt-3" @change="getBatchProcessSellPreview" :placeholder="$t('select_price_date')"/>
      <Loader v-if="isLoading" class="mt-3"/>
      <div class="list-group list-group-flush mt-3" v-if="batchProcessSellPreview">
        <detail-list-item :title="$t('gold_price_date')"
          ><div slot="value">
            {{ $d(new Date(batchProcessSellPreview.gram_price_date), "short") }}
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_price')"
          ><div slot="value">
            <i18n-n :value="batchProcessSellPreview.gram_price_raw / 100"></i18n-n>
            €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_amount')"
          ><div slot="value">
            <i18n-n :value="batchProcessSellPreview.gram_amount / 1000"></i18n-n> g
          </div></detail-list-item
        >
        <detail-list-item :title="$t('money_amount')"
          ><div slot="value">
            <i18n-n :value="batchProcessSellPreview.money_amount / 100"></i18n-n> €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('number_of_order')"
          ><div slot="value">
            {{ batchProcessSellPreview.total_orders_count }}
          </div></detail-list-item
        >
      </div>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelConfirmSell()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => sellGold()"
        :disabled="isSubmitting || !batchProcessSellPreview || batchProcessSellPreview.total_orders_count == 0"
      >
        {{ $t("sell_gold") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { DatePicker } from "element-ui";
import { formatDateToApiFormat } from "../../helpers/helpers";
import DetailListItem from "@/components/common/DetailListItem.vue";
import Loader from '@/components/common/Loader/Loader';
export default {
  components: {
    DatePicker,
    DetailListItem,
    Loader
  },
  props: {
    showConfirmSell: {
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
      batchProcessSellPreview: null,
      isLoading: false,
    };
  },
  methods: {
    cancelConfirmSell() {
      this.showConfirmSell = false;
      this.selectedOrderProcess = null;
      this.$emit("canceled");
    },
    getBatchProcessSellPreview() {
      this.isSubmitting = true;
      this.isLoading = true;
      const data = {
        gram_price_date: formatDateToApiFormat(this.selectedDate),
        order_process_id: this.selectedOrderProcess.id
      };
      this.$store
        .dispatch("batch-processing/sellGoldPreview", data)
        .then((res) => {
          this.batchProcessSellPreview = res;
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
          this.isLoading = false;
        });
    },
    sellGold() {
      this.isSubmitting = true;
      const data = {
          order_process_id:this.selectedOrderProcess.id,
          gold_price_date: this.selectedDate?formatDateToApiFormat(this.selectedDate):formatDateToApiFormat(new Date()),
      }
      this.$store
        .dispatch(
          "batch-processing/sellGold",
          data
        )
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("order_batch_gold_successfully"),
          });
          this.cancelConfirmSell();
          this.$emit("completed");
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("order_batch_gold_unsuccessfully"),
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>
