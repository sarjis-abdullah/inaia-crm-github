<template>
    <modal :show.sync="showModal" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
          <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
          <span></span>
        </template>
        <div>
            <div class="text-center">
              <img src="/img/theme/gold-gift.png" class="icon"/>
              <h2 class="card-title mt-3 mb-0 title">{{$t('gold_gift')}}</h2>
            </div>
            <div class="mt-4">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-sm">{{ $t('date') }}</div>
                      <DatePicker class="filterElement mb-0" v-model="priceDate" placeholder="" @change="getPrice"/>
                      <TextError :textError="$t(validationError.date)" v-if="validationError.date!=null"/>
                    </div>
                  </div>
                  <div class="col-md-6 my-auto">
                   
                      <div>{{ $t('gram_price') }} : {{ $n(fixingPriceGram) }} €</div>
                      <div>{{ $t('ounce_price') }} : {{ $n(fixingPriceOunce) }} €</div>
                  
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-sm">{{ $t('gold_amount') }} ( g )</div>
                      <Input class="filterElement mb-0" v-model="amount" :placeholder="$t('0')" type="number" @change="onGramChanged"/>
                      <TextError :textError="$t(validationError.amount)" v-if="validationError.amount!=null"/>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-sm">{{ $t('amount') }} ( € )</div>
                      <Input class="filterElement mb-0" v-model="moneyAmount" :placeholder="$t('0')" type="number" @change="onMoneyChanged"/>
                    </div>
                  </div>
                </div>

                <div class="text-sm">{{ $t('comment') }}
                  <Input class="filterElement" v-model="comment" />
                  <TextError :textError="$t(validationError.comment)" v-if="validationError.comment!=null"/>
                </div>

            </div>

            <div class="mt-4" v-if="isLoading">
                <Loader/>
            </div>
            <div class="mt-4" v-if="!isLoading && error!=null">
                <TextError :textError="error"/>
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
import { assetTypes } from '@/helpers/depots';
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
            moneyAmount:null,
            comment:'',
            isSubmitting:false,
            isLoading:false,
            error:null,
            
            fixingPriceGram:0,
            fixingPriceOunce:0,
            validationError:{
                date:null,
                amount:null,
                comment:null,
            }
        }
    },
    watch:{
        moneyAmount:{
            handler(){
                
                
            },
            immediate: true
        },
        priceDate:{
            handler(){
                
                if(this.fixingPriceGram > 0){
                    if(this.moneyAmount > 0){
                        const amount = this.moneyAmount *100;
                        const gramAmount = amount / (this.fixingPriceGram * 100)
                        if(!isNaN(gramAmount) && gramAmount>=100)
                        {
                            this.validationError.amount = null;
                            this.amount = gramAmount;
                        }
                        else
                        {
                            this.validationError.amount = 'add_gold_gift_amount'
                        }
                    }
                    else if(this.gramAmount > 0){
                        this.moneyAmount = (amount * this.fixingPriceGram * 100)/100000;

                    }
                    
                }
                
            },
            immediate: true
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
                this.amount = null;
                this.priceDate = null;
                this.comment = '';
                this.fixingPriceGram = 0,
                this.fixingPriceOunce = 0,
                this.validationError= {
                date:null,
                amount:null,
                comment:null,
                
            }
            this.error = null;
            this.$emit('onClose');
                this.$notify({type: 'success', timeout: 5000, message: this.$t('gold_gift_successfully')})
            }).catch(()=>{
                this.$notify({type: 'error', timeout: 5000, message: this.$t('gold_gift_unsuccessfully')})
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        shouldDisableSubmit(){
            if(this.comment!='' && !isNaN(this.amount) && this.amount*1000>=100 && this.priceDate && typeof this.priceDate.getMonth === 'function' && this.fixingPriceGram > 0){
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
            if(this.priceDate>today)
            {
                this.validationError.date = 'select_right_preview_date';
                return;
            }
            this.validationError.date = null;
            this.error = null;
            this.isLoading = true;
            const dbDate = formatDateToApiFormat(this.priceDate);
            
            if(this.depot.depot_type.name_translation_key == assetTypes.gold)
            {
                this.$store.dispatch('gold/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1)
                    {
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                        if(this.moneyAmount > 0){
                            this.onMoneyChanged(this.moneyAmount);
                        }
                        else if(this.amount){
                            this.onGramChanged(this.amount);
                        }
                    }
                    else{
                        this.fixingPriceGram = 0;
                        this.fixingPriceOunce = 0;
                        this.validationError.date = 'cant_load_preview'
                    }
                    
                }).catch(err=>{
                    this.fixingPriceGram = 0;
                        this.fixingPriceOunce = 0;
                        this.error = 'cant_load_preview'
                    }).finally(()=>{
                        this.isLoading = false;
                    })
            }
            if(this.depot.depot_type.name_translation_key == assetTypes.silver)
            {
                this.$store.dispatch('silver/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1){
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                        if(this.moneyAmount > 0){
                            this.onMoneyChanged(this.moneyAmount);
                        }
                        else if(this.amount){
                            this.onGramChanged(this.amount);
                        }
                    }
                    else{
                        this.fixingPriceGram = 0;
                        this.fixingPriceOunce = 0;
                        this.validationError.date = 'cant_load_preview'
                    }
                    
                }).catch(err=>{
                    this.fixingPriceGram = 0;
                        this.fixingPriceOunce = 0;
                    this.validationError.date = 'cant_load_preview'
                    }).finally(()=>{
                        this.isLoading = false;
                    })
            }
        },
        onGramChanged(value){
            const amount = value *1000
            if(!isNaN(amount) && amount>=100)
            {
                this.validationError.amount = null;
                this.moneyAmount = value * this.fixingPriceGram;
            }
            else
            {
                this.validationError.amount = 'add_gold_gift_amount'
            }
        },
        onMoneyChanged(value){
            
            if(this.fixingPriceGram > 0){
                const gramAmount = (value / (this.fixingPriceGram))
                if(!isNaN(gramAmount) && (gramAmount*1000)>=100)
                {
                    this.validationError.amount = null;
                    this.amount = parseFloat(gramAmount).toFixed(3);
                }
                else
                {
                    this.validationError.amount = 'add_gold_gift_amount'
                }
            }
        }
    },

}
</script>
<style scoped>
.icon {
    width: 90px;
    height: 90px;
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
