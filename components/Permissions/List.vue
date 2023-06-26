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
                    <base-button size="sm" type="neutral" @click="newPermission">New Permission</base-button>
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
                                    <h3 class="mb-0">Permission List</h3>
                                </div>
                                <div class="col">
                                    <!-- <base-button
                                        type="primary"
                                        @click="() => $router.push('/permissions/add')"
                                    >
                                        <i class="ni ni-fat-add"></i>Add Permission
                                    </base-button> -->
                                </div>
                                <div class="col">
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
                                </div>
                            </div>
                        </div>

                        <el-table
                            class="table-responsive table-flush"
                            header-row-class-name="thead-light"
                            :data="data"
                            @sort-change="sortChange"
                        >
                            <el-table-column label="Permission ID"
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

                            <el-table-column label="Short Name"
                                            min-width="240px"
                                            prop="short_name"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{ row.short_name || 'N/A' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Title"
                                            min-width="240px"
                                            prop="name_translation_key"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{ row.name_translation_key || 'N/A' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column label="Status"
                                            min-width="140px"
                                            prop="is_active"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status">{{ row.is_active == 1 ? 'Active' : 'Inactive' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="250px">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => popupDetails(row)" href="#">{{ $t('details') }}</a>
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/permissions/edit/'+row.id)" href="#">{{ $t('edit') }}</a>
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
                                <h5 class="modal-title" id="detailsModal">Permission details</h5>
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
                                Are you sure to delete permission with id "{{ selectedResource ? selectedResource.id : '' }}"?
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


<!-- <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>
                <vs-table 
                    :sst="true"
                    stripe
                    multiple
                    search
                    v-model="selected"
                    max-items="5"
                    id="permissions-table"
                    ref="table"
                    :data="data"
                    :total="totalTableData"
                    @search="handleSearch"
                    @sort="handleSort"
                    class="text-nowrap"
                >
                    <template slot="header">
                        <vs-button color="primary" type="gradient" icon="person_add" @click="newPermission"> Add Permission </vs-button>
                    </template>

                    <template slot="thead">
                        <vs-th sort-key="id">Permission ID</vs-th>
                        <vs-th sort-key="short_name">Short Name</vs-th>
                        <vs-th>Translation Key</vs-th>
                        <vs-th>Status</vs-th>
                        <vs-th>Action</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="i" :data="tr" v-for="(tr, i) in data">
                            <vs-td :data="tr.id"><span class="badge badge-light badge-pill border border-muted">{{ tr.id }}</span></vs-td>
                            <vs-td :data="tr.short_name">
                                <h5 class="mb-0 font-16">{{ tr.short_name }}</h5>
                            </vs-td>
                            <vs-td :data="tr.name_translation_key">
                                <h6 class="mb-0 font-16">{{ tr.name_translation_key }}</h6>
                            </vs-td>
                            <vs-td :data="tr.is_active">
                                <h6 class="mb-0 font-16">{{ tr.is_active == 1 ? 'Active' : 'Inactive' }}</h6>
                            </vs-td>
                            <vs-td>
                                <vs-button @click.native.stop="() => popupDetails(tr)" class="mr-2" color="warning" type="border">Details</vs-button>
                                <vs-button @click.native.stop="() => $router.push('/permissions/edit/'+tr.id)" class="mr-2" color="primary" type="border">Edit</vs-button>
                                <vs-button @click.native.stop="() => removeConfirm(tr.id)" color="danger" type="border" v-if="true">Delete</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>

                </vs-table>
                <template>
                    <div class="align: center">
                        <vs-pagination :total="totalPages" v-model="page"></vs-pagination>
                    </div>
                </template>
            </vs-card>
        </vs-col>
        <vs-popup title="Contact Details" :active.sync="showPopup">
            <Details :resource="selectedResource" v-if="showPopup" />
        </vs-popup>
    </vs-row> -->
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown } from 'element-ui'
import Details from '@/components/Permissions/Details'

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
            title: 'Permissions List',
            data: [],
            search: '',
            sort: 'is_active',
            order: 'desc',
            selected: [],
            id: '',
            initiated: false,
            debouced: null,
            selectedResource: null,
            showPopup: false,
            showConfirm: false,
            pageTitle: 'Permissions',
            perPage: 10,
            page: 1,
            totalTableData: 0
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
        // searchQuery: {
        //     handler() {
        //         this.fetchList(this.searchQuery)
        //     },
        //     immediate: true,
        // },
        page: {
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
                    .dispatch("permissions/fetchList", pageQuery)
                    .then(response => {
                        this.data = response.data.data
                        this.totalTableData = response.data.meta.total
                    }).catch(err => {
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newPermission() {
            this.$router.push('/permissions/add')
        },
        removeConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        remove(resource) {
            this.showConfirm        = false
            this.$store
                .dispatch('permissions/remove', resource.id)
                .then( () => {
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
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
        sortChange(s) {
            if (s.prop !== this.sort) {
                this.sort   = s.prop
            }
            if (s.order === 'ascending' && this.order !== 'asc') {
                this.order   = 'asc'
            } else if (s.order === 'descending' && this.order !== 'desc') {
                this.order   = 'desc'
            }
            this.fetchList(this.searchQuery)
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