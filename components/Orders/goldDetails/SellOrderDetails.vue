<template>
    <div class="list-group list-group-flush">
        <date-picker
            class="filterElement"
            v-model="selectedDate"
            type="date"
            @change="getPreview"
            :placeholder="$t('select_end_date_placeholder')">
          </date-picker>
          <PaymentAccountItem
                :account_id="order.depot.account_id"
                :order="order"
                @paymentSet="setSellingPaymentAccount"
                :isNew="true"
            />
        <div class="mt-4" v-if="isLoading">
            <Loader :width="25" :height="25"/>
        </div>
        <div v-else-if="!isLoading && error!=null" class="mt-4">
            <TextError :textError="error"/>
        </div>
        <div v-else-if="!isLoading && error==null && preview!=null" class="mt-4">
            <!--<detail-list-item title="ID"><div slot="value">{{preview.order_id}}</div></detail-list-item>-->
            <detail-list-item :title="$t('payment_accounts')" v-if="paymentMethod"><div slot="value"> {{$t(paymentMethod)}}</div></detail-list-item>
            <detail-list-item :title="$t('date')"><div slot="value"> {{$d(new Date(preview.gram_price_date),'short')}}</div></detail-list-item>
            <detail-list-item :title="$t('depot')"><div slot="value">{{order.depotName}}</div></detail-list-item>
            <detail-list-item :title="$t('course')"><div slot="value"> <i18n-n :value="preview.gram_price_trading/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('agio')" v-if="preview.fee!=0"><div slot="value"> <i18n-n :value="preview.fee/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="preview.money_amount/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('gold_amount')"><div slot="value"> <i18n-n :value="preview.gram_amount/1000"></i18n-n> g</div></detail-list-item>
            <!--
            <detail-list-item :title="$t('depot_balance_before')"><div slot="value"><i18n-n :value="preview.depot_balance_before/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('depot_balance_after')"><div slot="value"><i18n-n :value="preview.depot_balance_after/100"></i18n-n> €</div></detail-list-item>
            -->
        </div>
    </div>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import {formatDateToApiFormat} from '../../../helpers/helpers';
import {DatePicker} from 'element-ui';
import Loader from '@/components/common/Loader/Loader';
import TextError from '@/components/common/Errors/TextError';
import PaymentAccountItem from '@/components/Orders/goldDetails/payments/PaymentAccountItem';
import { apiErrorHandler } from '../../../helpers/apiErrorHandler';
export default {
    components:{
        DatePicker,
        DetailListItem,
        Loader,
        TextError,
        PaymentAccountItem
    },
    props:{
        order:{
            type:Object
        }
    },
    data (){
        return{
            isLoading:false,
            selectedDate:null,
            error:null,
            preview:null,
            paymentMethod:null,
        }
    },
    mounted:function(){
        const today = new Date();
        const dayOfTheWeek = today.getDay();
        this.selectedDate = new Date(today);
        debugger;
        if(dayOfTheWeek == 1){
            this.selectedDate.setDate(this.selectedDate.getDate()-3);
        }
        else if(dayOfTheWeek == 0){
            this.selectedDate.setDate(this.selectedDate.getDate()-2);
        }
        else{
            this.selectedDate.setDate(this.selectedDate.getDate()-1);
        }
        this.getPreview();
    },
    methods:{
        getPreview:function()
        {
            const today = new Date();
            if(this.selectedDate>today)
            {
                this.error = 'select_right_preview_date';
                return;
            }
            this.error = null;
            this.isLoading = true;
            this.$emit('dateselected',formatDateToApiFormat(this.selectedDate));
            this.$store.dispatch('orders/getCompleteOrderPreview',{id:this.order.id,date:formatDateToApiFormat(this.selectedDate)}).then(res=>{
                this.preview = res;
            }).catch(err=>{
                this.error = apiErrorHandler(err,null);
            }).finally(()=>{
                this.isLoading = false;
            })
        },
        setSellingPaymentAccount(account) {
            this.paymentMethod = account.payment_method;
            this.$emit('sellingPaymentAccountSelected',account);
        }
    }
}
</script>
<style scoped>

</style>