<template>
    <div class="transactions">
        <h4 class="mt-2 ps-2">{{$t('transactions')}}</h4>
        <collapse multipleActive>
            <collapse-item v-for="transaction in order.transactions" :key="transaction.id">
                <template v-slot:title>
                    <h5 class="mb-0">{{$t(transaction.transaction_type.name_translation_key)}}</h5>
                    <div class="me-2 date">{{$d(new Date(transaction.created_at))}}</div> 
                </template>
                <div>
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
    font-size: 12px;
    color: #adb5bd;
}
.transactions  .card {
    margin-bottom: 5px !important;
}
.transactions .card-header  {
    padding: 0.5rem 0.5rem !important;
}
</style>