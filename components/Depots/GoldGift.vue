<template>
    <modal :show.sync="showModal" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
            <h5 class="modal-title" id="exampleModalLabel">{{$t('gold_gift')}}</h5>           
        </template>
        <div>
            <div class="mb-4 text-center">
            <img src="/img/theme/gold-gift.png" class="logo"/>
            </div>
            <div class="dflex alignItemsCenter justifyContentCenter mt-3">
                <DatePicker class="filterElement" v-model="priceDate" :placeholder="$t('select_gold_price_date')" @change="getPrice"/>
                <TextError :textError="$t(validationError.date)" v-if="validationError.date!=null"/>
                <Input class="filterElement" v-model="amount" :placeholder="$t('enter_gift_gold_amount')" type="number" @change="onAmountChange"/>
                <TextError :textError="$t(validationError.amount)" v-if="validationError.amount!=null"/>
                <Input class="filterElement" v-model="comment" :placeholder="$t('enter_gift_gold_comment')"/>
                <TextError :textError="$t(validationError.comment)" v-if="validationError.comment!=null"/>
            </div>
            <div class="mt-4" v-if="isLoading">
                <Loader/>
            </div>
            <div class="mt-4" v-if="!isLoading && error!=null">
                <TextError :textError="error"/>
            </div>
            <div class="mt-4 list-group list-group-flush" v-if="!isLoading && error==null && currnetPrice!=null">
                <detail-list-item :title="$t('gold_price_sell')"><div slot="value">{{$n(currnetPrice.au_bid)}} €</div></detail-list-item>
                <detail-list-item :title="$t('gold_price_buy')"><div slot="value">{{$n(currnetPrice.au_ask)}} €</div></detail-list-item>
                <detail-list-item :title="$t('gold_price_average')"><div slot="value">{{$n(currnetPrice.au_avg)}} €</div></detail-list-item>
            </div>
        </div>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose">{{$t('cancel')}}</base-button>
            <base-button type="primary" v-if="!isSubmitting" :disabled="shouldDisableSubmit()" @click="createGoldGift">{{$t('gold_gift')}}</base-button>
            <Loader :width="20" :height="20" v-if="isSubmitting"/>
        </template>
    </modal>
</template>
<script>
import {Input,DatePicker} from 'element-ui';
import DetailListItem from '@/components/common/DetailListItem.vue';
import {formatDateToApiFormat} from '../../helpers/helpers';
import Loader from '@/components/common/Loader/Loader';
import TextError from '@/components/common/Errors/TextError';
export default {
    components:{
        Input,
        DatePicker,
        DetailListItem,
        Loader,
        TextError,
    },
    props:{
        showModal:{
            type:Boolean,
            default:false
        },
        depot:{
            type:Object,
            default:null
        },
        user:{
            type:Object,
            default:null
        }
    },
    data (){
        return {
            priceDate: null,
            amount:null,
            comment:'',
            isSubmitting:false,
            isLoading:false,
            error:null,
            currnetPrice:null,
            validationError:{
                date:null,
                amount:null,
                comment:null,
            }
        }
    },
    methods:{
        onClose(){
            this.$emit('onClose');
        },
        createGoldGift(){
            let data = {
                "amount": parseFloat(this.amount)*1000,
                "depot_id": this.depot.id,
                "comment": this.comment,
                "price_date": formatDateToApiFormat(this.priceDate)
                };
                this.isSubmitting = true;
            this.$store.dispatch('orders/orderGoldGift',data).then(res=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('gold_gift_successfully')})
            }).catch(()=>{
                this.$notify({type: 'error', timeout: 5000, message: this.$t('gold_gift_unsuccessfully')})
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        shouldDisableSubmit(){
            if(this.comment!='' && !isNaN(this.amount) && this.amount*1000>=999 && this.priceDate && typeof this.priceDate.getMonth === 'function'){
                return false;
            }
            else
            {
                return true;
            }
        },
        getPrice:function()
        {
            const today = new Date();
            if(this.selectedDate>today)
            {
                this.validationError.date = 'select_right_preview_date';
                return;
            }
            this.validationError.date = null;
            this.error = null;
            this.isLoading = true;
            this.$store.dispatch('depots/getGoldPriceByDate',formatDateToApiFormat(this.priceDate)).then(res=>{
                this.currnetPrice = res;
            }).catch(err=>{
                this.error = 'cant_load_preview'
            }).finally(()=>{
                this.isLoading = false;
            })
        },
        onAmountChange(value){
            if(!isNaN(value) && value*1000>=999)
            {
                this.validationError.amount = null;
            }
            else
            {
                this.validationError.amount = 'add_gold_gift_amount'
            }
        }
    },
    
}
</script>
<style scoped>
.logo {
    width: 120px;
    height: 120px;
}
.filterElement {
  margin-bottom: 15px;
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.filterElement input {

    height: 40px !important;
    line-height: 40px !important;
    font-size: 0.875rem;
}
</style>