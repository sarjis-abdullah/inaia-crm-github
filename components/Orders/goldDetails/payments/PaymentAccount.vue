<template>
    <div class="payments">
        <h4 class="mt-4 text-center">{{$t('payments')}}</h4>
        
        <collapse multipleActive v-if="!loading">
            
            <collapse-item v-for="(account, index) in paymentAccounts" :key="account.id">
                <template v-slot:title>
                    <div class="d-flex align-items-center">
                        <div class="date mr-4">{{ formatDate(account.updated_at) }}</div>
                        <div class="d-flex align-items-center">
                          <div class="amount mb-0 mr-2">{{ (account.recipient_payment_account_id == inaiaPaymentAccountId)?'+':'-'}} {{ $n(account.amount/100)}} €</div>
                          <div>
                            <Badge type="success" v-if="account.status.name_translation_key=='completed'" >{{$t(account.status.name_translation_key)}}</Badge>
                            <Badge type="danger" v-if="account.status.name_translation_key=='failed'" >{{$t(account.status.name_translation_key)}}</Badge>
                            <Badge type="secondary" v-if="account.status.name_translation_key=='pending'" >{{$t(account.status.name_translation_key)}}</Badge>
                            <Badge type="warning" v-if="account.status.name_translation_key=='rejected'" >{{$t(account.status.name_translation_key)}}</Badge>
                          </div>
                        </div>
                    </div>
                </template>
                <div class="list-group list-group-flush">
                    <PaymentAccountItem
                    :paymentAccount="getTheRightPaymentAccount(account)"
                    :paymentMethod="account && account.method && account.method.name_translation_key"
                    :isEditable="activateEdit"
                    :account_id="order.depot.account_id" :order="order"
                    @paymentAccountUpdated="onPaymentAccountUpdated"
                    :isTheLatest = "index == paymentAccounts.length-1"
                    />
                </div>
            </collapse-item>
        </collapse>
        <div v-else class="row"><loader class="mx-auto" :width="24" :height="24"/></div>
    </div>
</template>
<script>
import Collapse from '@/components/argon-core/Collapse/Collapse';
import CollapseItem from '@/components/argon-core/Collapse/CollapseItem';
import PaymentAccountItem from '@/components/Orders/goldDetails/payments/PaymentAccountItem';
import {Badge} from '@/components/argon-core';
import { isOrderPending,isOrderPaymentFailed,isOrderOutstanding,isOrderGoldSale, isOrderSilverSale} from '~/helpers/order';
import Loader from '@/components/common/Loader/Loader.vue';
export default {
    components:{
        Collapse,
        CollapseItem,
        Badge,
        PaymentAccountItem,
        Loader
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
            activeIndex:-1,
            loading : false
        }
    },
    computed:{
        inaiaPaymentAccountId(){
            return process.env.inaia_payment_account_id;
        }
    },
    mounted:function()
    {
        this.init();
    },
    methods:{
         init(){
            this.paymentAccounts=[];
            if(isOrderPending(this.order)  || isOrderPaymentFailed(this.order) || isOrderOutstanding(this.order))
            {
                this.activateEdit = true
            }
            if(this.order.orders_payment_transactions && this.order.orders_payment_transactions.length>0)
            {

                this.loading = true
                this.order.orders_payment_transactions.forEach((trans,index)=>{
                   
                    this.$store.dispatch('orders/getPaymentMethod',trans.payment_transaction_id).then(res=>{
                        
                    this.paymentAccounts.push(res);
                    if(index == this.order.orders_payment_transactions.length-1){
                        this.paymentAccounts.sort((acc1,acc2)=>{
                            let date1 = new Date(acc1.updated_at);
                            let date2 = new Date(acc2.updated_at);
                            if(date1 >=date2) return 1
                            else return -1;
                        })
                        this.loading = false;
                        
                    }

                }).finally(()=>{
                    this.loading = false;
                })
                })
            }
        },
        formatDate(dateString){
            let theDate = new Date(dateString);
            if(theDate)
                return theDate.toLocaleDateString() + ' ' + theDate.toLocaleTimeString()
        },
        onPaymentAccountUpdated(order){
            this.order = order;
            this.init();
        },
        getTheRightPaymentAccount(paymentAccount){
            if(isOrderGoldSale(this.order) || isOrderSilverSale(this.order)){
                return paymentAccount.recipient_payment_account;
            }
            else{
                return paymentAccount.payment_account
            }
        }
    }
}
</script>
<style scoped>
.date {
    width: 150px;
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
