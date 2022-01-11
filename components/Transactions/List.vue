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
                            <h3 class="mb-0">Transaction List</h3>
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
                                        <div class="media-body">
                                            <span class="font-weight-600 name mb-0 text-sm">{{row.id}}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="Order ID"
                                            prop="order_id"
                                            min-width="140px"
                                            sortable>
                            </el-table-column>

                            <el-table-column label="Type"
                                            prop="transaction_type_id"
                                            min-width="190px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.type ? row.type.name_translation_key : row.transaction_type_id}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Money"
                                            prop="money_amount"
                                            min-width="140px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.money_amount}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Gold Amount"
                                            prop="gold_amount"
                                            min-width="190px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.gold_amount}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Gold Price"
                                            prop="gold_price_raw"
                                            min-width="190px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.gold_price_raw}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Trading Price"
                                            prop="gold_price_trading"
                                            min-width="190px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.gold_price_trading}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Price Date"
                                            prop="gold_price_date"
                                            min-width="200px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.gold_price_date}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Fee"
                                            prop="fee"
                                            min-width="120px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.fee}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="140px">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => popupDetails(row)" href="#">{{ $t('details') }}</a>
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
                                <h5 class="modal-title" id="exampleModalLabel">Transaction details</h5>
                            </template>
                            <div>
                                <Details :resource="selectedResource" v-if="showPopup" />
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
                                Are you sure to delete transaction with id "{{ selectedResource ? selectedResource.id : '' }}"?
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
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
import Details from '@/components/Transactions/Details'

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
            showConfirm: false,
            pageTitle: 'Transactions',
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
    methods: {
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("transactions/fetchList", pageQuery)
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
            this.$router.push('/transactions/add')
        },
        removeConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        remove(resource) {
            this.showConfirm        = false
            this.$store
                .dispatch('transactions/remove', resource.id)
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