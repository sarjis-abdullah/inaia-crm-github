<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t("orders") }}</h6>
          <!--
                <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                    <route-breadcrumb/>
                </nav>
                -->
        </div>
        <div class="col-lg-6 col-5 text-right">
          <div  class="d-flex justify-content-end" v-if="!createNewBatch">
              <base-button size="sm" type="neutral" @click="createNewBatchFromList">
                    {{$t('new_batch_process')}}
                </base-button>
          </div>
            <div class="d-flex justify-content-end" v-if="createNewBatch">
                <base-button size="sm" type="neutral" @click="cancelCreatingNewBatch">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="neutral" @click="saveNewBatchOrderProcess" :disabled="selectedOrders.length==0">
                    {{$t('save_new_batch')}}
                </base-button>
                
            </div>
          
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <List :createNewBatch="createNewBatch" ref="list" @orderAdded="onOrderAdded" @orderRemoved="onOrderRemoved"/>
    </div>
    <modal :show.sync="showPopupDate" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="cancelSavingNewBatchOrderProcess" :allowOutSideClose="false">
                    <template slot="header" class="pb-0">
                        <span></span>
                    </template>
                    <div class="d-flex flex-column justify-content-center align-items-center" v-if="!batchProcessPreview">
                      <div>{{$t('number_of_order')+selectedOrders.length}}</div>
                      <div>{{$t("choose_fixing_date")}}</div>
                      <DatePicker v-model="orderProcessDate" class="mt-3"/>
                    </div>
                    <div class="list-group list-group-flush" v-else>
                      <detail-list-item :title="$t('gold_price_date')"><div slot="value">{{$d(new Date(batchProcessPreview.gold_price_date),'short')}}</div></detail-list-item>
                      <detail-list-item :title="$t('gold_price')"><div slot="value"><i18n-n :value="batchProcessPreview.gold_price_raw/100"></i18n-n> €</div></detail-list-item>
                      <detail-list-item :title="$t('trading_gold_price')"><div slot="value"><i18n-n :value="batchProcessPreview.gold_price_trading/100"></i18n-n> €</div></detail-list-item>
                      <detail-list-item :title="$t('gold_amount')"><div slot="value"><i18n-n :value="batchProcessPreview.gold_amount/1000"></i18n-n> g</div></detail-list-item>
                      <detail-list-item :title="$t('money_amount')"><div slot="value"><i18n-n :value="batchProcessPreview.money_amount/100"></i18n-n> €</div></detail-list-item>
                      <detail-list-item :title="$t('number_of_order')"><div slot="value">{{batchProcessPreview.total_orders_count}}</div></detail-list-item>
                    </div>
            <template slot="footer">
              <base-button size="sm" type="link" @click="cancelSavingNewBatchOrderProcess" :disabled="isSubmitting">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="primary" v-if="batchProcessPreview==null" @click="getBatchProcessPreview" :disabled="selectedOrders.length==0 || isSubmitting || orderProcessDate == null">
                    {{$t('get_preview')}}
                </base-button>
                <base-button size="sm" type="primary" @click="confirmSavingNewBatchProcess" :disabled="isSubmitting" v-if="batchProcessPreview!=null">
                    {{$t('confirm')}}
                </base-button>
            </template>
    </modal>
  </div>
</template>
<script>
import List from "@/components/Orders/List";
import { DatePicker } from 'element-ui';
import { formatDateToApiFormat } from '../../helpers/helpers';
import DetailListItem from '@/components/common/DetailListItem.vue';
export default {
  layout: "DashboardLayout",
  components: {
    List,
    DatePicker,
    DetailListItem
  },
  data(){
      return {
          createNewBatch:false,
          selectedOrders:[],
          showPopupDate:false,
          orderProcessDate:null,
          isSubmitting:false,
          batchProcessPreview : null,
      }
  },
  methods:{
      createNewBatchFromList(){
          this.createNewBatch = true;
      },
      handleCommand(command){
          if(command == "list")
          {
              this.createNewBatchFromList();
          }
      },
      cancelCreatingNewBatch(){
        this.showPopupDate = false;
          this.createNewBatch = false;
          this.selectedOrders = [];
          this.orderProcessDate = null;
          this.batchProcessPreview = null;
          this.$refs.list.cancelCreatingBatch();
      },
      onOrderAdded(order){
        this.selectedOrders.push(order);
      },
      onOrderRemoved(order){
        let index = this.selectedOrders.indexOf(order);
        this.selectedOrders.slice(index);
      },
      saveNewBatchOrderProcess(){
        this.showPopupDate = true;
        this.batchProcessPreview = null;
      },
      cancelSavingNewBatchOrderProcess(){
        if(this.batchProcessPreview)
        {
          this.batchProcessPreview = null;
        }
        else{
          this.showPopupDate = false;
          this.orderProcessDate = null;
          this.batchProcessPreview = null;
        }
      },
      getBatchProcessPreview(){
        this.isSubmitting = true;
        const data = {
            "gold_price_date": formatDateToApiFormat(this.orderProcessDate),
            "order_ids": this.selectedOrders
          }
        this.$store.dispatch('batch-processing/previewNewBatch',data).then((res)=>{
          this.batchProcessPreview = res;
        }).catch(err=>{
          this.$notify({type: 'danger', timeout: 5000, message: this.$t('batch_order_prcess_created_unsuccessfully')})
        }).finally(()=>{
          this.isSubmitting = false;
        })
      },
      confirmSavingNewBatchProcess(){
        this.isSubmitting = true;
        const data = {
            "gold_price_date": formatDateToApiFormat(this.orderProcessDate),
            "order_ids": this.selectedOrders
          }
        this.$store.dispatch('batch-processing/createNew',data).then(res=>{
            this.$notify({type: 'success', timeout: 5000, message: this.$t('batch_order_prcess_created_successfully')})
            this.cancelCreatingNewBatch();
        }).catch(err=>{
          this.$notify({type: 'danger', timeout: 5000, message: this.$t('batch_order_prcess_created_unsuccessfully')})
        }).finally(()=>{
          this.isSubmitting = false;
        })
      }

      
  }
};
</script>
