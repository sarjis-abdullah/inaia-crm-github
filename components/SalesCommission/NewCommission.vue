<template>
    <modal :show.sync="showPopup"  bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                <h5 class="modal-title" v-if="!hideStaticElements">{{$t('create_new_commission')}}</h5>
                <h5 class="modal-title" v-else>{{$t('edit_commission')}}</h5>
        </template>
        <form>
            <div class="row" v-if="!hideStaticElements">
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select v-model="selectedCustomer" remote filterable reserve-keyword
                        :placeholder="$t('customer_filter_placeholder')" :loading="loadingCustomers"
                        :remote-method="loadCustomers" @change="customerSelected" @clear="clearCustomer" clearable>
                        <Option v-for="option in customers" :value="option.id" :label="formatClientLabel(option)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('depots')" v-model="selectedDepots" filterable clearable @clear="clearDepot"
                        :disabled="selectedCustomer == null">
                        <Option v-for="option in depots" :value="option.id" :label="option.name" :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('orders')+' (optional)'" v-model="selectedOrder" filterable clearable @clear="clearOrder"
                        :disabled="selectedDepots == null">
                        <Option v-for="option in orders" :value="option.id" :label="formatOrderLabel(option)" :key="option.id">
                        </Option>
                    </Select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md">
                    <Input :placeholder="$t('rate')" v-model="rate" type="number"/>
                </div>
                <div class="col-md">
                    <Input :placeholder="$t('amount')" v-model="amount" type="number"/>
                </div>
                <div class="col-md">
                    <Input :placeholder="$t('target_amount')" v-model="target_amount" type="number"/>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-md d-flex flex-row justify-content-center" v-if="salesAdvisorId == -1 && !hideStaticElements">
                    <Select :placeholder="$t('sales_advisors')" v-model="selectedAdvisor" filterable clearable
                        @clear="clearAdvisor">
                        <Option v-for="option in salesAdvisors" :value="option.id" :label="formatClientLabel(option)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('direction')" v-model="selectedDirection">
                        <Option v-for="option in directions" :value="option.name" :label="$t(option.name)" :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('reason')" v-model="selectedReason">
                        <Option v-for="option in reasons" :value="option.name" :label="$t(option.name)" :key="option.id">
                        </Option>
                    </Select>
                </div>
            </div>
        </form>
        <template slot="footer">
            <base-button type="link" @click="onClose" >{{$t('cancel')}}</base-button>
            <base-button type="primary" class="ml-auto" :disabled="isSubmitting || !activateButton" @click="createNewCommission">{{$t('save')}}</base-button>
        </template>
    </modal>
</template>
<script>
import BaseButton from '../argon-core/BaseButton.vue';
import {Form,Select,
    Option,
    Autocomplete,Input} from 'element-ui';
import { mapGetters } from "vuex";
import moment from "moment";
import { formatDateToApiFormat } from '../../helpers/helpers';
export default{
  components: { BaseButton,Form,Select,Option,Input },
    props:{
        showPopup:{
            type:Boolean,
            default:false
        },
        salesAdvisorId:{
            type:Number,
            default:-1
        },
        oldCommission:{
            type:Object,
            default:null,
        }
    },
    mounted(){
        if (this.salesAdvisors.length == 0 && this.salesAdvisorId==-1) {
            this.$store.dispatch("salesCommission/fetchSalesAdvisors")
        }
        if(this.status.length == 0){
            this.$store.dispatch("orderStatus/fetchList", "");
        }
        if(this.types.length == 0){
            this.$store.dispatch("orderTypes/fetchOrderFilterList", "");
        }
        
    },
    data(){
        return {
            selectedCustomer: null,
            loadingCustomers: false,
            lastRequest: null,
            timer: null,
            customerQuery: "",
            selectedDepots: null,
            selectedAdvisor: null,
            selectedOrder:null,
            amount:null,
            target_amount:null,
            rate:null,
            directions:[{id:1,name:'credit'},{id:2,name:'debit'}],
            selectedDirection:null,
            reasons:[{id:1,name:'new_contract'},{id:2,name:'contract_canceled'}],
            selectedReason:null,
            isSubmitting:false,
            hideStaticElements:false
        }
    },
    computed:{
        ...mapGetters("depots", {
            depots: "orderFilterList",
        }),
        ...mapGetters("clients", {
            customers: "orderFilterList",
        }),
        ...mapGetters("salesCommission", {
            salesAdvisors: "salesAdvisors",
        }),
        ...mapGetters("orderStatus", {
            status: "list",
        }),
        ...mapGetters("orderTypes", {
            types: "orderFilterList",
        }),
        ...mapGetters("orders", {
            orders: "list",
        }),
        activateButton(){
            let shouldActivate = false;
            if(this.salesAdvisorId>-1 && this.selectedDepots && this.amount > 0 && this.target_amount > 0 && this.selectedReason!="" && this.selectedDirection!="" ){
                shouldActivate = true;
            }
            return true;
        }
    },
    watch: {
        selectedCustomer: {
            handler() {
                if (this.selectedCustomer != null) {
                    this.selectedDepots = null;
                    this.$store
                        .dispatch("depots/fetchDepotsByAccount", this.selectedCustomer);
                }
            },
            immediate: true,
        },
        selectedDepots:{
            handler() {
                if(this.selectedDepots){
                    const depot = this.depots.find(d=>d.id==this.selectedDepots);
                    if(depot){
                        if(parseInt(depot.target_amount) > 0){
                            this.target_amount = parseInt(depot.target_amount)/100
                        }
                    }
                    const stat = this.status.find(s=>s.name_translation_key.indexOf('completed')!=-1);
                    const types = this.types.filter(t=>(t.name_translation_key.indexOf('purchase')!=-1 && t.name_translation_key.indexOf('interval')==-1));
                    const typesIds = types.map(t=>t.id);
                    const payload = "per_page=100&depot_ids="+this.selectedDepots+
                    "&order_type_ids="+typesIds.join(',')+
                    "&order_status_ids="+stat.id;
                    this.$store.dispatch('orders/fetchList',payload);
                }
            },
            immediate:true
        },
        oldCommission:{
            handler(){
                this._initOldCommission()
            },
            immediate:true
        }
    },
    methods:{
        onClose(){
            this.selectedAdvisor = null;
            this.selectedCustomer = null;
            this.selectedDepots = null;
            this.selectedOrder = null;
            this.target_amount = null;
            this.amount = null;
            this.selectedDirection = null;
            this.selectedReason = null;
            this.rate = null;
            this.hideStaticElements=false;
            this.$emit('closed');
        },
        loadCustomers: function (query) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (query.length >= 3) {
                let update = true;
                this.customerQuery = query;
                if (this.lastRequest != null) {
                    let now = moment();
                    if (now.diff(this.lastRequest, "second") < 2) {
                        update = false;
                    }
                }
                if (update) {
                    this._getClients();
                } else {
                    this.timer = setTimeout(this._getClients, 1000);
                }
            } else {
                this.$store.commit("clients/orderFilterList", []);
                this.customerQuery = "";
            }
        },
        _getClients() {
            this.loadingCustomers = true;
            this.lastRequest = moment();
            this.$store
                .dispatch("clients/getClientListBySurname", this.customerQuery)
                .then(() => { })
                .finally(() => {
                    this.loadingCustomers = false;
                });
        },
        formatClientLabel: function (client) {
            if (client) {
                let email = null;
                if (client.contact.channels) {
                    client.contact.channels.forEach((element) => {
                        if (element.type == "email") {
                            email = element.value;
                        }
                    });
                }
                let label =
                    client.contact.name + " " + client.contact.person_data.surname;
                if (email) {
                    label += ` (${email})`;
                }
                return label;
            }
        },
        clearCustomer(){
            this.selectedCustomer = null;
            this.selectedDepots = null;
            this.selectedOrder = null;
            this.target_amount = null;
        },
        clearDepot(){
            this.selectedDepots = null;
            this.selectedOrder = null;
            this.target_amount = null;
        },
        clearOrder(){
            this.selectedOrder = null;
        },
        clearAdvisor(){
            this.selectedAdvisor = null;
        },
        formatOrderLabel(order){
            if(order){
                return order.purchase_amount/100 + ' €'
            }
        },
        createNewCommission(){
            if(!this.oldCommission)
            {
                let data = {
                    "sales_advisor_id":this.salesAdvisorId>-1?this.salesAdvisorId:this.selectedAdvisor,
                    "depot_id":this.selectedDepots,
                    "amount":this.amount*100,
                    "target_amount":this.target_amount*100,
                    "reason":this.selectedReason,
                    "direction":this.selectedDirection
                }
                if(this.selectedOrder){
                    data.order_id = this.selectedOrder;
                }
                if(this.rate){
                    data.rate = this.rate*100;
                }
                this.isSubmitting = true;
                this.$store.dispatch('salesCommission/addNew',data).then(res=>{
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('new_commission_created_successfully')});
                    this.onClose();
                }).catch(err=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('new_commission_created_unsuccessfully')})
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
            else{
                let data = {
                    "id":this.oldCommission.id,
                    "sales_advisor_id":this.oldCommission.sales_advisor_id,
                    "depot_id":this.oldCommission.depot_id,
                    "amount":this.amount*100,
                    "target_amount":this.target_amount*100,
                    "reason":this.selectedReason,
                    "direction":this.selectedDirection
                }
                if(this.oldCommission.order_id){
                    data.order_id = this.oldCommission.order_id;
                }
                if(this.rate){
                    data.rate = this.rate*100;
                }
                this.isSubmitting = true;
                this.$store.dispatch('salesCommission/edit',data).then(res=>{
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('commission_edited_successfully')});
                    this.onClose();
                }).catch(err=>{
                    console.error(err);
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('commission_edited_unsuccessfully')})
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
            
        },
        _initOldCommission(){
            if(this.oldCommission){
                this.hideStaticElements = true;
                this.selectedDirection = this.oldCommission.direction;
                this.rate = this.oldCommission.rate/100;
                this.amount = this.oldCommission.amount/100;
                this.target_amount = this.oldCommission.target_amount/100;
                this.selectedReason = this.oldCommission.reason;
            }
        }
    }
}
</script>