<template>
  <div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-8">
                <el-input prefix-icon="el-icon-search" :placeholder="$t('search')" clearable style="width: 200px"/>
              </div>
              <div class="col-4 text-right">
                <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                  <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                </button>
              </div>
            </div>


          </div>

          <!--<OrderFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter' :isDepotSet="isDepotSet"></OrderFilter>-->

          <el-table class="table-hover table-responsive table-flush"
                    header-row-class-name="thead-light"
                    :empty-text="$t('no_data')"
                    :data="data">

            <el-table-column label="#"
                             min-width="80px"
                             prop="id"
            >
              <template v-slot="{row}">
                  <div class="name" >{{row.id}}</div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('type')"
                             prop="order_type_id"
                             min-width="180px"
            >
              <template v-slot="{row}">
                  <div class="d-flex align-items-center">
                    <span href="#!" class="avatar mr-3 bg-transparent">
                      <img v-bind:src="row.logo"/>
                    </span>
                    <div>
                        <span class="transactionType text-body"><strong>{{ $t(row.type) }}</strong></span>
                        <div class="dateStyle">{{ $d(new Date(row.created_at), 'short') }}</div>
                    </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('reason_text')"
                             prop="reason"
                             min-width="180px"
                             sortable>
              <template v-slot="{row}">
                    <span class="reason">
                        {{ row.reason_text }}
                    </span>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('amount')"
                             prop="amount"
                             min-width="140px"
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

            <el-table-column v-bind:label="$t('status')"
                             prop="order_status_id"
                             min-width="140px"
            >
              <template v-slot="{row}">
                <Status :status='row.status' :lifecycle_status="row.lifecycle_status" />
              </template>
            </el-table-column>

            <el-table-column>
              <template v-slot="{row}">

                <icon-button type="info" @click="() => popupDetails(row)"></icon-button>

              </template>
            </el-table-column>

          </el-table>

          <div class="card-footer py-4 d-flex justify-content-end">
            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
          </div>


        </div>

      </div>

    </div>

  </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui'
import Status from '@/components/Banking/TransactionStatus';
import IconButton from '@/components/common/Buttons/IconButton';

export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Status,
    IconButton
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
    }
  },
  computed: {
    searchQuery() {
      let query = '?';
      /*
      query = (this.search ? '&short_name=' + this.search + '&name_translation_key=' + this.search : '') +
        `&order_by=${ this.sort }&order_direction=${ this.order }` +
        `&page=${this.search ? 1 : this.page}` +
        `&per_page=${this.perPage}`;
      */
      if (this.bankingAccountId!==0) query += '&banking_account_id='+this.bankingAccountId;

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
  },
  methods: {
    toggleFilter: function() {
      this.showFilter=!this.showFilter;
    },
    fetchList(pageQuery) {
      if (!this.initiated) {
        this.initiated  = true
        if(this.bankingAccountId!==0) {
          this.$store
            .dispatch("banking-accounts/getBankingTransactions", pageQuery )
            .then(response => {
              //console.log('data', response)
              this.data = response.data

              this.totalTableData = response.meta.total

              this.isLoading = false
            }).finally(() => {
            this.initiated  = false
          })
        }
      }
    },

  },
  mounted() {
    //this.fetchList();
  }
}
</script>
