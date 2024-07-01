<template>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" :status='transaction.status' :lifecycle_status="transaction.lifecycle_status" /></detail-list-item>
        <detail-list-item :title="$t('date')" ><div slot="value" >{{$d(new Date(transaction.applied_date),"short")}}</div></detail-list-item>
        <detail-list-item :title="$t('reference')" ><div slot="value" >{{transaction.reference_id}}</div></detail-list-item>
        <detail-list-item :title="$t('card_acceptor')" v-if="transaction.card_acceptor"><div slot="value" >{{transaction.card_acceptor}}</div></detail-list-item>
        <detail-list-item :title="$t('usage')" ><div slot="value" >{{transaction.reason_text}}</div></detail-list-item>
        <detail-list-item :title="$t('amount')"><div slot="value" >{{ transaction.direction == 'DEBIT' ? '-' : '+' }} {{$n(transaction.money_amount/100)}}  {{ transaction.currency }}</div></detail-list-item>
    </div>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import Status from '@/components/Banking/TransactionStatus';
export default ({
    components:{
        DetailListItem,
        Status
    },
    props:{
        transaction:{
            type:Object,
            default:null
        }
    }
})
</script>
