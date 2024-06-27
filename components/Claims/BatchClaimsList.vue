<template>
      <div>

<div class="row">
    <div class="col">
        <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-8">

                </div>
                <div class="col-4 text-right">

                </div>
              </div>


            </div>
            <el-table class="table-hover table-responsive table-flush"
                    header-row-class-name="thead-light"
                    :empty-text="$t('no_data')"
                    v-loading="isLoading"
                    :data="data">

                <el-table-column label="#"
                               min-width="100px"
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

                <el-table-column v-bind:label="$t('Claim Numbers')"

                                min-width="180px"
                                >
                    <template v-slot="{row}">
                        <div class="d-flex align-items-center">
                          {{ $t('paid') }} {{ row.paid_claims }} {{ $t('of') }} {{ row.total_claims }}
                        </div>
                    </template>
                </el-table-column>



                <el-table-column v-bind:label="$t('amount')"
                                prop="money_amount"
                                min-width="200px"
                                align="right"
                                sortable>
                    <template v-slot="{row}">
                        <Progress :percentage="Math.floor((row.paid_amount/row.total_amount) * 100)" color="#2dce89"></Progress>
                            <i18n-n :value="parseInt(row.paid_amount)/100"></i18n-n> {{ getCurrency(row) }} {{ $t('paid') }} {{ $t('of') }} <i18n-n :value="parseInt(row.total_amount)/100"></i18n-n> {{ getCurrency(row) }}

                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('date')"
                                prop="gram_amount"
                                min-width="160px"
                                align="right"
                                sortable>
                    <template v-slot="{row}">
                        <div>{{$d(new Date(row.created_at), 'short')}}</div>
                    </template>
                </el-table-column>

                <el-table-column>
                    <template v-slot="{row}">
                        <icon-button type="info" @click="() => $router.push('/accounting/claims/batch-claims/details/'+row.id)"></icon-button>

                    </template>
                </el-table-column>

            </el-table>

            <div class="card-footer py-4 d-flex align-items-center">
                <MetaInfo :meta="meta" class="d-flex"/>
                <base-pagination v-model="page" :per-page="perPage" :total="totalTableData" class="ml-auto"></base-pagination>
            </div>


        </div>

    </div>

</div>
</div>
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn,Progress } from 'element-ui'
import IconButton from '@/components/common/Buttons/IconButton';
import { getCurrencySymbol } from '@/helpers/currency';
export default {
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        Progress,
        IconButton
    },
    data(){
        return {
            page:1,
            perPage:10,
            totalTableData:0,
            isLoading:true,
            meta:null
        }
    },
    computed: {
        ...mapGetters({
            data: "batch-claims/list"
        }),
        searchQuery() {
            return (

                `&page=${this.page}` +
                `&per_page=${this.perPage}`
            )
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchList()
            },
            immediate: true,
        }
    },
    mounted(){
        this.fetchList();
    },
    methods:{
        fetchList(){
            this.isLoading = true
            this.$store.dispatch('batch-claims/getListOfBatchClaims',this.searchQuery).then(response => {
                        this.totalTableData = response.meta.total
                        this.meta = response.meta;
                        this.isLoading = false
                    }).finally(() => {
                        this.isLoading = false
                    })
        },
        getCurrency(claim){
          let currency = undefined
          if (claim?.currency) {
              currency = claim.currency
          }
          return getCurrencySymbol(currency);
        }
    }
}
</script>
