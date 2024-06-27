<template>
    <div>
        <div v-if="!editActive">
            <detail-list-item  :title="$t('payment_method')">
                    <div slot="value">

                            {{$t(paymentMethod)}}
                        </div>
                </detail-list-item>
            <div v-if="paymentMethod=='bank_account'">
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
               <select-payment-account
                    :account_id="account_id"
                    :paymentMethod="paymentMethodName"
                    v-if="shouldDisplayPaymentAccout"
                    @paymentaccountselected="onPaymentAccountSelected"
                    :initialValue="paymentAccountInitialData"
               />
               <el-input :placeholder="$t('reference')" v-model="reference"  class="filterElement" />
            </div>
        </div>
        <div class="mt-3 row d-flex justify-content-center" v-if="(isTheLatest && isEditable) " >
            <base-button type="link" @click="cancelEdit" v-if="editActive">
                {{$t('cancel')}}
            </base-button>
            <base-button type="secondary" @click="editInfo" :disabled="(editActive && selectedPaymentMethod==null) || isSubmitting">
                <span v-if="!editActive  && !failed  ">{{$t('change_payment_method')}}</span>
                <span v-if="editActive">{{$t('save')}}</span>
                
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
import {Select,Option, DatePicker} from 'element-ui';
import SelectPaymentAccount from '@/components/Orders/goldDetails/payments/SelectPaymentAccount.vue';
import moment from "moment"
import { apiErrorHandler } from '@/helpers/apiErrorHandler';
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
    DatePicker
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
        claim:{
            type:Object,
            default:null
        },
        
        paymentMethod:{
            type: String,
            default:'bank_account'
        },
        isTheLatest:{
            type: Boolean,
            default:false
        }
    },
    computed:{
        ...mapGetters('payment-accounts',{
            paymentMethods:'paymentMethods'
        }),
        isFailed(){
            if(this.claim && this.claim.claim_status && this.claim.claim_status.name_translation_key == 'payment_failed'){
                return true;
            }
            else{
                return false;
            }
        },
        
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
            selectedPaymentAccount:null,
            paymentAccountInitialData:-1,
            isSubmitting:false,
            paymentDate : (moment().add(1,'day')).toDate()
        }
    },
   mounted:function(){
    this.initView();

    },
    methods:{
        initView(){
            console.log(this.paymentAccount)
            if(this.paymentAccount && this.paymentAccount.payment_account_specs && this.paymentAccount.payment_account_specs.length>0)
            {

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
        initForm(){
            this.loadindPaymentInformation = true

                this.$store.dispatch('payment-accounts/getPaymentMethods').then(res=>{
                    this.error = "";
                    if(this.paymentAccount){
                        this.selectedPaymentMethod = this.paymentAccount.payment_method.id;
                        this.setPaymentMethod(this.selectedPaymentMethod);
                    }

                }).catch((err)=>{
                    this.error = apiErrorHandler(err,null)
                }).finally(()=>{
                    this.loadindPaymentInformation = false;
                })
        },
        editInfo (){
            if(!this.editActive)
            {
                this.editActive = true;
                this.initForm();
            }
            else{
                let data ={
                    "payment_method": this.paymentMethodName,
                    "claim_type_id": this.claim.claim_type_id,
                }
                if(this.selectedPaymentAccount)
                {
                    data.payment_account_id = this.selectedPaymentAccount;
                }
                if(this.reference)
                {
                    data.comment = this.reference;
                }
                this.isSubmitting = true;
                this.$store.dispatch("claims/updatePaymentMethod",{
                        id:this.claim.id,
                        data:data
                    }).then((res)=>{

                        this.$emit('paymentAccountUpdated',res);
                        this.editActive = false;
                        this.reference = null;

                        this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_payment_changed_successfully')})
                    }).catch((err)=>{
                        apiErrorHandler(err,this.$notify);
                    }).finally(()=>{
                        this.isSubmitting = false;
                    })
            }
        },
        setPaymentMethod(method){
            let pm = this.paymentMethods.find(x=>x.id==method);
            if(pm)
            {
                this.paymentMethodName =pm.name_translation_key;
                if(pm.name_translation_key!='bank_transfer')
                {
                    if(this.paymentAccount)
                    {
                        if(this.paymentAccount.payment_method.id == method)
                        {
                            this.paymentAccountInitialData =  this.paymentAccount.id;
                        }
                        else
                        {
                            this.paymentAccountInitialData = -1;
                        }
                    }

                    this.shouldDisplayPaymentAccout = true;
                }
                else
                {
                    this.selectedPaymentAccount = null;
                    this.shouldDisplayPaymentAccout = false;
                }
            }
        },
        onPaymentAccountSelected(paymentAccount){
            this.selectedPaymentAccount = paymentAccount;
        },
        
        
        cancelEdit (){
            this.editActive = false;
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
