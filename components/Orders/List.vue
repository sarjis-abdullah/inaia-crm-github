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
                        <div class="card-header">
                          <div class="row align-items-center">
                            <div class="col-8">
                              <el-input prefix-icon="el-icon-search" :placeholder="$t('search')" clearable style="width: 200px" v-model="orderId" @change="doSearchById" @clear="clearSearchById"/>
                            </div>
                            <div class="col-4 text-right">
                              <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                                <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                              </button>
                            </div>
                          </div>

                        </div>

                        <OrderFilter v-bind:showFilter="showFilter" v-on:filter='applyFilter' :isDepotSet="isDepotSet"></OrderFilter>

                        <el-table class="table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="data">
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
                                            prop="order_type_id"
                                            min-width="180px"
                                            >
                                <template v-slot="{row}">
                                    <div class="d-flex">
                                        <span href="#!" class="avatar mr-3 removeImageBorder">
                                          <img v-bind:src="row.logo"/>
                                        </span>
                                        <div>
                                          <span class="orderType"><strong>{{row.order_type ? $t(row.order_type.name_translation_key) : row.order_type_id}}</strong></span>
                                          <div class="dateStyle">{{ $d(new Date(row.created_at), 'short') }}</div>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column v-bind:label="$t('depot')"
                                            prop="depotName"
                                            min-width="180"
                                            >
                                            <template v-slot="{row}">
                                                <span>{{row.depotName}}</span>
                                                <div class="dateStyle"># {{row.depot.id}}</div>
                                            </template>
                            </el-table-column>

                            <el-table-column v-bind:label="$t('amount')"
                                            prop="amount"
                                            min-width="100px"
                                            align="right"
                                            sortable>
                                <template v-slot="{row}">
                                    <span class="status" v-if="row.unit === 'gram'">
                                        <i18n-n :value="row.amount/1000"></i18n-n> g
                                    </span>
                                    <span class="status" v-else>
                                        <i18n-n :value="parseInt(row.amount)/100"></i18n-n> €
                                    </span>
                                    <!-- <span class="status">{{row.amount}} {{row.unit}}</span> -->
                                </template>
                            </el-table-column>

                            <el-table-column v-bind:label="$t('status')"
                                            prop="order_status_id"
                                            min-width="140px"
                                            >
                                <template v-slot="{row}">
                                  <Status v-bind:status='row.order_status.name_translation_key'>{{row.order_status ? $t(row.order_status.name_translation_key) : row.order_status_id}}</Status>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="180px" v-bind:label="$t('action')">
                                <template v-slot="{row}">
                                    <icon-button type="info" @click="() => popupDetails(row)"></icon-button>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="card-footer py-4 d-flex justify-content-end">
                            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                        </div>

                        <modal :show.sync="showPopup" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false">
                            <template slot="header" class="pb-0">
                                <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                                <span></span>
                            </template>
                            <div>
                                <Details :resource="selectedResource" v-if="showPopup" :selectedScreen="selectedResourceScreen" @completeDateSelected="setCompleteDate" @completePaymentAccountSelected="setPaymentAccount"/>
                            </div>
                            <template slot="footer">
                                <base-button type="neutral" class="ml-auto" @click="backToDetailScreen()" v-if="selectedResourceScreen==orderDetailsSceens.complete">{{$t('back')}}</base-button>
                                <base-button type="danger" @click="() => removeOrderConfirm(selectedResource)" v-if="selectedResource && shouldDisplayOrderDeleteButton(selectedResource)">{{$t('delete')}}</base-button>
                                <base-button type="danger" @click="() => cancelOrderConfirm(selectedResource)" v-if="selectedResource && shouldDisplayOrderCancelButton(selectedResource)">{{$t('cancel_order')}}</base-button>
                                <base-button type="primary" @click="() => paidOrderConfirm(selectedResource)" v-if="selectedResource && shouldDisplayOrderPaidButton(selectedResource)">{{$t('mark_as_paid')}}</base-button>
                                 <base-button type="primary" @click="() => completeOrder(selectedResource)" v-if="selectedResource && shouldDisplayOrderCompleteButton(selectedResource)" :disabled="shouldDisableCompleteButton()">
                                    <span v-if="selectedResourceScreen==orderDetailsSceens.detail">{{$t('complete')}}</span>
                                    <span v-if="selectedResourceScreen==orderDetailsSceens.complete">{{$t('confirm')}}</span>
                                 </base-button>
                            </template>
                        </modal>

                        <modal :show.sync="showConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">{{$t('confirmation')}}</h5>
                            </template>
                            <div>
                                {{$t('confirm_delete_order')}} "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showConfirm = false">Close</base-button>
                                <base-button type="danger" @click="removeOrder(selectedResource)">Remove</base-button>
                            </template>
                        </modal>

                        <modal :show.sync="showOrderConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">{{$t('confirmation')}}</h5>
                            </template>
                            <div>
                                Are you sure to complete the order with id "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showOrderConfirm = false">Close</base-button>
                                <base-button type="primary" @click="completeOrder(selectedResource)">Complete Order</base-button>
                            </template>
                        </modal>
                        <modal :show.sync="showOrderPaidConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">{{$t('confirmation')}}</h5>
                            </template>
                            <div>
                                {{$t('confirm_paid_order')}} "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showOrderConfirm = false">{{$t('close')}}</base-button>
                                <base-button type="success" @click="markPaidOrder(selectedResource)">{{$t('confirm')}}</base-button>
                            </template>
                        </modal>

                        <modal :show.sync="showOrderCancelConfirm">
                            <template slot="header">
                                <h5 class="modal-title" id="confirmModal">{{$t('confirmation')}}</h5>
                            </template>
                            <div>
                                <select-payment-account :account_id="selectedResource.depot.account_id" 
                                    v-if="selectedResource && isOrderPaid(selectedResource)"
                                    @paymentaccountselected="setCancelPaymentAccount"
                                />
                                {{$t('confirm_cancel_order')}} "{{ selectedResource ? selectedResource.id : '' }}"?
                            </div>
                            <template slot="footer">
                                <base-button type="secondary" @click="showOrderCancelConfirm = false;selectedCancelPaymentAccount=null">{{$t('close')}}</base-button>
                                <base-button type="success" @click="cancelOrder(selectedResource)" :disabled="selectedCancelPaymentAccount==null">{{$t('confirm')}}</base-button>
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
import Status from '@/components/Orders/Status';
import { paddingFractionTo3,paddingFractionTo2 } from '~/helpers/helpers'
import { isOrderPending, isOrderPaid,isOrderPaymentFailed } from '~/helpers/order'
import {BaseButton} from '@/components/argon-core';
import IconButton from '@/components/common/Buttons/IconButton';
import OrderFilter from '@/components/Orders/OrderFilter';
import {orderDetailScreens} from '../../helpers/constans';
import SelectPaymentAccount from './goldDetails/payments/SelectPaymentAccount.vue';
export default {
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Dropdown.name]: Dropdown,
        [DropdownItem.name]: DropdownItem,
        [DropdownMenu.name]: DropdownMenu,
        Details,
        Status,
        IconButton,
        OrderFilter,
        SelectPaymentAccount
    },
    props:{
        isDepotSet:{
            type:Boolean,
            default:false,
        },
        depotSetId:{
            type:Number,
            default:0
        }
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
            selectedResourceScreen:orderDetailScreens.detail,
            showPopup: false,
            showConfirm: false,
            showOrderConfirm: false,
            showOrderCancelConfirm: false,
            showOrderPaidConfirm:false,
            pageTitle: 'Orders',
            perPage: 10,
            page: 1,
            totalTableData: 0,
            sortedBy: { customer: "asc" },
            isLoading:false,
            showFilter: false,
            filterQuery:null,
            orderId:"",
            completeOrderInfo:{date:null,paymentAccount:null},
            selectedCancelPaymentAccount:null
        }
    },
    computed: {
        searchQuery() {
            return (
                (this.search ? '&search=' + this.search : '') +
                `&order_by=${ this.sort }&order_direction=${ this.order }` +
                `&page=${this.page}` +
                `&per_page=${this.perPage}`+(this.filterQuery ? this.filterQuery : '')
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        }
    },
    created (){
        this.orderDetailsSceens = orderDetailScreens;
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
        paddingFractionTo2,
        isOrderPending,
        isOrderPaid,
        doSearchById(value) {
           if(value)
           {
               let query = "&id="+this.orderId;
               if(this.isDepotSet && this.depotSetId!=0)
                {
                    query+='&depot_ids='+this.depotSetId;
                }
               this.$store
                    .dispatch("orders/fetchList", query)
                    .then(response => {
                        this.data = response.data.data

                        this.totalTableData = response.data.meta.total
                    }).catch(() => {
                        this.data = [];
                    })
           }
           else
           {
               this.clearSearchById();
           }

        },
        clearSearchById() {

               this.fetchList(this.searchQuery);
        },
        popupDetails(resource) {
            this.selectedResource   = resource
            this.showPopup          = true
        },
        fetchList(pageQuery) {
            if (!this.initiated) {
                this.initiated  = true
                if(this.isDepotSet && this.depotSetId!=0)
                {
                    if(!pageQuery.includes('&depot_ids='))
                    {
                        pageQuery+='&depot_ids='+this.depotSetId;
                    }
                }
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
        paidOrderConfirm(resource){
            this.selectedResource = resource;
            this.showOrderPaidConfirm = true;
        },
        cancelOrderConfirm(resource) {
            this.selectedResource       = resource
            this.showOrderCancelConfirm = true
        },
        removeOrder(resource) {
            this.showConfirm        = false;
            this.showPopup = false;
            this.$store
                .dispatch('orders/remove', resource.id)
                .then( () => {
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_deleted_successfully')})
                    if (!this.data.length && this.page > 1) {
                        this.page = this.page - 1;
                    } else {
                        this.fetchList(this.searchQuery)
                    }
                }).catch(()=>{this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_deleted_unsuccessfully')})})
        },
        cancelOrder(resource) {
            this.showOrderCancelConfirm = false;
            let data = {
                id:resource.id,
                data:{
                    payment_account_id:this.selectedCancelPaymentAccount
                }
            }
            this.$store
                .dispatch('orders/cancel', data)
                .then( res => {
                    this.showPopup = false;
                    this.selectedCancelPaymentAccount=null;
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('order_canceled_successfully')})
                }).catch(()=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('order_canceled_unsuccessfully')})
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
        toggleFilter: function() {
          this.showFilter=!this.showFilter;
        },
        applyFilter: function(query)
        {
            this.filterQuery = query;
        },
        onOrderDetailScreenChanged (slide)
        {
            this.selectedResourceScreen = slide
        },
        setCompleteDate (date)
        {
            this.completeOrderInfo.date = date;
        },
        onDetailClose ()
        {
            this.selectedResourceScreen = orderDetailScreens.detail;
            this.completeOrderInfo = {date:null,paymentAccount:null};
        },
        setPaymentAccount(account)
        {
            this.completeOrderInfo.paymentAccount = account;
        },
        shouldDisplayOrderDeleteButton(resource)
        {
            if(isOrderPending(resource) || isOrderPaymentFailed(resource))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        shouldDisplayOrderCompleteButton(resource)
        {
            return isOrderPaid(resource);
        },
        completeOrder(resource)
        {
            if(this.selectedResourceScreen == orderDetailScreens.detail)
            {
                this.selectedResourceScreen = orderDetailScreens.complete;
            }
            else
            {
                
                let data = {
                    id:resource.id,
                    data:{price_date:this.completeOrderInfo.date,
                    payment_account_id:this.completeOrderInfo.paymentAccount}
                }
                this.$store
                .dispatch('orders/complete', data)
                .then( res => {
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_completed_successfully')})
                    this.selectedResource = null;
                    this.showPopup = false;

                }).catch(err=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_completed_unsuccessfully')})
                })
            }
            
        },
        markPaidOrder (resource){
            this.$store
                .dispatch('orders/paid', resource.id)
                .then( res => {
                     this.showOrderPaidConfirm = false;
                    this.showPopup = false;
                    
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_paid_successfully')})
                    // console.error('order->', res.data.data)
                }).catch(()=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_paid_unsuccessfully')})
                })
        },
        backToDetailScreen()
        {
            this.selectedResourceScreen = orderDetailScreens.detail;
        },
        shouldDisableCompleteButton(){
            if(this.selectedResourceScreen == orderDetailScreens.complete)
            {
                if(!this.completeOrderInfo || !this.completeOrderInfo.paymentAccount || !this.completeOrderInfo.date)
                {
                    return true;
                }
            }
            return false;
        },
        shouldDisplayOrderCancelButton(resource)
        {
            return isOrderPaid(resource);
        },
        shouldDisplayOrderPaidButton(resource)
        {
            return isOrderPending(resource);
        },
        setCancelPaymentAccount(account)
        {
            this.selectedCancelPaymentAccount = account;
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
