<template>
    <div>
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
    </div>
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
        paymentAccount: {
            type: Object
        }
    },
    data: function(){
        return {
            iban:"",
            bank:""
        }
    },
   mounted:function(){
        if(this.paymentAccount.payment_account_specs && this.paymentAccount.payment_account_specs.length>0)
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
            })
        }
    }
}
</script>
<style scoped>

</style>