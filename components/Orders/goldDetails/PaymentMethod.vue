<template>
    <detail-list-item v-if="order && order.orders_payment_transactions" :title="$t('paymentMethods')">
        <div v-if="loading" slot="value">{{$t('loading')}}...</div>
        <div v-if="!loading" slot="value">
            <div>
                {{bank}}
            </div>
            <div>
                {{iban}}
            </div>
        </div>
    </detail-list-item>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
export default {
    name:'payment-method',
    components:{
        DetailListItem
        ,
    },
    props: {
        order: {
            type: Object
        }
    },
    data: function(){
        return {
            loading:false,
            paymentMethod:null,
            iban:"",
            bank:""
        }
    },
   mounted:function(){
        if(this.order.orders_payment_transactions && this.order.orders_payment_transactions.length>0)
        {
            let payment = this.order.orders_payment_transactions[0];
            this.loading = true
            this.$store.dispatch('orders/getPaymentMethod',payment.id).then(res=>{
                let details = res;
                this.paymentMethod = details.payment_account;
                console.log(details);
                if(details.payment_account)
                {
                    if(details.payment_account.payment_account_specs && details.payment_account.payment_account_specs.length>0)
                    {
                    
                        details.payment_account.payment_account_specs.forEach((element)=>{
                            if(element.name == 'bank_name')
                            {
                                this.bank = element.value;
                            }
                            if(element.name == 'iban')
                            {
                                this.iban = element.value;
                            }
                        })
                    }
                }
            }).finally(()=>{
                this.loading = false;
            })
        }
    }
}
</script>
<style scoped>

</style>