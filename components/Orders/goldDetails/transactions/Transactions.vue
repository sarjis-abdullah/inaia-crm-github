<template>
    <div class="transactions">
        <h4 class="mt-4 text-center">{{$t('transactions')}}</h4>
        <collapse multipleActive>
            <collapse-item v-for="transaction in order.transactions" :key="transaction.id">
                <template v-slot:title>
                  <div class="d-flex align-items-center">
                    <div class="date mr-4">{{$d(new Date(transaction.gram_price_date?transaction.gram_price_date:transaction.created_at))}}</div>
                    <div class="type mb-0">{{$t(transaction.transaction_type.name_translation_key)}}</div>
                  </div>
                </template>
                <div class="list-group list-group-flush">
                   <TransactionItem :transaction="transaction"/>
                </div>
            </collapse-item>
        </collapse>
    </div>
</template>
<script>
import Collapse from '@/components/argon-core/Collapse/Collapse';
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem';
import TransactionItem from '@/components/Orders/goldDetails/transactions/TransactionItem'
export default {
    components:{
        Collapse,
        CollapseItem,
        TransactionItem
    },
    props:{
        order:{
            type:Object
        }
    },
    data:function()
    {
        return {

        }
    }
}
</script>
<style scoped>
.date {
  width: 65px;
  color: #adb5bd;
}
.type {
  font-weight: bold;
  color:#525f7f;
}
.transactions .card {
    margin-bottom: 5px !important;
}
.transactions .card-header  {
    padding: 0.25rem 0.25rem !important;
}
</style>
