<template>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
        <detail-list-item :title="$t('date')"><div slot="value">{{$d(order.applied_date,'short')}}</div></detail-list-item>
        <detail-list-item :title="$t('depot')"><div slot="value">{{order.depotName}}</div></detail-list-item>
       <detail-list-item :title="$t('gold_amount')" v-if="order.transactions && order.transactions.length>0"><div slot="value"> <i18n-n :value="calculateGoldAmount()"></i18n-n> g</div></detail-list-item>

    </div>
</template>
<script>

import Status from '@/components/Orders/Status';
import DetailListItem from '@/components/common/DetailListItem.vue';
import PaymentMethod from '@/components/Orders/goldDetails/PaymentMethod';
export default {
    components:{
        DetailListItem,
        Status,
        PaymentMethod
    },
    props: {
        order: {
            type: Object
        }
    },
    methods:{

        calculateGoldAmount (){
            if(this.order.transactions)
            {
                if(this.order.transactions.length>0)
                {
                    let tranDetail = this.order.transactions[0];
                    return tranDetail.gold_amount/1000;
                }
            }
        },
    }
}
</script>
<style scoped>

</style>
