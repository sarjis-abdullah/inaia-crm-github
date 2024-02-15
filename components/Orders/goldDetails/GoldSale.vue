<template>
  <div>
    <div class="list-group list-group-flush">
      <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
      <detail-list-item :title="$t('id')"><div slot="value">{{ order.id }}</div></detail-list-item>
      <detail-list-item :title="$t('proceeds')"><div slot="value"> <i18n-n :value="order.amount/1000"></i18n-n> g</div></detail-list-item>
      
      <detail-list-item v-if="order && order.depot" :title="$t('customer')"><UserInfo :accountId="order.depot.account_id" slot="value"></UserInfo></detail-list-item>
      <detail-list-item :title="$t('created_by')"><UserInfo :accountId="order.created_by" slot="value" :isLazy="true"/></detail-list-item>
        <detail-list-item :title="$t('updated_by')"><UserInfo :accountId="order.updated_by" slot="value" :isLazy="true"/></detail-list-item>
      <detail-list-item :title="$t('depot')"><div slot="value"><nuxt-link :to="'/depots/details/'+order.depot.id">{{order.depot.depot_number}} ({{order.depotName}})</nuxt-link></div></detail-list-item>
      <detail-list-item :title="$t('proceeds')"><div slot="value"> <i18n-n :value="order.amount/1000"></i18n-n> g</div></detail-list-item>
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
import { isOrderPending } from '~/helpers/order'
import UserInfo from '@/components/Contacts/UserInfo';
export default {
    components:{
        DetailListItem,
        Status,
        PaymentAccount,
        Transactions,
        UserInfo
    },
    props: {
        order: {
            type: Object
        }
    },
    methods:{
      isOrderPending
    },
  beforeMount() {

  }


}
</script>
<style scoped>

</style>
