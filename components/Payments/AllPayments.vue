<template>
    
</template>
<script>
import {Select,Option} from 'element-ui';
import Loader from '@/components/common/Loader/Loader';
import TextError from '../../../common/Errors/TextError.vue';
import { apiErrorHandler } from '../../../../helpers/apiErrorHandler';
import { mapGetters } from "vuex";
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
        initialValue:{
            type:Number,
            default:-1
        }
    },
    computed:{
        ...mapGetters("payment-accounts", {
            paymentMethods: "paymentMethods",
      }),
    },
    data(){
        return{
            allPaymentOptions:[]
        }
    },
    watch:{
        paymentMethods:{
            handler(){
                this.initData()
            },
            immediate:true
        }
    },
    mounted(){
        if(!this.paymentMethods || this.paymentMethods.length == 0){
            this.$store.dispatch('payment-accounts/getPaymentMethods')
        }
    },
    methods:{
        initData(){
            if(this.paymentMethods && this.paymentMethods.length > 0){
                const paymentAccountIndex = this.paymentMethods.findIndex(x=>x.name_translation_key=='bank_account');
                const paymentTransferIndex = res.data.data.findIndex(x=>x.name_translation_key=='bank_transfer');
                if(paymentTransferIndex > -1){
                    this.allPaymentOptions.push(this.paymentMethods[paymentTransferIndex])
                }
                if(paymentAccountIndex>-1){
                    this.$store.dispatch('payment-accounts/getPaymentAccountByUser',this.account_id).then(res=>{
                        
                    })
                }
            }
        }
    }
}
</script>
