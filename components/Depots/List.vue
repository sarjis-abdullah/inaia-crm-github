<template>
    <div>

        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">
                      <div class="row align-items-center">
                        <div class="col-8">
                          <el-input v-if="accountId==0" prefix-icon="el-icon-search" :placeholder="$t('search')+`: `+$t('depot_name')" clearable style="width: 200px" v-model="searchValue" @change="doSearchById" @clear="clearSearchById" />
                          
                        </div>
                        <div class="col-4 text-right">
                          <button v-if="accountId==0" @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                            <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    <depot-filter v-if="accountId==0" v-bind:showFilter="showFilter" v-on:filter='applyFilter'></depot-filter>

                    <el-table class="table-hover table-responsive table-flush"
                            header-row-class-name="thead-light"
                            :data="data">
                        <el-table-column label="#"
                                        min-width="120px"
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
                                    <div class="d-flex align-items-center text-body">
                                      <span><strong>{{row.name}}</strong></span>

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
                                        <div>{{$n(row.interval_amount / 100)}} €</div>
                                        <div class="dateStyle">{{$d(new Date(row.interval_startdate))}} - {{$d(new Date(row.interval_enddate))}}</div>
                                    </div>
                                </template>
                        </el-table-column>

                        <el-table-column :label="$t('depot_agio')"
                                         prop="agio"
                                         min-width="160px"
                        >
                          <template v-slot="{row}">
                            <span>{{$n(row.agio/100)}} €</span>
                            <div class="dateStyle">{{$t(row.agio_payment_option)}}</div>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('depot_type')"

                                         min-width="160px"
                        >
                          <template v-slot="{row}">
                             <span>{{$t(row.depot_type.name_translation_key)}}</span>
                          </template>
                        </el-table-column>
                        <el-table-column :label="$t('status')"
                                        prop="status.name_translation_key"
                                        min-width="160px"
                                        >
                                 <template v-slot="{row}">
                                    <Status :row="row"/>
                                 </template>
                        </el-table-column>

                        <el-table-column>
                            <template v-slot="{row}">

                              <icon-button type="info" @click="() => gotoDetails(row)"></icon-button>
                              <!--
                              <icon-button type="info" @click="() => popupDetails(row)"></icon-button>
                              <icon-button type="cancel" @click="() => removeConfirm(row)"></icon-button>
                              -->

                            </template>
                        </el-table-column>

                    </el-table>

                    <div class="card-footer py-4 d-flex justify-content-end" v-if="totalTableData> perPage">
                        <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
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
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Details,
        Badge,
        IconButton,
        DepotFilter,
        Status
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
            searchValue:null
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
                        this.data = response.data.data;
                        this.totalTableData = response.data.meta.total
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        gotoDetails(resource){
          this.$router.push('/depots/details/'+resource.id)
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

