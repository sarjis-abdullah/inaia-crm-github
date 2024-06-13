<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("order_batch_process") + " : " + processId }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6" v-if="shouldShowDetails()">
      <div class="row">
        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-9">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    {{ $t("type") }}
                  </h5>

                  <span class="h2 font-weight-bold mb-0">{{
                    $t(batchProcess.order_type.name_translation_key)
                  }}</span>
                  <div class="text-sm">
                    {{ $t("processing_date") }} :
                    {{ $d(new Date(batchProcess.processing_date), "short") }}
                  </div>
                </div>
                <div class="col-3">
                  <div class="float-right">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                      v-if="
                        shouldShowCsv() && hasEditAccess
                      "
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>
                      <a
                        class="dropdown-item"
                        v-if="!isBeforeProcessingDate()"
                        @click="uploadCsvFile()"
                        ><i class="fa fa-upload"></i>{{ $t("upload_csv") }}</a
                      >
                      <a class="dropdown-item" @click="showDownloadCSVDialog()"
                        ><i class="fa fa-download"></i
                        >{{ $t("download_csv") }}</a
                      >
                      <a class="dropdown-item" @click="openCsvFilesList()"
                        ><i class="fa fa-list"></i>{{ $t("csv_list") }}</a
                      >
                    </base-dropdown>
                  </div>
                  <div class="float-right mt-2">
                    <Status
                      v-bind:status="
                        batchProcess.order_process_status.name_translation_key
                      "
                      >{{
                        batchProcess.order_process_status
                          ? $t(
                              batchProcess.order_process_status
                                .name_translation_key
                            )
                          : batchProcess.order_process_status_id
                      }}</Status
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-9">
                  <h5 class="card-title text-uppercase text-muted mb-0 mr-2">
                    {{ $t("progress") }}
                  </h5>
                  <div>
                    {{ $t("total_order_count") }}:
                    {{ batchProcess.total_orders_count }}
                  </div>
                  <div>
                    {{ $t("completed") }}:
                    {{ batchProcess.completed_orders_count }}
                  </div>
                </div>
                <div class="col-3">
                  <div class="float-right">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                      v-if="
                        shouldDisplayProgressActions() && hasEditAccess
                      "
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>
                      <a
                        class="dropdown-item"
                        v-if="
                        shouldDisplayRetry()
                        "
                        @click.prevent="confirmRetryComplete"
                        ><i class="lnir lnir-reload"></i
                        >{{ $t("retry_last_failed") }}</a
                      >
                      
                      <a
                        class="dropdown-item"
                        v-if="
                          shouldDisplayComplete()
                        "
                        @click.prevent="confirmMarkAsComplete"
                        ><i class="fa fa-check"></i
                        >{{ $t("complete_batch") }}</a
                      >
                      <a
                        class="dropdown-item"
                        v-if="
                          shouldDisplayPPsExecutePayment()
                        "
                        @click="displayExecutePayment()"
                        ><i class="fa fa-credit-card"></i
                        >{{ $t("execute_pps_payment") }} ( {{pendingPPSOrders}} )</a
                      >
                      <a
                        class="dropdown-item"
                        v-if="
                          shouldDisplayBankExecutePayment()
                        "
                        @click="displayExecuteBankPayment()"
                        ><i class="fa fa-credit-card"></i
                        >{{ $t("execute_bank_payment") }} ( {{pendingBankAccountOrders>0?pendingBankAccountOrders:oustandingBankAccountOrders}} )</a
                      >
                      <a
                        class="dropdown-item"
                        v-if="
                          isOrderGoldSale(batchProcess)
                        "
                        @click.prevent="displaySellGoldModal"
                        ><i class="fa fa-check"></i
                        >{{ $t("sell_gold") }}</a
                      >
                    </base-dropdown>
                    <div class="text-sm"></div>
                  </div>
                  <div class="float-right mt-2">
                    <Progress
                      type="dashboard"
                      :percentage="progressPercentage"
                      color="#2dce89"
                      :width="80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    {{ $t("total_gold_amount") }}
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    ><i18n-n :value="batchProcess.gram_amount / 1000"></i18n-n>
                    g</span
                  >
                </div>
                <div class="col">
                  <h5 class="card-title text-uppercase text-muted mb-0">
                    {{ $t("amount") }}
                  </h5>
                  <span class="h2 font-weight-bold mb-0"
                    ><i18n-n :value="batchProcess.money_amount / 100"></i18n-n>
                    {{ currency }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <List :order_process_id="processId"  @orderUpdated="onOrderUpdated"/>
      <Complete
        v-if="!isBeforeProcessingDate()"
        :showConfirmComplete="showConfirmComplete"
        :selectedOrderProcess="batchProcess"
        @canceled="cancelConfirmComplete"
      />
      <RetryFailed
        v-if="
          !isBeforeProcessingDate() &&
          batchProcess.order_process_status.name_translation_key == 'failed'
        "
        :showConfirmComplete="showConfirmRetryComplete"
        :selectedOrderProcess="batchProcess"
        @canceled="cancelConfirmComplete"
      />
      <ExecutePayment
        v-if="
          !isBeforeProcessingDate()
        "
        :showConfirmExecute="showExecutePayment"
        :selectedOrderProcess="batchProcess"
        @canceled="cancelExecutePayment"
      />
      <ExecuteBankPayment
        :showExecuteBankPayment="showExecuteBankPayment"
        :selectedOrderProcess="batchProcess"
        :totalNumber="pendingBankAccountOrders"
        @canceled="cancelExecuteBankPayment"
      />
      <DownloadCsv
        :selectedOrderProcess="batchProcess"
        :showDownloadDialog="showDownloadCsv"
        @canceled="cancelShowDownloadCSVDialog"
        @downloaded="checkCsvFileList"
      />
      <CsvList
        :showCsvList="showFilesList"
        :selectedOrderProcess="batchProcess"
        @closed="closeCSVList"
      />
      <UploadCsv
        :showUploadDialog="showUploadCsv"
        @canceled="()=>{showUploadCsv = true}"
      />
      <SellGold
        v-if="batchProcess && isOrderGoldSale(batchProcess)"
        :showConfirmSell="showSellGold"
        :selectedOrderProcess="batchProcess"
        @canceled="cancelSellGold"
      />
      
    </div>
    <div class="mt-4 ml-4" v-if="isInProgress()">
      {{ $t("cant_open_batch_because_it_is_in_progress") }}
    </div>
  </div>
</template>
<script>
import { mapGetters,mapMutations } from "vuex";
import Status from "@/components/Batch-processing/Status";
import List from "@/components/Orders/List";
import Complete from "@/components/Batch-processing/Complete";
import ExecuteBankPayment from "@/components/Batch-processing/ExecuteBankPayment";
import { Progress } from "element-ui";
import moment from "moment";
import RetryFailed from "@/components/Batch-processing/RetryFailed";
import DownloadCsv from "@/components/Csv-file/DownloadCsv";
import CsvList from "@/components/Csv-file/CsvList";
import UploadCsv from "@/components/Csv-file/UploadCsv";
import ExecutePayment from '@/components/Batch-processing/ExecutePayment';
import SellGold from '@/components/Batch-processing/SellGold';
import {isOrderGoldPurchase,isOrderGoldPurchaseInterval,isOrderGoldSale, isOrderSilverSale} from '../../../../helpers/order';
import { canEditDepot } from '@/permissions'
import {ORDER_PROCESS_STATUS_PENDING,ORDER_PROCESS_STATUS_COMPLETE,ORDER_PROCESS_STATUS_INPROGRESS,ORDER_PROCESS_STATUS_FAILED} from '../../../../helpers/orderProcess';
import { getCurrencySymbol } from "@/helpers/currency";
export default {
  layout: "DashboardLayout",
  components: {
    Status,
    List,
    Complete,
    Progress,
    RetryFailed,
    DownloadCsv,
    CsvList,
    UploadCsv,
    ExecutePayment,
    SellGold,
    ExecuteBankPayment
  },
  data() {
    return {
      isLoading: false,
      showConfirmComplete: false,
      showConfirmRetryComplete: false,
      showDownloadCsv: false,
      showFilesList: false,
      showUploadCsv: false,
      showExecutePayment: false,
      showSellGold : false,
      showExecuteBankPayment:false
    };
  },
  computed: {
    ...mapGetters({
      batchProcess: "batch-processing/batchProcess",
    }),
    progressPercentage() {
      return Math.floor(
        (this.batchProcess.completed_orders_count /
          this.batchProcess.total_orders_count) *
          100
      );
    },
    pendingBankAccountOrders(){
      if(this.batchProcess && this.batchProcess.payment_methods && this.batchProcess.payment_methods.bank_account)
      {
        return this.batchProcess.payment_methods.bank_account.pending
      }
      else{
        return 0;
      }
    },
    oustandingBankAccountOrders(){
      if(this.batchProcess && this.batchProcess.orders_count && this.batchProcess.orders_count.order_status_payment_outstanding>0)
      {
        return this.batchProcess.orders_count.order_status_payment_outstanding
      }
      else{
        return 0;
      }
    },
    pendingPPSOrders(){
      if(this.batchProcess && this.batchProcess.payment_methods && this.batchProcess.payment_methods.pps)
      {
        return this.batchProcess.payment_methods.pps.pending
      }
      else{
        return 0;
      }
    },
    hasEditAccess(){
       return canEditDepot();
    },
    processId() {
      return Number(this.$route.params.id)
    },
    currency(){
      return getCurrencySymbol(this.batchProcess.currency);
    }
  },
  destroyed(){
    this.$store.commit('batch-processing/batchProcess',null);
  },
  mounted() {
    this.isLoading = true;
    this.getBatchProcess();
  },
  methods: {
    isOrderGoldSale,
    cancelConfirmComplete() {
      this.showConfirmComplete = false;
      this.showConfirmRetryComplete = false;
    },
    confirmMarkAsComplete() {
      this.showConfirmComplete = true;
    },
    confirmRetryComplete() {
      this.showConfirmRetryComplete = true;
    },
    isBeforeProcessingDate() {
      if (this.batchProcess.processing_date) {
        const now = moment();
        const processingDate = moment(this.batchProcess.processing_date);
        return now.isBefore(processingDate);
      } else {
        return false;
      }
    },
    showDownloadCSVDialog() {
      this.showDownloadCsv = true;
    },
    openCsvFilesList() {
      this.showFilesList = true;
    },
    closeCSVList() {
      this.showFilesList = false;
    },
    cancelShowDownloadCSVDialog() {
      this.showDownloadCsv = false;
    },
    uploadCsvFile() {
      this.showUploadCsv = true;
    },
    checkCsvFileList() {
      let count = 0;
      const recurrentFuntion = (count) => {
        count++;
        const payload = "order_process_id=" + this.batchProcess.id;
        this.$store
          .dispatch("csv-file/fetchList", payload)
        if (count < 6) {
          setTimeout(() => recurrentFuntion(count), 5000);
        }
      };
      setTimeout(() => recurrentFuntion(count), 5000);
    },
  shouldShowCsv()
  {
    return ((isOrderGoldPurchase(this.batchProcess) || isOrderGoldPurchaseInterval(this.batchProcess)) && this.batchProcess.order_process_status.name_translation_key == ORDER_PROCESS_STATUS_PENDING);
  },
  shouldDisplayProgressActions(){
    return (this.batchProcess.order_process_status
                          .name_translation_key == ORDER_PROCESS_STATUS_PENDING ||
                          this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_FAILED);
  },
  shouldDisplayRetry(){
    /*return this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_FAILED;*/
                            return false;
  },
  shouldDisplayComplete(){
    return this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_PENDING && !this.isBeforeProcessingDate();
  },
  shouldDisplayPPsExecutePayment(){
    return this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_PENDING && !isOrderGoldSale(this.batchProcess) && this.pendingPPSOrders > 0 && !this.isBeforeProcessingDate();;
  },
  shouldDisplayBankExecutePayment(){
    return (this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_PENDING && !isOrderGoldSale(this.batchProcess) && this.pendingBankAccountOrders > 0) || ((isOrderGoldSale(this.batchProcess) || isOrderSilverSale(this.batchProcess) && this.oustandingBankAccountOrders>0));
  },
  cancelExecutePayment(){
    this.showExecutePayment = false;
  },
  displayExecutePayment(){
    this.showExecutePayment = true;
  },
  displaySellGoldModal (){
    this.showSellGold = true;
  },
  cancelSellGold(){
    this.showSellGold = false;
  },
  shouldShowDetails()
  {
    return this.batchProcess && this.batchProcess.order_process_status
                            .name_translation_key != ORDER_PROCESS_STATUS_INPROGRESS;
  },
  isInProgress()
  {
    return this.batchProcess && this.batchProcess.order_process_status
                            .name_translation_key == ORDER_PROCESS_STATUS_INPROGRESS;
  },
  getBatchProcess()
  {
    this.$store
      .dispatch("batch-processing/fetchOrderProcessDetails", this.processId)
      .then((res) => {
      })
      .catch((err) => console.log("Error fetching batch process details"))
      .finally(() => (this.isLoading = false));
  },
  cancelExecuteBankPayment(){
    this.showExecuteBankPayment = false;
  },
  displayExecuteBankPayment(){
    if(!(isOrderGoldSale(this.batchProcess) || isOrderSilverSale(this.batchProcess))){
      this.showExecuteBankPayment = true;
    }
    else{
      const payload = {
        "order_process_id":this.batchProcess.id
      }
      this.$store.dispatch('orders/executeSellBankPayment',payload).then((res)=>{
                                window.open(res,'_blank');
                                //window.location.href = res;
                                }).catch((err)=>{
                                    apiErrorHandler(err,this.$notify);
                                }).finally(()=>{
                                    this.isSubmitting = false;
                                })
    }
    
  },
  onOrderUpdated(order)
  {
    if(order.order_process_id)
    {
      this.$notify({
            type: "info",
            timeout: 5000,
            message: this.$t("batch_process_will_be_updated"),
          });
      setTimeout(() => {
        this.getBatchProcess();
      }, 10000);
      
    }
  }
  }
};
</script>