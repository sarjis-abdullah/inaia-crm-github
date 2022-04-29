<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("order_batch_process") + ' : '+processId}}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6" v-if="batchProcess && !isInProgress">
    <div class="row" >
          <div class="col-xl-4 col-md-6">
            <div class="card border-0">
              <div class="card-body">
                  <div class="row">
                      <div class="col-9">
                <h5 class="card-title text-uppercase text-muted mb-0">{{$t('type')}}</h5>
                <span class="h2 font-weight-bold mb-0">{{$t(batchProcess.order_type.name_translation_key) }}</span>
                </div>
                <div class="col-3">
                    <div class="float-right">
                    <base-dropdown
                      title-classes="btn btn-sm btn-link mr-0"
                      menu-on-right
                      :has-toggle="false"
                      v-if="batchProcess.order_process_status.name_translation_key=='pending'"
                    >
                      <template slot="title">
                        <i class="fas fa-ellipsis-v"></i>
                      </template>

                      <a class="dropdown-item" @click.prevent="confirmMarkAsComplete"><i class="fa fa-check" ></i>{{$t("complete_batch")}}</a>
                      <a class="dropdown-item" ><i class="fa fa-upload"></i>{{$t("upload_csv")}}</a>
                       <a class="dropdown-item" ><i class="fa fa-download"></i>{{$t("download_csv")}}</a>
                    </base-dropdown>
                  </div>
                  <div class="float-right mt-2">
                    <Status v-bind:status='batchProcess.order_process_status.name_translation_key'>{{batchProcess.order_process_status ? $t(batchProcess.order_process_status.name_translation_key) : batchProcess.order_process_status_id}}</Status>
                    </div>
                </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <div class="text-nowrap">
                      {{$t('completed')}} / {{$t('total_order_count')}}

                  </div>
                    <div>{{batchProcess.completed_orders_count}} / {{batchProcess.total_orders_count}}</div>
                </p>
              </div>
            </div>
          </div>

          <div class="col-xl-4 col-md-6">
            <div class="card border-0">
              <div class="card-body">
                
                  
                    <h5 class="card-title text-uppercase text-muted mb-0">
                      {{$t('total_gold_amount')}}
                    </h5>
                    <span class="h2 font-weight-bold mb-0"
                      ><i18n-n :value="batchProcess.gold_amount/1000"></i18n-n> g</span
                    >
                  
                  
                
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-nowrap">{{$t('amount')}}: <i18n-n :value="batchProcess.money_amount/100"></i18n-n> €</span>
                </p>
              </div>
            </div>
          </div>

          <div class="col-xl-4 col-md-6">
            <div class="card border-0">
              <div class="card-body">
                
                    <h5 class="card-title text-uppercase text-muted mb-0 mr-2">
                      {{$t('trading_gold_price')}}
                       
                    </h5>
                     <span class="h2 font-weight-bold mb-0">
                         {{ $n(batchProcess.gold_price_trading/100) }} €
                     </span>
                
                <div class="mt-3 mb-0 text-sm">
                  <div>{{$t('gold_price_date')}}: {{ $d(new Date(batchProcess.gold_price_date),'short') }}</div>
                  <div>{{$t('gold_price')}}: {{ $n(batchProcess.gold_price_raw/100) }} €</div>
                </div>
              
            </div>
          </div>
        </div>
    </div>
    <List :order_process_id="processId"/>
    <Complete :showConfirmComplete="showConfirmComplete" :selectedOrderProcess="batchProcess" @canceled="cancelConfirmComplete"/>
    </div>
    <div class="mt-4 ml-4" v-else-if="isInProgress">
      {{$t('cant_open_batch_because_it_is_in_progress')}}
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Status from "@/components/Batch-processing/Status";
import List from "@/components/Orders/List";
import Complete from '@/components/Batch-processing/Complete';
export default {
  layout: "DashboardLayout",
  components: {
    Status,
    List,
    Complete
  },
  data() {
    return {
      processId: this.$route.params.id,
      isLoading: false,
      showConfirmComplete:false,
      isInProgress:false
    };
  },
  computed: {
    ...mapGetters({
      batchProcess: "batch-processing/batchProcess",
    }),
  },
  mounted() {
    this.isLoading = true;
    this.$store
      .dispatch("batch-processing/fetchOrderProcessDetails", this.processId)
      .then(res=>{
        if(res.order_process_status && res.order_process_status.name_translation_key=="in_progress")
        {
          this.isInProgress = true;
        }
      })
      .catch((err) => console.log(err))
      .finally(() => (this.isLoading = false));
  },
  methods:{
      cancelConfirmComplete(){
            this.showConfirmComplete = false;
            
        },
        confirmMarkAsComplete(){
            this.showConfirmComplete = true;
        }
  }
};
</script>