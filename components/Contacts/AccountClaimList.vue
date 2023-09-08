<template>
    <div>
      <el-table
        class="table-hover table-responsive table-flush"
        header-row-class-name="thead-light"
        :data="aggregatedClaims"
      >
        <el-table-column label="#" prop="id">
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
          
          align="right"
          prop="amount"
        >
          <template v-slot="{ row }">
            <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
          </template>
        </el-table-column>
          <el-table-column v-bind:label="$t('type')" min-width="180px" prop="type">
          <template v-slot="{ row }">
            <div class="d-flex align-items-center">
              <div>
                <span class="orderType text-body"
                  >{{
                    row.claim_type ? $t(row.claim_type.name_translation_key) : ""
                  }}</span
                >
  
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-bind:label="$t('status')" prop="status">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div>
             <Status :status='row.claim_status ? $t(row.claim_status.name_translation_key) : ""'/>

            </div>
          </div>
        </template>
      </el-table-column>
        <el-table-column v-bind:label="$t('date')" prop="created_at">
          <template v-slot="{ row }" >
            <div class="d-flex align-items-center">
              <div>
                {{row.created_at?$d(new Date(row.created_at),'short'):""}}
  
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column  v-if="hasEditAccess">
          <template v-slot="{ row }" >
            <Dropdown trigger="click" v-if="row.claim_status && (row.claim_status.name_translation_key=='pending' || row.claim_status.name_translation_key=='payment_failed')" @command="(command)=>handleCommand(command,row.id)">
                <span class="btn btn-sm btn-icon-only text-light">
                    <i class="fas fa-ellipsis-v mt-2"></i>
                </span>
                <DropdownMenu  slot="dropdown">
                    <DropdownItem command="mark_as_paid">{{$t('mark_as_paid')}}</DropdownItem>
                   
                </DropdownMenu>
                </Dropdown>
          </template>
        </el-table-column>
  
      </el-table>
  
      <div class="py-1 d-flex justify-content-end" v-if="totalTableData>1">
        <base-pagination
          v-model="page"
          :per-page="perPage"
          :total="totalTableData"
        ></base-pagination>
      </div>
  
    </div>
  </template>
  <script>
  import { Table, TableColumn,Dropdown,DropdownItem,DropdownMenu } from "element-ui";
  import Status from "@/components/Claims/Status";
  import { mapGetters } from "vuex";
  import {PAYMENT_PENDING,PAYMENT_PAID, PAYMENT_FAILED} from '../../helpers/claims';
  import { MessageBox } from "element-ui";
  import { canEditClaims } from '@/permissions';
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
      Dropdown,DropdownItem,DropdownMenu
    },
    computed: {
      ...mapGetters({
        aggregatedClaims: "claims/claims",
      }),
      searchQuery() {
        return `&account_id=${this.account_id}&page=${
          this.page | 1
        }&per_page=${this.perPage | 10}`;
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
          this.fetchClaims();
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
        isSubmitting: false
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
            .then((res) => (this.totalTableData = res.meta.total))
            .catch((err) => (this.loadingError = this.$t("cant_load_list")))
            .finally(() => (this.isLoading = false));
        
      },
      handleCommand(command,id){
      if(command=="mark_as_paid"){
        this.markAspaid(id);
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
         }).catch(()=>{
          this.$notify({
            type: "error",
            timeout: 5000,
            message: this.$t("claim_marked_paid_unsuccessfully"),
          });
         });
        }).catch(() => {
         
        });
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