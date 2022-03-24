<template>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
        <detail-list-item :title="$t('date')"><div slot="value">{{$d(new Date(order.created_at),'long')}}</div></detail-list-item>
        <detail-list-item :title="$t('depot')"><div slot="value"><nuxt-link :to="'/depots/details/'+order.depot.id">{{order.depot.depot_number}} ({{order.depotName}})</nuxt-link></div></detail-list-item>
        <detail-list-item :title="$t('gold_amount')"><div slot="value"> <i18n-n :value="order.amount/1000"></i18n-n> g</div></detail-list-item>

        <Transactions v-if="order.transactions && order.transactions.length>0" :order="order"/>
        <PaymentAccount v-if="order.orders_payment_transactions && order.orders_payment_transactions.length>0" :order="order"/>
         <h4 class="mt-4 text-center" v-if="order.order_shipping_details">{{$t('shipping_details')}}</h4>
         <collapse multipleActive v-if="order.order_shipping_details">
            <collapse-item>
                <template v-slot:title>
                    <h5 class="type">{{$t('shipping_details')}}</h5>
                </template>
                <div class="list-group list-group-flush">
                    <ShipmentDetails  :shippmentDetails="order.order_shipping_details" :isNew="false" :order_id="order.id"/>
                </div>
            </collapse-item>
        </collapse>   
        
    </div>
</template>
<script>

import Status from '@/components/Orders/Status';
import DetailListItem from '@/components/common/DetailListItem.vue';
import PaymentAccount from '@/components/Orders/goldDetails/payments/PaymentAccount';
import Transactions from '@/components/Orders/goldDetails/transactions/Transactions';
import ShipmentDetails from '@/components/Orders/goldDetails/ShipmentDetails';
import Collapse from '@/components/argon-core/Collapse/Collapse';
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem';
export default {
    components:{
        DetailListItem,
        Status,
        PaymentAccount,
        Transactions,
        ShipmentDetails,
        Collapse,
        CollapseItem
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
