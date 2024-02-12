<template>
    <div class="list-group list-group-flush">
        <date-picker
            class="align-self-center"
            v-model="selectedDate"
            type="date"
            @change="getPreview"
            :placeholder="$t('select_end_date_placeholder')">
          </date-picker>
          <Checkbox v-model="doDiscount" @change="makediscount" class="mt-3" v-if="isPurchaseOrder(order)">{{ $t('change_transaction_fee') }}</Checkbox>
            <div v-if="doDiscount" class="mt-3">
                <label  for="transactionfee">{{ $t('transaction_fee') }} in %</label>
                <Input type="numeric" v-model="transactionFee" class="mt-3" :placeholder="$t('transaction_fee')" name="transactionfee" @input="setTransactionFee"/>
                <div class="text-sm-left" :class="transactionFeeBadValue?'text-danger':'text-muted'">{{ $t('transactionfee_explanation') }} </div>
            </div>
        <div v-if="isLoading">
            <p class="mt-2 text-sm text-center text-muted">{{$t('loading')}}...</p>
        </div>
        <div v-else-if="!isLoading && error!=null">
            <p class="mt-2 text-sm text-center text-danger">{{error}}</p>
        </div>
        <div v-else-if="!isLoading && error==null && preview!=null" >
            <!--<detail-list-item title="ID"><div slot="value">{{preview.order_id}}</div></detail-list-item>-->
            <detail-list-item :title="$t('date')"><div slot="value"> {{$d(new Date(preview.gram_price_date),'short')}}</div></detail-list-item>
            <detail-list-item :title="$t('depot')"><div slot="value">{{order.depotName}}</div></detail-list-item>
            <detail-list-item :title="$t('course')"><div slot="value"> <i18n-n :value="preview.gram_price_trading/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('agio')" v-if="preview.fee!=0"><div slot="value"> <i18n-n :value="preview.fee/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="preview.money_amount/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('gold_amount')"><div slot="value"> <i18n-n :value="preview.gram_amount/1000"></i18n-n> g</div></detail-list-item>
            <detail-list-item :title="$t('operation_stock')"><div slot="value"> <i18n-n :value="preview.operation_stock_balance/1000"></i18n-n> g</div></detail-list-item>
            
            <div v-if="!preview.operation_stock_balance || preview.operation_stock_balance<preview.gram_amount" class="text-sm-left text-danger mt-3">{{ $t('please_buy_assets') }}</div>
            
            <!--
            <detail-list-item :title="$t('depot_balance_before')"><div slot="value"><i18n-n :value="preview.depot_balance_before/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('depot_balance_after')"><div slot="value"><i18n-n :value="preview.depot_balance_after/100"></i18n-n> €</div></detail-list-item>
            -->
        </div>
    </div>
</template>
<script >
import DetailListItem from '@/components/common/DetailListItem.vue';
import {formatDateToApiFormat} from '../../../helpers/helpers';
import {DatePicker,Checkbox,Input} from 'element-ui';
import { apiErrorHandler } from '../../../helpers/apiErrorHandler';
import { isPurchaseOrder } from '~/helpers/order';
export default {
    components:{
        DetailListItem,
        DatePicker,
        Checkbox,
        Input
    },
    props:{
        order:{
            type:Object
        }
    },
    data:function(){
        return {
            selectedDate:null,
            preview:null,
            isLoading:false,
            error:null,
            doDiscount:false,
            transactionFee:null,
            transactionFeeBadValue : false

        }
    },
    mounted:function(){
        const today = new Date();
        const dayOfTheWeek = today.getDay();
        this.selectedDate = new Date(today);
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
        isPurchaseOrder,
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
            this.$store.dispatch('orders/getCompleteOrderPreview',{id:this.order.id,date:formatDateToApiFormat(this.selectedDate),transaction_fee:(this.doDiscount  && !isNaN(this.transactionFee))?parseInt(this.transactionFee*100):0}).then(res=>{
                this.preview = res;
            }).catch((err)=>{
                
                this.error = apiErrorHandler(err,null);
            }).finally(()=>{
                this.isLoading = false;
            })
        },
        setTransactionFee:function(value){
            if(!value || (!isNaN(value) && value>=0 && value<=100)){
                this.transactionFeeBadValue = false;
                this.$emit('setTransactionFee',value);
                this.getPreview();
            }
            else{
                this.transactionFeeBadValue = true;
            }
           
        },
        makediscount:function(value){
            if(!value){
                this.$emit('setTransactionFee',null);
            }
        }
    }
}

</script>
<style scoped>

</style>
