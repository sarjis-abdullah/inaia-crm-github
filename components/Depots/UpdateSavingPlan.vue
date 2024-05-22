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
            <div class="d-flex flex-row align-content-center mt-3" v-if="selectePaymentMethod=='bank_account'">
                <div class="col-4">
                    {{ $t('payment_accounts') }}
                </div>
                <div class="col-8">
                    <Select
                :placeholder="$t('payment_accounts')"
                v-model="selectedBankAccount"
                >
                    <Option
                    v-for="option in paymentAccounts"
                    :value="option.id"
                    :label="formatPaymentAccountLabel(option)"
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
                    {{ $t('end_date') }}
                </div>
                <div class="col-8">
                    <date-picker
                    v-model="endDate"
                    type="date"
                    :placeholder="$t('end_date')"
                >
            </date-picker>
            </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('monthly_payment') }}
                </div>
                <div class="col-8">
                    <Input v-model="monthlyPayment" :placeholder="$t('monthly_payment')" type="numeric"/>
                </div>
            </div>
            <div class="mt-3 ml-3">
            <checkbox :label="$t('change_target_amount')" v-model="checkChangeTargetAmount" size="meduim"/>
        </div>
            <div v-if="checkChangeTargetAmount">
                <div class="d-flex flex-row align-content-center mt-3">
                    <div class="col-4">
                    {{ $t('target_amount') }}
                </div>
                <div class="col-8">
                    <Input v-model="targetAmount" :placeholder="$t('target_amount')" type="numeric"/>
                </div>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3" v-if="checkChangeTargetAmount">
                <div class="col-4">
                    {{ $t('added_amount') }}
                </div>
                <div class="col-8">
                    <Input v-model="addedAmount" :placeholder="$t('added_amount')" type="numeric"/>
                    <p class="mt-2 text-muted  text-sm-left">{{ $t('added_amount_explanation') }}</p>
                </div>
            </div>
        </form>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose()">
                {{$t('cancel')}}
            </base-button>
            <base-button type="primary" @click="() => saveSavingPlan()"
            :disabled="isSubmitting || (addedAmount!=null && isNaN(addedAmount))">
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
  Input,
  Checkbox
} from "element-ui";
import { formatDateToApiFormat } from '../../helpers/helpers';
import { mapGetters } from "vuex";
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
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
    computed:{
        ...mapGetters({
            paymentAccounts: "payment-accounts/paymentAccounts"
        }),
    },
    mounted(){
        
    },
    components: {
        Checkbox,
        Select,
        Option,
        DatePicker,
        Autocomplete,
        Form,
        FormItem,
        Input,
        
    },
    watch:{
        show:{
            handler(){
                if(this.depot && this.show){
                    this.selectedPaymentDay = this.depot.interval_day;
                    this.startingDate = new Date(this.depot.interval_startdate);
                    const onetimeIndex = this.billingOptions.findIndex(x=>x.id==1);
                    if(this.depot.agio_payment_option == 'onetime'){
                        
                        this.selecteBillingMethod = this.depot.agio_payment_option;
                    }
                    else{
                        this.selecteBillingMethod = this.depot.agio_percentage;
                    }
                    this.selectePaymentMethod = this.depot.payment_method;
                    this.selectedBankAccount == this.depot.payment_account_id;
                    this.monthlyPayment = this.depot.interval_amount/100;
                    this.targetAmount = this.depot.target_amount/100;
                    this.duration = this.calculateDuration(new Date(this.depot.interval_enddate),this.startingDate);
                    this.endDate = new Date(this.depot.interval_enddate);
                    const now = Date.now();
                    if(now >= this.startingDate){
                        this.diableStartDate = true
                    }
                    else{
                        this.diableStartDate = false;
                    }
                    const dayOfMonth = new Date().getDate();
                    if(dayOfMonth > 15){
                        this.shouldDisableIntervalDay = false
                    }
                    else{
                        this.shouldDisableIntervalDay = true
                    }
                }   
            },
            immediate:true
        },
        selectePaymentMethod:{
            handler(){
                this.$store.dispatch('payment-accounts/getPaymentAccountByUser',this.depot.account_id).finally(()=>{
                    this.selectedBankAccount = this.depot.payment_account_id
                })
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
                    value:50,
                    text: '50/50'
                },
                {
                    id:3,
                    value:75,
                    text: "75/25"
                }
            ],
            selectedPaymentDay:null,
            startingDate:null,
            selectePaymentMethod:null,
            selecteBillingMethod:null,
            duration : 0,
            diableStartDate:false,
            shouldDisableIntervalDay:true,
            monthlyPayment:null,
            checkChangeTargetAmount:false,
            addedAmount:null,
            isSubmitting:false,
            targetAmount:null,
            endDate:null,
            selectedBankAccount:null
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
            if(this.endDate){
                //const endDate = this.addYears(this.startingDate,parseInt(this.duration));
                newDepot.interval_enddate =  formatDateToApiFormat(this.endDate);
            }
            if(this.selectedPaymentDay){
                newDepot.interval_day = this.selectedPaymentDay;
            }
            if(this.selectePaymentMethod){
                newDepot.payment_method = this.selectePaymentMethod;
            }
            if(this.selectedBankAccount){
                newDepot.payment_account_id = this.selectedBankAccount;
            }
            if(this.monthlyPayment && this.monthlyPayment > 0){
                newDepot.interval_amount = this.monthlyPayment * 100;
            }
            if(this.selecteBillingMethod){
                
                if(this.selecteBillingMethod == "onetime")
                {
                    newDepot.agio_payment_option = this.selecteBillingMethod;
                    
                }
                else{
                    newDepot.agio_payment_option = "installment";
                    newDepot.agio_percentage = this.selecteBillingMethod;
                    
                }
            }
            if(this.targetAmount && this.targetAmount > 0){
                newDepot.target_amount = this.targetAmount * 100;
            }
            if(this.checkChangeTargetAmount && this.addedAmount){
                    newDepot.agio_increase = this.addedAmount * 100;
            }
            this.isSubmitting = true;
            this.$store.dispatch('depots/submit',newDepot).then(()=>{
                this.$notify({
                    type:'success',
                    message:this.$t('entry_updated_successfully'),
                    duration:5000})
                this.selecteBillingMethod = null;
                this.startingDate = null;
                this.selectedPaymentDay = null;
                this.duration = 0;
                this.selectePaymentMethod = null;
                this.checkChangeTargetAmount = false;
                this.addedAmount = null;
                this.selectedBankAccount = null;
                this.isSubmitting = false;
                this.onClose();
            }).catch((err)=>{
               this.isSubmitting = false;
               apiErrorHandler(err,this.$notify);
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
        },
        formatPaymentAccountLabel(paymentAccount){
            let label = '';
            let iban = '';
            let bankName = '';
            if(paymentAccount && paymentAccount.payment_account_specs ){
                paymentAccount.payment_account_specs.forEach(spec=>{
                    if(spec.name == 'iban'){
                        iban  = spec.value
                    }
                    if(spec.name == 'bank_name'){
                        bankName  = spec.value
                    }
                })
                label = bankName + ' ' + iban
            }
            return label;
        }
    }
}

</script>