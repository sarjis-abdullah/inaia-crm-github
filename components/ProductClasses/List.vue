<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{this.pageTitle}}</h6>
                </div>
                <div class="col-lg-6 col-5 text-right">
                    <base-button size="sm" type="neutral" @click="newProductClass">New Product Class</base-button>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="border-0 card-header">
                            <div class="row">
                                <div class="col">
                                    <h3 class="mb-0">Product Classes List</h3>
                                </div>
                                <!-- <div class="col">
                                    <form class="navbar-search form-inline mr-sm-3" id="navbar-search-main">
                                        <div class="form-group mb-0">
                                            <div class="input-group input-group-alternative input-group-merge">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                                                </div>
                                                <input class="form-control" placeholder="Search" type="text" @input="(e) => handleSearch(e.target.value)">
                                            </div>
                                        </div>
                                        <button type="button" class="close" data-action="search-close" data-target="#navbar-search-main"
                                                aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </form>
                                </div> -->
                            </div>
                        </div>

                        <el-table class="table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="data">
                            <el-table-column label="Class ID"
                                            min-width="140px"
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

                            <el-table-column label="Class Name"
                                            min-width="240px"
                                            prop="name_translation_key">
                                <template v-slot="{row}">
                                    <span class="status">{{ row.name_translation_key || 'N/A' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Product Name"
                                            min-width="240px"
                                            prop="name_translation_key">
                                <template v-slot="{row}">
                                    <span class="status">{{ row.product.name_translation_key || 'N/A' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="180px">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/product-classes/edit/'+row.id)" href="#">Edit</a>
                                            <a class="dropdown-item" @click.prevent="() => removeConfirm(row)" href="#">Delete</a>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="card-footer py-4 d-flex justify-content-end">
                            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                        </div>

                        <modal :show.sync="showConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">Confirmation</h5>
                            </template>
                            <div>
                                Are you sure to delete product class with id "{{ selectedResource ? selectedResource.id : '' }}"?
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

export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu
    },
    data() {
        return {
            title: 'Product List',
            data: [
            ],
            search: '',
            sort: 'id',
            order: 'desc',
            selected: [],
            id: '',
            initiated: false,
            debouced: null,
            selectedResource: null,
            pageTitle: 'Product Classes',
            showPopup: false,
            showConfirm: false,
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" }
        }
    },
    computed: {
        searchQuery() {
            return (
                (this.search ? '&short_name=' + this.search + '&name_translation_key=' + this.search : '') +
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.search ? 1 : this.page}` +
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
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("product-classes/fetchList", pageQuery)
                    .then(response => {
                        this.data = response.data.data
                        this.totalTableData = response.data.meta.total
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newProductClass() {
            this.$router.push('/product-classes/add')
        },
        removeConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        remove(resource) {
            this.showConfirm        = false
            this.$store
                .dispatch('product-classes/remove', resource.id)
                .then( () => {
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
                }).catch(error => {
                  this.$notify({type: 'danger', timeout: 10000, message: error.response.data.error})
                })
        },
        handleSearch(search) {
            if (this.debouced) {
                clearTimeout(this.debouced)
            }
            this.debouced   = setTimeout(() => {
                if (search.length > 1) {
                    this.search = search
                } else if (this.search) {
                    this.search = ''
                }
            }, 800)
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
