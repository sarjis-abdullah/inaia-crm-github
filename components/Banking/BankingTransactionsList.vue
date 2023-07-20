<template>
  <div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-8">
                <el-input prefix-icon="el-icon-search" :placeholder="$t('search_by_id')" clearable style="width: 200px" v-model="searchWords" @change="onSearch"/>
              </div>
              <div class="col-4 text-right">
                <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                  <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                </button>
              </div>
            </div>


          </div>

          <TransactionListFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter'></TransactionListFilter>

          <el-table class="table-hover table-responsive table-flush"
                    header-row-class-name="thead-light"
                    :empty-text="$t('no_data')"
                    :data="data">

            <el-table-column :label="$t('date')"
                             min-width="100px"
                             prop="created_at"
            >
              <template v-slot="{row}">
                  <div class="name" >{{ $d(new Date(row.created_at), 'short') }}</div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('type')"
                             prop="order_type_id"
                             min-width="180px"
            >
              <template v-slot="{row}">
                  <div class="d-flex align-items-center">
                    
                    <div>
                        <span class="transactionType text-body"><strong>{{ $t(row.type) }}</strong></span>
                    </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('reason_text')"
                             prop="reason"
                             min-width="180px"
                             sortable>
              <template v-slot="{row}">
                    <span class="d-inline-block text-truncate" style="max-width: 150px;">
                        {{ row.reason_text }}
                    </span>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('amount')"
                             prop="amount"
                             min-width="120px"
                             header-align="right"
                             align="right"
                             sortable>
                <template v-slot="{row}">
                    <span class="amount">
                        {{ row.direction == 'DEBIT' ? '-' : '+' }}
                        <i18n-n :value="parseInt(row.money_amount)/100"></i18n-n> €
                    </span>
                </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('sender')"
                             prop="transfer_account_name"
                             min-width="200px"
            >
              <template v-slot="{row}">
                  <div>
                      <div class="text-body">{{ $t(row.transfer_account_name) }}</div>
                      <div class="text-muted">{{ $t(row.transfer_account_iban) }}</div>
                  </div>
              </template>
            </el-table-column>

            <el-table-column>
              <template v-slot="{row}">

                <icon-button type="info" @click="() => displayDetails(row)"></icon-button>

              </template>
            </el-table-column>

          </el-table>

          <div class="card-footer py-4 d-flex justify-content-end">
            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
          </div>


        </div>

      </div>

    </div>
    <BankingTransactionDetail v-if="selectedTransaction!=null" :showModal="showDetail" :transaction="selectedTransaction" @closed="onDetailClosed"/>
  </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui'
import Status from '@/components/Banking/TransactionStatus';
import IconButton from '@/components/common/Buttons/IconButton';
import BankingTransactionDetail from '@/components/Banking/BankingTransactionDetail/BankingTransactionDetail';
import TransactionListFilter from '@/components/Banking/Filters/TransactionListFilter';
export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Status,
    IconButton,
    BankingTransactionDetail,
    TransactionListFilter
  },
  props:{
    bankingAccountId:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      showFilter: false,
      initiated: false,
      isLoading:true,
      page: 1,
      perPage: 20,
      totalTableData: 0,
      data: [],
      showDetail:false,
      selectedTransaction:null,
      search:null,
      searchWords:null,
      filterQuery:'',
    }
  },
  computed: {
    searchQuery() {
      let query = '?page=' + this.page + `&per_page=${this.perPage}${this.filterQuery}`;
      /*
      query = (this.search ? '&short_name=' + this.search + '&name_translation_key=' + this.search : '') +
        `&order_by=${ this.sort }&order_direction=${ this.order }` +
        `&page=${this.search ? 1 : this.page}` +
        `&per_page=${this.perPage}`;
      */
      if (this.bankingAccountId!==0) query += '&banking_account_id='+this.bankingAccountId;
       if(this.search && this.search!="")
       {
         query+='&id='+this.search;
       }

      return query;
    },
    totalPages() {
      return Math.ceil(this.totalTableData / this.perPage)
    }
  },
  watch: {
    bankingAccountId: {
      handler() {
        if (this.bankingAccountId) {
          this.fetchList(this.searchQuery)
        }
      },
      immediate: true
    },
    searchQuery: {
      handler() {
        if (this.bankingAccountId) {
          this.fetchList(this.searchQuery)
        }
      },
      immediate: true
    },
  },
  methods: {
    toggleFilter: function() {
      this.showFilter=!this.showFilter;
    },
    fetchList(pageQuery) {
     
        this.initiated  = true
        if(this.bankingAccountId!==0) {
          this.$store
            .dispatch("banking-accounts/getBankingTransactions", pageQuery )
            .then(response => {
              this.data = response.data

              this.totalTableData = response.meta.total

              this.isLoading = false
            }).finally(() => {
            this.initiated  = false
          })
        }
    },
    displayDetails(row){
      this.selectedTransaction = row;
      this.showDetail = true;
    },
    onDetailClosed(){
      this.showDetail = false;
      this.selectedTransaction = null;
    },
    onSearch(value){
      this.page = 1;
      this.search = value;
    },
    applyFilter(query){
      this.page = 1;
      this.filterQuery = query
    }

  },
  mounted() {
    //this.fetchList();
  }
}
</script>
