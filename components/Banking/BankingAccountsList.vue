<template>
  <div>

    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">

            <div class="row align-items-center">
              <div class="col-8">
                <el-input prefix-icon="el-icon-search" :placeholder="$t('search')+': IBAN, Card, ...'" clearable style="width: 200px"/>
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
                             min-width="60px"
                             prop="id"
            >
              <template v-slot="{row}">
                <div class="media align-items-center">
                  <div class="media-body">

                    <div class="font-weight-300 name" >{{row.id}}</div>

                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('iban')"
                             prop="amount"
                             min-width="180px"
                             sortable>
              <template v-slot="{row}">
                <div class="d-flex align-items-center">
                    <span href="#!" class="avatar mr-3 bg-transparent">
                      <img src="/img/icons/cards/mastercard.png" />
                    </span>
                  <div>
                    {{ row.account_number }}
                    <div class="iban text-xs text-muted">
                      {{ $t('iban')+': '+row.iban }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('cards')"
                             prop="amount"
                             min-width="180px"
                             sortable>
              <template v-slot="{row}">
                  <div v-for="card in row.cards" :key="card.id">
                    {{ card.card_serial }}
                    <span class="text-muted">{{ card.pan }}</span>
                  </div>
              </template>
            </el-table-column>

            <el-table-column v-bind:label="$t('balance')"
                             prop="amount"
                             min-width="100px"
                             sortable>
              <template v-slot="{row}">
                  <span class="balance">
                      <i18n-n :value="parseInt(row.balance)/100"></i18n-n> {{ getCurrency(row) }}
                  </span>
              </template>
            </el-table-column>

            <el-table-column>
              <template v-slot="{row}">

                <icon-button type="info" @click="$router.push('/banking-accounts/details/'+row.account_id)"></icon-button>

              </template>
            </el-table-column>

          </el-table>

          <div class="card-footer py-4 d-flex justify-content-end" >
            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
          </div>


        </div>

      </div>

    </div>
    
  </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui'
import IconButton from "../common/Buttons/IconButton";
import { getCurrencySymbol } from '@/helpers/currency';

export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    IconButton,
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
    totalPages() {
      return Math.ceil(this.totalTableData / this.perPage)
    }
  },
  watch: {

  },
  methods: {
    toggleFilter: function() {
      this.showFilter=!this.showFilter;
    },
    fetchList(pageQuery='') {
      if (!this.initiated) {
        this.initiated  = true
        this.$store
          .dispatch("banking-accounts/getBankingAccounts", pageQuery )
          .then(response => {
            this.data = response.data

            this.totalTableData = response.meta.total

            this.isLoading = false
          }).finally(() => {
          this.initiated  = false
        })
      }
    },
    getCurrency(row){
      let currency = undefined
      if (row && row.currency) {
        currency = row.currency
      }
      return getCurrencySymbol(currency);
    }
  },
  mounted() {
    this.fetchList();
  }
}
</script>

