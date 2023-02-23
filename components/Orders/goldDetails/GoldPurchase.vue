<template>
  <div>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
        <detail-list-item :title="$t('date')"><div slot="value">{{$d(new Date(order.created_at),'long')}}</div></detail-list-item>
      <detail-list-item :title="$t('depot')"><div slot="value"><nuxt-link :to="'/depots/details/'+order.depot.id">{{order.depot.depot_number}} ({{order.depotName}})</nuxt-link></div></detail-list-item>
        <detail-list-item :title="$t('comment')" v-if="order.comment && order.comment!=''"><div slot="value">{{order.comment}}</div></detail-list-item>
        <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="order.amount/100"></i18n-n> €</div></detail-list-item>
    </div>
    <Transactions v-if="order.transactions && order.transactions.length>0" :order="order"/>
    <PaymentAccount v-if="order.orders_payment_transactions && order.orders_payment_transactions.length>0" :order="order"/>
  </div>
</template>
<script>

import Status from '@/components/Orders/Status';
import DetailListItem from '@/components/common/DetailListItem.vue';
import PaymentAccount from '@/components/Orders/goldDetails/payments/PaymentAccount';
import Transactions from '@/components/Orders/goldDetails/transactions/Transactions';
export default {
    components:{
        DetailListItem,
        Status,
        PaymentAccount,
        Transactions
    },
    props: {
        order: {
            type: Object
        }
    },
}
</script>
<style scoped>

</style>
