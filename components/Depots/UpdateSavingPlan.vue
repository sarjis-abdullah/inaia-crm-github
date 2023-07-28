<template>
    <modal :show.sync="show"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" >
            <h5 class="modal-title">{{$t('edit_saving_plan')}}</h5>
        </template>
        <form>
            <div class="d-flex flex-row align-content-center">
                <div class="col-4">
                    {{ $t('interval_day') }}
                </div>
                <div class="col-8">
                    <Select
                :placeholder="$t('interval_day')"
                v-model="selectedPaymentDay"
                disabled
                
                >
                    <Option
                    v-for="option in paymentDayOptions"
                    :value="option.value"
                    :label="option.text"
                    :key="option.id"
                    >
                    </Option>
                </Select>
            </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('billing_method') }}
                </div>
                <div class="col-8">
                    <Select
                :placeholder="$t('billing_method')"
                v-model="selecteBillingMethod"
                
                >
                    <Option
                    v-for="option in billingOptions"
                    :value="option.value"
                    :label="option.text"
                    :key="option.id"
                    >
                    </Option>
                </Select>
            </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('payment_method') }}
                </div>
                <div class="col-8">
                    <Select
                :placeholder="$t('payment_method')"
                v-model="selectePaymentMethod"
                disabled
                >
                    <Option
                    v-for="option in paymentMethods"
                    :value="option.value"
                    :label="option.text"
                    :key="option.id"
                    >
                    </Option>
                </Select>
            </div>
            </div>

            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('start_date') }}
                    
                </div>
                <div   class="col-8">
                <date-picker
                    v-model="startingDate"
                    type="date"
                    :placeholder="$t('start_date')"
                    :disabled="true"
                >
            </date-picker>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('duration') }} {{$t('in')}} {{$t('years')}}
                </div>
                <div class="col-8">
                    <Input v-model="duration" placeholder="duration" type="numeric" disabled/>
                </Select>
            </div>
            </div>
            
        </form>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose()">
                {{$t('cancel')}}
            </base-button>
            <base-button type="primary" @click="() => saveSavingPlan()"
            :disabled="isSubmitting">
                {{$t('save')}}
            </base-button>
        </template>
    </modal>
</template>
<script>
import {
  Select,
  Option,
  DatePicker,
  Autocomplete,
  Form,
  FormItem,
  Input
} from "element-ui";
import { json } from 'd3';
import { formatDateToApiFormat } from '../../helpers/helpers';
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        depot:{
            type : Object,
            default: null
        },
    },
    mounted(){
        console.log(this.depot);
        
    },
    components: {
        Select,
        Option,
        DatePicker,
        Autocomplete,
        Form,
        FormItem,
        Input
    },
    watch:{
        show:{
            handler(){
                if(this.depot && this.show){
                    this.selectedPaymentDay = this.depot.interval_day;
                    this.startingDate = new Date(this.depot.interval_startdate);
                    this.selecteBillingMethod = this.depot.agio_payment_option;
                    this.selectePaymentMethod = this.depot.payment_method;
                    this.duration = this.calculateDuration(new Date(this.depot.interval_enddate),this.startingDate);
                    const now = Date.now();
                    console.log(this.startingDate)
                    if(now >= this.startingDate){
                        this.diableStartDate = true
                    }
                    else{
                        this.diableStartDate = false;
                    }
                }   
            },
            immediate:true
        }
    },
    data(){
        return {
            paymentDayOptions:[
                {
                    id:1,
                    value:1,
                    text: this.$t('1')
                },
                {
                    id:2,
                    value:15,
                    text: this.$t('15')
                }
            ],
            paymentMethods:[
                {
                    id:1,
                    value:'bank_account',
                    text: this.$t('bank_account')
                },
                {
                    id:2,
                    value:'bank_transfer',
                    text: this.$t('bank_transfer')
                }
            ],
            billingOptions:[
                {
                    id:1,
                    value:'onetime',
                    text: this.$t('onetime')
                },
                {
                    id:2,
                    value:'installment',
                    text: this.$t('installment')
                }
            ],
            selectedPaymentDay:null,
            startingDate:null,
            selectePaymentMethod:null,
            selecteBillingMethod:null,
            duration : 0,
            diableStartDate:false
        }
    },
    methods:{
        saveSavingPlan(){
            let newDepot = {
                id:this.depot.id,
            };
            if(this.startingDate){
                newDepot.interval_startdate = formatDateToApiFormat(this.startingDate);
            }
            if(!isNaN(this.duration) && this.duration > 0){
                newDepot.interval_enddate =  formatDateToApiFormat(this.addYears(this.startingDate,this.duration));
            }
            if(this.selectedPaymentDay){
                newDepot.interval_day = this.selectedPaymentDay;
            }
            if(this.selectePaymentMethod){
                newDepot.payment_method = this.selectePaymentMethod;
            }
            if(this.selecteBillingMethod){
                newDepot.agio_payment_option = this.selecteBillingMethod;
            }
            this.$store.dispatch('depots/submit',newDepot).then(()=>{
                this.$notify({
                    type:'success',
                    message:this.$t('success_updating_saving_plan'),
                    duration:5000})
                this.selecteBillingMethod = null;
                this.startingDate = null;
                this.selectedPaymentDay = null;
                this.duration = 0;
                this.selectePaymentMethod = null;
                this.onClose();
            }).catch((err)=>{
                console.log(err);
                this.$notify({
                    type:'error',
                    message:this.$t('error_updating_saving_plan'),
                    duration:5000})
            })
        },
        addYears(date, years) {
            date.setFullYear(date.getFullYear() + years);
            return date;
        },
        onClose(){
            this.$emit('closed');
        },
        calculateDuration(endDate,startDate){
            var diff =(endDate.getTime() - startDate.getTime()) / 1000;
            diff /= (60 * 60 * 24);
            return Math.abs(Math.round(diff/365.25));
        }
    }
}

</script>