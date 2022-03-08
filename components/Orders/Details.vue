<template>
    <div>
        <div class="text-center">
            <img :src="resource.logo" class="logo"/>
            <h2 class="card-title mt-3 mb-0 title">{{resource.order_type ? $t(resource.order_type.name_translation_key) : resource.order_type_id}}</h2>
        </div>
        <VueSlickCarousel :arrows="false" :dots="true" v-if="isOrderPending(resource) || isOrderPaid(resource)" @afterChange="onSlideChange">
            <div> 
                <GoldSale :order="resource" v-if="resource.order_type.name_translation_key=='gold_sell'"></GoldSale>
                <GoldPurchase :order="resource" v-if="resource.order_type.name_translation_key=='gold_purchase' || resource.order_type.name_translation_key=='gold_purchase_interval'"></GoldPurchase>
                <GoldDelivery :order="resource" v-if="resource.order_type.name_translation_key=='gold_delivery'"></GoldDelivery>
                <GoldGift :order="resource" v-if="resource.order_type.name_translation_key=='gold_gift'"></GoldGift>
                <GoldTransfer :order="resource" v-if="resource.order_type.name_translation_key=='gold_transfer_in' || resource.order_type.name_translation_key=='gold_transfer_out'"></GoldTransfer>
                <GoldWithdrawal :order="resource" v-if="resource.order_type.name_translation_key=='gold_withdrawal'"></GoldWithdrawal>
            </div>
            <div>
                <CompleteOrderDetail :order="resource" @dateselected="onCompleteDateSelected" @paymentaccountselected="onPaymentAccountSelected"/>
            </div>
        </VueSlickCarousel>
         
        <div class="mt-4 text-sm" v-else>
            <GoldSale :order="resource" v-if="resource.order_type.name_translation_key=='gold_sell'"></GoldSale>
            <GoldPurchase :order="resource" v-if="resource.order_type.name_translation_key=='gold_purchase' || resource.order_type.name_translation_key=='gold_purchase_interval'"></GoldPurchase>
            <GoldDelivery :order="resource" v-if="resource.order_type.name_translation_key=='gold_delivery'"></GoldDelivery>
            <GoldGift :order="resource" v-if="resource.order_type.name_translation_key=='gold_gift'"></GoldGift>
            <GoldTransfer :order="resource" v-if="resource.order_type.name_translation_key=='gold_transfer_in' || resource.order_type.name_translation_key=='gold_transfer_out'"></GoldTransfer>
            <GoldWithdrawal :order="resource" v-if="resource.order_type.name_translation_key=='gold_withdrawal'"></GoldWithdrawal>
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
import { isOrderPending, isOrderPaid } from '~/helpers/order';
import VueSlickCarousel from 'vue-slick-carousel';
import CompleteOrderDetail from '@/components/Orders/goldDetails/CompleteOrderDetail';
import {orderDetailSlides} from '../../helpers/constans';
export default {
    components:{
        GoldSale,
        GoldPurchase,
        GoldDelivery,
        GoldGift,
        GoldTransfer,
        GoldWithdrawal,
        VueSlickCarousel,
        CompleteOrderDetail
    },
    props: {
        resource: {
            type: Object
        }
    },
    methods:
    {
        isOrderPending,
        isOrderPaid,
        onSlideChange:function(slideIndex) {
            console.log(slideIndex);
            if(slideIndex==0)
            {
                this.$emit("slideChange",orderDetailSlides.detail)
            }
            if(slideIndex==1)
            {
                this.$emit("slideChange",orderDetailSlides.complete)
            }
        },
         onCompleteDateSelected(date)
         {
             this.$emit('completeDateSelected',date);
         },
         onPaymentAccountSelected(account)
         {
             this.$emit('completePaymentAccountSelected',account);
         }
    },
   
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
