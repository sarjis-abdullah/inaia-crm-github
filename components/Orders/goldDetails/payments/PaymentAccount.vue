<template>
    <div class="payment">
        <h4 class="mt-2 ps-2">{{$t('payments')}}</h4>
        <collapse multipleActive>
            <collapse-item v-for="account in paymentAccounts" :key="account.id">
                <template v-slot:title>
                    <h5 class="mb-0">{{$n(account.amount/100)}} €</h5>
                    <div class="d-inline-flex flex-row align-items-center"> 
                        <div class="me-2 date">{{$d(new Date(account.updated_at))}}</div> 
                        <Badge type="danger" v-if="account.status.name_translation_key=='failed'" >{{$t(account.status.name_translation_key)}}</Badge>
                        <Badge type="secondary" v-if="account.status.name_translation_key=='pending'" >{{$t(account.status.name_translation_key)}}</Badge>
                        <Badge type="warning" v-if="account.status.name_translation_key=='rejected'" >{{$t(account.status.name_translation_key)}}</Badge>
                    </div>
                </template>
                <div>
                    <PaymentAccountItem :paymentAccount="account.payment_account"/>
                </div>
            </collapse-item>
        </collapse>
    </div>
</template>
<script>
import Collapse from '@/components/argon-core/Collapse/Collapse';
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem';
import PaymentAccountItem from '@/components/Orders/goldDetails/payments/PaymentAccountItem';
import {Badge} from '@/components/argon-core';
export default {
    components:{
        Collapse,
        CollapseItem,
        Badge,
        PaymentAccountItem
    },
    props:{
        order:{
            type:Object
        }
    },
    data:function()
    {
        return {
            paymentAccounts:[],
            loading:false
        }
    },
    mounted:function()
    {
        if(this.order.orders_payment_transactions && this.order.orders_payment_transactions.length>0)
        {
            this.order.orders_payment_transactions.forEach(trans=>{
                this.$store.dispatch('orders/getPaymentMethod',trans.id).then(res=>{
                console.log(res);
                this.paymentAccounts.push(res);
            }).finally(()=>{
                this.loading = false;
            })
            })
        }
    }
}
</script>
<style scoped>
.date {
    font-size: 12px;
    color: #adb5bd;
}
.payment  .card {
    margin-bottom: 5px !important;
}
.payment .card-header  {
    padding: 0.5rem 0.5rem !important;
}
</style>