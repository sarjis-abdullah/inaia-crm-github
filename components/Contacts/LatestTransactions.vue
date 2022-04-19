<template>
            <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
            <div class="row align-items-center">
                <div class="col-8">
                    <h5 class="h3 mb-0">{{ $t('latest_transactions') }}</h5>
                </div>
            </div>
        </div>
                        <el-table class="table-hover table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="lastTransactions">

                             <el-table-column label="#"
                                   min-width="100px"
                                    prop="id"
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <div class="font-weight-300 name" >{{row.id}}</div>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column v-bind:label="$t('type')"
                                    min-width="180px"
                                    >
                                <template v-slot="{row}">
                                    <div class="d-flex align-items-center">
                                        <span href="#!" class="avatar mr-3 removeImageBorder">
                                        <img v-bind:src="row.logo"/>
                                        </span>
                                        <div>
                                        <span class="orderType text-body" v-if="row.order_type"><strong>{{row.order_type ? $t(row.order_type.name_translation_key) : ''}}</strong></span>
                                        <span class="orderType text-body" v-if="row.type"><strong>{{row.type ? $t(row.type) : ''}}</strong></span>
                                        <div class="dateStyle">{{ $d(new Date(row.created_at), 'short') }}</div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column v-bind:label="$t('amount')"
                                    min-width="140px"
                                    align="right"
                                    >
                                <template v-slot="{row}">
                                    <span class="status" v-if="row.unit === 'gram'">
                                        <i18n-n :value="row.amount/1000"></i18n-n> g
                                    </span>
                                    <span class="status" v-else-if="row.unit == 'euro'">
                                        <i18n-n :value="parseInt(row.amount)/100"></i18n-n> €
                                    </span>
                                    <span class="status" v-else-if="!row.unit">
                                        <span>{{row.direction=='CREDIT'?'- ':''}}</span><i18n-n :value="parseInt(row.money_amount)/100"></i18n-n> €
                                    </span>
                                </template>
                               
                            </el-table-column>
                            <el-table-column v-bind:label="$t('status')"
                                    min-width="140px"
                                    >
                                <template v-slot="{row}">
                                    <div v-if="row.order_status">
                                        <Status v-bind:status='row.order_status.name_translation_key'>{{row.order_status ? $t(row.order_status.name_translation_key) : row.order_status_id}}</Status>
                                    </div>
                                    <div v-else>
                                        <BankStatus :status="row.status"  :lifecycle_status="row.lifecycle_status"/>
                                    </div>                              
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template v-slot="{row}">

                                  <icon-button type="info" @click="()=>displayDetails(row)"></icon-button>

                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="card-footer py-4 d-flex justify-content-end">
                            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                        </div>
                        <OrderDetails 
                            :showPopup="showOrderDetails" 
                            :selectedResource="selectedOrder" 
                            @onClose="onOrderDetailsClosed"
                        />
                        <BankingTransactionDetail v-if="showBankTransactionDetail" :showModal="showBankTransactionDetail" :transaction="selectedOrder" @closed="onOrderDetailsClosed"/>
                    </div>
                </div>
                
            </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn } from 'element-ui';
import Status from '@/components/Orders/Status';
import {Badge} from '@/components/argon-core';
import IconButton from '@/components/common/Buttons/IconButton';
import OrderDetails from '@/components/Orders/Details';
import BankStatus from '@/components/Banking/TransactionStatus';
import BankingTransactionDetail from '@/components/Banking/BankingTransactionDetail/BankingTransactionDetail';
export default {
    props:{
        account_id:{
            type:Number,
            default: null
        }
    },
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        Status,
        Badge,
        IconButton,
        OrderDetails,
        BankStatus,
        BankingTransactionDetail
    },
    computed: {
        ...mapGetters({
            lastTransactions: "clients/latestTransactions"
        }),
        searchQuery() {
            return (
                `&account_id=${this.account_id}&page=${this.page | 1}&per_page=${this.perPage | 5}`
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage) 
        }
    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchLatestTransactions(this.searchQuery)
            },
            immediate: true,
        },
    },
    data() {
        return {
            perPage: 5,
            page: 1,
            totalTableData: 0,
            isLoading: false,
            loadingError: null,
            selectedOrder: null,
            showOrderDetails: false,
            showBankTransactionDetail:false
        }
    },
    methods:{
        fetchLatestTransactions(){
            this.isLoading = true;
            this.$store.dispatch('clients/getClientLatestTransactions',this.searchQuery)
                .then(res=>this.totalTableData = res.total)
                .catch(err=>this.loadingError=this.$t('cant_load_list'))
                .finally(()=>this.isLoading=false)
        },
        displayDetails(resource)
        {
            this.selectedOrder = resource;
            if(resource && resource.order_status)
            {
                
                this.showOrderDetails = true;
            }
            else
            {
                this.showBankTransactionDetail =  true;
            }
        },
        onOrderDetailsClosed(){
            this.selectedOrder = null;
            this.showOrderDetails = false;
            this.showBankTransactionDetail = false;
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
.orderType {
  white-space: nowrap;
}
.avatar, .avatar img {
  height: 44px;
  width: 44px;
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