<template>
  <div>

    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <el-input prefix-icon="el-icon-search" :placeholder="$t('search')" clearable style="width: 200px" v-model="orderProcessSearch" @change="doSearchById" @clear="clearSearchById"/>
                    </div>
                    <div class="col-4 text-right">
                      <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                        <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                      </button>
                    </div>
                  </div>


                </div>

                <BachFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter'></BachFilter>

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

                    <el-table-column v-bind:label="$t('type')"
                                    prop="order_type_id"
                                    min-width="180px"
                                    >
                        <template v-slot="{row}">
                            <div class="d-flex align-items-center">
                                <span href="#!" class="avatar mr-3 removeImageBorder">
                                  <img v-bind:src="row.logo"/>
                                </span>
                                <div>
                                  <span class="orderType text-body"><strong>{{row.order_type ? $t(row.order_type.name_translation_key) : row.order_type_id}}</strong></span>
                                  
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    

                    <el-table-column v-bind:label="$t('amount')"
                                    prop="money_amount"
                                    min-width="120px"
                                    align="right"
                                    sortable>
                        <template v-slot="{row}">
                            <span class="amount">
                                <i18n-n :value="parseInt(row.money_amount)/100"></i18n-n> €
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('gold_amount')"
                                    prop="gold_amount"
                                    min-width="160px"
                                    align="right"
                                    sortable>
                        <template v-slot="{row}">
                            <span class="amount">
                                <i18n-n :value="parseInt(row.gold_amount)/1000"></i18n-n> g
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('progress')"
                                    prop="total_orders_count"
                                    min-width="160px"
                                    align="left"
                                    sortable>
                        <template v-slot="{row}">
                            <Progress :percentage="Math.floor((row.completed_orders_count/row.total_orders_count) * 100)" color="#2dce89"></Progress>
                            <div class="dateStyle">{{row.completed_orders_count}}/{{row.total_orders_count}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('processing_date')"
                                    prop="processing_date"
                                    min-width="160px"
                                    align="left"
                                    sortable>
                        <template v-slot="{row}">
                            <div>{{$d(new Date(row.processing_date), 'short')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('status')"
                                    prop="order_status_id"
                                    min-width="120px"
                                    >
                        <template v-slot="{row}">
                          <Status v-bind:status='row.order_process_status.name_translation_key'>{{row.order_process_status ? $t(row.order_process_status.name_translation_key) : row.order_status_id}}</Status>
                        </template>
                    </el-table-column>

                    <el-table-column>
                        <template v-slot="{row}">
                            <icon-button type="info" @click="() => $router.push('/orders/batch-processing/details/'+row.id)" v-if="row.order_process_status && row.order_process_status.name_translation_key!='in_progress'"></icon-button>
                            <icon-button type="confirm" @click="() => confirmMarkAsComplete(row)"  v-if="row.order_process_status && row.order_process_status.name_translation_key=='pending'"></icon-button>
                            <icon-button type="redo"  @click="confirmRetryComplete(row)"  v-if="row.order_process_status && row.order_process_status.name_translation_key=='failed'"></icon-button>
                        </template>
                    </el-table-column>

                </el-table>

                <div class="card-footer py-4 d-flex justify-content-end">
                    <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                </div>
                

            </div>

        </div>

    </div>
    <Complete :showConfirmComplete="showConfirmComplete" :selectedOrderProcess="selectedOrderProcess" @canceled="cancelConfirmComplete"/>
    <RetryFailed :showConfirmComplete="showConfirmRetryComplete" :selectedOrderProcess="selectedOrderProcess" @canceled="cancelConfirmComplete"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Progress } from 'element-ui'

import Status from '@/components/Batch-processing/Status';
import IconButton from '@/components/common/Buttons/IconButton';

import BachFilter from '@/components/Batch-processing/Filter';
import Complete from '@/components/Batch-processing/Complete';
import RetryFailed from '@/components/Batch-processing/RetryFailed';
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Status,
        IconButton,
        BachFilter,
        Complete,
        Progress,
        RetryFailed
    },
    data() {
        return {
            title: 'Batch processing',
            order: 'desc',
            isLoading:true,
            showFilter: false,
            filterQuery:null,
            page:1,
            perPage:10,
            totalTableData:0,
            initiated:false,
            orderProcessId:null,
            orderProcessSearch:null,
            showConfirmComplete: false,
            selectedOrderProcess: null,
            isSubmitting : false,
            showConfirmRetryComplete:false
        }
    },
    computed: {
        ...mapGetters({
            data: "batch-processing/batchProcesses"
        }),
        searchQuery() {
            return (
                
                `&order_direction=${ this.order }` +
                `&page=${this.page}` +
                `&per_page=${this.perPage}`+(this.filterQuery ? this.filterQuery : '') + 
                (this.orderProcessId ? `&id=${ this.orderProcessId }` : "")
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchList(this.searchQuery)
            },
            immediate: true,
        }
    },
    methods: {
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("batch-processing/fetchList", pageQuery)
                    .then(response => {
                        this.totalTableData = response.data.meta.total
                        this.isLoading = false
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        toggleFilter(){
            this.showFilter = !this.showFilter;
        },
        applyFilter(query){
            this.page = 1;
            this.filterQuery = query;
        },
        markAsComplete(orderProcess){

        },
        doSearchById(value){
            this.page = 1;
            this.filterQuery = '';
            if(value=="")
            {
                this.orderProcessId = null;
            }
            else
            {
                this.orderProcessId = value;
            }
        },
        clearSearchById(){
            this.orderProcessId = null;
        },
        cancelConfirmComplete(){
            this.showConfirmComplete = false;
            this.showConfirmRetryComplete = false;
            this.selectedOrderProcess = null;
        },
        confirmMarkAsComplete(resource){
            this.selectedOrderProcess = resource;
            this.showConfirmComplete = true;
        },
        confirmRetryComplete(resource){
            this.selectedOrderProcess = resource;
            this.showConfirmRetryComplete = true;
        }
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
.mdi-10 {
    font-size: 18px;
}
.superscript {
    position: relative; top: -0.5em; font-size: 60%;
}
.orderType {
  white-space: nowrap;
}
.avatar, .avatar img {
  height: 44px;
  width: 44px;
}
.dateStyle {
  color:#b5bacc;
  font-size:0.85em;
  margin-top:-0.5em;
  white-space: nowrap;
}
.removeImageBorder {
    background-color: transparent !important
}
.actionBtnStyle {
    color:#8898aa;
}
</style>
