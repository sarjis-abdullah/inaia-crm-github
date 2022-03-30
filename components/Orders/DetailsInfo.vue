<template>
    <div>
        <div class="text-center">
            <img :src="resource.logo" class="icon"/>
            <h2 class="card-title mt-3 mb-0 title">{{resource.order_type ? $t(resource.order_type.name_translation_key) : resource.order_type_id}}</h2>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.detail || selectedScreen==orderDetailScreens.delete || selectedScreen==orderDetailScreens.cancel">
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
                <CompleteGoldDelivery v-if="isOrderDelivery(resource)"
                    @shippmentFeeChargeChanged="onShippmentFeeChargeChanged"
                    @shippmentDetailsChanged="onShippmentDetailsChanged"
                
                />
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.sell">
                <SellOrderDetail :order="resource"
                    @dateselected="onSellGoldDateSelected"
                    @sellingPaymentAccountSelected="onSellingPaymentAccountSelected"
                />
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.cancel">
                <div>
                  <h4>{{$tc('confirm_cancel_order', resource.id)}}</h4>

                  <div class="mt-4 mb-1">{{ $t('choose_payment_account_for_payback') }}:</div>
                  <select-payment-account :account_id="resource.depot.account_id"
                                          v-if="resource"
                                          @paymentaccountselected="setCancelPaymentAccount"
                  />
                </div>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.delete">
            <h4>{{$tc('confirm_delete_order', resource.id)}}</h4>
            <Input :placeholder="$t('order_id_delete_placeholder')" class="mt-2" v-model="deleteOrderId"/>
        </div>

        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.paid">
            {{$t('confirm_paid_order')}} "{{ resource ? resource.id : '' }}"?
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.refund">
            <select-payment-account :account_id="resource.depot.account_id"
                @paymentaccountselected="setRefundPaymentAccount"
                @sellingPaymentAccountSelected="onSellingPaymentAccountSelected"
            />
            {{$t('confirm_refund_order')}} "{{ resource ? resource.id : '' }}"?
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
import { isOrderPending, isOrderPaid,isOrderGoldPurchase,isOrderGoldPurchaseInterval,isOrderGoldSale,isOrderDelivery } from '~/helpers/order';
import VueSlickCarousel from 'vue-slick-carousel';
import CompleteOrderDetail from '@/components/Orders/goldDetails/CompleteOrderDetail';
import CompleteGoldDelivery from '@/components/Orders/goldDetails/CompleteGoldDelivery';
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
        SellOrderDetail,
        CompleteGoldDelivery
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
        isOrderDelivery,
         onCompleteDateSelected(date)
         {
             this.$emit('completeDateSelected',date);
         },
         onSellGoldDateSelected(date){
             this.$emit('sellGoldDateSelected',date)
         },
         setCancelPaymentAccount(account){
            this.$emit('cancelpaymentaccountselected',account)
        },
        setRefundPaymentAccount(account){
            this.$emit('refundpaymentaccountselected',account)
        },
        onShippmentDetailsChanged(value)
        {
            this.$emit('shippmentDetailsChanged',value);
        },
        onShippmentFeeChargeChanged(value){
            this.$emit('shippmentFeeChargeChanged',value);
        },
        onSellingPaymentAccountSelected (account) {
            this.$emit('sellingPaymentAccountSelected',account);
        }

    }

}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
.icon {
    width: 90px;
    height: 90px;
}
.title {
}
.detailsContainer {
}
</style>
