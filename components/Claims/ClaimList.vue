<template>
    <div>
    <div class="row">
        <div class="col">

          <div class="card">
            <div class="card-header" v-if="batch_process_id==-1">
              <div class="row align-items-center">
                <el-input prefix-icon="el-icon-search" :placeholder="$t('search')+`: ID`" clearable style="width: 200px" class="ml-0" v-model="claimId"/>
                <div class="col text-right">


                  <Dropdown  v-if="!makingManyAsPaid && !initiatePaymentForMany" @command="handleCommand" trigger="click">
                    <base-button size="sm" type="neutral" class="mr-0">{{$t('manage_payments')}}<i class="el-icon-arrow-down el-icon--right"></i></base-button>
                    <DropdownMenu  slot="dropdown">
                      <!--DropdownItem command="mark_many_as_paid">{{$t('mark_many_as_paid')}}</DropdownItem-->
                      <DropdownItem command="initiate_payment_for_many">{{$t('initiate_payment_for_many_claims')}}</DropdownItem>
                      <DropdownItem command="initiate_payment_for_all" >{{$t('initiate_payment_for_all')}}</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>

                  <div class="d-flex justify-content-end" v-else>
                    <base-button size="sm" type="neutral" @click="cancelMarkMany">
                      {{$t('cancel')}}
                    </base-button>
                    <base-button size="sm" type="neutral" @click="completeManyAction" :disabled="selectedClaims.length==0">
                      {{$t('confirm')}}
                    </base-button>

                  </div>
                  <base-button @click.prevent="toggleAddClaim()" size="sm" type="neutral" class="ml-3" v-if="!makingManyAsPaid && !initiatePaymentForMany">
                    <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('add_claim')}}</span>
                  </base-button>
                  
                      <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm" v-if="!makingManyAsPaid && !initiatePaymentForMany">
                        <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                      </button>
                      <button @click.prevent="createBatch()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm" v-if="!makingManyAsPaid && !initiatePaymentForMany">
                        <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('create_batch')}}</span>
                      </button>
                  
                </div>
              </div>
              <ClaimFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter'></ClaimFilter>
              <CreateBatchClaims :showForm="showCreateForm" v-on:filter='applyFilter' @done="cancelCreateBtach"/>
            </div>
            <div class="card-header" v-else>
              <div class="row align-items-center">
                
                <div class="col text-right" v-if="!removeClaims">
                  <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm" v-if="!makingManyAsPaid && !initiatePaymentForMany">
                        <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                      </button>
                  <button @click.prevent="activateRemovingClaims()" type="button" class="btn base-button btn-icon btn-fab btn-danger btn-sm">
                        <span class="btn-inner--text">{{$t('remove_claims')}}</span>
                      </button>
                  <button @click.prevent="initiateBatchProcessPayment()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                        <span class="btn-inner--text">{{$t('initiate_payment')}}</span>
                      </button>
                      <button @click.prevent="notifyUsers()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm" :disabled="isSubmitting">
                        <span class="btn-inner--text">{{$t('notify_user')}}</span>
                      </button>
                  </div>
                  <div class="col text-right" v-else>
                    <base-button size="sm" type="neutral" @click="cancelRemove">
                      {{$t('cancel')}}
                    </base-button>
                    <base-button size="sm" type="neutral" @click="completeRemove" :disabled="selectedClaims.length==0">
                      {{$t('confirm')}}
                    </base-button>

                  </div>
              </div>
              <ClaimFilter :showSelectedFilters="['status', 'customer','depots', 'payment_method', 'types', 'amount', 'id']" v-bind:showFilter="showFilter" v-on:filter='applyFilter'></ClaimFilter>
            </div>
            
      <el-table
        class="table-hover table-responsive table-flush"
        header-row-class-name="thead-light"
        :data="claims"
      >
        <el-table-column label="#" prop="id">
          <template v-slot="{ row }">
            <Checkbox  :label="row.id" @change="(value)=>addClaim(value,row)" v-if="shouldShowCheckBox(row)">

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
          <el-table-column v-bind:label="$t('type')"  prop="type" min-width="200">
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
        <el-table-column v-bind:label="$t('payment_method')"  prop="type" min-width="100">
          <template v-slot="{ row }">
            <div >
              <div>
                <span class="orderType text-body"
                  >{{
                    $t(getPaymentMethod(row))
                  }}</span
                >

              </div>
              
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
              <div class="font-weight-300" v-if="row.order_id">{{$t('order')}} : {{row.order_id}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('client')"  prop="type" min-width="150">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div>
                <UserInfo :accountId="row.account_id" slot="value" :isLazy="true"/>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('ref') + '/' +$t('comment')"  prop="type" min-width="150">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div v-if="row.reference || row.comment">
                 <span v-if="row.reference" class="orderType text-body"
                  >{{ $t('ref') }} : {{
                    row.reference
                  }}</span
                >
                <span class="orderType text-body" v-if="row.comment"
                  >{{
                    row.comment
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

    </div>
    </div>
    </div>
    <CreateClaim :show="showCreateNewClaim"  @closed="closeAddClaim"/>
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
  import { Table, TableColumn,Dropdown,DropdownItem,DropdownMenu, Checkbox,DatePicker } from "element-ui";
  import Status from "@/components/Claims/Status";
  import { mapGetters } from "vuex";
  import UserInfo from '@/components/Contacts/UserInfo';
  import {PAYMENT_PENDING,PAYMENT_PAID, PAYMENT_FAILED} from '../../helpers/claims';
  import { MessageBox } from "element-ui";
  import IconButton from "@/components/common/Buttons/IconButton";
  import { apiErrorHandler } from '../../helpers/apiErrorHandler';
  import MetaInfo from '@/components/common/MetaInfo';
import { formatDateToApiFormat } from '../../helpers/helpers';
import CreateClaim from "@/components/Claims/CreateClaim";
import ClaimFilter from "@/components/Claims/ClaimFilter";
import ClaimDetail from "@/components/Claims/ClaimDetail";
import Modal from '../argon-core/Modal.vue';
import CreateBatchClaims from "@/components/Claims/CreateBatchClaims";
  export default {
    props: {
      batch_process_id:{
        default:-1
      }
    },
    components: {
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      Status,
      UserInfo,
      IconButton,
      Dropdown,
      DropdownItem,
      DropdownMenu,
      MetaInfo,
      Checkbox,
      DatePicker,
      CreateClaim,
      ClaimFilter,
      ClaimDetail,
        Modal,
        CreateBatchClaims
    },
    computed: {
      ...mapGetters({
        claims: "claims/claims",
      }),
      searchQuery() {
        let filterByClaimId = ''
        if (this.claimId) {
          filterByClaimId += '&id=' + this.claimId
        }
        return `&page=${
          this.page || 1
        }&per_page=${this.perPage || 10}${this.filterQuery}${this.batch_process_id>-1?"&claim_batch_process_id="+this.batch_process_id:''}${filterByClaimId}`;
      },
      totalPages() {
        return Math.ceil(this.totalTableData / this.perPage);
      },
    },
    watch: {
      searchQuery: {
        handler() {
          this.fetchClaims();
        },
        immediate: true,
      },
      claims:{
        handler(){
          if(this.selectedClaim!=null){
            const newClaim = this.claims.find(c=>c.id==this.selectedClaim.id);
            if(newClaim){
              this.selectedClaim = newClaim;
            }
          }
        },
        immediate:true
      }
    },
    data() {
      return {
        page: 1,
        perPage: 50,
        totalTableData: 1,
        isLoading: false,
        loadingError: null,
        confirming:false,
        isSubmitting: false,
        meta:null,
        makingManyAsPaid:false,
        initiatePaymentForMany:false,
        selectedClaims:[],
        paymentExecutionDate : null,
        showExecutionDate:false,
        showCreateNewClaim:false,
        isDeleting:false,
        showFilter:false,
        filterQuery:'',
        selectedClaim:null,
        showDetail:false,
        showCreateForm:false,
        removeClaims:false,
        claimId:null,
      };
    },
    mounted(){
        this.$confirm = MessageBox.confirm
      },
    methods: {
      fetchClaims() {
          this.isLoading = true;
          this.$store
            .dispatch("claims/getClientClaims", this.searchQuery)
            .then((res) => {this.totalTableData = res.meta.total;this.meta = res.meta})
            .catch((err) => (this.loadingError = apiErrorHandler(err,null)))
            .finally(() => (this.isLoading = false));

      },
      getPaymentMethod(claim){
        if(claim && claim.claim_payment_transactions && claim.claim_payment_transactions.length >0){
          const transaction = claim.claim_payment_transactions[claim.claim_payment_transactions.length-1];
          if(transaction){
            return transaction.payment_method;
          }
        }
      },
      shouldShowCheckBox(row){
        if(this.makingManyAsPaid || this.initiatePaymentForMany)
        {
          if(row && row.claim_status){
            if(row.claim_status.name_translation_key == 'payment_failed'){
              return true;
            }
            if(row.claim_status.name_translation_key == 'pending'){
              const now = Date.now();
                    const dueDate = row.possible_debit_date?(new Date(row.possible_debit_date)):null;
                    if(dueDate)
                    {
                        if(dueDate > now){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    else{
                        return true;
                    }
            }
          }
          else{
            return false;
          }
        }
        if(this.removeClaims)
        {
          return (row && row.claim_status && (row.claim_status.name_translation_key == 'pending'));
        }
        
      },
      showClaimDetail(claim){
        this.selectedClaim = claim;
        this.showDetail = true;
      },
     onClaimCloseDetail(){
        this.selectedClaim = null;
        this.showDetail = false;
      },
      toggleAddClaim(){
        this.showCreateNewClaim = true;
      },
      closeAddClaim(){
        this.showCreateNewClaim = false;
      },
      activateRemovingClaims(){
        this.removeClaims = true;
      },
      cancelRemove(){
        this.removeClaims = false;
      },
      completeRemove(){
        const data = {
          "claim_ids":this.selectedClaims
        }
        const payload = {
          id:this.batch_process_id,
          data:data
        }
        this.$store.dispatch('claims/removeClaimsFromBatch',payload).then(res=>{
          this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t("claim_removed_successfully"),
            });
            this.selectedClaims = [];
            this.removeClaims = false;
            this.fetchClaims();
        }).catch(err=>{
          apiErrorHandler(err,this.$notify)
        })
      },
      handleCommand(command,id){
        if(command=="mark_as_paid"){
          this.markAspaid(id);
        }
        if(command=="initiate_payment"){
            this.showExecutionDate = true;
            this.selectedClaims.push(id);
        }
        if(command=="mark_many_as_paid"){
            this.makingManyAsPaid = true;
            this.selectedClaims = [];
        }
        if(command=="initiate_payment_for_many"){
            this.initiatePaymentForMany = true;
            this.selectedClaims = [];
        }
        if(command=="initiate_payment_for_all"){
            this.showExecutionDate = true;
            this.selectedClaims = [];
        }
      },
      cancelMarkMany(){
        this.makingManyAsPaid = false;
        this.initiatePaymentForMany = false;
        this.paymentExecutionDate = null;
        this.selectedClaims = [];
      },
      completeManyAction(){
        if(this.initiatePaymentForMany){
            this.paymentExecutionDate = null;
            this.showExecutionDate = true;
        }
        if(this.makingManyAsPaid){
            this.paymentExecutionDate = null;
            this.showExecutionDate = true;
        }

      },
     addClaim(value,claim){
        if(value){
            this.selectedClaims.push(claim.id);
        }else{
            let index = this.selectedClaims.findIndex(i=>i==claim.id);
            this.selectedClaims.splice(index,1)
        }
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
        initiateBankPayment(){
            this.isSubmitting = true;
            let data = {
                execution_date: formatDateToApiFormat(this.paymentExecutionDate)

            };
            if(this.batch_process_id == -1){
              if(this.selectedClaims.length > 0){
                data.claim_ids = this.selectedClaims
              }
              else{
                  data.no_of_claims = 999;
              }
            }
            else{
              data.claim_batch_process_id = this.batch_process_id;
            }
            
            this.$store.dispatch('claims/initiateClaimPayment',data).then((res)=>{

                this.paymentExecutionDate = null;
                this.selectedClaims = [];
                this.showExecutionDate = false;
                this.cancelMarkMany();
                window.open(res,'_blank');

            }).catch((err)=>{
                apiErrorHandler(err,this.$notify)
            }).finally(()=>{
            this.isSubmitting = false;
            })
        },
        cancelExecutionDate(){
        this.paymentExecutionDate = null;
        this.selectedClaims = [];
        this.showExecutionDate = false;
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
      notifyUsers(){
        this.$confirm(this.$t('do_you_want_to_notify_users_about_claim'), 'Warning', {
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
            this.isSubmitting = true
            this.$store.dispatch('claims/notifyuser',data).then(()=>{
                    this.$notify({
                    type: "success",
                    timeout: 5000,
                    message: this.$t("user_notified__successfully"),
                    
                    });
                    setTimeout(()=>{
                      this.fetchClaims();
                      this.isSubmitting = false;
                    },5000)
                    
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
                    this.isSubmitting = false;
                }).finally(()=>{
                        
                    });
          }).catch((err) => {
            apiErrorHandler(err,this.$notify);
          });
        let data = {
          claim_batch_process_id:this.batch_process_id
        }

      },
      applyFilter: function(query)
        {
            this.page = 1;
            this.filterQuery = query;
        },
      toggleFilter: function() {
          this.showFilter=!this.showFilter;
        },
        createBatch(){
          this.showCreateForm = true
        },
        cancelCreateBtach(){
          this.showCreateForm = false
        },
        initiateBatchProcessPayment(){
          this.showExecutionDate = true;
          this.paymentExecutionDate = null;
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
  .ml-0{
    margin-left: 15px !important;
  }
  </style>
