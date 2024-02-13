<template>
    <modal :show.sync="showModal" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" >
          <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
          <span></span>
        </template>
        <div>
            <div class="text-center">
              <h2 class="card-title mt-3 mb-0 title">{{$t('deposit')}}</h2>
            </div>
            <div class="mt-4">
                <div class="row">
                  
                  <div class="col-md-6">
                    <div class="mb-3">
                      <div class="text-sm">{{ $t('amount') }}</div>
                      <Input class="filterElement mb-0" v-model="amount" :placeholder="$t('0')" type="number" @change="onAmountChange"/>
                      <TextError :textError="$t(validationError.amount)" v-if="validationError.amount!=null"/>
                    </div>
                  </div>
                </div>

                <div class="text-sm">{{ $t('comment') }}
                  <Input class="filterElement" v-model="comment" />
                  <TextError :textError="$t(validationError.comment)" v-if="validationError.comment!=null"/>
                </div>

            </div>
            <div class="mt-4" v-if="!isLoading && error!=null">
                <TextError :textError="error"/>
            </div>
        </div>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose">{{$t('cancel')}}</base-button>
            <base-button type="primary" v-if="!isSubmitting" :disabled="shouldDisableSubmit()" @click="createDeposit">{{$t('add_deposit')}}</base-button>
            <Loader :width="20" :height="20" v-if="isSubmitting"/>
        </template>
    </modal>
</template>
<script>
import {Input} from 'element-ui';
import TextError from '@/components/common/Errors/TextError';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    components:{
        Input,
        
       
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
    },
    data (){
        return {
            
            amount:null,
            comment:'',
            isSubmitting:false,
            error:null,
            validationError:{
                amount:null,
                comment:null,
            }
        }
    },
    methods:{
        onClose(){
            this.$emit('onClose');
        },
        createDeposit(){
            let data = {
                "amount": parseFloat(this.amount)*1000,
                "depot_id": this.depot.id,
                "comment": this.comment,
                };
                this.isSubmitting = true;
            this.$store.dispatch('orders/deposit',data).then(res=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('deposit_created_successfully')})
                this.$store.dispatch('depots/details',this.depot.id);
                this.$emit('onClose');
                this.amount = null;
                this.comment = '';

            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        shouldDisableSubmit(){
            if(this.comment!='' && !isNaN(this.amount)){
                return false;
            }
            else
            {
                return true;
            }
        },
        onAmountChange(value){
            const amount = value *1000
            if(!isNaN(amount))
            {
                this.validationError.amount = null;
            }
            else
            {
                this.validationError.amount = 'deposit_amount_must_be_string'
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
