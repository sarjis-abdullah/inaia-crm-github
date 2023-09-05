<template>
    <div>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{tite}}</h6>
          <!--
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
              <route-breadcrumb/>
          </nav>
          -->
        </div>
        <div class="col-lg-6 col-5 text-right" v-if="hasEditAccess">
          <Dropdown  v-if="!markMany" @command="handleCommand" trigger="click">
            <base-button size="sm" type="neutral">{{$t('manage_payments')}}<i class="el-icon-arrow-down el-icon--right"></i></base-button>
                                        <DropdownMenu  slot="dropdown">
                                            <DropdownItem command="mark_many_as_paid">{{$t('mark_many_as_paid')}}</DropdownItem>
                                            <DropdownItem command="initiate_payment_for_this_month" >{{$t('initiate_payment_for_this_month')}}</DropdownItem>
                                            <DropdownItem command="initiate_payment_for_many">{{$t('initiate_payment_for_many')}}</DropdownItem>
                                            
                                        </DropdownMenu>
                                    </Dropdown>
          
          <div class="d-flex justify-content-end" v-else>
                <base-button size="sm" type="neutral" @click="cancelMarkMany">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="neutral" @click="completeManyAction" :disabled="selectedAggregatedClaims.length==0">
                    {{$t('confirm')}}
                </base-button>
                
            </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
        <AggregatedClaims ref="list" 
        :month="month" :perPage="10" 
        :status="status" 
        :markMany="markMany"
        @markAdded="markAdded"
        @markDeleted="markDeleted"
        />
    </div>
    <modal
      :show.sync="showConfirmMany"
      bodyClasses="pt-0"
      footerClasses="border-top bg-secondary"
      :allowOutSideClose="false"
      size="lg"
      @close="showConfirmMany = false"
      >
      <template slot="header">
        <h5 class="modal-title" id="exampleModalLabel">{{$t('confirm')}}</h5>
      </template>
      <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="selectedAggregatedClaims"
        >
          <el-table-column label="#" min-width="100px" prop="id">
            <template v-slot="{ row }">
              <div class="media align-items-center">
                <div class="media-body">
                  
                  <div class="font-weight-300 name">{{ row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('amount')"
            min-width="100px"
            header-align="right"
            align="right"
            prop="amount"
          >
            <template v-slot="{ row }">
              <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('date')"
            min-width="100px"
            prop="claim_date"
          >
            <template v-slot="{ row }">
              {{ $d(new Date(row.claim_date), "short") }}
            </template>
          </el-table-column>
        </el-table>
      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="showConfirmMarAsPaid = false">
                          {{$t('cancel')}}
                        </base-button>
        <base-button type="primary" @click="() => confirmAction()"
                            :disabled="isSubmitting">
                          {{$t('confirm')}}
                        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import AggregatedClaims from '@/components/Claims/AggregatedClaims';
import { formatDateToApiFormat, getMonthName } from "../../../../helpers/helpers";
import { Table, TableColumn,Dropdown,DropdownMenu,DropdownItem } from "element-ui";
import { canEditClaims } from '@/permissions';
import moment from 'moment';
export default {
  layout: "DashboardLayout",
  components: {
    AggregatedClaims,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Dropdown,
    DropdownMenu,
    DropdownItem
  },
  data(){
      return {
          month:this.$route.params.month,
          status:this.$route.query.status,
          markMany:false,
          selectedAggregatedClaims:[],
          showConfirmMany: false,
          isSubmitting:false,
          selectedCommand:null
      }
  },
  computed:{
      tite(){
          let dates = this.month.split('-');
          const monthName = getMonthName(dates[1]);
          return monthName + ' ' + dates[0];
      },
    hasEditAccess(){
      return canEditClaims()
    }
  },
  methods:{
    actDecMarkAsMany(){
      this.markMany = !this.markMany;
    },
    cancelMarkMany(){
       this.markMany = false;
       this.$refs.list.cancelAddingMany();
       this.selectedAggregatedClaims=[];
       this.selectedCommand = null;
    },
    completeManyAction(){
      this.showConfirmMany = true;
    },
    markAdded(aggregatedClaim)
    {
      this.selectedAggregatedClaims.push(aggregatedClaim);
      
    },
    markDeleted(aggregatedClaim)
    {
      let index = this.selectedAggregatedClaims.indexOf(aggregatedClaim);
      this.selectedAggregatedClaims.splice(index,1);
    },
    handleCommand(command) {
        this.selectedCommand = command;
        if(command == 'initiate_payment_for_this_month'){

        }
        if(command == 'mark_many_as_paid' || command == 'initiate_payment_for_many'){
          this.markMany = !this.markMany;
        }
    },
    confirmAction(){
      if(this.selectedCommand == 'mark_many_as_paid'){
        this.confirmMarlAllAsPaid()
      }
      if(this.selectedCommand == 'initiate_payment_for_many'){
        this.initiatePaymentforAll()
      }
    },
    confirmMarlAllAsPaid()
    {
      this.$notify({type: 'info', timeout: 5000, message: this.$t('marking_many_as_paid')})
      this.isSubmitting = true;
      let data = [];
      this.selectedAggregatedClaims.forEach(element => {
        data.push(element.id);
      });
      this.$store.dispatch('claims/markManyAspaid',data).then(()=>{
        this.$notify({type: 'success', timeout: 5000, message: this.$t('mark_many_as_paid_successfully')})
        this.$refs.list.refresh();
        this.showConfirmMany = false;
        this.cancelMarkMany();
      }).catch(()=>{
        this.$notify({type: 'danger', timeout: 5000, message: this.$t('mark_many_as_paid_unsuccessfully')})
      }).finally(()=>{
        this.isSubmitting = false;
      })
    },
    initiatePaymentforAll(){
      this.isSubmitting = true;
      let aggregated_claims = [];
      this.selectedAggregatedClaims.forEach(element => {
        aggregated_claims.push({id:element.id});
      });
      const executionDate = moment().add('1','day').toDate();
      const data = {
        aggregated_claims:aggregated_claims,
        execution_date : formatDateToApiFormat(executionDate)
      }

      this.$store.dispatch('claims/initiateAggregatedClaimDirectDebit',data).then((res)=>{
       window.open(res,'_blanc');
        this.showConfirmMany = false;
        this.cancelMarkMany();
      }).catch(()=>{
        this.$notify({type: 'danger', timeout: 5000, message: this.$t('payment_not_initiated')})
      }).finally(()=>{
        this.isSubmitting = false;
      })
    }
  }
};
</script>