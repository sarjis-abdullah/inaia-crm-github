<template>
    <div>
        <div class="text-center">
            <img :src="resource.logo" class="logo"/>
            <h2 class="card-title mt-3 mb-0 title">{{resource.order_type ? $t(resource.order_type.name_translation_key) : resource.order_type_id}}</h2>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.detail">
            <GoldSale :order="resource" v-if="resource.order_type.name_translation_key=='gold_sell'"></GoldSale>
            <GoldPurchase :order="resource" v-if="resource.order_type.name_translation_key=='gold_purchase' || resource.order_type.name_translation_key=='gold_purchase_interval'"></GoldPurchase>
            <GoldDelivery :order="resource" v-if="resource.order_type.name_translation_key=='gold_delivery'"></GoldDelivery>
            <GoldGift :order="resource" v-if="resource.order_type.name_translation_key=='gold_gift'"></GoldGift>
            <GoldTransfer :order="resource" v-if="resource.order_type.name_translation_key=='gold_transfer_in' || resource.order_type.name_translation_key=='gold_transfer_out'"></GoldTransfer>
            <GoldWithdrawal :order="resource" v-if="resource.order_type.name_translation_key=='gold_withdrawal'"></GoldWithdrawal>
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.complete">
                <CompleteOrderDetail :order="resource" 
                    @dateselected="onCompleteDateSelected" 
                    v-if="isOrderGoldPurchase(resource) || isOrderGoldPurchaseInterval(resource)"
                />
                <span v-if="isOrderGoldSale(resource)">{{$t('confirm_complete_order')}} "{{ resource ? resource.id : '' }}"?</span>
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.sell">
                <SellOrderDetail :order="resource" 
                    @dateselected="onSellGoldDateSelected" 
                />
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.cancel">
                <div>
                    <select-payment-account :account_id="resource.depot.account_id"
                        v-if="resource"
                        @paymentaccountselected="setCancelPaymentAccount"
                    />
                    {{$t('confirm_cancel_order')}} "{{ resource ? resource.id : '' }}"?
                </div>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.delete">
            {{$t('confirm_delete_order')}} "{{ resource ? resource.id : '' }}"?

            <Input :placeholder="$t('order_id_delete_placeholder')" class="mt-4" v-model="deleteOrderId"/>
        </div>
        
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.paid">
            {{$t('confirm_paid_order')}} "{{ resource ? resource.id : '' }}"?
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.refund">
            <select-payment-account :account_id="selectedResource.depot.account_id"
                @paymentaccountselected="setRefundPaymentAccount"
            />
            {{$t('confirm_refund_order')}} "{{ selectedResource ? selectedResource.id : '' }}"?
        </div>
    </div>
</template>

<script>
import GoldSale from '@/components/Orders/goldDetails/GoldSale';
import GoldPurchase from '@/components/Orders/goldDetails/GoldPurchase';
import GoldDelivery from '@/components/Orders/goldDetails/GoldDelivery';
import GoldGift from '@/components/Orders/goldDetails/GoldGift';
import GoldTransfer from '@/components/Orders/goldDetails/GoldTransfer';
import GoldWithdrawal from '@/components/Orders/goldDetails/GoldWithdrawal';
import { isOrderPending, isOrderPaid,isOrderGoldPurchase,isOrderGoldPurchaseInterval,isOrderGoldSale } from '~/helpers/order';
import VueSlickCarousel from 'vue-slick-carousel';
import CompleteOrderDetail from '@/components/Orders/goldDetails/CompleteOrderDetail';
import SellOrderDetail from '@/components/Orders/goldDetails/SellOrderDetails';
import {orderDetailScreens} from '../../helpers/constans';
import SelectPaymentAccount from '@/components/Orders/goldDetails/payments/SelectPaymentAccount.vue';
import {Input} from 'element-ui';
export default {
    components:{
        GoldSale,
        GoldPurchase,
        GoldDelivery,
        GoldGift,
        GoldTransfer,
        GoldWithdrawal,
        VueSlickCarousel,
        CompleteOrderDetail,
        SelectPaymentAccount,
        Input,
        SellOrderDetail
    },
    props: {
        resource: {
            type: Object
        },
        selectedScreen: {
            type:String,
            default:orderDetailScreens.detail
        }
    },
    data:function(){
        return {
            deleteOrderId:''
        }
    },
    created (){
        this.orderDetailScreens = orderDetailScreens
    },
    watch:{
        deleteOrderId : {
            handler (){
                if(this.deleteOrderId == this.resource.id)
                {
                    this.$emit("shouldEnableDelete",true);
                }
                else{
                    this.$emit("shouldEnableDelete",false);
                }
            }
        }
    },
    methods:
    {
        isOrderPending,
        isOrderPaid,
        isOrderGoldPurchase,
        isOrderGoldPurchaseInterval,
        isOrderGoldSale,
         onCompleteDateSelected(date)
         {
             this.$emit('completeDateSelected',date);
         },
         onPaymentAccountSelected(account)
         {
             this.$emit('completePaymentAccountSelected',account);
         },
         onSellGoldDateSelected(date){
             this.$emit('sellGoldDateSelected',date)
         },
         setCancelPaymentAccount(account){
            this.$emit('cancelpaymentaccountselected',account)
        },
        setRefundPaymentAccount(account){
            this.$emit('refundpaymentaccountselected',account)
        }
    }
   
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
.logo {
    width: 80px;
    height: 80px;
}
.title {
}
.detailsContainer {
}
</style>
