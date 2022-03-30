<template>
  <div>

    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <el-input prefix-icon="el-icon-search" :placeholder="$t('search')" clearable style="width: 200px" v-model="orderId" @change="doSearchById" @clear="clearSearchById"/>
                    </div>
                    <div class="col-4 text-right">
                      <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                        <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                      </button>
                    </div>
                  </div>


                </div>

                <OrderFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter' :isDepotSet="isDepotSet"></OrderFilter>

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
                                  <div class="dateStyle">{{ $d(new Date(row.created_at), 'short') }}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>


                            <el-table-column v-bind:label="$t('depot')"
                                            prop="depotName"
                                            min-width="180"
                                            >
                                            <template v-slot="{row}">
                                                <span>{{row.depotName}}</span>
                                                <div class="dateStyle">{{row.depot ? '# '+row.depot.id : ''}}</div>
                                            </template>
                            </el-table-column>

                    <el-table-column v-bind:label="$t('amount')"
                                    prop="amount"
                                    min-width="140px"
                                    align="right"
                                    sortable>
                        <template v-slot="{row}">
                            <span class="status" v-if="row.unit === 'gram'">
                                <i18n-n :value="row.amount/1000"></i18n-n> g
                            </span>
                            <span class="status" v-else>
                                <i18n-n :value="parseInt(row.amount)/100"></i18n-n> €
                            </span>
                            <!-- <span class="status">{{row.amount}} {{row.unit}}</span> -->
                        </template>
                    </el-table-column>

                    <el-table-column v-bind:label="$t('status')"
                                    prop="order_status_id"
                                    min-width="140px"
                                    >
                        <template v-slot="{row}">
                          <Status v-bind:status='row.order_status.name_translation_key'>{{row.order_status ? $t(row.order_status.name_translation_key) : row.order_status_id}}</Status>
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
                <Details
                        :selectedResource="selectedResource"
                        :showPopup="showPopup"
                        @onClose="onDetailClosed"
                        @orderDeleted="onOrderDeleted"
                />

            </div>

        </div>

    </div>

  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
import Details from '@/components/Orders/Details'
import Status from '@/components/Orders/Status';
import { paddingFractionTo3,paddingFractionTo2 } from '~/helpers/helpers'

import {BaseButton} from '@/components/argon-core';
import IconButton from '@/components/common/Buttons/IconButton';
import OrderFilter from '@/components/Orders/OrderFilter';
import SelectPaymentAccount from '@/components/Orders/goldDetails/payments/SelectPaymentAccount.vue';
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Details,
        Status,
        IconButton,
        OrderFilter,
        SelectPaymentAccount
    },
    props:{
        isDepotSet:{
            type:Boolean,
            default:false,
        },
        depotSetId:{
            type:Number,
            default:0
        }
    },
    data() {
        return {
            title: 'Transaction List',
            data: [],
            search: '',
            sort: 'id',
            order: 'desc',
            selected: [],
            id: '',
            initiated: false,
            debounced: null,
            selectedResource: null,
            showPopup: false,
            pageTitle: 'Orders',
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" },
            isLoading:true,
            showFilter: false,
            filterQuery:null,
            orderId:"",
        }
    },
    computed: {
        searchQuery() {
            return (
                (this.search ? '&search=' + this.search : '') +
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.page}` +
                `&per_page=${this.perPage}`+(this.filterQuery ? this.filterQuery : '')
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
        paddingFractionTo3,
        paddingFractionTo2,
        doSearchById(value) {
           if(value)
           {
               let query = "&id="+this.orderId;
               if(this.isDepotSet && this.depotSetId!=0)
                {
                    query+='&depot_ids='+this.depotSetId;
                }
               this.$store
                    .dispatch("orders/fetchList", query)
                    .then(response => {
                        this.data = response.data.data

                        this.totalTableData = response.data.meta.total
                    }).catch(() => {
                        this.data = [];
                    })
           }
           else
           {
               this.clearSearchById();
           }

        },
        clearSearchById() {

               this.fetchList(this.searchQuery);
        },
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                if(this.isDepotSet && this.depotSetId!=0)
                {
                    if(!pageQuery.includes('&depot_ids='))
                    {
                        pageQuery+='&depot_ids='+this.depotSetId;
                    }
                }
                this.$store
                    .dispatch("orders/fetchList", pageQuery)
                    .then(response => {
                        // console.error('data', response.data)
                        this.data = response.data.data

                        this.totalTableData = response.data.meta.total

                        this.isLoading = false
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newDepot() {
            this.$router.push('/orders/add')
        },
        handleSearch(search) {
            if (this.debounced) {
                clearTimeout(this.debounced)
            }
            this.debounced   = setTimeout(() => {
                if (search.length > 1) {
                    this.search = search
                } else if (this.search) {
                    this.search = ''
                }
            }, 400)
        },
        handleSort(sort, order) {
            if (!order || !sort)    return
            this.sort   = sort
            this.order  = order
        },
        toggleFilter: function() {
          this.showFilter=!this.showFilter;
        },
        applyFilter: function(query)
        {

            this.page = 1;
            this.filterQuery = query;
        },
        onDetailClosed(){
            this.showPopup = false;
            this.selectedResource = null;
        },
        onOrderDeleted(){
            if (!this.data.length && this.page > 1) {
                this.page = this.page - 1;
            } else {
                this.fetchList(this.searchQuery)
            }
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
