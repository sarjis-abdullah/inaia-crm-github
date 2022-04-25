<template>
    <modal :show.sync="showPopup" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false">
                    <template slot="header" class="pb-0">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
                    </template>
                    <div>
                        <DetailsInfo
                        :resource="selectedResource"
                        v-if="showPopup"
                        :selectedScreen="selectedResourceScreen"
                        @completeDateSelected="setCompleteDate"
                        @cancelpaymentaccountselected ="setCancelPaymentAccount"
                        @shouldEnableDelete ="onEnableDeletingChanged"
                        @refundpaymentaccountselected="setRefundPaymentAccount"
                        @sellGoldDateSelected ="setSellGoldDate"
                        @shippmentFeeChargeChanged="onShippmentFeeChargeChanged"
                        @shippmentDetailsChanged="onShippmentDetailsChanged"
                        @sellingPaymentAccountSelected="onSellingPaymentAccountSelected"
                        />
                    </div>
                    <template slot="footer">
                        <base-button type="link" class="ml-auto" @click="backToDetailScreen()"
                            v-if="selectedResourceScreen!=orderDetailsSceens.detail">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="white" class="text-danger" @click="() => removeOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayOrderDeleteButton(selectedResource)"
                            :disabled="(!enableDeleting && selectedResourceScreen==orderDetailsSceens.delete) || isSubmitting">
                          <i class="lnir lnir-trash mr-1"></i>{{$t('delete_order')}}
                        </base-button>
                        <base-button type="white" class="text-danger" @click="() => cancelOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayOrderCancelButton(selectedResource)"
                            :disabled="(selectedCancelPaymentAccount==null && selectedResourceScreen==orderDetailsSceens.cancel) || isSubmitting"
                            >
                          <i class="lnir lnir-close mr-1"></i>{{$t('cancel_order')}}
                        </base-button>
                        <base-button type="primary" @click="() => markPaidOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayOrderPaidButton(selectedResource) && selectedResourceScreen!==orderDetailsSceens.delete"
                            :disabled="isSubmitting">
                          {{$t('mark_as_paid')}}
                        </base-button>
                         <base-button type="primary" @click="() => completeOrder(selectedResource)" v-if="selectedResource && shouldDisplayOrderCompleteButton(selectedResource)"
                            :disabled="shouldDisableCompleteButton() || isSubmitting">
                           <span v-if="selectedResourceScreen==orderDetailsSceens.detail">{{$t('preview_order')}}</span>
                            <span v-if="selectedResourceScreen==orderDetailsSceens.complete">{{$t('confirm_order')}}</span>
                         </base-button>
                         <base-button type="white" @click="() => refundOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayRefundButton(selectedResource)"
                            :disabled="(selectedRefundPaymentAccount==null && selectedResourceScreen==orderDetailsSceens.refund) ||
                            isSubmitting">
                           <i class="lnir lnir-undo mr-1"></i><span>{{$t('order_refund')}}</span>
                         </base-button>
                          <base-button type="primary" @click="() => sellGold(selectedResource)"
                            v-if="selectedResource && shouldDisplaySellGoldButton(selectedResource)"
                            :disabled="((selectedSellingPaymentAccount == null || sellGoldDate==null) && selectedResourceScreen==orderDetailsSceens.sell) || isSubmitting">
                            <span>{{$t('sell_gold')}}</span>
                         </base-button>
                    </template>
                </modal>
</template>
<script>
import {orderDetailScreens} from '../../helpers/constans';
import DetailsInfo from '@/components/Orders/DetailsInfo';
import { isOrderPending, isOrderPaid,isOrderPaymentFailed,isOrderGoldPurchase,isOrderCompleted,isOrderGoldPurchaseInterval,isOrderOutstanding,isOrderGoldSale,isOrderDelivery } from '~/helpers/order'
export default {
    props:{
        showPopup:{
            type: Boolean,
            default: false
        },
        selectedResource: {
            type: Boolean,
            default: null
        }
    },
    components:{
        DetailsInfo
    },
    data () {
        return {
            completeOrderInfo:{date:null},
            selectedCancelPaymentAccount:null,
            selectedRefundPaymentAccount:null,
            selectedSellingPaymentAccount:null,
            enableDeleting:false,
            sellGoldDate:null,
            shippmentDetails:null,
            chargeShippmentFee:true,
            isSubmitting: false,
            selectedResourceScreen:orderDetailScreens.detail,
        }
    },
     created (){
        this.orderDetailsSceens = orderDetailScreens;
    },
    watch:{
        showPopup:{
            handler() {
                if(!this.showPopup)
                {
                    this.$emit("onClose");
                }
            }
        }
    },
    methods :{
        isOrderPending,
        isOrderPaid,
         removeOrder(resource) {
            if(this.selectedResourceScreen != orderDetailScreens.delete)
            {
                this.selectedResourceScreen = orderDetailScreens.delete;
            }
            else
            {
                
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/remove', resource.id)
                    .then( () => {
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_deleted_successfully')})
                        this.$emit('orderDeleted');
                        this.showPopup = false;
                        this.onDetailClose();
                    }).catch((err)=>{console.error(err);this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_deleted_unsuccessfully')})})
                    .finally(()=>this.isSubmitting = false)
            }
        },
        cancelOrder(resource) {
            if(this.selectedResourceScreen == orderDetailScreens.detail)
            {
                this.selectedResourceScreen = orderDetailScreens.cancel;
            }
            else if(this.selectedResourceScreen == orderDetailScreens.cancel){
                let data = {
                    id:resource.id,
                    data:{
                        payment_account_id:this.selectedCancelPaymentAccount
                    }
                }
                this.isSubmitting =  true;
                this.$store
                    .dispatch('orders/cancel', data)
                    .then( res => {
                        this.showPopup = false;
                        this.onDetailClose();
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('order_canceled_successfully')})
                    }).catch(()=>{
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('order_canceled_unsuccessfully')})
                    }).finally(()=>this.isSubmitting = false)
            }
        },
        onOrderDetailScreenChanged (slide)
        {
            this.selectedResourceScreen = slide
        },
        setCompleteDate (date)
        {
            this.completeOrderInfo.date = date;
        },
        setSellGoldDate(date)
        {
            this.sellGoldDate = date;
        },
        onDetailClose ()
        {
            this.selectedResourceScreen = orderDetailScreens.detail;
            this.completeOrderInfo = {date:null};
            this.selectedCancelPaymentAccount = null;
            this.enableDeleting = false;
            this.selectedRefundPaymentAccount=null;
            this.sellGoldDate = null;
            this.selectedSellingPaymentAccount = null;
        },
        shouldDisplayOrderDeleteButton(resource)
        {
            if((isOrderPending(resource) || isOrderPaymentFailed(resource)) &&
                (this.selectedResourceScreen == orderDetailScreens.delete || this.selectedResourceScreen == orderDetailScreens.detail))
            {
                return true;
            }
            else
            {
                return false;
            }
        },
        shouldDisplayOrderCompleteButton(resource)
        {
            return (isOrderPaid(resource) || isOrderOutstanding(resource) || (isOrderPending(resource) && isOrderDelivery(resource))) 
            && (this.selectedResourceScreen == orderDetailScreens.complete || this.selectedResourceScreen == orderDetailScreens.detail)
            ;
        },
        completeOrder(resource)
        {
            if(this.selectedResourceScreen == orderDetailScreens.detail)
            {
                this.selectedResourceScreen = orderDetailScreens.complete;
            }
            else
            {

                let data ={
                    id:resource.id,
                }
                if(isOrderGoldPurchase(resource) || isOrderGoldPurchaseInterval(resource))
                {
                    data.data = {price_date:this.completeOrderInfo.date}
                }
                if(isOrderDelivery(resource))
                {
                    data.data = {charge_delivery_cost:this.chargeShippmentFee};
                    if(this.shippmentDetails){
                        data.data.shipping_company = this.shippmentDetails.shippmentCompany;
                        data.data.shipping_number = this.shippmentDetails.shippmentNumber;
                        if(this.shippmentDetails.trackingLink)
                        {
                            data.data.tracking_link = this.shippmentDetails.trackingLink;
                        }
                    }
                }
                this.isSubmitting = true;
                this.$store
                .dispatch('orders/complete', data)
                .then( res => {
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_completed_successfully')})
                    this.selectedResource = null;
                    this.showPopup = false;
                    this.onDetailClose();

                }).catch(err=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_completed_unsuccessfully')})
                }).finally(()=>this.isSubmitting = false)
            }

        },
        markPaidOrder (resource){
            if(this.selectedResourceScreen != orderDetailScreens.paid)
            {
                this.selectedResourceScreen = orderDetailScreens.paid;
            }
            else{
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/paid', resource.id)
                    .then( res => {
                        this.showPopup = false;
                        this.onDetailClose();
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_paid_successfully')})
                        // console.error('order->', res.data.data)
                    }).catch(()=>{
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_paid_unsuccessfully')})
                    }).finally(()=>this.isSubmitting = false)
            }
        },
        refundOrder(resource)
        {
            if(this.selectedResourceScreen != orderDetailScreens.refund)
            {
                this.selectedResourceScreen = orderDetailScreens.refund;
            }
            else{
                let data = {
                    id:resource.id,
                    data:{
                        payment_account_id:this.selectedRefundPaymentAccount
                    }
                }
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/refund', data)
                    .then( res => {
                        this.showPopup = false;
                        this.onDetailClose();
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('order_refunded_successfully')})
                    }).catch(()=>{
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('order_refunded_unsuccessfully')})
                    }).finally(()=>this.isSubmitting = false)
            }
        },
        backToDetailScreen()
        {
            this.selectedResourceScreen = orderDetailScreens.detail;
            this.selectedCancelPaymentAccount = null;
        },
        shouldDisableCompleteButton(){
            if(this.selectedResourceScreen == orderDetailScreens.complete)
            {
                if(isOrderGoldPurchase(this.selectedResource) || isOrderGoldPurchaseInterval(this.selectedResource))
                {
                    if(!this.completeOrderInfo || !this.completeOrderInfo.date)
                    {
                        return true;
                    }
                }
                if(isOrderDelivery(this.selectedResource))
                {
                    if(this.shippmentDetails)
                    {
                        return !this.shippmentDetails.isValid();
                    }
                }
            }
            return false;
        },
        shouldDisplayOrderCancelButton(resource)
        {
          if (this.selectedResourceScreen == orderDetailScreens.detail || this.selectedResourceScreen == orderDetailScreens.cancel)
            return isOrderPaid(resource);
          else return false;
        },
        shouldDisplayOrderPaidButton(resource)
        {
            return isOrderPending(resource) && (isOrderGoldPurchase(resource) || isOrderGoldPurchaseInterval(resource));
        },
        setCancelPaymentAccount(account)
        {
            this.selectedCancelPaymentAccount = account;
        },
        shouldDisplayRefundButton(resource){
            return isOrderCompleted(resource) && (isOrderGoldPurchase(resource) || isOrderGoldPurchaseInterval(resource))
        },
        shouldDisplaySellGoldButton(resource){
            return isOrderPending(resource) &&
                (this.selectedResourceScreen == orderDetailScreens.detail || this.selectedResourceScreen == orderDetailScreens.sell) &&
                isOrderGoldSale(resource)
        },
        setRefundPaymentAccount(account)
        {
            this.selectedRefundPaymentAccount = account;
        },
        onEnableDeletingChanged(value)
        {
            this.enableDeleting = value;
        },
        sellGold (resource){
            if(this.selectedResourceScreen != orderDetailScreens.sell)
            {
                this.selectedResourceScreen = orderDetailScreens.sell;
            }
            else{
                let data = {
                    id:resource.id,
                    data:
                    {
                        price_date:this.sellGoldDate,
                        payment_method_id:this.selectedSellingPaymentAccount.payment_method_id
                    }
                }
                if(this.selectedSellingPaymentAccount.payment_account_id)
                {
                    data.data.payment_account_id = this.selectedSellingPaymentAccount.payment_account_id;
                }
                this.isSubmitting = true;
                this.$store
                .dispatch('orders/sellGold', data)
                .then( res => {
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('gold_sold_successfully')})
                    this.selectedResource = null;
                    this.showPopup = false;
                    
                    this.onDetailClose();

                }).catch(err=>{
                    this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_sold_unsuccessfully')})
                }).finally(()=>this.isSubmitting = false)
            }
        },
        onShippmentFeeChargeChanged(value)
        {
            this.chargeShippmentFee = value;

        },
        onShippmentDetailsChanged(value)
        {
            this.shippmentDetails = value;
            
        },
        onSellingPaymentAccountSelected(account){
            this.selectedSellingPaymentAccount = account;
        }
    }
}
</script>
<style scoped>
</style>