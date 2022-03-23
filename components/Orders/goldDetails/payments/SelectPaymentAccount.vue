<template>
    <div class="d-flex align-items-center justify-content-center w-100">
      <Loader v-if="loading" :width="20" :height="20" />
      <text-error :textError="error" v-if="error!='' && !loading"/>
      <Select :placeholder="$t('payment_accounts')"
              v-model="selectedPaymentAccount"
              class="w-100"
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
import Loader from '@/components/common/Loader/Loader';
import TextError from '../../../common/Errors/TextError.vue';
export default {
    components:{
        Select,
        Option,
        Loader
    ,
        TextError},

    props:{
        account_id:{
            type:Number,
        },
        paymentMethod:{
            type:String,
            default:''
        },
        initialValue:{
            type:Number,
            default:-1
        }
    },
    data (){
        return {
            selectedPaymentAccount:null,
            loading:false,
            error:'',
            paymentAccounts:[]
        }
    },
    watch:{
    paymentMethod:{
      handler() {
        this.initData();
      },
      immediate: true,
    }
  },
    mounted (){
       //this.initData();
    },
    methods:{
        displayPaymentAccountLabel:function(paymentAccount)
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
        },
        setPaymentAccount (account)
        {
            this.$emit('paymentaccountselected',account);
        },
        initData(){
            this.error = '';
            this.loading = true;
            this.paymentAccounts=[];
            this.$store.dispatch('payment-accounts/getPaymentAccountByUser',this.account_id).then(res=>{
                if(this.paymentMethod=='')
                {
                    this.paymentAccounts = res;
                }
                else
                {
                    
                    res.forEach(el=>{
                        if(el.payment_method.name_translation_key==this.paymentMethod)
                        {
                            this.paymentAccounts.push(el);
                        }
                    })
                }
                if(this.initialValue!=-1)
                {
                    this.selectedPaymentAccount = this.initialValue;
                }
                else
                {
                    this.selectedPaymentAccount = this.paymentAccounts[0].id;
                }
                this.$emit('paymentaccountselected',this.selectedPaymentAccount);
            }).catch(()=>{
                this.error = this.$t('error_loading_payment_accounts');
            }).finally(()=>{
                this.loading = false;
            })
        }
    }
}
</script>
<style scoped>

</style>
