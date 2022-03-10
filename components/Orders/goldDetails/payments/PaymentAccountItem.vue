<template>
    <div>
        <div v-if="!editActive">
            <detail-list-item  :title="$t('bank')">
                <div slot="value">
                    
                        {{bank}}
                    </div>
            </detail-list-item>
            <detail-list-item :title="$t('iban')">
                <div slot="value">
                    
                        {{iban}}
                    </div>
            </detail-list-item>
            <detail-list-item :title="$t('account_holder')">
                <div slot="value">
                    
                        {{accountHolder}}
                    </div>
            </detail-list-item>
        </div>
        <div v-if="editActive">
            <div class="mt-3 row d-flex justify-content-center" v-if="loadindPaymentInformation">
                <loader/>
            </div>
            <div class="mt-3 row d-flex justify-content-center" v-if="!loadindPaymentInformation && error!=''">
                <text-error :textError="error"/>
            </div>
            <div class="mt-3 row d-flex justify-content-center" v-if="!loadindPaymentInformation && error==''">
                <Select :placeholder="$t('payment_accounts')"
                        v-model="selectedPaymentMethod"
                        class="filterElement"
                        @change="setPaymentMethod"
                        >
                    <Option v-for="option in paymentMethods"
                            :value="option.id"
                            :label="$t(option.name_translation_key)"
                            :key="option.id">
                    </Option>
                </Select>
               <select-payment-account :account_id="account_id" :paymentMethod="paymentMethodName" v-if="shouldDisplayPaymentAccout" @paymentaccountselected="onPaymentAccountSelected"/>
               <el-input :placeholder="$t('reference')" v-model="reference"  class="filterElement"/>
            </div>
        </div>
        <div class="mt-3 row d-flex justify-content-center" v-if="isEditable" >
            <base-button type="secondary" @click="editInfo" :disabled="editActive && selectedPaymentMethod==null">
                <span v-if="!editActive">{{$t('edit_info')}}</span>
                <span v-if="editActive">{{$t('save')}}</span>
            </base-button>
            <base-button type="secondary" @click="executePayment" v-if="shouldDisplayExecutePayment()">
                <span>{{$t('execute_payment')}}</span>
            </base-button>
        </div>
    </div>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import BaseButton from '@/components/argon-core/BaseButton.vue';
import Loader from '@/components/common/Loader/Loader';
import TextError from '@/components/common/Errors/TextError.vue';
import { mapGetters } from "vuex";
import {Select,Option} from 'element-ui';
import SelectPaymentAccount from './SelectPaymentAccount.vue';
import { isOrderPending,isOrderPaymentFailed} from '~/helpers/order';
export default {
    name:'payment-method',
    components:{
        DetailListItem,
        BaseButton,
        Loader,
        TextError,
        Select,
        Option,
        SelectPaymentAccount,
        
    },
    props: {
        paymentAccount: {
            type: Object
        },
        isEditable:{
            type:Boolean,
            default:false
        },
        account_id:{
            type:Number,
            default:-1
        },
        order:{
            type:Object,
            default:null
        }
    },
    computed:{
        ...mapGetters('payment-accounts',{
            paymentMethods:'paymentMethods'
        })
    },
    data: function(){
        return {
            iban:"",
            bank:"",
            accountHolder:"",
            editActive:false,
            loadindPaymentInformation:false,
            error:"",
            selectedPaymentMethod:null,
            shouldDisplayPaymentAccout:false,
            paymentMethodName:'',
            reference:null,
            selectedPaymentAccount:null
        }
    },
   mounted:function(){
        if(this.paymentAccount.payment_account_specs && this.paymentAccount.payment_account_specs.length>0)
        {
        
            console.log(this.paymentAccount);
            this.paymentAccount.payment_account_specs.forEach((element)=>{
                if(element.name == 'bank_name')
                {
                    this.bank = element.value;
                }
                if(element.name == 'iban')
                {
                    this.iban = element.value;
                }
                if(element.name == 'account_holder')
                {
                    this.accountHolder = element.value;
                }
            })
        }
    },
    methods:{
        editInfo (){
            if(!this.editActive)
            {
                this.editActive = true;
                this.loadindPaymentInformation = true

                this.$store.dispatch('payment-accounts/getPaymentMethods').then(res=>{
                    this.error = "";

                }).catch(()=>{
                    this.error = this.$t('error_loading_payment_accounts');
                }).finally(()=>{
                    this.loadindPaymentInformation = false;
                })
            }
            else{
                let data ={
                    "payment_method": this.paymentMethodName,
                    "payment_method_id": this.selectedPaymentMethod,
                }
                if(this.selectedPaymentAccount)
                {
                    data.payment_account_id = this.selectedPaymentAccount;
                }
                if(this.reference!='')
                {
                    data.reference_data = reference;
                }
                this.$store.dispatch("orders/updatePaymentMethod",{
                    id:this.order.id,
                    data:data
                }).then(()=>{
                    this.editActive = false;
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_payment_changed_successfully')})
                }).catch((err)=>{
                    console.log(err);
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_payment_changed_unsuccessfully')})
                })
            }
        },
        setPaymentMethod(method){
            let pm = this.paymentMethods.find(x=>x.id==method);
            if(pm && pm.name_translation_key!='bank_transfer')
            {
                this.paymentMethodName =pm.name_translation_key;
                this.shouldDisplayPaymentAccout = true;
            }
            else
            {
                this.selectedPaymentAccount = null;
                this.shouldDisplayPaymentAccout = false;
            }
        },
        onPaymentAccountSelected(paymentAccount){
            this.selectedPaymentAccount = paymentAccount;
        },
        shouldDisplayExecutePayment(){
            return (isOrderPending(this.order) || isOrderPaymentFailed(this.order)) && (this.paymentAccount.payment_method.name_translation_key=="pps")
        },
        executePayment(){
            this.$store.dispatch('orders/retryPayment',this.order.id).then((res)=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('payment_initiated_successfully')})
            }).catch((err)=>{
                this.$notify({type: 'danger', timeout: 5000, message: this.$t('payment_initiated_unsuccessfully')})
            })
        }
    }
}
</script>
<style scoped>
.filterElement {
  margin-bottom: 15px;
  margin-top: 15px;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.filterElement input {

    height: 40px !important;
    line-height: 40px !important;
    font-size: 0.875rem;
}
</style>