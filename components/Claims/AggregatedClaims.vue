<template>
  <div class="row">
    
    <div class="col-9">
      
      <div class="card">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-8">
              <h5 class="h3 mb-0" v-if="account_id==-1">{{ $t("aggregated_claims") }}</h5>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col" v-if="!account_id">
              <CustomerFilter @change="onAccountSelected" @clear="onAccountCleared"/>
            </div>
            <div class="col">
              <Select
                :placeholder="$t('status')"
                v-model="selectedStatus"
                @change="applyFilter"
                class="mb-3"
                @clear="applyFilter"
                :loading="loadingStatus"
                clearable
              >
                <Option
                  v-for="option in claimStatuses"
                  :value="option.id"
                  :label="$t(option.name_translation_key)"
                  :key="option.id"
                >
                </Option>
              </Select>
            </div>
            <div class="col" v-if="!month">
              <date-picker
                size="large"
                clearable
                v-model="selectedDate"
                @clear="applyFilter"
                type="month"
                :placeholder="$t('select_start_date_placeholder')"
              >
              </date-picker>
            </div>
          </div>
        </div>

        <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="aggregatedClaims"
        >
          <el-table-column label="#"  prop="id">
            <template v-slot="{ row }">
              <div class="media align-items-center">
                <div class="media-body">
                  <div class="font-weight-300 name" v-if="markMany" >
                    <Checkbox :value="shouldCheck(row.id)" :label="row.id" @change="(value)=>addMarkAsPaid(value,row)" :disabled="isPaid(row.claim_status.name_translation_key)">
                        
                    </Checkbox>
                    </div>
                  <div class="font-weight-300 name" v-else>{{ row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('amount')"
            min-width="180px"
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
            min-width="140px"
            prop="claim_date"
          >
            <template v-slot="{ row }">
              {{ $d(new Date(row.claim_date), "short") }}
            </template>
          </el-table-column>
          <el-table-column v-bind:label="$t('status')">
            <template v-slot="{ row }">
              <Status
                :status="
                  row.claim_status ? row.claim_status.name_translation_key : ''
                "
              />
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot="{ row }">
              <icon-button
                type="info"
                @click="() => displayDetails(row)"
              ></icon-button>
              <Dropdown trigger="click" v-if="!isPaid(row.claim_status.name_translation_key)">
                <span class="btn btn-sm btn-icon-only text-light">
                    <i class="fas fa-ellipsis-v mt-2"></i>
                </span>
                <DropdownMenu  slot="dropdown">
                    <DropdownItem command="mark_as_paid">{{$t('mark_as_paid')}}</DropdownItem>
                    <DropdownItem command="initiate_payment" >{{$t('initiate_payment')}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </template>
          </el-table-column>
        </el-table>

        <div
          class="card-footer py-4 d-flex justify-content-end"
          v-if="totalPages > 1"
        >
          <base-pagination
            v-model="page"
            :per-page="perPage"
            :total="totalTableData"
          ></base-pagination>
        </div>
        <modal
          :show.sync="showDetails"
          class="orderModal"
          headerClasses=""
          bodyClasses="pt-0"
          footerClasses="border-top bg-secondary"
          :allowOutSideClose="false"
          size="lg"
          @close="selectedAggregated = null"
        >
          <template slot="header">
            <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
            <span></span>
          </template>
          <div v-if="selectedAggregated">
            <Claims :aggregated_id="selectedAggregated.id" 
                    :account_id="selectedAggregated.account_id" 
                    :aggregated_status="selectedAggregated.claim_status.name_translation_key"
                    @markedAsPaid="refresh"
            />
          </div>
        </modal>
      </div>
    </div>
    <div class="col-3">
      <div class="card" v-if="pendingAmount > 0">
        <div class="card-header" >
          <h5 class="h3 mb-0">{{$t('pending_amount')}}</h5>
        </div>
        <div class="card-body">
          <div class="text-sm-center">{{$n(pendingAmount/100)}} €</div>
        </div>
      </div>
      <div class="card" v-if="paidAmount > 0">
        <div class="card-header">
          <h5 class="h3 mb-0">{{$t('paid_amount')}}</h5>
        </div>
        <div class="card-body">
          <div class="text-center">{{$n(paidAmount/100)}} €</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn,Checkbox } from "element-ui";
import Status from "@/components/Claims/Status";
import Claims from "@/components/Claims/Claims";
import { Select, Option, DatePicker,Dropdown,DropdownMenu,DropdownItem } from "element-ui";
import IconButton from "@/components/common/Buttons/IconButton";
import { formatDateToApiFormat } from "../../helpers/helpers";
import CustomerFilter from '@/components/common/CustomerFilter';
import moment from 'moment';
import {PAYMENT_PENDING,PAYMENT_PAID} from '../../helpers/claims';
export default {
  props: {
    account_id: {
      type: Number,
      default: -1,
    },
    month:{
      type:String
    },
    perPage:{
      type: Number,
      default: 10
    },
    status:{
      type:String
    },
    markMany:{
      type:Boolean,
      default:false
    }
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Status,
    IconButton,
    Select,
    Option,
    DatePicker,
    Claims,
    Checkbox,
    CustomerFilter,
    Dropdown,
    DropdownMenu,
    DropdownItem
  },
  mounted() {
    if (this.claimStatuses.length == 0) {
      this.$store.dispatch("claims/getClaimStatuses").then(()=>{
        if(this.status == PAYMENT_PENDING)
        {
          let pendingStatus = this.claimStatuses.find(x=>x.name_translation_key == this.status);
          this.selectedStatus = pendingStatus.id;
        }
      });
    }
    else{
      if(this.status == PAYMENT_PENDING)
      {
        let pendingStatus = this.claimStatuses.find(x=>x.name_translation_key == this.status);
        this.selectedStatus = pendingStatus.id;
      }
    }
  },
  computed: {
    ...mapGetters({
      aggregatedClaims: "claims/aggregatedClaims",
      claimStatuses: "claims/claimStatuses",
    }),
    searchQuery() {
      let base = `&page=${
        this.page
      }&per_page=${this.perPage}`;
      if(this.selectedCustomer > 0)
      {
        base+=`&account_id=${this.selectedCustomer}`;
      }
      if (this.selectedStatus) {
        base += `&claim_status_id=${this.selectedStatus}`;
      }
      if (this.selectedDate) {
        if(this.selectedDate instanceof Date)
        {
          let date = moment(this.selectedDate);

          this.selectedDate = date.format('YYYY-MM');
        }
        base += `&claim_month=${this.selectedDate}`;
      }
      return base;
    },
    pendingAmount(){
      if(this.claimStatuses.length>0 && this.amounts.length > 0)
      {
        let pendingStatus =  this.claimStatuses.find(x=>x.name_translation_key == PAYMENT_PENDING);
        let pendingAmount = this.amounts.find(x=>x.claim_status_id==pendingStatus.id);
        if(pendingAmount)
        {
          return pendingAmount.sum;
        }
      }
      return 0;
    },
    paidAmount(){
      if(this.claimStatuses.length>0 && this.amounts.length > 0)
      {
        let paidStatus =  this.claimStatuses.find(x=>x.name_translation_key == PAYMENT_PAID);
        let paidAmount = this.amounts.find(x=>x.claim_status_id==paidStatus.id);
        if(paidAmount)
        {
          return paidAmount.sum;
        }
      }
      return 0;
    }
  },
  watch: {
    searchQuery: {
      handler() {
        this.fetchAggregatedClaims();
      },
      immediate: true,
    },
  },
  
  data() {
    return {
      page: 1,
      totalTableData: 0,
      isLoading: false,
      loadingError: null,
      selectedOrder: null,
      showOrderDetails: false,
      selectedStatus: null,
      selectedDate: this.month,
      loadingStatus: false,
      selectedAggregated: null,
      showDetails: false,
      amounts:[],
      customers:[],
      selectedCustomer:this.account_id,
      selectedToBeMarked:[],
      totalPages:0
    };
  },
  methods: {
    fetchAggregatedClaims() {
      if(this.status == PAYMENT_PENDING && this.claimStatuses.length == 0)
      {
        return;
      }
      this.isLoading = true;
      this.$store
        .dispatch("claims/getClientAggregatedClaims", this.searchQuery)
        .then((res) => {
          this.totalTableData = res.meta.total;
          this.totalPages = res.meta.last_page;
          if(res.total_amounts){
            this.amounts = res.total_amounts
          }
        })
        .catch((err) => (this.loadingError = this.$t("cant_load_list")))
        .finally(() => (this.isLoading = false));
    },
    displayDetails(resource) {
      this.selectedAggregated = resource;
      this.showDetails = true;
    },
    onAccountSelected(account)
    {
      this.selectedCustomer = account.id;
      this.applyFilter();
    },
    onAccountCleared(){
      this.selectedCustomer = null;
      this.applyFilter();
    },
    applyFilter() {
      this.page = 1;
    },
    shouldCheck(id)
    {
      let index = this.selectedToBeMarked.indexOf(id);
      return index > -1;
    },
    addMarkAsPaid(value,row){
      if(value)
      {
        this.selectedToBeMarked.push(row.id);
        this.$emit('markAdded',row)
      }
      else
      {
        let index = this.selectedToBeMarked.indexOf(row.id);
        if(index> -1)
        {
          this.selectedToBeMarked.splice(index,1);
          this.$emit('markDeleted',row)
        }
      }
      
    },
    cancelAddingMany(){
      this.selectedToBeMarked = [];
    },
    isPaid(status)
    {
      return status == PAYMENT_PAID;
    },
    refresh(){
      this.page = 1;
      this.fetchAggregatedClaims();
    }
  },
};
</script>
<style scoped>
</style>
