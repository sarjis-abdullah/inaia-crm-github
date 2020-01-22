<template>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
            <vs-card>
                <vs-table 
                    :sst="true"
                    stripe
                    multiple
                    search
                    v-model="selected"
                    max-items="5"
                    id="customer-table"
                    ref="table"
                    :data="data"
                    :total="totalTableData"
                    @search="handleSearch"
                    @sort="handleSort"
                    class="text-nowrap"
                >
                    <template slot="header">
                        <h3> Customer List </h3>
                        <!-- <vs-button color="primary" type="gradient" icon="person_add" @click="newCustomer"> add customer </vs-button> -->
                    </template>

                    <template slot="thead">
                        <vs-th sort-key="id">Contact ID</vs-th>
                        <vs-th sort-key="name">Name</vs-th>
                        <vs-th>Account Number</vs-th>
                        <vs-th>Mobile</vs-th>
                        <vs-th>Gender</vs-th>
                        <vs-th>Action</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="i" :data="tr" v-for="(tr, i) in data">
                            <vs-td :data="tr.id"><span class="badge badge-light badge-pill border border-muted">{{ tr.id }}</span></vs-td>
                            <vs-td :data="tr.name">
                                <div class="d-flex no-block align-items-center">
                                <div class="mr-2">
                                    <img
                                    :src="require('@/assets/images/users/3.jpg')"
                                    alt="user"
                                    class="rounded-circle"
                                    width="45"
                                    />
                                </div>
                                <div class>
                                    <h5 class="mb-0 font-16">{{ tr.name + ' ' + (tr.person_data ? tr.person_data.surname : 'n/a') }}</h5>
                                    <span class="text-muted">{{ tr.account ? tr.account.email : 'N/A' }}</span>
                                </div>
                                </div>
                            </vs-td>
                            <vs-td :data="tr.account ? tr.account.account_number : 'n/a'">
                                <span class="badge badge-light badge-pill border border-muted">{{ tr.account ? tr.account.account_number : 'N/A' }}</span>
                            </vs-td>
                            <vs-td :data="getMobileNo(tr.channels) || 'n/a'">
                                <div class="d-flex align-items-center">
                                <i class="mdi mdi-phone-classic mr-2 display-8"></i>
                                <span class="text-muted">{{getMobileNo(tr.channels) || 'N/A'}}</span>
                                </div>
                            </vs-td>
                            <vs-td :data="tr.person_data ? tr.person_data.gender : 'n/a'">
                                <span :class="{'capitalize': true, 'badge': true, 'badge-pill': true, 'text-white': tr.person_data && tr.person_data.gender, 'badge-info': tr.person_data && (tr.person_data.gender == 'male' || tr.person_data.gender == 'M'), 'badge-success': tr.person_data && (tr.person_data.gender != 'male' || tr.person_data.gender != 'M')}">
                                    {{ tr.person_data && tr.person_data.gender ? tr.person_data.gender : 'N/A' }}
                                </span>
                            </vs-td>
                            <vs-td><nuxt-link :to="'/customers/edit/'+tr.id">Edit</nuxt-link></vs-td>
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
    </vs-row>
</template>
<script>
import { mapGetters } from "vuex"
export default {
    data() {
        return {
            title: 'Customer List',
            data: [
            ],
            search: '',
            sort: 'id',
            order: 'desc',
            selected: [],
            id: '',
            account_number: '',
            name: '',
            gender: '',
            initiated: false,
            perPage: 5,
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
                `&page=${this.page || 1}` +
                `&per_page=${this.perPage || 5}`
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchClientData(this.searchQuery)
            },
            immediate: true
        }
    },
    mounted() {
        this.fetchClientData(this.searchQuery)
    },
    methods: {
        fetchClientData(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                this.$store
                    .dispatch("clients/initClientData", pageQuery)
                    .then(response => {
                        this.data = response.data.data
                        console.log('data', this.data)
                        this.totalTableData = response.data.meta.total
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newCustomer() {
            this.$router.push('/customers/add')
        },
        getMobileNo(channels) {
            if (channels && channels.length && channels[0].type && channels[0].type.value == 'tel') {
                return channels[0].value
            }
            return null
        },
        handleSearch(search) {
            // console.error('search-key', search)
            if (search.length > 1) {
                this.search = search
            } else if (this.search) {
                this.search = ''
            }
        },
        handleSort(sort, order) {
            // console.error('sort', sort, order)
            if (!order)     return
            const mapSort   = {'id': 'contacts.id', 'name': 'contacts.name', 'account_number': 'account_number'}
            this.sort   = mapSort[sort]
            this.order  = order
        }
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>