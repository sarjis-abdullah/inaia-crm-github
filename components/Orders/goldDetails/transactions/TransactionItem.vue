<template>
    <div>
        <detail-list-item :title="$t('amount')" v-if="showAmount()"><div slot="value"><i18n-n :value="transaction.money_amount/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('agio')" v-if="showAgio()"><div slot="value"><i18n-n :value="transaction.fee/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('course')" v-if="showCourse()"><div slot="value"><i18n-n :value="transaction.gram_price_trading/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('gold_amount')"><div slot="value">{{getSign()}} <i18n-n :value="transaction.gram_amount/1000"></i18n-n> g</div></detail-list-item>
        <detail-list-item :title="$t('depot_balance_before')"><div slot="value"><i18n-n :value="transaction.depot_balance_before/1000"></i18n-n> g</div></detail-list-item>
        <detail-list-item :title="$t('depot_balance_after')"><div slot="value"><i18n-n :value="transaction.depot_balance_after/1000"></i18n-n> g</div></detail-list-item>
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
            if(this.transaction.transaction_type.name_translation_key==("purchase")
              || this.transaction.transaction_type.name_translation_key==("purchase_interval")
              || this.transaction.transaction_type.name_translation_key==("transfer_in")
              || this.transaction.transaction_type.name_translation_key==("gift"))
              return "+";
            else return "-";
        },
        showAmount() {
          if (this.transaction.transaction_type.name_translation_key!=='gift')
            return true;
          else return false;
        },
        showAgio() {
          if (this.transaction.transaction_type.name_translation_key!=='gift')
            return true;
          else return false;
        },
        showCourse() {
          if (this.transaction.transaction_type.name_translation_key!=='gift')
            return true;
          else return false;
        },

    }
}
</script>
<style scoped>

</style>
