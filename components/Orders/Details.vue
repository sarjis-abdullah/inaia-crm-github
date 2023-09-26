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
                        @isMoneyRefunded="setIsMoneyRefunded"
                        @revertorderdateselected="setRevertDate"
                        @makediscount="doMakeDiscount"
                        @hasMoneyTransfered="setHasMoneyTranfered"
                        />
                    </div>
                    <template slot="footer" v-if="hasEditAccess">
                        <base-button type="link" class="ml-auto" @click="backToDetailScreen()"
                            v-if="selectedResourceScreen!=orderDetailsSceens.detail">
                          {{$t('cancel')}}
                        </base-button>
                       
                        <base-button type="white" class="text-danger" @click="() => removeOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayOrderDeleteButton(selectedResource)"
                            :disabled="(!enableDeleting && selectedResourceScreen==orderDetailsSceens.delete) || isSubmitting">
                          <i class="lnir lnir-trash mr-1"></i>{{$t('delete_order')}}
                        </base-button>
                        <base-button type="danger" class="ml-auto" @click="markOrderAsfailed(selectedResource)"
                            v-if="selectedResource && shouldDisplayOrderFailedButton(selectedResource)">
                          {{$t('mark_failed')}}
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
                         <base-button type="primary" @click="() => revertOrder(selectedResource)"
                            v-if="selectedResource && shouldDisplayRevertButton(selectedResource)"
                            :disabled="(revertDate==null && selectedResourceScreen==orderDetailsSceens.revert) ||
                            isSubmitting">
                           <i class="lnir lnir-undo mr-1"></i><span>{{$t('order_revert')}}</span>
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
import { isOrderPending, isOrderPaid,isOrderPaymentFailed,isPurchaseOrder,isOrderCompleted,isIntervalPurchaseOrder,isOrderOutstanding,isSellOrder,isDeliveryOrder } from '~/helpers/order';
import { canEditOrder } from '@/permissions';
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
            isMoneyRefunded: 0,
            revertDate:null,
            makeDiscount:false,
            hasMoneyTransfered:true
        }
    },
     created (){
        this.orderDetailsSceens = orderDetailScreens;
    },
    computed : {
        hasEditAccess(){
          return canEditOrder();
        }
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
                        this.$emit('orderUpdated',resource);
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
                }
                if(this.hasMoneyTransfered){
                    data.data = {
                        
                        has_money_transferred:true
                    }
                }
                else{
                    data.data = {
                        payment_account_id:this.selectedCancelPaymentAccount,
                        has_money_transferred:false
                    }
                }
                this.isSubmitting =  true;
                this.$store
                    .dispatch('orders/cancel', data)
                    .then( res => {
                        let data = res.data.data;
                        if(data.fin_api_webform_url){
                            window.location.href = data.fin_api_webform_url
                        }
                        else{
                            this.showPopup = false;
                            this.$emit('orderUpdated',resource);
                            this.onDetailClose();
                            this.$notify({type: 'success', timeout: 5000, message: this.$t('order_canceled_successfully')})
                        }
                        
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
       setIsMoneyRefunded(isMoneyRefunded)
       {
          this.isMoneyRefunded = isMoneyRefunded;
       },
       doMakeDiscount(value){
        this.makeDiscount = value;
       },
       setHasMoneyTranfered(value){
        this.hasMoneyTransfered = value;
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
            this.isMoneyRefunded = 0;
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
            return (isOrderPaid(resource) || isOrderOutstanding(resource) || (isOrderPending(resource) && isDeliveryOrder(resource)))
            && (this.selectedResourceScreen == orderDetailScreens.complete || this.selectedResourceScreen == orderDetailScreens.detail)
            ;
        },
        shouldDisplayOrderFailedButton(resource){
            return (isOrderPaid(resource) || (isOrderPending(resource)))
            && (this.selectedResourceScreen == orderDetailScreens.failed || this.selectedResourceScreen == orderDetailScreens.detail)
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
                if(isPurchaseOrder(resource) || isIntervalPurchaseOrder(resource))
                {
                    data.data = {price_date:this.completeOrderInfo.date,discount_transaction_fee:this.makeDiscount}
                }
                if(isDeliveryOrder(resource))
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
                    this.$emit('orderUpdated',resource);
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
                        this.$emit('orderUpdated',resource);
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
                        payment_account_id:this.selectedRefundPaymentAccount,
                        is_money_refunded: this.isMoneyRefunded
                    }
                }
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/refund', data)
                    .then( res => {
                        this.showPopup = false;
                        this.$emit('orderUpdated',resource);
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
                if(isPurchaseOrder(this.selectedResource) || isIntervalPurchaseOrder(this.selectedResource))
                {
                    if(!this.completeOrderInfo || !this.completeOrderInfo.date)
                    {
                        return true;
                    }
                }
                if(isDeliveryOrder(this.selectedResource))
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
            return (isOrderPending(resource) || isOrderPaymentFailed(resource)) && (isPurchaseOrder(resource) || isIntervalPurchaseOrder(resource));
        },
        setCancelPaymentAccount(account)
        {
            this.selectedCancelPaymentAccount = account;
        },
        shouldDisplayRefundButton(resource){
            return this.selectedResourceScreen!=orderDetailScreens.revert && isOrderCompleted(resource) && (isPurchaseOrder(resource) || isIntervalPurchaseOrder(resource))
        },
        shouldDisplayRevertButton(resource){
            return this.selectedResourceScreen!=orderDetailScreens.refund && isOrderCompleted(resource) && (isPurchaseOrder(resource) || isIntervalPurchaseOrder(resource))
        },
        shouldDisplaySellGoldButton(resource){
            return isOrderPending(resource) &&
                (this.selectedResourceScreen == orderDetailScreens.detail || this.selectedResourceScreen == orderDetailScreens.sell) &&
                isSellOrder(resource)
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
                    this.$emit('orderUpdated',resource);
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
        },
        setRevertDate(date){
            this.revertDate = date;
        },
        revertOrder(resource){
            this.selectedResource = resource;
            if(this.selectedResourceScreen != orderDetailScreens.revert)
            {
                this.selectedResourceScreen = orderDetailScreens.revert;
            }
            else{
                let data = {
                    id:resource.id,
                    data:{
                        fixing_date:this.revertDate,
                    }
                }
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/revert', data)
                    .then( res => {
                        this.showPopup = false;
                        this.$emit('orderUpdated',resource);
                        this.onDetailClose();
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('order_reverted_successfully')})
                    }).catch(()=>{
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('order_reverted_unsuccessfully')})
                    }).finally(()=>this.isSubmitting = false)
            }
        },
        markOrderAsfailed(resource){
            if(this.selectedResourceScreen != orderDetailScreens.failed)
            {
                this.selectedResourceScreen = orderDetailScreens.failed;
            }
            else{
                this.isSubmitting = true;
                this.$store
                    .dispatch('orders/failed', resource.id)
                    .then( res => {
                        this.showPopup = false;
                        this.$emit('orderUpdated',resource);
                        this.onDetailClose();
                        this.$notify({type: 'success', timeout: 5000, message: this.$t('Order_marked_failed_successfully')})
                        // console.error('order->', res.data.data)
                    }).catch(()=>{
                        this.$notify({type: 'danger', timeout: 5000, message: this.$t('Order_marked_failed_unsuccessfully')})
                    }).finally(()=>this.isSubmitting = false)
            }
            
        }
    }
}
</script>
<style scoped>
</style>
