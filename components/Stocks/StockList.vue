<template>
      <div>

<div class="row">
    <div class="col">
        <div class="card">
            <div class="card-header">
              <div class="row align-items-center">
                <div class="col-8">
                  <el-input prefix-icon="el-icon-search" :placeholder="$t('search_by_reference')" clearable style="width: 200px" v-model="reference" @change="doSearchByReference" @clear="clearSearchByReference"/>
                </div>
                <div class="col-4 text-right">
                  <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                    <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                  </button>
                  <button @click.prevent="addStock()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                    <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('new_transaction')}}</span>
                  </button>
                </div>
              </div>


            </div>

            <StockFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter'></StockFilter>

            <el-table class="table-hover table-responsive table-flush"
                    header-row-class-name="thead-light"
                    :empty-text="$t('no_data')"
                    v-loading="isLoading"
                    :data="data">
                <el-table-column label="#"
                               
                                prop="id"
                                >
                    <template v-slot="{row}">
                        <div class="media align-items-center">
                            <div class="media-body">
                                <div class="font-weight-300 name">{{row.id}}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column v-bind:label="$t('transaction_type')"
                                prop="transaction_type"
                                
                                >
                    <template v-slot="{row}">
                        <div>
                              <span class="orderType text-body"><strong>{{$t(row.transaction_type)}}</strong></span>
                              <div class="dateStyle" v-if="row.created_at">{{ $d(new Date(row.created_at), 'short') }}</div>
                            </div>
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('fixing')"
                                prop="fixing_price"
                                
                                >
                    <template v-slot="{row}">
                        <div>
                            <i18n-n :value="parseInt(row.fixing_price)/100"></i18n-n> €
                              <div class="dateStyle">{{ $d(new Date(row.fixing_date), 'short') }}</div>
                            </div>
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('amount')"
                                prop="amount"
                                
                                align="right"
                                sortable>
                    <template v-slot="{row}">
                        <span class="amount">
                            <i18n-n :value="row.amount/1000"></i18n-n> g
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('balance_before')"
                                prop="balance_before"
                                
                                align="right"
                                sortable>
                    <template v-slot="{row}">
                        <span class="amount">
                            <i18n-n :value="row.balance_before/1000"></i18n-n> g
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('balance_after')"
                                prop="balance_after"
                                
                                align="right"
                                sortable>
                    <template v-slot="{row}">
                        <span class="amount">
                            <i18n-n :value="row.balance_after/1000"></i18n-n> g
                        </span>
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('reference')"
                                prop="external_ref_number"
                                
                                >
                    <template v-slot="{row}">
                        {{ row.external_ref_number }}
                            
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('document')"
                                prop="document"
                                
                                >
                    <template v-slot="{row}">
                        {{ row.document?row.document.title:$t('no_document') }}
                    </template>
                </el-table-column>
                <el-table-column v-bind:label="$t('supplier')"
                                prop="supplier"
                                
                                >
                    <template v-slot="{row}">
                        {{ row.supplier?row.supplier.name:$t('no_supplier') }}
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
<AddStock :show="showAddStock" :assetTypeId="depotType" :target="stockType" @closed="onClosed" @added="loadData"/>
</div>

</template>
<script>
import {stockTypes} from '@/helpers/stocks';
import { Table, TableColumn,Input } from 'element-ui';
import StockFilter from '@/components/Stocks/StockFilter';
import AddStock from '@/components/Stocks/AddStock';
import MetaInfo from '@/components/common/MetaInfo';
export default {
    props:{
        depotType:{
            type:Number,
            default:1
        },
        stockType:{
            type:String,
            default:stockTypes.operationStock
        }
    },
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        StockFilter,
        Input,
        AddStock,
        MetaInfo
    },
    data(){
        return{
            isLoading:false,
            reference:null,
            showFilter:false,
            page:1,
            perPage:10,
            totalTableData:1,
            filterQuery:null,
            data:[],
            showAddStock:false,
            meta:null
        }
    },
    computed:{
        searchQuery(){
            let query = `?depot_type_id=${this.depotType}&page=${this.page}&per_page=${this.perPage}`;
            if(this.reference){
                query+='&external_ref_number='+this.reference;
            }
            if(this.filterQuery)
            {
                query+=this.filterQuery;
            }
            return query;
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.loadData()
            },
            immediate: true,
        }
    },
    mounted(){
        this.loadData();
    },
    methods:{
        doSearchByReference(){
            this.page = 1;
            this.loadData();
        },
        clearSearchByReference(){
            this.page = 1;
            this.reference = null;
            this.loadData();
        },
        toggleFilter(){
            this.showFilter = !this.showFilter;
        },
        applyFilter(query){
            this.filterQuery = query;
            this.page = 1;
            this.loadData();
        },
        loadData(){
            this.isLoading = true;
            const payload ={
                type:this.stockType,
                filter:this.searchQuery
            }
            this.$store.dispatch('stocks/getStockList',payload).then((res)=>{
                this.page = res.meta.current_page;
                this.totalTableData = res.meta.total;
                this.data = res.data;
                this.meta = res.meta
            }).finally(()=>{
                this.isLoading = false;
            })
        },
        onClosed(){
            this.showAddStock = false;
        },
        addStock(){
            this.showAddStock = true;
        }
    }
}
</script>
<style scoped>

</style>