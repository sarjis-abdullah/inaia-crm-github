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
                            <h3 class="mb-0">Order List</h3>
                        </div>

                        <el-table class="table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="data">
                            <el-table-column label="ID"
                                            min-width="310px"
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
                            <el-table-column label="Depot ID"
                                            prop="depot_id"
                                            min-width="140px"
                                            sortable>
                            </el-table-column>

                            <el-table-column label="Type"
                                            prop="order_type_id"
                                            min-width="140px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.order_type ? $t(row.order_type.name_translation_key) : row.order_type_id}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Bank Account"
                                            prop="banking_account_id"
                                            min-width="140px"
                                            sortable>
                            </el-table-column>

                            <el-table-column label="Amount"
                                            prop="amount"
                                            min-width="140px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status" v-if="row.unit === 'gram'">
                                        <i18n-n :value="row.amount/1000">
                                            <template v-slot:integer="slotProps">{{ slotProps.integer }}</template>
                                            <template v-slot:group="slotProps">{{ slotProps.group }}</template>
                                            <template v-slot:decimal="slotProps">{{ slotProps.decimal }}</template>
                                            <template v-slot:fraction="slotProps">
                                                <span class="superscript">{{ paddingFractionTo3(slotProps.fraction) }}</span>
                                            </template>
                                        </i18n-n> g
                                    </span>
                                    <span class="status" v-else>
                                        <i18n-n :value="row.amount/100">
                                            <template v-slot:integer="slotProps">{{ slotProps.integer }}</template>
                                            <template v-slot:group="slotProps">{{ slotProps.group }}</template>
                                            <template v-slot:decimal="slotProps">{{ slotProps.decimal }}</template>
                                            <template v-slot:fraction="slotProps">
                                                <span class="superscript">{{ paddingFractionTo3(slotProps.fraction) }}</span>
                                            </template>
                                        </i18n-n> €
                                    </span>
                                    <!-- <span class="status">{{row.amount}} {{row.unit}}</span> -->
                                </template>
                            </el-table-column>

                            <el-table-column label="Status"
                                            prop="order_status_id"
                                            min-width="140px"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{row.order_status ? $t(row.order_status.name_translation_key) : row.order_status_id}}</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="180px">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => popupDetails(row)" href="#">{{ $t('details') }}</a>
                                            <a class="dropdown-item" @click.prevent="() => completeOrderConfirm(row)" href="#" v-if="isOrderPending(row) || isOrderPaid(row)">{{ $t('complete') }}</a>
                                            <a class="dropdown-item" @click.prevent="() => cancelOrderConfirm(row)" href="#" v-if="isOrderPending(row) || isOrderPaid(row)">{{ $t('cancel') }}</a>
                                            <!-- <a class="dropdown-item" @click.prevent="() => removeOrderConfirm(row)" href="#">Delete</a> -->
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
                                <h5 class="modal-title" id="exampleModalLabel">Order details</h5>
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
                                Are you sure to delete order with id "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showConfirm = false">Close</base-button>
                                <base-button type="danger" @click="removeOrder(selectedResource)">Remove</base-button>
                            </template>
                        </modal>

                        <modal :show.sync="showOrderConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">Confirmation</h5>
                            </template>
                            <div>
                                Are you sure to complete the order with id "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showOrderConfirm = false">Close</base-button>
                                <base-button type="primary" @click="completeOrder(selectedResource)">Complete Order</base-button>
                            </template>
                        </modal>

                        <modal :show.sync="showOrderCancelConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">Confirmation</h5>
                            </template>
                            <div>
                                Are you sure to cancel the order with id "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showOrderCancelConfirm = false">Close</base-button>
                                <base-button type="danger" @click="cancelOrder(selectedResource)">Cancel Order</base-button>
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
import Details from '@/components/Orders/Details'
import { paddingFractionTo3 } from '~/helpers/helpers'
import { isOrderPending, isOrderPaid } from '~/helpers/order'

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
            showOrderConfirm: false,
            showOrderCancelConfirm: false,
            pageTitle: 'Orders',
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
        paddingFractionTo3,
        isOrderPending,
        isOrderPaid,
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("orders/fetchList", pageQuery)
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
            this.$router.push('/orders/add')
        },
        removeOrderConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        completeOrderConfirm(resource) {
            this.selectedResource   = resource
            this.showOrderConfirm   = true
        },
        cancelOrderConfirm(resource) {
            this.selectedResource       = resource
            this.showOrderCancelConfirm = true
        },
        removeOrder(resource) {
            this.showConfirm        = false
            this.$store
                .dispatch('orders/remove', resource.id)
                .then( () => {
                    this.$notify({type: 'warning', timeout: 5000, message: 'Order removed successfully!'})
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
                })
        },
        completeOrder(resource) {
            this.showOrderConfirm   = false
            this.$store
                .dispatch('orders/complete', resource.id)
                .then( res => {
                    this.$notify({type: 'success', timeout: 5000, message: 'Order completed successfully!'})
                    // console.error('order->', res.data.data)
                })
        },
        cancelOrder(resource) {
            this.showOrderCancelConfirm = false
            this.$store
                .dispatch('orders/cancel', resource.id)
                .then( res => {
                    this.$notify({type: 'warning', timeout: 5000, message: 'Order canceled successfully!'})
                    // console.error('order->', res.data.data)
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
.superscript {
    position: relative; top: -0.5em; font-size: 60%;
}
</style>
