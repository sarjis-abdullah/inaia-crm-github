<template>
  <div>
    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-1">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t("orders") }}</h6>
          <!--
                <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                    <route-breadcrumb/>
                </nav>
                -->
        </div>
        <div class="col-lg-11 text-right">
          <div  class="d-flex justify-content-end" v-if="!createNewBatch">
              <base-button size="sm" type="neutral" @click="createNewBatchFromList">
                    {{$t('new_batch_process')}}
                </base-button>
          </div>
              <NewBatch @saved="saveNewBatchOrderProcess" @canceled="cancelCreatingNewBatch" v-if="createNewBatch" @changed="onBatchCreatingFilterChange"/>
          
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
                    <div class="d-flex flex-column justify-content-center align-items-center">
                      <div v-if="selectedOrders.length>0">{{$t('number_of_order')+selectedOrders.length}}</div>
                      <div v-else>{{$t('create_new_batch_select_all')}}</div>
                    </div>
            <template slot="footer">
              <base-button size="sm" type="link" @click="cancelSavingNewBatchOrderProcess" :disabled="isSubmitting">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="primary" @click="confirmSavingNewBatchProcess" :disabled="isSubmitting">
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
import NewBatch from '@/components/Batch-processing/NewBatch';

export default {
  layout: "DashboardLayout",
  components: {
    List,
    DatePicker,
    DetailListItem,
    NewBatch
  },
  data(){
      return {
          createNewBatch:false,
          selectedOrders:[],
          showPopupDate:false,
          orderProcessDate:null,
          isSubmitting:false,
          newBatchSelectedCriteria:null
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
          this.$refs.list.cancelCreatingBatch();
      },
      onOrderAdded(order){
        this.selectedOrders.push(order);
      },
      onOrderRemoved(order){
        let index = this.selectedOrders.indexOf(order);
        this.selectedOrders.slice(index);
      },
      saveNewBatchOrderProcess(criteria){
        this.showPopupDate = true;
        this.newBatchSelectedCriteria = criteria;
      },
      cancelSavingNewBatchOrderProcess(){
          this.showPopupDate = false;
      },
      confirmSavingNewBatchProcess(){
        this.isSubmitting = true;
        let data = {};
        if(this.selectedOrders.length>0)
        {
          data = {
            "order_ids": this.selectedOrders
          }
        }
        else{
          data.order_type_id = this.newBatchSelectedCriteria.selectedType;
          if(this.newBatchSelectedCriteria.startDate)
          {
            data.start_date = this.newBatchSelectedCriteria.startDate;
          }
          if(this.newBatchSelectedCriteria.startDate && this.newBatchSelectedCriteria.endDate)
          {
            data.end_date = this.newBatchSelectedCriteria.endDate;
          }
        }
        
        this.$store.dispatch('batch-processing/createNew',data).then(res=>{
            this.$notify({type: 'success', timeout: 5000, message: this.$t('batch_order_prcess_created_successfully')})
            this.cancelCreatingNewBatch();
        }).catch(err=>{
          this.$notify({type: 'danger', timeout: 5000, message: this.$t('batch_order_prcess_created_unsuccessfully')})
        }).finally(()=>{
          this.isSubmitting = false;
        })
      },
      onBatchCreatingFilterChange(query)
      {
        this.$refs.list.applyFilter(query);
      }

      
  }
};
</script>
