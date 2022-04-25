<template>
    <div class="list-group list-group-flush">
        <detail-list-item :title="$t('status')" ><Status slot="value" :status='transaction.status' :lifecycle_status="transaction.lifecycle_status" /></detail-list-item>
        <detail-list-item :title="$t('date')" ><div slot="value" >{{$d(new Date(transaction.applied_date),"short")}}</div></detail-list-item>
        <detail-list-item :title="$t('receiver')" ><div slot="value" >{{transaction.transfer_account_name}}</div></detail-list-item>
        <detail-list-item title="IBAN"><div slot="value" >{{transaction.transfer_account_iban}}</div></detail-list-item>
        <detail-list-item :title="$t('usage')" ><div slot="value" >{{transaction.reason_text}}</div></detail-list-item>
        <detail-list-item :title="$t('amount')"><div slot="value" >{{ transaction.direction == 'DEBIT' ? '-' : '+' }} {{$n(transaction.money_amount/100)}} €</div></detail-list-item>
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
