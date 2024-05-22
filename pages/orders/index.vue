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
        <div class="col-lg-11 text-right" v-if="hasEditAccess">
          <div  class="d-flex justify-content-end" v-if="!createNewBatch">
              <base-button size="sm" type="neutral" @click="createNewBatchFromList">
                    {{$t('new_batch_process')}}
                </base-button>
          </div>
              <NewBatch 
                @saved="saveNewBatchOrderProcess" 
                @canceled="cancelCreatingNewBatch" 
                v-if="createNewBatch" 
                @changed="onBatchCreatingFilterChange"
                :selectedOrders="selectedOrders"
                :selectedType="selectedOrderType"
                />
          
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <List :createNewBatch="activateSelection" ref="list" @orderAdded="onOrderAdded" @orderRemoved="onOrderRemoved"/>
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
import { canEditDepot } from '@/permissions'
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
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
          newBatchSelectedCriteria:null,
          selectedOrderType:null,
          activateSelection:false
      }
  },
  computed : {
    hasEditAccess(){
       return canEditDepot();
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
          this.$refs.list.applyFilter("");
          this.activateSelection = false;
      },
      onOrderAdded(order){
        const index = this.selectedOrders.findIndex(o=>o==order)
        if(index==-1)
          this.selectedOrders.push(order);
      },
      onOrderRemoved(order){
        let index = this.selectedOrders.indexOf(order);
        this.selectedOrders.splice(index,1);
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
          let uniqueArray = this.selectedOrders.reduce((acc, value) => {
          if (!acc.includes(value)) {
            acc.push(value);
          }
          return acc;
        }, []);
          data = {
            "order_ids": uniqueArray,
            "order_type_id": this.newBatchSelectedCriteria.selectedType
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
            this.$notify({type: 'success', timeout: 5000, message: this.$t('entry_added_successfully')})
            this.cancelCreatingNewBatch();
        }).catch(err=>{
          apiErrorHandler(err,this.$notify);
        }).finally(()=>{
          this.isSubmitting = false;
        })
      },
      onBatchCreatingFilterChange(query)
      {
        if(query.includes('order_type_ids'))
        {
          this.activateSelection = true;
        }
        else{
          this.activateSelection = false;
        }
        this.$refs.list.applyFilter(query);
      }

      
  }
};
</script>
