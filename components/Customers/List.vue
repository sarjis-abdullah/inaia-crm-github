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
                        <vs-button color="primary" type="gradient" icon="person_add" @click="newCustomer"> Add Contact </vs-button>
                    </template>

                    <template slot="thead">
                        <vs-th sort-key="id">Contact ID</vs-th>
                        <vs-th sort-key="name">Name</vs-th>
                        <vs-th>Contact</vs-th>
                        <vs-th sort-key="account_number">Account Number</vs-th>
                        <vs-th sort-key="type_id">Contact Type</vs-th>
                        <vs-th>Action</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="i" :data="tr" v-for="(tr, i) in data">
                            <vs-td :data="tr.id"><span class="badge badge-light badge-pill border border-muted">{{ tr.id }}</span></vs-td>
                            <vs-td :data="tr.name">
                                <div class="d-flex no-block align-items-center">
                                    <div class="mr-2">
                                        <img
                                        :src="require('@/assets/images/users/1.jpg')"
                                        alt="user"
                                        class="rounded-circle"
                                        width="45"
                                        />
                                    </div>
                                    <div>
                                        <h5 class="mb-0 font-16">{{ tr.name + (tr.person_data ? ' ' + tr.person_data.surname : '') }}</h5>
                                    </div>
                                </div>
                            </vs-td>
                            <vs-td :data="getChannelInfo(tr.channels, 'mobile') || getChannelInfo(tr.channels, 'tel') || 'n/a'">
                                <div v-if="getChannelInfo(tr.channels, 'mobile') || getChannelInfo(tr.channels, 'tel')">
                                    <div class="d-flex align-items-center">
                                        <i class="mdi mr-2 mdi-phone mdi-10"></i>
                                        <span class="text-muted">{{getChannelInfo(tr.channels, 'mobile') || getChannelInfo(tr.channels, 'tel') || 'N/A'}}</span>
                                    </div>
                                </div>
                                <div v-if="getChannelInfo(tr.channels, 'email')">
                                    <div class="d-flex align-items-center">
                                        <i class="mdi mr-2 mdi-email mdi-10"></i>
                                        <span class="text-muted">{{getChannelInfo(tr.channels, 'email')}}</span>
                                    </div>
                                </div>
                            </vs-td>
                            <vs-td :data="tr.account ? tr.account.account_number : 'n/a'">
                                <span class="badge badge-light badge-pill border border-muted">{{ tr.account ? tr.account.account_number : 'N/A' }}</span>
                            </vs-td>
                            <vs-td :data="getAccountType(tr) || 'n/a'">
                                <span :class="{'capitalize': true, 'badge': true, 'badge-pill': true, 'badge-primary': getAccountType(tr) === 'customer', 'badge-success': getAccountType(tr) === 'employee', 'badge-info': getAccountType(tr) === 'partner'}">
                                    {{ getAccountType(tr) || 'N/A' }}
                                </span>
                            </vs-td>
                            <vs-td>
                                <vs-button @click.native.stop="() => popupDetails(tr)" class="mr-2" color="warning" type="border">Details</vs-button>
                                <vs-button @click.native.stop="() => $router.push('/customers/edit/'+tr.id)" class="mr-2" color="primary" type="border">Edit</vs-button>
                                <vs-button @click.native.stop="() => removeConfirm(tr.id)" color="danger" type="border" v-if="!tr.account">Delete</vs-button>
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
            <Details :contact="selectedContact" v-if="showPopup" />
        </vs-popup>
    </vs-row>
</template>
<script>
import { mapGetters } from "vuex"
import Details from '@/components/Customers/Details'

export default {
    components: {
        Details
    },
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
            type_id: '',
            name: '',
            gender: '',
            initiated: false,
            debouced: null,
            selectedContact: null,
            showPopup: false,
            perPage: 5,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" }
        }
    },
    computed: {
        ...mapGetters({
            types: "types/types"
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
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchClientData(this.searchQuery)
            },
            immediate: true,
        },
        types: {
            handler() {
                this.fetchClientData(this.searchQuery)
            },
            immediate: true
        }
    },
    mounted() {
    },
    methods: {
        popupDetails(contact) {
            this.selectedContact= contact
            this.showPopup      = true
        },
        fetchClientData(pageQuery) {
            if (!this.initiated && this.types && this.types.person) {
                this.initiated  = true
                this.$store
                    .dispatch("clients/initClientData", pageQuery)
                    .then(response => {
                        this.data = response.data.data
                        this.totalTableData = response.data.meta.total
                    }).finally(() => {
                        this.initiated  = false
                    })
            }
        },
        newCustomer() {
            this.$router.push('/customers/add')
        },
        removeConfirm(contactId) {
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text: 'Are you sure to delete contact with id "'+ contactId +'"?',
                accept:(() => {
                    this.$store
                        .dispatch('clients/removeClient', contactId)
                        .then( () => {
                            this.fetchClientData(this.searchQuery)
                        })
                })
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