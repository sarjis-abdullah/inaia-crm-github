<template>
  <div class="card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col text-right">

          <button @click.prevent="toggleAddClaim()" type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="hasEditAccess && !isCreatingBatch">
            <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('add_claim')}}</span>
          </button>
          <button @click.prevent="initiatePaymentForAccount()" type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="hasEditAccess && !isCreatingBatch">
            <span class="btn-inner--text">{{$t('initiate_payment_for_all')}}</span>
          </button>
          <button @click.prevent="toggleCreateBatch()" type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="hasEditAccess && !isCreatingBatch">
            <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('create_batch')}}</span>
          </button>
          <button @click.prevent="cancelCreatingBatch()" type="button" class="btn base-button btn-icon btn-fab btn-secondary btn-sm" v-if="hasEditAccess && isCreatingBatch" :disabled="isSubmitting">
            <span class="btn-inner--text">{{$t('cancel')}}</span>
          </button>
          <button @click.prevent="saveNewBatchClaim()" type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="hasEditAccess && isCreatingBatch" :disabled="isSubmitting || claimsToAdd.length == 0">
            <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('create_batch')}}</span>
          </button>
        </div>
      </div>

    </div>

      <el-table
        class="table-hover table-responsive table-flush"
        header-row-class-name="thead-light"
        :data="claims"
      >
        <el-table-column label="#" prop="id">
          <template v-slot="{ row }">
            <Checkbox  :label="row.id" @change="(value)=>addRemoveClaim(value,row)" v-if="row && isCreatingBatch">

            </Checkbox>
            <div class="font-weight-300 name" v-else>{{ row.id }}</div>
            
          </template>
        </el-table-column>
          <el-table-column
          v-bind:label="$t('amount')"

          align="right"
          prop="amount"
          
        >
          <template v-slot="{ row }">
            <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
            
          </template>
        </el-table-column>
          <el-table-column v-bind:label="$t('type')"  prop="type" min-width="180">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">

                <span class="orderType text-body"
                  >{{
                    row.claim_type ? $t(row.claim_type.name_translation_key) : ""
                  }}</span
                ><Status :status='row.claim_status ? row.claim_status.name_translation_key : ""' class="ml-2"/>



            </div>
            
          </template>
        </el-table-column>

        <el-table-column v-bind:label="$t('depot')"  prop="type" min-width="100">
          <template v-slot="{ row }">
            <div >
              <div>
                <span class="orderType text-body"
                  >{{
                    row.depot_number?row.depot_number:row.depot_id
                  }}</span
                >

              </div>
              
            </div>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('created_date') + ' / ' +$t('debit_date')"   min-width="150">
          <template v-slot="{ row }">
          {{row.created_at?$d(new Date(row.created_at),'short'):""}}<span v-if="row.possible_debit_date" > / {{row.possible_debit_date?$d(new Date(row.possible_debit_date),'short'):""}}</span>
          </template>
        </el-table-column>
        <el-table-column>
            <template v-slot="{ row }" >
              <IconButton type="info" @click="()=>showClaimDetail(row)"/>
                 
                  
            </template>
          </el-table-column>
      </el-table>

      <div class="card-footer py-4 d-flex align-items-center" v-if="totalTableData>1">
        <MetaInfo :meta="meta" class="d-flex"/>
        <base-pagination
          v-model="page"
          :per-page="perPage"
          :total="totalTableData"
          class="ml-auto"
        ></base-pagination>
      </div>
      <CreateClaim :show="showCreateNewClaim" :account_id="account_id" @closed="closeAddClaim"/>
      <modal
    :show.sync="showExecutionDate"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelExecutionDate"
    :allowOutSideClose="false"
  >
  <template slot="header">
      <h5 class="modal-title">{{ $t("choose_execute_date") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex flex-column align-align-items-center justify-content-center"
    >
    <date-picker
            size="large"
            v-model="paymentExecutionDate"
            type="date"
            :placeholder="$t('select_execution_date')"
          >
          </date-picker>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelExecutionDate()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => initiateBankPayment()"
        :disabled="isSubmitting || !paymentExecutionDate"
      >
        {{ $t("initiate_payment") }}
      </base-button>
    </template>
    </modal>
    <ClaimDetail v-if="selectedClaim" :showDetail="showDetail" :claim="selectedClaim" @changed="onClaimCloseDetail" @closed="onClaimCloseDetail" @onUserNotified="fetchClaims"/>
    </div>
  </template>
  <script>
  import { Table, TableColumn,Dropdown,DropdownItem,DropdownMenu, Checkbox,DatePicker  } from "element-ui";
  import Status from "@/components/Claims/Status";
  import { mapGetters } from "vuex";
  import {PAYMENT_PENDING,PAYMENT_PAID, PAYMENT_FAILED} from '../../helpers/claims';
  import { MessageBox } from "element-ui";
  import { canEditClaims } from '@/permissions';
  import CreateClaim from "@/components/Claims/CreateClaim";
  import ClaimDetail from "@/components/Claims/ClaimDetail"
  import { apiErrorHandler } from '../../helpers/apiErrorHandler';
  import MetaInfo from '@/components/common/MetaInfo';
  import IconButton from "@/components/common/Buttons/IconButton";
import { formatDateToApiFormat } from '../../helpers/helpers';
  export default {
    props: {

      account_id:{
        type:Number,
        default:-1
      },
    },
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      Status,
      Dropdown,DropdownItem,DropdownMenu,
      CreateClaim,
      MetaInfo,
      Checkbox,
      DatePicker,
      IconButton,
      ClaimDetail
    },
    computed: {
      ...mapGetters({
        claims: "claims/claims",
        status: "claims/claimStatuses",
      }),
      searchQuery() {
        return `&account_id=${this.account_id}&page=${
          this.page
        }&per_page=${this.perPage}`;
      },
      totalPages() {
        return Math.ceil(this.totalTableData / this.perPage);
      },
      hasEditAccess(){
        return canEditClaims();
      }
    },
    watch: {
      searchQuery: {
        handler() {
          this.fetchClaims(this.searchQuery);
        },
        immediate: true,
      },
    },
    data() {
      return {
        page: 1,
        perPage: 10,
        totalTableData: 1,
        isLoading: false,
        loadingError: null,
        confirming:false,
        isSubmitting: false,
        showCreateNewClaim:false,
        meta:null,
        showExecutionDate:false,
        paymentExecutionDate:null,
        selectedClaims:[],
        selectedClaim:null,
        showDetail:false,
        isCreatingBatch:false,
        claimsToAdd:[]
      };
    },
    mounted(){
      this.$confirm = MessageBox.confirm;
      if(this.status.length == 0){
            this.$store.dispatch("claims/getClaimStatuses", "");
        }
    },
    methods: {
      fetchClaims(searchQuery) {
          if(!searchQuery){
            searchQuery = this.searchQuery;
          }
          this.isLoading = true;
          this.$store
            .dispatch("claims/getClientClaims", searchQuery)
            .then((res) => {this.totalTableData = res.meta.total;this.meta = res.meta})
            .catch((err) => (this.loadingError =apiErrorHandler(err,null)))
            .finally(() => (this.isLoading = false));

      },
      toggleCreateBatch(){
        let pendingStatus = this.status.find(x=>x.name_translation_key == 'pending');
        let query = `&is_part_of_a_process=0&account_id=${this.account_id}&page=${
          this.page | 1
        }&per_page=${this.perPage | 10}`;
        if(pendingStatus){
            query+="&claim_status_id="+pendingStatus.id
        }
        this.fetchClaims(query);
        this.isCreatingBatch = true;
      },
      cancelCreatingBatch(){
        this.isCreatingBatch = false;
        this.fetchClaims(this.searchQuery);
        this.claimsToAdd = []
      },
      addRemoveClaim(value,claim){
        
        if(value){
          this.claimsToAdd.push(claim.id);
        }
        else{
          let index = this.claimsToAdd.findIndex(x=>x==claim.id);
          this.claimsToAdd.splice(index,1);

        }
      },
      saveNewBatchClaim(){
        let data = {};
        data.claim_ids = this.claimsToAdd;
        this.isSubmitting = true;
        this.$store.dispatch('batch-claims/createNewBatchProcess',data).then(()=>{
            this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("batch_claim_created_successfully"),
          });
          this.cancelCreatingBatch();
        }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
        }).finally(()=>{
            this.isSubmitting = false;
        })
      },
      showClaimDetail(claim){
        this.selectedClaim = claim;
        this.showDetail = true;
      },
     onClaimCloseDetail(){
        this.selectedClaim = null;
        this.showDetail = false;
      },
      confirmDelete(id){
        this.$confirm(this.$t('do_you_want_to_delete_this_claim'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
         this.$store.dispatch('claims/deleteSingleClaim',id).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("claim_deleted_successfully"),
          });
         }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
         });
        }).catch((err) => {
          apiErrorHandler(err,this.$notify);
        });
      },
      handleCommand(command,id){
      if(command=="mark_as_paid"){
        this.markAspaid(id);
      }
      if(command=="initiate_payment"){
            this.showExecutionDate = true;
            this.selectedClaims.push(id);
        }
    },
      isPending(){
        return this.aggregated_status == PAYMENT_PENDING;
      },
      isFailed(){
        return this.aggregated_status == PAYMENT_FAILED;
      },
      markAspaid(id){
        this.$confirm(this.$t('do_you_want_to_mark_claim_as_paid'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
         this.$store.dispatch('claims/markSingleClaimAsPaid',id).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("claim_marked_paid_successfully"),
          });
         }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
         });
        }).catch((err) => {
          apiErrorHandler(err,this.$notify);
        });
      },
      toggleAddClaim(){
        this.showCreateNewClaim = true;
      },
      closeAddClaim(){
        this.showCreateNewClaim = false;
      },
      initiatePaymentForAccount(){
      this.showExecutionDate = true;
      this.paymentExecutionDate = null;
    },
    initiateBankPayment(){
            this.isSubmitting = true;
            let data = {
                execution_date: formatDateToApiFormat(this.paymentExecutionDate)

            };
            if(this.selectedClaims.length > 0){
                data.claim_ids = this.selectedClaims
            }
            else{
                data.account_id = this.account_id;
            }
            this.$store.dispatch('claims/initiateClaimPayment',data).then((res)=>{

                this.paymentExecutionDate = null;
                this.selectedClaims = [];
                this.showExecutionDate = false;
                window.open(res,'_blank');

            }).catch((err)=>{
                apiErrorHandler(err,this.$notify)
            }).finally(()=>{
            this.isSubmitting = false;
            })
        },
        cancelExecutionDate(){
        this.paymentExecutionDate = null;
        this.showExecutionDate = false;
    }
    },

  };
  </script>
  <style scoped>
  .capitalize {
    text-transform: capitalize;
  }
  .mdi-10 {
    font-size: 18px;
  }
  .superscript {
    position: relative;
    top: -0.5em;
    font-size: 60%;
  }
  .orderType {
    white-space: nowrap;
  }
  .avatar,
  .avatar img {
    height: 44px;
    width: 44px;
  }
  .dateStyle {
    color: #b5bacc;
    font-size: 0.85em;
    margin-top: -0.5em;
    white-space: nowrap;
  }
  .removeImageBorder {
    background-color: transparent !important;
  }
  .actionBtnStyle {
    color: #8898aa;
  }
  </style>
