<template>
    <modal :show.sync="showPopup"  bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                <h5 class="modal-title" v-if="!hideStaticElements">{{$t('create_new_commission')}}</h5>
                <h5 class="modal-title" v-else>{{$t('edit_commission')}}</h5>
        </template>
        <form>
            <div v-if="!hideStaticElements">
                <div class="mb-3">{{ $t('purchase_information') }}</div>
                <div class="row pl-3" >
                    
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label>{{ $t('customer') }}</label>
                            <Select v-model="selectedCustomer" remote filterable reserve-keyword
                                :placeholder="$t('customer_filter_placeholder')" :loading="loadingCustomers"
                                :remote-method="loadCustomers" @change="customerSelected" @clear="clearCustomer" clearable>
                                <Option v-for="option in customers" :value="option.id" :label="formatClientLabel(option)"
                                    :key="option.id">
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label>{{ $t('depot') }}</label>
                            <Select :placeholder="$t('depots')" v-model="selectedDepots" filterable clearable @clear="clearDepot"
                                :disabled="selectedCustomer == null">
                                <Option v-for="option in depots" :value="option.id" :label="option.name" :key="option.id">
                                </Option>
                            </Select>
                        </div>
                    </div>
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label class="text-nowrap">{{ $t('orders') }} ({{ $t('optional') }})</label>
                        <Select :placeholder="$t('orders')+' ('+$t('optional')+')'" v-model="selectedOrder" filterable clearable @clear="clearOrder"
                            :disabled="selectedDepots == null">
                            <Option v-for="option in orders" :value="option.id" :label="formatOrderLabel(option)" :key="option.id">
                            </Option>
                        </Select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div class="mb-3">{{ $t('commission_information') }}</div>
                <div class="row pl-3">
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label>{{ $t('direction') }}</label>
                    <Select :placeholder="$t('direction')" v-model="selectedDirection">
                        <Option v-for="option in directions" :value="option.name" :label="$t(option.name)" :key="option.id">
                        </Option>
                    </Select>
                </div>
                </div>
                    
                    
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label>{{ $t('reason') }}</label>
                    <Select :placeholder="$t('reason')" v-model="selectedReason">
                        <Option v-for="option in reasons" :value="option.name" :label="$t(option.name)" :key="option.id">
                        </Option>
                    </Select>
                </div>
                
                </div>
                <div class="col-md" v-if="hideStaticElements">
                    <div>
                            <label>{{ $t('rate') }}</label>
                            <Input :placeholder="$t('rate')" v-model="rate" type="number"/>
                        </div>
                </div>
                    <div class="col-md">
                        <div>
                            <label class="text-nowrap">{{$t('target_amount')}}</label>
                        <Input :placeholder="$t('target_amount')" v-model="target_amount" type="number" :disabled="true"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3" v-if="!hideStaticElements">
                <div>{{ $t('sales_advisors') }}</div>
                    <div v-for="(advisor) in advisors" :key="advisor.index" class="pl-3 mt-3 d-flex justify-content-center align-items-center">
                        <AddSaleAdvisorItem  :salesAdvisors="salesAdvisors" :index="advisor.index" 
                        @change="onAdvisorChange" 
                        :totalAmount="remainingAmount"
                        :data="advisor.data"
                        :displayAdd="advisor.index==(advisors.length-1)"
                        @add="addNewSaleAdvisor"
                        @delete="removeSaleAdvisor"
                        />
                        
                    </div>
                    <p class="text-center mt-2 text-danger" v-if="this.remainingAmount>=0">{{ $t('maximum_available_amount') }} {{ $n(this.remainingAmount/100) }} €</p>
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
    Autocomplete,Input,FormItem} from 'element-ui';
import { mapGetters } from "vuex";
import moment from "moment";
import { formatDateToApiFormat } from '../../helpers/helpers';
import AddSaleAdvisorItem from '@/components/SalesCommission/AddSaleAdvisorItem';
import IconButton from '@/components/common/Buttons/IconButton';

export default{
  components: { BaseButton,Form,Select,Option,Input,FormItem,AddSaleAdvisorItem,IconButton },
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
            reasons:[{id:1,name:'new_contract'},{id:2,name:'contract_canceled'},{id:3,name:'contract_data_changed'}],
            selectedReason:null,
            isSubmitting:false,
            hideStaticElements:false,
            advisors:[{index:0,data:{
                sales_advisor_id:-1,
                rate:0,
                target_amount:0,
                amount:0
            }}],
        }
    },
    computed:{
        activateButton(){
            if(!this.oldCommission)
                return (this.target_amount > 0 && this.selectedReason!="" && this.selectedDirection!="" && this.remainingAmount==0)
            else{
                return (this.target_amount > 0 && this.selectedReason!="" && this.selectedDirection!="")
            }
        },
        remainingAmount(){
           
            let sum = 0;
            if(this.advisors.length > 0){
                this.advisors.forEach(element=>{
                    if(element.data && element.data.target_amount>0){
                        sum+=parseInt(element.data.target_amount*100);
                    }
                })
            }
            let amount = (this.target_amount*100) - sum;
            if(amount>=0){
                return amount;
            }
            else{
                return this.target_amount*100
            }
        },
        ...mapGetters("depots", {
            depots: "orderFilterList",

        }),
        ...mapGetters("clients", {
            customers: "orderFilterList",
        }),
        ...mapGetters("salesCommission", {
            salesAdvisors: "salesAdvisors",
        }),
        ...mapGetters("orders", {
            orders: "commissionList",
        }),
        
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
                            this.target_amount = parseFloat(depot.target_amount/100);
                        }
                    }
                    const payload = "per_page=500&depot_id="+this.selectedDepots;
                    this.$store.dispatch('orders/fetchCommissionList',payload);
                }
            },
            immediate:true
        },
        selectedOrder:{
            handler(){
                if(this.selectedOrder)
                {
                    const order = this.orders.find(o=>o.id==this.selectedOrder);
                    if(order){
                        if(parseInt(order.amount)> 0){
                            this.target_amount = parseFloat(order.amount/100);
                        }
                    }
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
            this.advisors = [{index:0,data:{
                sales_advisor_id:-1,
                rate:0,
                target_amount:0,
                amount:0
            }}];
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
            this.target_amount = null;
        },
        formatOrderLabel(order){
            if(order){
                return order.purchase_amount/100 + ' €'
            }
        },
        createNewCommission(){
            if(!this.oldCommission)
            {
                let commissions = [];
                this.advisors.forEach(ad=>{
                    let data ={
                        "reason":this.selectedReason,
                        "direction":this.selectedDirection,
                        "depot_id":this.selectedDepots
                    }
                    if(this.selectedOrder){
                        data.order_id = this.selectedOrder;
                    }
                    if(ad.data.sales_advisor_id>-1 && ad.data.rate>0 && ad.data.amount > 0 && ad.data.target_amount > 0){
                        data.sales_advisor_id = ad.data.sales_advisor_id;
                        data.rate = ad.data.rate;
                        data.amount = ad.data.amount;
                        data.target_amount = ad.data.target_amount*100;
                        commissions.push(data);
                    }
                })
                this.isSubmitting = true;
                commissions.forEach((element,index)=>{
                    this.$store.dispatch('salesCommission/addNew',element).then(res=>{
                        if(index == commissions.length-1)
                        {
                            this.$notify({type: 'success', timeout: 5000, message: this.$t('new_commission_created_successfully')});
                            this.isSubmitting = false;
                            this.onClose();
                        }
                        
                    }).catch(err=>{
                        this.isSubmitting = false;
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('new_commission_created_unsuccessfully')})
                    })
                })
                
            }
            else{
                let data = {
                    "id":this.oldCommission.id,
                    "sales_advisor_id":this.oldCommission.sales_advisor_id,
                    "depot_id":this.oldCommission.depot_id,
                    "amount":this.target_amount*this.rate,
                    "target_amount":this.target_amount*100,
                    "reason":this.selectedReason,
                    "direction":this.selectedDirection
                }
                if(this.oldCommission.order_id){
                    data.order_id = this.oldCommission.order_id;
                }
                if(this.rate){
                    data.rate = this.rate;
                }
                this.isSubmitting = true;
                this.$store.dispatch('salesCommission/edit',data).then(res=>{
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('commission_edited_successfully')});
                    this.onClose();
                }).catch(err=>{
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
                this.rate = this.oldCommission.rate;
                this.amount = this.oldCommission.amount/100;
                this.target_amount = this.oldCommission.target_amount/100;
                this.selectedReason = this.oldCommission.reason;
            }
        },
        addNewSaleAdvisor(index){

            this.advisors.push({index:index+1,data:{
                sales_advisor_id:-1,
                rate:0,
                target_amount:0,
                amount:0
            }})
        },
        removeSaleAdvisor(index){
            for (let i = index; i < this.advisors.length; i++) {
                const element = this.advisors[i];
                element.index --;
            }
            this.advisors.splice(index,1);
        },
        onAdvisorChange(value){
            this.advisors[value.index].data = value.data;
        }
    }
}
</script>