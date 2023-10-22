<template>
    <modal
    :show.sync="showExecuteBankPayment"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelExecuteBankPayment"
    :allowOutSideClose="false"
  >
  <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("execute_bank_payment") }}</h5>
    </template>
    <div class="d-flex flex-column align-align-items-center justify-content-center">
        {{ $t('choose_date_to_execute_payment') }}
        <DatePicker v-model="selectedDate" class="mt-3" :placeholder="$t('select_payment_date')"/>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelExecuteBankPayment()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => initiatePayment()"
        :disabled="!selectedDate || isSubmitting"
      >
        {{ $t("execute_payment") }}
      </base-button>
    </template>
    </modal>
</template>
<script>
import {
  DatePicker,
} from "element-ui";
import { formatDateToApiFormat } from "../../helpers/helpers";
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    components: {
        DatePicker,
    },
    props:{
        showExecuteBankPayment:{
            type: Boolean,
            default: false
        },
        selectedOrderProcess:{
            type:Object,
            default:null
        },
        totalNumber:{
            type:Number,
            default:0
        }
    },
    data() {
    return {
      isSubmitting: false,
      selectedDate: null,
    };
  },
    methods:{
        cancelExecuteBankPayment(){
            this.showExecuteBankPayment = false;
            this.$emit("canceled");
        },
        initiatePayment(){
            let orderNumber = 0;
            if(this.totalNumber>999){
                orderNumber  = 999
            }
            else{
                orderNumber = this.totalNumber
            }
            const payload = {
                        order_process_id:this.selectedOrderProcess.id,
                        execution_date:formatDateToApiFormat(this.selectedDate),
                        no_of_orders:orderNumber
                    }

            this.$store.dispatch('orders/executeBankPayment',payload).then((res)=>{
                window.open(res,'_blank');
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        }
    }
}
</script>
