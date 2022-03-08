<template>
    <div class="payments">
        <h4 class="mt-4 text-center">{{$t('payments')}}</h4>
        <collapse multipleActive>
            <collapse-item v-for="account in paymentAccounts" :key="account.id">
                <template v-slot:title>
                    <div class="d-flex align-items-center">
                        <div class="date mr-4">{{$d(new Date(account.updated_at))}}</div>
                        <div class="d-flex align-items-center">
                          <div class="amount mb-0 mr-2">{{$n(account.amount/100)}} €</div>
                          <div>
                            <Badge type="danger" v-if="account.status.name_translation_key=='failed'" >{{$t(account.status.name_translation_key)}}</Badge>
                            <Badge type="secondary" v-if="account.status.name_translation_key=='pending'" >{{$t(account.status.name_translation_key)}}</Badge>
                            <Badge type="warning" v-if="account.status.name_translation_key=='rejected'" >{{$t(account.status.name_translation_key)}}</Badge>
                          </div>
                        </div>
                    </div>
                </template>
                <div class="list-group list-group-flush">
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
import { isOrderPending} from '~/helpers/order'
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
            loading:false,
            activateEdit:false,
            activeIndex:-1
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
                if(isOrderPending(this.order))
                {
                    this.activateEdit = true
                }
            }).finally(()=>{
                this.loading = false;
            })
            })
        }
    },
    methods:{
        
    }
}
</script>
<style scoped>
.date {
    width: 65px;
    color: #adb5bd;
}
.amount {
  font-weight: bold;
  color:#525f7f;
}
.payments .card {
    margin-bottom: 5px !important;
}
.payments .card-header  {
    padding: 0.5rem 0.5rem !important;
}
</style>
