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
          isOrderGoldPurchaseInterval(selectedOrderProcess) || isOrderSilverPurchase(selectedOrderProcess) || isOrderSilverPurchaseInterval(selectedOrderProcess))
      "
    >
      <DatePicker v-model="selectedDate" class="mt-3" @change="getBatchProcessPreview" :placeholder="$t('select_price_date')"/>
      <Loader v-if="isLoading" class="mt-3"/>
      <div class="list-group list-group-flush mt-3" v-if="batchProcessPreview && !isLoading">
        <detail-list-item :title="$t('gold_price_date')"
          ><div slot="value">
            {{ $d(new Date(batchProcessPreview.gram_price_date), "short") }}
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_price')"
          ><div slot="value">
            <i18n-n :value="batchProcessPreview.gram_price_raw / 100"></i18n-n>
            €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('trading_gold_price')"
          ><div slot="value">
            <i18n-n
              :value="batchProcessPreview.gram_price_trading / 100"
            ></i18n-n>
            €
          </div></detail-list-item
        >
        <detail-list-item :title="$t('gold_amount')"
          ><div slot="value">
            <i18n-n :value="batchProcessPreview.gram_amount / 1000"></i18n-n> g
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
        <div v-if="batchProcessPreview.inaia_stock_balance >=0 && batchProcessPreview.operation_stock_balance >=0">
        <div class="my-4">
          <span class=" text-black-100 text-uppercase">Asset sources</span>
          <div class="text-danger" v-if="batchProcessPreview.gram_amount > (batchProcessPreview.operation_stock_balance+batchProcessPreview.inaia_stock_balance)">
            {{ $t('not_enough_asset_please_buy') }}
          </div>
        </div>
        <detail-list-item :title="$t('inaia_stock')"
          ><div slot="value" class="d-flex float-right align-items-center">
            
              <Input type="numeric" class="mr-2" :placeholder="$t('amount')" v-model="inaiaStockAmount"/> {{$t('from')}}  {{ batchProcessPreview.inaia_stock_balance/1000 }} g
           
          </div></detail-list-item
        >
        <detail-list-item :title="$t('operation_stock')"
          ><div slot="value" class="d-flex float-right align-items-center">
            
              <Input type="numeric" class="mr-2" :placeholder="$t('amount')" v-model="operationStockAmount"/> {{$t('from')}}  {{ batchProcessPreview.operation_stock_balance/1000 }} g
           
          </div></detail-list-item
        >
        <div class="text-danger" v-if="batchProcessPreview.gram_amount > (parseInt(inaiaStockAmount*1000)+parseInt(operationStockAmount*1000))">
            {{ $t('the_stock_amounts_must_be_equal_to_purchased_amout') }}
          </div>
      </div>
      <span class="text-danger" v-if="batchProcessPreview && batchProcessPreview.gram_amount > totalAvailableStockAmount">{{ $t('please_buy_assets') }}</span>
      </div>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelConfirmComplete()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => transferOrComplete()"
        :disabled="shouldDisableMarkAsComplete()"
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
  isOrderSilverPurchase,
  isOrderSilverPurchaseInterval
} from "../../helpers/order";
import { DatePicker,Input } from "element-ui";
import { formatDateToApiFormat } from "../../helpers/helpers";
import DetailListItem from "@/components/common/DetailListItem.vue";
import Loader from '@/components/common/Loader/Loader';
import { mapGetters } from "vuex";
import { assetTypes } from '@/helpers/depots'
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
  components: {
    DatePicker,
    DetailListItem,
    Loader,
    Input
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
  mounted(){
    if(this.depotTypes.length == 0)
      {
          this.$store.dispatch('depots/getDepotTypes');
          
      }
  },
  data() {
    return {
      isSubmitting: false,
      selectedDate: null,
      batchProcessPreview: null,
      isLoading: false,
      inaiaStockAmount:null,
      operationStockAmount:null
    };
  },
  computed:{
        ...mapGetters({
            depotTypes : 'depots/depotTypes'
        }),
        totalAvailableStockAmount(){
          if(this.batchProcessPreview){
            const operationAmount = (this.batchProcessPreview.operation_stock_balance?this.batchProcessPreview.operation_stock_balance:0);
            const inaiaAmount = (this.batchProcessPreview.inaia_stock_balance?this.batchProcessPreview.inaia_stock_balance:0);
            return operationAmount + inaiaAmount;
          }
          return 0;
          
        }
    },
  methods: {
    isOrderGoldPurchase,
    isOrderGoldPurchaseInterval,
    isOrderGoldSale,
    isOrderSilverPurchase,
    isOrderSilverPurchaseInterval,
    cancelConfirmComplete() {
      this.showConfirmComplete = false;
      this.selectedOrderProcess = null;
      this.$emit("canceled");
    },
    getBatchProcessPreview() {
      this.isSubmitting = true;
      this.isLoading = true;
      const data = {
        gram_price_date: formatDateToApiFormat(this.selectedDate),
        order_process_id: this.selectedOrderProcess.id,
        order_type: this.selectedOrderProcess.order_type.name_translation_key
      };
      this.$store
        .dispatch("batch-processing/previewNewBatch", data)
        .then((res) => {
          this.batchProcessPreview = res;
        })
        .catch((err) => {
          apiErrorHandler(err,this.$notify);
        })
        .finally(() => {
          this.isSubmitting = false;
          this.isLoading = false;
        });
    },
    transferOrComplete(){
      if(this.inaiaStockAmount>0)
      {
        this.transferGramAmount();
      }
      else{
        this.markAsComplete();
      }
    },
    markAsComplete() {
      this.isSubmitting = true;
      if(isOrderGoldSale(this.selectedOrderProcess))
      {
        this.selectedDate = new Date();
      }
      const data = {
          order_process_id:this.selectedOrderProcess.id,
          gram_price_date: this.selectedDate?formatDateToApiFormat(this.selectedDate):formatDateToApiFormat(new Date()),
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
        .catch((err) => {
          apiErrorHandler(err,this.$notify);
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
    transferGramAmount(){
      let depoType = null;
      if(this.selectedOrderProcess.order_type)
      {
        if(this.selectedOrderProcess.order_type.name_translation_key.indexOf('gold')!=-1)
          depoType = this.depotTypes.find(x=>x.name_translation_key.indexOf(assetTypes.gold)!=-1);
        else
          depoType = this.depotTypes.find(x=>x.name_translation_key.indexOf(assetTypes.silver)!=-1);
      }
      if(depoType)
      {
        this.isSubmitting =  true;
        let data = {
                    depot_type_id:depoType.id,
                    amount:this.inaiaStockAmount*1000,
                    fixing_price:parseInt(this.batchProcessPreview.gram_price_raw),
                    fixing_date:this.batchProcessPreview.gram_price_date
                }
                this.$store.dispatch('stocks/transferStock',{data:data}).then((res)=>{
                    this.markAsComplete();
                }).catch((err)=>{
                    this.isSubmitting =  false;
                    apiErrorHandler(err,this.$notify);
                })
      }
    },
    shouldDisableMarkAsComplete(){
      if(this.selectedOrderProcess && isOrderGoldSale(this.selectedOrderProcess))
      {
        return this.isSubmitting;
      }
      else{
        return this.isSubmitting || !this.batchProcessPreview || this.batchProcessPreview.total_orders_count == 0 
        || this.batchProcessPreview.gram_amount > (this.batchProcessPreview.operation_stock_balance+this.batchProcessPreview.inaia_stock_balance)
        || parseInt(this.inaiaStockAmount*1000 + this.operationStockAmount*1000) < parseInt(this.batchProcessPreview.gram_amount)
        
        ;
      }
    }
  },
};
</script>
