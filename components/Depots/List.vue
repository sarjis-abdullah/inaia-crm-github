<template>
    <div>

        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header" v-if="accountId==0">
                      <div class="row align-items-center">
                        <div class="col-8">
                          <el-input prefix-icon="el-icon-search" :placeholder="$t('search')+`: `+$t('name')+' / '+$t('number')" clearable style="width: 300px" v-model="searchValue" @change="doSearchById" @clear="clearSearchById" />

                        </div>
                        <div class="col-4 text-right">
                          <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                            <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                          </button>
                        </div>
                      </div>

                      <depot-filter v-if="accountId==0" v-bind:showFilter="showFilter" v-on:filter='applyFilter'></depot-filter>

                    </div>

                    <el-table class="table-hover table-responsive table-flush"
                            header-row-class-name="thead-light"
                            :data="data"
                            v-if="!loading">
                        <el-table-column label="#"
                                        min-width="100px"
                                        prop="id"
                                        >
                            <template v-slot="{row}">
                                <div>{{row.id}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('depot_name')"
                                        prop="name"
                                        min-width="240px"
                                        sortable
                                        >
                             <template v-slot="{row}">
                                <div class="d-flex align-middle">
                                    <div class="avatar mr-3">
                                      <img v-bind:src="row.avatar" />
                                    </div>
                                    <div class="d-flex text-body flex-column">
                                        <div><strong>{{row.name}}</strong></div>
                                        <div>Num. {{ row.depot_number }}</div>
                                    </div>

                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('total_gold_amount')"
                                        prop="gram_amount"
                                        min-width="160px"
                                        sortable>
                            <template v-slot="{row}">
                                <span class="status">{{$n(row.gram_amount/1000)}} g</span>
                            </template>
                        </el-table-column>

                        <el-table-column :label="$t('saving_plan')"
                                        prop="is_savings_plan"
                                        min-width="160px"
                                        >
                                <template v-slot="{row}">
                                    <span class="orderType" v-if="row.is_savings_plan==0">{{$t('no_saving_plan')}}</span>
                                    <div v-if="row.is_savings_plan==1">
                                        <div>{{$n(row.interval_amount / 100)}} {{ getCurrency(row) }}</div>
                                        <div class="dateStyle">{{$d(new Date(row.interval_startdate))}} - {{$d(new Date(row.interval_enddate))}}</div>
                                    </div>
                                </template>
                        </el-table-column>

                        <el-table-column :label="$t('depot_agio')"
                                         prop="agio"
                                         min-width="160px"
                        >
                          <template v-slot="{row}">
                            <span>{{$n(row.agio/100)}} {{ getCurrency(row) }}</span>
                            <div class="dateStyle" v-if="row.agio_payment_option=='onetime'">{{$t(row.agio_payment_option)}}</div>
                            <div class="dateStyle" v-else>{{$t('billing')}}  <span v-if="row.agio_percentage == 75">75/25</span>
                                <span v-if="row.agio_percentage == 50">50/50</span>
                            </div>

                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('type')"

                                         min-width="120px"
                        >
                          <template v-slot="{row}">
                             <span>{{$t(row.depot_type.name_translation_key)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('status')"
                                        prop="status.name_translation_key"
                                        min-width="120px"
                                        >
                                 <template v-slot="{row}">
                                    <Status :row="row"/>
                                 </template>
                        </el-table-column>

                        <el-table-column v-if="hasViewAccess">
                            <template v-slot="{row}">

                              <icon-button type="info" @click="() => gotoDetails(row)"></icon-button>
                              <!--
                              <icon-button type="info" @click="() => popupDetails(row)"></icon-button>
                              <icon-button type="cancel" @click="() => removeConfirm(row)"></icon-button>
                              -->

                            </template>
                        </el-table-column>

                    </el-table>

                    <!-- Loading: Spinner -->
                    <div v-else class="text-center py-4"><Loader /></div>

                    <div class="card-footer py-4 d-flex align-items-center" v-if="meta && meta.total > 0">

                      <div class="perPageSelector mr-4">
                          <select name="perPage" class="form-control" v-model="perPage">
                            <option value="10">10 {{$t('perPage')}}</option>
                            <option value="25">25 {{$t('perPage')}}</option>
                            <option value="50">50 {{$t('perPage')}}</option>
                            <option value="100">100 {{$t('perPage')}}</option>
                          </select>
                      </div>

                      <MetaInfo :meta="meta" class="d-flex" />

                      <base-pagination v-model="page" :per-page="parseInt(perPage)" :total="totalTableData" class="ml-auto" v-if="totalTableData > parseInt(perPage)"></base-pagination>

                    </div>

                    <modal :show.sync="showPopup">
                        <template slot="header">
                            <h5 class="modal-title" id="exampleModalLabel">Depot details</h5>
                        </template>
                        <div>
                            <Details :resource="selectedResource" :productClasses="productClasses" v-if="showPopup" />
                        </div>
                        <template slot="footer">
                            <!--<base-button type="secondary" @click="showPopup = false">Close</base-button>-->
                            <base-button type="primary" @click="() => $router.push('/depots/details/'+selectedResource.id)">{{$t('see_more')}}</base-button>
                        </template>
                    </modal>

                    <!--
                    <modal :show.sync="showConfirm">
                        <template slot="header">
                            <h5 class="modal-title" id="confirmModal">Confirmation</h5>
                        </template>
                        <div>
                            Are you sure to delete depot with id "{{ selectedResource ? selectedResource.id : '' }}"?
                        </div>
                        <template slot="footer">
                            <base-button type="secondary" @click="showConfirm = false">Close</base-button>
                            <base-button type="danger" @click="remove(selectedResource)">Remove</base-button>
                        </template>
                    </modal>
                    -->

                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { mapGetters } from "vuex"
import Details from '@/components/Depots/Details'
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
import {Badge} from '@/components/argon-core';
import IconButton from '@/components/common/Buttons/IconButton';
import DepotFilter from '@/components/Depots/DepotFilter';
import Status from '@/components/Depots/Status';
import MetaInfo from '@/components/common/MetaInfo';
import {canViewDepot} from '@/permissions'
import Loader from "../common/Loader/Loader";
import { getCurrencySymbol } from '@/helpers/currency';
export default {
    components: {
      Loader,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
      Details,
      Badge,
      IconButton,
      DepotFilter,
      Status,
      MetaInfo
    },
    props:{
      accountId:{
        type:Number,
        default:0
      }
    },
    data() {
        return {
            title: 'Depot List',
            data: [],
            loading: true,
            search: '',
            sort: 'id',
            order: 'desc',
            selected: [],
            id: '',
            initiated: false,
            debounced: null,
            selectedResource: null,
            showPopup: false,
            showConfirm: false,
            pageTitle: 'Depots',
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" },
            showFilter: false,
            filterQuery:null,
            searchValue:null,
            meta:null
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
        mergedQuery() {
            return this.searchQuery
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage )
        },
        hasViewAccess(){
            return canViewDepot();
        },
        hasRouteQuery() {
            return Object.keys(this.$route.query).length
        }
    },
    watch: {
        searchQuery: {
            handler(o, p) {
                setTimeout(() => {
                    if (!this.hasRouteQuery) {
                        this.fetchList(this.searchQuery)
                    }
                }, 1);
            },
            immediate: true,
        },
        mergedQuery: {
            handler(o, p) {
                if (this.hasRouteQuery && this.filterQuery) {
                    this.fetchList(this.searchQuery)
                }
            },
            immediate: true,
        },
        $route: {
            handler() {
                if (this.$route.query && Object.keys(this.$route.query).length) {
                    this.showFilter = true;
                }
            },
            immediate: true,
            deep: false
        }
    },
    mounted() {
    },
    methods: {
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true;
                if(this.accountId!==0) {
                  if(!pageQuery.includes('&account_id=')) {
                    pageQuery+='&account_id='+this.accountId;
                  }
                }

                this.$store
                    .dispatch("depots/fetchList", pageQuery)
                    .then(response => {
                    if(response && response.data){
                        this.data = response.data.data;
                        this.totalTableData = response.data.meta.total
                        this.meta = response.data.meta;
                        
                    }
                    this.loading = false;
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        gotoDetails(resource){
            const part = "/depots/details/";
            const url = "http://"+window.location.host+part+resource.id;
            window.open(url,'_blank');
          //this.$router.push('/depots/details/'+resource.id)
        },
        newDepot() {
            this.$router.push('/depots/add')
        },
        removeConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        remove(resource) {
            this.$store
                .dispatch('depots/remove', resource.id)
                .then( () => {
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
                })
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
       doSearchById(value) {
           if(value)
           {
             this.$store
                  .dispatch("depots/fetchList", "&name_or_number="+value)
                  .then(response => {
                      this.data = response.data.data

                      this.totalTableData = response.data.meta.total
                      this.meta = response.data.meta;
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
         toggleFilter: function() {
          this.showFilter=!this.showFilter;
        },
        applyFilter: function(query)
        {
            this.filterQuery = query;
        },
        getCurrency(row){
          let currency = undefined
          if (row && row.currency) {
              currency = row.currency
          }
          return getCurrencySymbol(currency);
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
.avatar, .avatar img {
  height: 48px;
  width: 48px;
  border-radius: 100%;
}
.dateStyle {
  color:#b5bacc;
  font-size:0.85em;
  margin-top:-0.5em;
  white-space: nowrap;
}
.actionBtnStyle {
    color:#8898aa;
}
</style>

