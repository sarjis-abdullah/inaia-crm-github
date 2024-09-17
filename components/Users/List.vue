<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ pageTitle }}</h6>
                    <!--
                    <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                        <route-breadcrumb/>
                    </nav>
                    -->
                </div>
                <div class="col-lg-6 col-5 text-right">
                    <base-button size="sm" type="neutral" @click="newUser" v-if="hasEditAccess">New User</base-button>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="border-0 card-header">
                            <h3 class="mb-0">{{ tableTitle }}</h3>
                        </div>

                        <el-table
                            class="table-responsive table-flush"
                            header-row-class-name="thead-light"
                            :data="data"
                            @sort-change="sortChange"
                        >

                            <el-table-column
                                label="Name"
                                min-width="280px"
                            >
                                <template v-slot="{row}">
                                    <a @click.prevent="() => popupDetails(row)" href="#" class="media align-items-center">
                                        <span class="avatar rounded-circle mr-3">
                                            <img alt="Im" :src="avatar(row)">
                                        </span>
                                        <div class="media-body">
                                            <span class="font-weight-600 name mb-0 text-sm">{{ row.name + (row.person_data ? ' ' + row.person_data.surname : '') }}</span>
                                        </div>
                                    </a>
                                </template>
                            </el-table-column>

                            <el-table-column
                                label="Contact"
                                min-width="200px"
                            >
                                <template v-slot="{row}">
                                    <span>{{getChannelInfo(row.channels, 'mobile') || getChannelInfo(row.channels, 'tel') || 'N/A'}}</span>
                                    <template v-if="getChannelInfo(row.channels, 'email')">
                                        <br />
                                        <span>{{getChannelInfo(row.channels, 'email')}}</span>
                                    </template>
                                </template>
                            </el-table-column>

                            <el-table-column
                                label="Roles"
                                min-width="200px"
                            >
                                <template v-slot="{row}">
                                    <el-tag v-for="(role, idx) in row.account.roles" :key="`role-${idx}`" class="mr-1 mb-1">
                                        {{ $t(role.short_name) }}
                                    </el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column
                                label="Status"
                                min-width="120px"
                                prop="is_active"
                                sortable
                            >
                                <template v-slot="{row}">
                                    <badge class="badge-dot mr-4" type="">
                                        <i :class="`bg-${row.is_active ? 'success' : 'danger'}`"></i>
                                        <span class="status">{{row.is_active ? 'active' : 'inactive'}}</span>
                                    </badge>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="100px" v-if="hasEditAccess">
                                <template v-slot="{row}">
                                    <el-dropdown trigger="click" class="dropdown">
                                        <span class="btn btn-sm btn-icon-only text-light">
                                            <i class="fas fa-ellipsis-v mt-2"></i>
                                        </span>
                                        <el-dropdown-menu class="dropdown-menu dropdown-menu-arrow show" slot="dropdown">
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/users/details/'+row.id)" href="#">{{ $t('details') }}</a>
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/users/edit/'+row.id)" href="#">{{ $t('edit') }}</a>
                                            <a class="dropdown-item" @click.prevent="() => $router.push('/users/assign-roles/'+row.id)" href="#">{{ $t('assign_roles') }}</a>
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
                                <h5 class="modal-title" id="exampleModalLabel">User details</h5>
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
                                Are you sure to delete user with id "{{ selectedResource ? selectedResource.id : '' }}"?
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
import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown, Tag } from 'element-ui'
import Details from '@/components/Users/Details'
import { canEditAdmin } from '@/permissions';
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        [Tag.name]: Tag,
        Details
    },
    data() {
        return {
            pageTitle: 'Users',
            tableTitle: 'User List',
            data: [],
            search: '',
            sort: 'is_active',
            order: 'desc',
            selected: [],
            id: '',
            account_number: '',
            type_id: '',
            gender: '',
            initiated: false,
            debouced: null,
            selectedResource: null,
            showPopup: false,
            showConfirm: false,
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" }
        }
    },
    computed: {
        ...mapGetters({
            types: "types/pairs"
        }),
        searchQuery() {
            return (
                (this.search ? '&search=' + this.search : '') +
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.page || 1}` +
                `&per_page=${this.perPage || 5}`
                // `&type_id=${ this.types && this.types.person ? this.types.person : 0 }`
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        },
    hasEditAccess(){
      return canEditAdmin()
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
        },
        types: {
            handler() {
                this.fetchList(this.searchQuery)
            },
            immediate: true
        }
    },
    methods: {
        popupDetails(resource) {
            this.selectedResource= resource
            this.showPopup      = true
        },
        fetchList(pageQuery) {
            if (!this.initiated && this.types && this.types.person) {
                this.initiated  = true
                this.$store
                    .dispatch("users/initUserData", pageQuery)
                    .then(response => {
                        this.data = response.data.data
                        this.totalTableData = response.data.meta.total
                    }).catch(err => {
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newUser() {
            this.$router.push('/users/add')
        },
        removeConfirm(resource) {
            this.selectedResource   = resource
            this.showConfirm        = true
        },
        remove(resource) {
            this.showConfirm    = false
            this.$store
                .dispatch('users/removeUser', resource.id)
                .then( () => {
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
                })
        },
        getChannelInfo(channels, type) {
            let channel = channels && channels.length && channels.find( c => c.type.value == type )
            if (channel) {
                return channel.value
            }
            return null
        },
        getAccountType(contact) {
            if (contact.account && contact.account.type) {
                return contact.account.type.value
            }
            return null
        },
        avatar(resource) {
            if (resource && resource.person_data) {
                let gender    = resource.person_data.gender ? resource.person_data.gender.toLowerCase() : ''
                if (gender == 'female' || gender == 'f') {
                    return '/img/theme/avatar_f.png'
                }
            }
            return '/img/theme/avatar_m.png'
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
            }, 400)
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
