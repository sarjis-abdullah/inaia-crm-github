<template>
  <div>

    <div class="row align-items-center mb-3">
      <div class="col-8">
        <h5 class="h2 mb-0">{{ $t("agio_history") }}</h5>
      </div>
      <div class="col-4 text-right" v-if="!showAddTransaction">
          <button @click.prevent="toggleAddTransaction()" type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm" v-if="hasDepotEditAccess">
            <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('add_transaction')}}</span>
          </button>
      </div>
    </div>
    <div class="row" v-if="showAddTransaction">
      <div class="col">
        <AddAgioTransaction @canceled="showAddTransaction=false" :depot_id="depot_id"/>
      </div>
    </div>
    <div class="mb-3" v-if="showDeleteTransaction">
      <div class="mb-3">
          {{$t('enter_agio_transaction_id')}}
        </div>
        <div class="row">
      <div class="col">

        <Input :placeholder="$t('agio_transaction_id')" v-model="deletedAgioTransactionId"/>
      </div>
      <div class="col">
        <Button  :disabled="isDeleting" @click="cancelDeletion">{{$t('cancel')}}</Button>
        <Button type="danger" :disabled="shouldDeleteDisabled() || isDeleting" @click="confirmDeletion">{{$t('delete')}}</Button>
      </div>
      </div>
    </div>
    <el-table
      class="table-hover table-responsive table-flush mb-3"
      header-row-class-name="thead-light"
      :data="agioTransactions"
      :key="agioTransactionsKey"
    >
      <el-table-column label="#" min-width="100px" prop="id">
        <template v-slot="{ row }">
          <div class="media align-items-center">
            <div class="media-body">
              <div class="font-weight-300 name">{{ row.id }}</div>
              <div class="font-weight-300 name" v-if="row.created_by">{{$t('created_by')}} : <UserInfo :accountId="row.created_by" :isLazy="true"/></div>
          <div class="font-weight-300 name" v-if="row.updated_by">{{$t('updated_by')}} : <UserInfo :accountId="row.updated_by" :isLazy="true"/></div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column v-bind:label="$t('type')" min-width="180px" prop="type">
        <template v-slot="{ row }">
          <div class="align-items-center">
            <div>
              <span class="orderType text-body"
                >{{
                  row.type ? $t(row.type.name_translation_key) : ""
                }}</span
              >

            </div>
            <div class="text-muted text-sm">{{ $d(new Date(row.created_at)) }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-bind:label="$t('amount')"
        min-width="140px"
        prop="amount"
      >
        <template v-slot="{ row }">
          <span class="status">
            <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> {{ currency }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('agio_fee_rate')"
        min-width="140px"
        prop="agio_fee_rate"
      >
        <template v-slot="{ row }">
          <span class="status" v-if="row.agio_fee_rate">
            <i18n-n :value="parseInt(row.agio_fee_rate) / 100"></i18n-n> %
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('agio_before')"
        min-width="150px"
        prop="agio_before"
      >
        <template v-slot="{ row }">
          <span class="status">
            <i18n-n :value="parseInt(row.agio_before) / 100"></i18n-n> {{ currency }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('agio_after')"
        min-width="150px"
        prop="agio_after"
      >
        <template v-slot="{ row }">
          <span class="status">
            <i18n-n :value="parseInt(row.agio_after) / 100"></i18n-n> {{ currency }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('sales_advisor')"
        min-width="150px"
        prop="sales_advisor_id"
      >
        <template v-slot="{ row }">
        <div class="card mb-0">
          <AgioTransactionSalesAdvisor @updateListKey="agioTransactionsKey++" :salesAdvisorId="row.sales_advisor_id" :agioTransaction="row" :advisors="advisors"/>
        </div>
        </template>
      </el-table-column>
      <el-table-column
        v-bind:label="$t('comment')"
        min-width="150px"
        prop="comment"
      >
        <template v-slot="{ row }">
          <div class="ml-3">{{ row.comment }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template v-slot="{row}">
          <icon-button type="delete" v-if="displayDelete(row) && !showDeleteTransaction" @click="deleteAgioTransaction(row)"></icon-button>
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
import { mapGetters } from "vuex";
import { Table, TableColumn,Input,Button } from "element-ui";
import { Badge } from "@/components/argon-core";
import IconButton from '@/components/common/Buttons/IconButton';
import CheckCircleOutlineIcon from '@/components/common/Buttons/CheckCircleOutlineIcon';
import AddAgioTransaction from '@/components/Depots/AddAgioTransaction';
import moment from 'moment';
import { canEditDepot} from '@/permissions'; 
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
import UserInfo from '@/components/Contacts/UserInfo';
import AgioTransactionSalesAdvisor from '@/components/Depots/AgioTransactionSalesAdvisor'
import {getCurrencySymbol} from '../../helpers/currency';
export default {
  props: {
    depot_id: {
      type: Number,
      default: null,
    },
    depot: {
      type: Object,
      default: ()=> ({}),
    },
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Badge,
    IconButton,
    AddAgioTransaction,
    Input,
    Button,
    UserInfo,
    CheckCircleOutlineIcon,
    AgioTransactionSalesAdvisor
  },
  computed: {
    ...mapGetters({
      agioTransactions: "depots/agioTransactions",
      advisors: "salesCommission/salesAdvisors",
    }),
    searchQuery() {
      return `&depot_id=${this.depot_id}&page=${this.page}&per_page=${
        this.perPage
      }`;
    },
    totalPages() {
      return Math.floor(this.totalTableData / this.perPage);
    },
    hasDepotEditAccess(){
      return canEditDepot();
    },
    currency(){
      return getCurrencySymbol(this.depot.currency);
    }
  },
  watch: {
    searchQuery: {
      handler() {
        this.fetchAgioTransactions(this.searchQuery);
      },
      immediate: true,
    },
    advisors: {
      handler(n, p) {
        if ((n && n.length) != (p && p.length)) {
          this.$store.dispatch("salesCommission/fetchSalesAdvisors");
        }
      },
      deep: false,
      immediate: true,
    },
  },
  data() {
    return {
      perPage: 5,
      page: 1,
      totalTableData: 0,
      isLoading: false,
      loadingError: null,
      showAddTransaction:false,
      showDeleteTransaction:false,
      selectedAgioTransaction:null,
      deletedAgioTransactionId:null,
      isDeleting:false,
      agioTransactionsKey: 1,
    };
  },
  methods: {
    fetchAgioTransactions() {
      this.isLoading = true;
      this.$store
        .dispatch("depots/fetchAgioTransactionList", this.searchQuery)
        .then((res) => (this.totalTableData = res.meta.total))
        .catch((err) => (this.loadingError = apiErrorHandler(err,null)))
        .finally(() => (this.isLoading = false));
    },
    toggleAddTransaction() {
      this.showAddTransaction = true;
    },
    displayDelete(transaction)
    {
      let creationDate = moment(transaction.created_at);
      const numberOfDays = creationDate.diff(moment(),'days');
      const lastTransaction = this.agioTransactions[0];
      return this.hasDepotEditAccess && numberOfDays<=30 && transaction.id == lastTransaction.id;
    },
    deleteAgioTransaction(transaction) {
      this.selectedAgioTransaction = transaction;
      this.showDeleteTransaction = true;
    },
    shouldDeleteDisabled()
    {
      if(this.selectedAgioTransaction)
      {
        return this.selectedAgioTransaction.id != this.deletedAgioTransactionId;
      }
      else
      {
        return true;
      }
    },
    cancelDeletion()
    {
      this.showDeleteTransaction = false;
      this.selectedAgioTransaction = null;
      this.deletedAgioTransactionId = null;
    },
    confirmDeletion()
    {
      this.$store.dispatch('depots/deleteAgioTransaction',this.selectedAgioTransaction.id).then(()=>{
        this.$notify({type: 'success', timeout: 5000, message: this.$t('entry_deleted_successfully')});
        this.cancelDeletion();
      }).catch((err)=>{
        apiErrorHandler(err,this.$notify);
      })
    },
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
