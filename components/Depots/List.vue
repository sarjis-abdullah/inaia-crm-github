<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{this.pageTitle}}</h6>
                    <!--
                    <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                        <route-breadcrumb/>
                    </nav>
                    -->
                </div>
                <div class="col-lg-6 col-5 text-right">
                    <!-- <base-button size="sm" type="neutral">New</base-button> -->
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="border-0 card-header">
                            <h3 class="mb-0">{{$t('depot_list')}}</h3>
                        </div>

                        <el-table class="table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="data">
                            <el-table-column label="#"
                                            min-width="120px"
                                            prop="id"
                                            >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <!-- <a href="#" class="avatar rounded-circle mr-3">
                                            <img alt="Image placeholder" src="">
                                        </a> -->
                                        <div class="media-body">
                                            <div class="font-weight-300 name" >{{row.id}}</div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column :label="$t('depot_name')"
                                            prop="name"
                                            min-width="300px"
                                            sortable
                                            >
                                 <template v-slot="{row}">
                                    <div class="d-flex">
                                        <span href="#!" class="avatar mr-3 removeImageBorder">
                                          <img v-bind:src="row.avatar"/>
                                        </span>
                                        <div>
                                          <span class="orderType"><strong>{{row.name}}</strong></span>
                                          
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('depot_agio')"
                                            prop="agio"
                                            min-width="250px"
                                            >
                                    <template v-slot="{row}">
                                        <span>{{$n(row.agio)}} €</span>
                                        <div class="dateStyle">{{$t(row.agio_payment_option)}}</div>
                                    </template> 
                            </el-table-column>

                            <el-table-column :label="$t('amount')"
                                            prop="gold_amount"
                                            min-width="150px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{$n(row.gold_amount/1000)}} g</span>
                                </template>
                            </el-table-column>

                            <el-table-column :label="$t('saving_plan')"
                                            prop="is_savings_plan"
                                            min-width="190px"
                                            >
                                    <template v-slot="{row}">
                                        <span class="orderType" v-if="row.is_savings_plan==0">{{$t('no_saving_plan')}}</span>
                                        <div v-if="row.is_savings_plan==1">
                                            <div>{{$n(row.interval_amount)}} €</div>
                                            <div class="dateStyle">{{$d(new Date(row.interval_startdate))}} - {{$d(new Date(row.interval_enddate))}}</div>
                                        </div>
                                    </template>
                            </el-table-column>
                            <el-table-column :label="$t('status')"
                                            prop="status.name_translation_key"
                                            min-width="190px"
                                            >
                                     <template v-slot="{row}">
                                <Badge type="success" v-if="row.status.name_translation_key=='depot_status_active'">{{row.status.translated_name}}</Badge>
                                     </template>
                            </el-table-column>
                           
                            <el-table-column min-width="230px">
                                <template v-slot="{row}">
                                    <icon-button type="info" @click="() => popupDetails(row)"></icon-button>
                                <icon-button type="cancel" @click="() => removeConfirm(row)"></icon-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="card-footer py-4 d-flex justify-content-end">
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
                                <base-button type="secondary" @click="showPopup = false">Close</base-button>
                            </template>
                        </modal>

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
                    </div>
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
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Details,
        Badge,
        IconButton
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
            productClasses: null,
            productClassesLoaded: false,
            pageTitle: 'Depots',
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" }
        }
    },
    computed: {
        searchQuery() {
            return (
                (this.search ? '&search=' + this.search : '') +
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.page}` +
                `&per_page=${this.perPage}`
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
        this.$store
            .dispatch('product-classes/pairs')
            .then(res => {
                // console.error('products', res.data.data)
                console.log(res.data.data);
                this.productClasses = res.data.data
            })
    },
    methods: {
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("depots/fetchList", pageQuery)
                    .then(response => {
                        // console.error('data', response.data)
                        this.data = response.data.data;
                        console.log(this.data);
                        this.totalTableData = response.data.meta.total
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
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
        getProductClass(cid) {
            if (this.productClasses) {
                let c   = Object.values(this.productClasses).find(cl => cl == cid)
                console.log(Object.values(this.productClasses))
                return c;
            }
            return cid
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
.orderType {
  white-space: nowrap;
}
.avatar, .avatar img {
  height: 40px;
  width: 40px;
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