<template>
  <div>

    <div class="row align-items-center mb-3">
      <div class="col-8">
        <h5 class="h2 mb-0">{{ $t("claims_details") }}</h5>
        <p class="mt-3 mb-0 text-sm" v-if="account_id!=-1">
                  <UserInfo  :accountId="account_id"></UserInfo>
                </p>
      </div>
      <div class="col-4 text-right">
        <button type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="(isPending() || isFailed()) && !confirming" @click="confirming=true">
          <span class="btn-inner--icon"><i class="fas fa-check"></i></span><span class="btn-inner--text">{{$t('mark_as_paid')}}</span>
        </button>
        <div class="d-flex justify-content-end" v-else-if="confirming">
                <base-button size="sm" type="neutral" @click="confirming=false">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="neutral" @click="completeAsPaid" :disabled="isSubmitting">
                    {{$t('mark_as_paid')}}
                </base-button>
                
            </div>
      </div>
    </div>

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
          <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> {{ getCurrency(row) }}
        </template>
      </el-table-column>
        <el-table-column v-bind:label="$t('type')"  prop="type" min-width="150">
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
      <el-table-column v-bind:label="$t('date')"  prop="created_at">
        <template v-slot="{ row }">
          <div class="d-flex align-items-center">
            <div>
              {{row.created_at?$d(new Date(row.created_at),'short'):""}}

            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
          <template v-slot="{ row }" >
            <Dropdown trigger="click" v-if="row.claim_status && (row.claim_status.name_translation_key=='pending' || row.claim_status.name_translation_key=='payment_failed')" @command="(command)=>handleCommand(command,row.id)">
                <span class="btn btn-sm btn-icon-only text-light">
                    <i class="fas fa-ellipsis-v mt-2"></i>
                </span>
                <DropdownMenu  slot="dropdown">
                    <DropdownItem command="mark_as_paid">{{$t('mark_as_paid')}}</DropdownItem>
                   
                </DropdownMenu>
                </Dropdown>
                <IconButton type="delete" @click="()=>confirmDelete(row.id)" :disabled="isDeleting"/>
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
import UserInfo from '@/components/Contacts/UserInfo';
import {PAYMENT_PENDING,PAYMENT_PAID, PAYMENT_FAILED} from '../../helpers/claims';
import { MessageBox } from "element-ui";
import IconButton from "@/components/common/Buttons/IconButton";
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
import { getCurrencySymbol } from '@/helpers/currency';
export default {
  props: {
    aggregated_id: {
      type: Number,
      default: -1,
    },
    account_id:{
      type:Number,
      default:-1
    },
    aggregated_status:{
      type: String
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
    DropdownMenu
  },
  computed: {
    ...mapGetters({
      aggregatedClaims: "claims/claims",
    }),
    searchQuery() {
      return `&aggregated_claim_id=${this.aggregated_id}&page=${
        this.page | 1
      }&per_page=${this.perPage | 10}`;
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
      isDeleting:false
    };
  },
  mounted(){
      this.$confirm = MessageBox.confirm
    },
  methods: {
    fetchClaims() {
      if (this.aggregated_id > -1) {
        this.isLoading = true;
        this.$store
          .dispatch("claims/getClientClaims", this.searchQuery)
          .then((res) => (this.totalTableData = res.meta.total))
          .catch((err) => (this.loadingError = apiErrorHandler(err,null)))
          .finally(() => (this.isLoading = false));
      }
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
    completeAsPaid()
    {
      this.isSubmitting = true;
      let data = [];
      data.push(this.aggregated_id);
      this.$store.dispatch('claims/markManyAspaid',data).then(()=>{
        this.$notify({type: 'success', timeout: 5000, message: this.$t('mark_many_as_paid_successfully')})
        this.$emit("markedAsPaid");
        this.confirming = false;
      }).catch((err)=>{
        apiErrorHandler(err,this.$notify)
      }).finally(()=>{
        this.isSubmitting = false;
      })
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
            message: this.$t("claim_marked_paid_successfully"),
          });
         }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
         });
        }).catch((err) => {
          apiErrorHandler(err,this.$notify);
        });
      },
      getCurrency(row){
        let currency = undefined
        if (row && row.currency) {
          currency = row.currency
        }
        return getCurrencySymbol(currency);
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
