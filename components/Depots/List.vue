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
                            <h3 class="mb-0">Depot List</h3>
                        </div>

                        <el-table class="table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="data">
                            <el-table-column label="ID"
                                            min-width="110px"
                                            prop="id"
                                            sortable>
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <!-- <a href="#" class="avatar rounded-circle mr-3">
                                            <img alt="Image placeholder" src="">
                                        </a> -->
                                        <div class="media-body">
                                            <span class="font-weight-600 name mb-0 text-sm">{{row.id}}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Account ID"
                                            prop="account_id"
                                            min-width="140px"
                                            sortable>
                            </el-table-column>

                            <el-table-column label="Gold Amount"
                                            prop="gold_amount"
                                            min-width="140px"
                                            sortable>
                            </el-table-column>

                            <el-table-column label="Product"
                                            prop="product_class_id"
                                            min-width="240px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{getProductClass(row.product_class_id)}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Product"
                                            prop="status.name_translation_key"
                                            min-width="190px"
                                            sortable>
                            </el-table-column>

                            <!-- <el-table-column label="Status"
                                            min-width="170px"
                                            prop="status"
                                            sortable>
                                <template v-slot="{row}">
                                    <badge class="badge-dot mr-4" type="">
                                        <i :class="`bg-${row.statusType}`"></i>
                                        <span class="status">{{row.status}}</span>
                                    </badge>
                                </template>
                            </el-table-column> -->

                            <!-- <el-table-column label="Users" min-width="190px">
                                <div class="avatar-group">
                                    <a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip"
                                    data-original-title="Ryan Tompson">
                                        <img alt="Image placeholder" src="img/theme/team-1.jpg">
                                    </a>
                                    <a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip"
                                    data-original-title="Romina Hadid">
                                        <img alt="Image placeholder" src="img/theme/team-2.jpg">
                                    </a>
                                    <a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip"
                                    data-original-title="Alexander Smith">
                                        <img alt="Image placeholder" src="img/theme/team-3.jpg">
                                    </a>
                                    <a href="#" class="avatar avatar-sm rounded-circle" data-toggle="tooltip"
                                    data-original-title="Jessica Doe">
                                        <img alt="Image placeholder" src="img/theme/team-4.jpg">
                                    </a>
                                </div>
                            </el-table-column>

                            <el-table-column label="Completion"
                                            prop="completion"
                                            min-width="240px"
                                            sortable>
                                <template v-slot="{row}">
                                    <div class="d-flex align-items-center">
                                        <span class="completion mr-2">{{row.completion}}%</span>
                                        <div>
                                            <base-progress :type="row.statusType" :value="row.completion"/>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column> -->
                            <el-table-column min-width="230px">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/depots/details/'+row.id)" href="#">{{ $t('details') }}</a>
                                            <!--<a class="dropdown-item" @click.prevent="() => popupDetails(row)" href="#">{{ $t('details') }}</a>-->
                                            <a class="dropdown-item" @click.prevent="() => removeConfirm(row)" href="#">{{ $t('delete') }}</a>
                                        </el-dropdown-menu>
                                    </el-dropdown>
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

export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Details
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
                        this.data = response.data.data
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
                let c   = Object.keys(this.productClasses).find(cl => this.productClasses[cl] == cid)
                return c || cid
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
</style>
