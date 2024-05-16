<template>
  <div>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" v-bind:status='order.order_status.name_translation_key'>{{order.order_status ? $t(order.order_status.name_translation_key) : order.order_status_id}}</Status></detail-list-item>
        <detail-list-item :title="$t('id')"><div slot="value">{{ order.id }}</div></detail-list-item>
        <detail-list-item :title="$t('date')"><div slot="value">{{$d(new Date(order.created_at),'long')}}</div></detail-list-item>
        <detail-list-item :title="$t('batch_orders')" v-if="order.order_process_id"><div slot="value">
                        <nuxt-link :to="'/orders/batch-processing/details/'+order.order_process_id">{{
                    order.order_process_id
                  }}</nuxt-link>
                    </div></detail-list-item>
        <detail-list-item v-if="order && order.depot" :title="$t('customer')"><UserInfo :accountId="order.depot.account_id" slot="value"></UserInfo></detail-list-item>
        <detail-list-item :title="$t('created_by')"><UserInfo :accountId="order.created_by" slot="value" :isLazy="true"/></detail-list-item>
        <detail-list-item :title="$t('updated_by')"><UserInfo :accountId="order.updated_by" slot="value" :isLazy="true"/></detail-list-item>
        <detail-list-item :title="$t('depot')"><div slot="value"><nuxt-link :to="'/depots/details/'+order.depot.id">{{order.depot.depot_number}} ({{order.depotName}})</nuxt-link></div></detail-list-item>
        <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="displayAmount()/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('purchase_amount')" v-if="order.purchase_amount && order.purchase_amount>0"><div slot="value">{{ $n(order.purchase_amount/100) }} €</div></detail-list-item>
        <detail-list-item :title="$t('agio')" v-if="order &&
            order.order_status &&
            order.agio_amount>0"><div slot="value"> <i18n-n :value="order.agio_amount/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('storage_fee')" v-if="order.storage_fee && order.storage_fee>0"><div slot="value"><i18n-n :value="order.storage_fee/100"></i18n-n> €</div></detail-list-item>
        <detail-list-item :title="$t('comment')" v-if="order.comment && order.comment!=''"><div slot="value">{{order.comment}}</div></detail-list-item>
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
    mounted(){
        console.log()
    },
    methods:{
      displayAmount(){
        /*
        if(this.order.order_status && this.order.order_status.name_translation_key=='order_status_completed'){
            if(this.order.order_type && this.order.order_type.name_translation_key.includes('interval')){
                return this.order.amount;
            }
            else{
                if(this.order.transactions && this.order.transactions.length > 0){
                    const latestTran = this.order.transactions[this.order.transactions.length-1];
                    if(latestTran){
                        return latestTran.money_amount;
                    }
                }
            }
        }
        */
        return this.order.amount;

   },
    }
}
</script>
<style scoped>

</style>
