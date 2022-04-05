<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-8">
              <h5 class="h3 mb-0">{{ $t("agio_transaction") }}</h5>
            </div>
            <div class="col-4 text-right" v-if="!showAddTransaction">
                <button @click.prevent="toggleAddTransaction()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                  <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('add_transaction')}}</span>
                </button>
            </div>
          </div>
          <div class="row" v-if="showAddTransaction">
            <AddAgioTransaction @canceled="showAddTransaction=false" :depot_id="depot_id"/>
          </div>
        </div>
        <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="agioTransactions"
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

          <el-table-column v-bind:label="$t('type')" min-width="180px" prop="type">
            <template v-slot="{ row }">
              <div class="d-flex align-items-center">
                <div>
                  <span class="orderType text-body"
                    >{{
                      row.type ? $t(row.type.name_translation_key) : ""
                    }}</span
                  >
                  
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('amount')"
            min-width="140px"
            align="right"
            prop="amount"
          >
            <template v-slot="{ row }">
              <span class="status">
                <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('agio_fee_rate')"
            min-width="140px"
            align="right"
            prop="agio_fee_rate"
          >
            <template v-slot="{ row }">
              <span class="status" v-if="row.agio_fee_rate">
                <i18n-n :value="parseInt(row.agio_fee_rate) / 100"></i18n-n> €
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('agio_before')"
            min-width="150px"
            align="right"
            prop="agio_before"
          >
            <template v-slot="{ row }">
              <span class="status">
                <i18n-n :value="parseInt(row.agio_before) / 100"></i18n-n> €
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-bind:label="$t('agio_after')"
            min-width="150px"
            align="right"
            prop="agio_after"
          >
            <template v-slot="{ row }">
              <span class="status">
                <i18n-n :value="parseInt(row.agio_after) / 100"></i18n-n> €
              </span>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot="{row}">
              <icon-button type="delete" v-if="displayDelete(row)"></icon-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="card-footer py-4 d-flex justify-content-end" v-if="totalTableData>1">
          <base-pagination
            v-model="page"
            :per-page="perPage"
            :total="totalTableData"
          ></base-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn } from "element-ui";
import { Badge } from "@/components/argon-core";
import IconButton from '@/components/common/Buttons/IconButton';
import AddAgioTransaction from '@/components/Depots/AddAgioTransaction';
import moment from 'moment';
export default {
  props: {
    depot_id: {
      type: Number,
      default: null,
    },
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Badge,
    IconButton,
    AddAgioTransaction
  },
  computed: {
    ...mapGetters({
      agioTransactions: "depots/agioTransactions",
    }),
    searchQuery() {
      return `&depot_id=${this.depot_id}&page=${this.page | 1}&per_page=${
        this.perPage | 5
      }`;
    },
    totalPages() {
      return Math.floor(this.totalTableData / this.perPage);
    },
  },
  watch: {
    searchQuery: {
      handler() {
        this.fetchAgioTransactions(this.searchQuery);
      },
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
      showAddTransaction:false
    };
  },
  methods: {
    fetchAgioTransactions() {
      this.isLoading = true;
      this.$store
        .dispatch("depots/fetchAgioTransactionList", this.searchQuery)
        .then((res) => (this.totalTableData = res.meta.total))
        .catch((err) => (this.loadingError = this.$t("cant_load_list")))
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
      return transaction.type.name_translation_key!='claim' && numberOfDays<=30 && transaction.id == lastTransaction.id;
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