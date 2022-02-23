<template>
    <div>
        <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="transaction.money_amount/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('agio')" ><div slot="value"> <i18n-n :value="transaction.fee/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('course')"><div slot="value"> <i18n-n :value="transaction.gold_price_trading/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('gold_amount')"><div slot="value">{{getSign()}} <i18n-n :value="transaction.gold_amount/1000"></i18n-n> g</div></detail-list-item>
    </div>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
export default {
    components:{
        DetailListItem
    },
    props:{
        transaction:{
            type:Object
        },
        
    },
    methods:{
        getSign:function(){
            if(this.transaction.transaction_type.name_translation_key=="gold_purchase" || this.transaction.transaction_type.name_translation_key=="gold_transfer_in")
            {
                return "+"
            }
            else
            {
                return "-"
            }
        }
    }
}
</script>
<style scoped>

</style>