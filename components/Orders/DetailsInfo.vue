<template>
    <div>
        <div class="text-center">
            <img :src="resource.logo" class="icon"/>
            <h2 class="card-title mt-3 mb-0 title">{{resource.order_type ? $t(resource.order_type.name_translation_key) : resource.order_type_id}}</h2>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.detail || selectedScreen==orderDetailScreens.delete || selectedScreen==orderDetailScreens.cancel">
            <GoldSale :order="resource" v-if="resource.order_type.name_translation_key.includes('sell')"></GoldSale>
            <GoldPurchase :order="resource" v-if="resource.order_type.name_translation_key.includes('purchase') || resource.order_type.name_translation_key.includes('purchase_interval')"></GoldPurchase>
            <GoldDelivery :order="resource" v-if="resource.order_type.name_translation_key.includes('delivery')"></GoldDelivery>
            <GoldGift :order="resource" v-if="resource.order_type.name_translation_key.includes('gift')"></GoldGift>
            <GoldTransfer :order="resource" v-if="resource.order_type.name_translation_key.includes('transfer_in') || resource.order_type.name_translation_key.includes('transfer_out')"></GoldTransfer>
            <GoldWithdrawal :order="resource" v-if="resource.order_type.name_translation_key.includes('withdrawal')"></GoldWithdrawal>
        </div>
         <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.complete">
                <CompleteOrderDetail :order="resource"
                    @dateselected="onCompleteDateSelected"
                    @makediscount="onMakeDiscountChanged"
                    @setTransactionFee="onSetTransactionFee"
                    v-if="isPurchaseOrder(resource) || isIntervalPurchaseOrder(resource)"
                />
                <span v-if="isSellOrder(resource)">{{$t('confirm_complete_order')}} "{{ resource ? resource.id : '' }}"?</span>
                <CompleteGoldDelivery v-if="isDeliveryOrder(resource)"
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

                  <div class="mt-4 mb-1" v-if="!hasMoneyTransfered">{{ $t('choose_payment_account_for_payback') }}:</div>
                  <select-payment-account :account_id="resource.depot.account_id"
                                          v-if="resource && !hasMoneyTransfered"
                                          @paymentaccountselected="setCancelPaymentAccount"
                  />
                  <Checkbox v-model="hasMoneyTransfered" class="mt-3" @change="hasMoneyTranferedChanged">{{ $t('money_was_tranfered') }}</Checkbox>
                </div>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.delete">
            <h4>{{$tc('confirm_delete_order', resource.id)}}</h4>
            <Input :placeholder="$t('order_id_delete_placeholder')" class="mt-2" v-model="deleteOrderId"/>
        </div>

        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.paid">
            {{$t('confirm_paid_order')}} "{{ resource ? resource.id : '' }}"?
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.failed">
            {{$t('confirm_failed_order')}} "{{ resource ? resource.id : '' }}"?
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.refund">
            <select-payment-account :account_id="resource.depot.account_id"
                @paymentaccountselected="setRefundPaymentAccount"
                @sellingPaymentAccountSelected="onSellingPaymentAccountSelected"
            />
            {{$t('confirm_refund_order')}} "{{ resource ? resource.id : '' }}"?
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.refund">
          <h4>Did you already pay back the customer?</h4>
          <input type="radio"  value="1" v-model="isMoneyRefunded" />
          <label for="yes">Yes</label>

          <input type="radio" value="0" v-model="isMoneyRefunded" />
          <label for="no">No</label>
        </div>
        <div class="mt-4 text-sm" v-if="selectedScreen==orderDetailScreens.revert">
            <date-picker
                    size="large"
                    class="my-2"
                    v-model="fixingDate"
                    type="date"
                    :placeholder="$t('select_gold_price_date')"
                    @change="getFixingPrice"
                >
                </date-picker>
                <div class="mt--1 mb-3 row text-sm text-danger" v-if="fixingDate==null">
                    {{$t('choose_fixing_date')}}
                </div>
                <div class="mt--1 mb-3 row" v-else>
                    <div v-if="fixingPriceGram > -1" class="col text-sm text-muted">
                        {{$t('gram_price')}} : {{$n(fixingPriceGram)}} €
                    </div>
                    <div v-if="fixingPriceOunce > -1" class="col text-sm text-muted">
                        {{$t('ounce_price')}} : {{$n(fixingPriceOunce)}} €
                    </div>
                    <div v-if="(fixingPriceGram == -1)" class="mt--1 my-3 text-sm text-danger">
                        {{$t('this_date_has_not_goldprice')}}
                    </div>
                </div>
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
import { isOrderPending, isOrderPaid,isPurchaseOrder,isIntervalPurchaseOrder,isSellOrder,isDeliveryOrder } from '~/helpers/order';
import VueSlickCarousel from 'vue-slick-carousel';
import CompleteOrderDetail from '@/components/Orders/goldDetails/CompleteOrderDetail';
import CompleteGoldDelivery from '@/components/Orders/goldDetails/CompleteGoldDelivery';
import SellOrderDetail from '@/components/Orders/goldDetails/SellOrderDetails';
import {orderDetailScreens} from '../../helpers/constans';
import SelectPaymentAccount from '@/components/Orders/goldDetails/payments/SelectPaymentAccount.vue';
import {Input,Checkbox} from 'element-ui';
import DetailListItem from '@/components/common/DetailListItem.vue';
import {formatDateToApiFormat} from '../../helpers/helpers';
import {DatePicker} from 'element-ui';
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
        CompleteGoldDelivery,
        DetailListItem,
        DatePicker,
        Checkbox
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
            deleteOrderId:'',
            isMoneyRefunded: 0,
            fixingPriceGram:-1,
            fixingPriceOunce:-1,
            fixingDate:null,
            hasMoneyTransfered:false
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
        },
        isMoneyRefunded: {
          handler (){
            this.$emit('isMoneyRefunded', this.isMoneyRefunded);
          }
        }
    },
    methods:
    {
        isOrderPending,
        isOrderPaid,
        isPurchaseOrder,
        isIntervalPurchaseOrder,
        isSellOrder,
        isDeliveryOrder,
         onCompleteDateSelected(date)
         {
             this.$emit('completeDateSelected',date);
         },
         onMakeDiscountChanged(value){
            this.$emit('makediscount',value);
         },
         hasMoneyTranferedChanged(value){
            this.$emit('hasMoneyTransfered',value);
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
        },
        getFixingPrice(){
            const dbDate = formatDateToApiFormat(this.fixingDate);
            if(this.resource!=null && this.resource.order_type!=null && this.resource.order_type.name_translation_key.indexOf('gold') != -1)
            {
                this.$store.dispatch('gold/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1)
                    {
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                        this.$emit('revertorderdateselected',dbDate);
                    }
                    else{
                        this.fixingPriceGram = -1;
                        this.fixingPriceOunce = -1;
                        this.$emit('revertorderdateselected',null);
                    }
                    
                })
            }
            else if(this.resource!=null && this.resource.order_type!=null && this.resource.order_type.name_translation_key.indexOf('silver') != -1)
            {
                this.$store.dispatch('silver/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1){
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                        this.$emit('revertorderdateselected',dbDate);
                    }
                    else{
                        this.fixingPriceGram = -1;
                        this.fixingPriceOunce = -1;
                        this.$emit('revertorderdateselected',null);
                    }
                    
                })
            }
            
        },
        onSetTransactionFee:function(value){
            this.$emit('setTransactionFee',value);
        },

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
