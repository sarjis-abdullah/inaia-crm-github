<template>
    <div class="selectcontainer d-flex align-items-center justify-content-center">
    <Loader  v-if="loading" :width="10" :height="10"/>
    <text-error :textError="error" v-if="error!='' && !loading"/>
    <Select :placeholder="$t('payment_accounts')"
            v-model="selectedPaymentAccount"
            class="filterElement"
            @change="setPaymentAccount"
            v-if="!loading && error==''">
        <Option v-for="option in paymentAccounts"
                :value="option.id"
                :label="displayPaymentAccountLabel(option)"
                :key="option.id">
        </Option>
    </Select>
    </div>
</template>
<script>
import {Select,Option} from 'element-ui';
import { mapGetters } from "vuex";
import Loader from '@/components/common/Loader/Loader';
import TextError from '../../../common/Errors/TextError.vue';
export default {
    components:{
        Select,
        Option,
        Loader
    ,
        TextError},
    computed :{
        ...mapGetters('payment-accounts',{
            paymentAccounts:'paymentAccounts',
        }),
    },
    props:{
        account_id:{
            type:Number,
        }
    },
    data (){
        return {
            selectedPaymentAccount:null,
            loading:false,
            error:'',
        }
    },
    mounted (){
       
            this.error = '';
            this.loading = true;
            this.$store.dispatch('payment-accounts/getPaymentAccountByUser',this.account_id).then(res=>{
                this.selectedPaymentAccount = res[0].id;
                this.$emit('paymentaccountselected',this.selectedPaymentAccount);
            }).catch(()=>{
                this.error = this.$t('error_loading_payment_accounts');
            }).finally(()=>{
                this.loading = false;
            })
       
        
    },
    methods:{
        displayPaymentAccountLabel:function(paymentAccount)
        {
            if(paymentAccount.payment_method.name_translation_key=="pps")
            {
                return "PPS";
            }
            else
            {
                let bank ="";
                let iban ="";
                paymentAccount.payment_account_specs.forEach(ele=>{
                    if(ele.name=="bank_name")
                    {
                        bank = ele.value
                    }
                    if(ele.name=="iban")
                    {
                        iban = ele.value
                    }
                })
                return bank + " " + iban;

            }
        },
        setPaymentAccount (account)
        {
            this.$emit('paymentaccountselected',account);
        }
    }
}
</script>
<style scoped>
.selectcontainer {
    width: 100%;
    min-height: 40px !important;
}
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