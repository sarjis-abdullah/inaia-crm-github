<template>
  <div>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
        <detail-list-item :title="$t('date')"><div slot="value">{{$d(new Date(order.created_at),'short')}}</div></detail-list-item>
        <detail-list-item :title="$t('depot')"><div slot="value">{{order.depotName}}</div></detail-list-item>
    </div>
    <Transactions v-if="order.transactions && order.transactions.length>0" :order="order"/>
  </div>
</template>
<script>

import Status from '@/components/Orders/Status';
import DetailListItem from '@/components/common/DetailListItem.vue';
import Transactions from '@/components/Orders/goldDetails/transactions/Transactions';
export default {
    components:{
        DetailListItem,
        Status,
        Transactions
    },
    props: {
        order: {
            type: Object
        }
    }
}
</script>
<style scoped>

</style>
