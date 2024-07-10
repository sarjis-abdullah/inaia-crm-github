<template>
    <modal :show.sync="showDetail" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
        </template>
        <div v-if="!iNotifying">
            <div class="list-group list-group-flush" v-if="!confirming">
                <detail-list-item :title="$t('status')" >
                    <Status slot="value" :status='claim.claim_status ? claim.claim_status.name_translation_key : ""'/>
                        
                </detail-list-item>
                <detail-list-item :title="$t('type')" >
                    <div slot="value">
                        {{
                        claim.claim_type ? $t(claim.claim_type.name_translation_key) : ""
                    }}
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('amount')" >
                    <div slot="value">
                        <i18n-n :value="parseInt(claim.amount) / 100" ></i18n-n> {{ currency }}
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('date')" >
                    <div slot="value">
                        {{claim.created_at?$d(new Date(claim.created_at),'short'):""}}
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('reference')" >
                    <div slot="value">
                        {{
                    claim.reference
                  }}
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('payment_method')" v-if="paymentmethod && !isEditingPaymentMethod">
                    <div slot="value">
                        {{
                    $t(paymentmethod)
                  }}
                    </div> 
                </detail-list-item>
                <div v-else>

                </div>
                <detail-list-item :title="$t('batch_claims')" v-if="claim && claim.claim_batch_process_id">
                    <div slot="value">
                        <nuxt-link :to="'/accounting/claims/batch-claims/details/'+claim.claim_batch_process_id">{{
                    claim.claim_batch_process_id
                  }}</nuxt-link>
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('comment')" >
                    <div slot="value">
                        {{
                    claim.comment
                  }}
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('debit_date')" v-if="claim.possible_debit_date">
                    <div slot="value">
                        {{claim.possible_debit_date?$d(new Date(claim.possible_debit_date),'short'):""}}  {{ numberOfDaysLeft }} 
                    </div>
                </detail-list-item>
                <detail-list-item :title="$t('depot')" >
                    <div slot="value"><nuxt-link :to="'/depots/details/'+claim.depot_id">{{
                    claim.depot_number?claim.depot_number:claim.depot_id
                  }}</nuxt-link></div>
                </detail-list-item>
                <detail-list-item :title="$t('order')" >
                    <div slot="value">{{ claim.order_id }}</div>
                </detail-list-item>
                <detail-list-item :title="$t('client')" >
                    <UserInfo :accountId="claim.account_id" slot="value" :isLazy="true"/>
                </detail-list-item>
                <detail-list-item :title="$t('created_by')">
                    <UserInfo :accountId="claim.created_by" slot="value" :isLazy="true"/>
                </detail-list-item>
                <detail-list-item :title="$t('updated_by')">
                    <UserInfo :accountId="claim.updated_by" slot="value" :isLazy="true"/>
                </detail-list-item>
                <PaymentTransactions v-if="claim.claim_payment_transactions && claim.claim_payment_transactions.length>0" :claim="claim"/>
            </div>
            <div v-else>
                <div v-if="selectedAction == 'markpaid'">
                    {{$t('do_you_want_to_mark_claim_as_paid')}}
                </div>
                <div v-if="selectedAction == 'delete'">
                    {{$t('do_you_want_to_delete_this_claim')}}
                </div>
                <div v-if="selectedAction == 'cancel'">
                    {{$t('do_you_want_to_cancel_this_claim')}}
                </div>
                <div v-if="selectedAction == 'notifyuser'">
                    {{$t('do_you_want_to_notify_the_user')}}
                </div>
                <div v-if="selectedAction == 'initiatepayment'">
                    <date-picker
            size="large"
            v-model="paymentExecutionDate"
            type="date"
            :placeholder="$t('select_execution_date')"
          >

          </date-picker>
          <div class="text-danger mt-3" v-if="!isAfterOrEqualDueDate"> {{ $t('payment_date_after') }} {{ claim.possible_debit_date?$d(new Date(claim.possible_debit_date),'short'):"" }}</div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="d-flex justify-content-center align-items-center">
                <loader class="mx-auto"/>
            </div>
            <div class="mt-3 text-center">
                Please wait until the form get updated...
            </div>
        </div>
        <template slot="footer" v-if="!confirming && !iNotifying">
            
                       
                        <base-button type="white" class="text-danger" 
                        @click="askToConfirm('delete')"
                        :disabled="isSubmitting" v-if="claim.claim_status && (claim.claim_status.name_translation_key=='pending' || claim.claim_status.name_translation_key=='payment_failed')">
                          <i class="lnir lnir-trash mr-1"></i>{{$t('delete')}}
                        </base-button>
                        <base-button @click="askToConfirm('cancel')" type="danger" :disabled="isSubmitting" v-if="claim.claim_status && (claim.claim_status.name_translation_key=='pending' || claim.claim_status.name_translation_key=='payment_failed')">
                        {{$t('cancel_claim')}}
                        </base-button>
                        <base-button type="primary" @click="askToConfirm('markpaid')" :disabled="isSubmitting" v-if="shouldShowAnyAction">
                        {{$t('mark_as_paid')}}
                        </base-button>
                        <base-button type="primary" @click="askToConfirm('initiatepayment')" :disabled="isSubmitting" v-if="shouldShowAnyAction && paymentmethod!='bank_transfer'">
                        {{$t('initiate_payment')}}
                        </base-button>
                        <base-button type="primary" @click="askToConfirm('notifyuser')" :disabled="isSubmitting" v-if="shouldNotify">
                        {{$t('notify_user')}}
                        </base-button>
        </template>
        <template v-else-if="!iNotifying" slot="footer">
            <base-button type="link" class="ml-auto" @click="cancelConfirmation">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="primary" class="ml-auto" @click="confirmAction()" :disabled="isSubmitting || (selectedAction == 'initiatepayment' && !isAfterOrEqualDueDate)">
                          {{$t('confirm')}}
                        </base-button>
        </template>
    </modal>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import Status from "@/components/Claims/Status";
import UserInfo from '@/components/Contacts/UserInfo';
import { DatePicker } from "element-ui";
import { formatDateToApiFormat } from '../../helpers/helpers';
import moment from 'moment'
import Loader from '../common/Loader/Loader.vue';
import PaymentTransactions from '@/components/Claims/Payments/PaymentTransactions';
import { getCurrencySymbol } from '@/helpers/currency';
export default {
    props:{
        showDetail:{
            type: Boolean,
            default: false
        },
        claim: {
            type: Object,
            default: null
        }
    },
    components:{
        DetailListItem,
        Status,
        UserInfo,
        DatePicker,
        Loader,
        PaymentTransactions
    },
    data(){
        return{
            confirming:false,
            selectedAction:'',
            isSubmitting:false,
            paymentExecutionDate:null,
            iNotifying:false,
            isEditingPaymentMethod:false

        }
    },
    computed :{
        shouldShowAnyAction(){
            return this.claim && this.claim.claim_status && (this.claim.claim_status.name_translation_key == 'pending' || this.claim.claim_status.name_translation_key == 'payment_failed')
        },
        isAfterOrEqualDueDate(){
            if(this.paymentExecutionDate ){
                let expDate = moment(this.paymentExecutionDate);
                const dueDate = this.claim.possible_debit_date?(moment(this.claim.possible_debit_date)):null;
                    if(dueDate)
                    {
                        if(dueDate.isSameOrBefore(expDate)){
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                    return true;
            }
            return false;
        },
        numberOfDaysLeft(){
            if(this.claim && this.claim.possible_debit_date){
                let now = moment();
                let dueDate = moment(this.claim.possible_debit_date);
                const numOfDays = dueDate.diff(now,'days')
                if(numOfDays>0) return '( in '+numOfDays+' days)';
                else return ''
            }
            else{
                return '';
            }
        },
        shouldNotify(){
            if(this.claim && this.claim.possible_debit_date==null && this.claim.claim_status.name_translation_key == 'pending'){
                return true;
            }
            return false;
        },
        paymentmethod(){
        if(this.claim && this.claim.claim_payment_transactions && this.claim.claim_payment_transactions.length >0){
          const transaction = this.claim.claim_payment_transactions[this.claim.claim_payment_transactions.length-1];
          if(transaction){
            return transaction.payment_method;
          }
        }
      },
      currency(){
        return getCurrencySymbol(this.claim.currency);
      }
    },
    methods:{
        askToConfirm(action){
            this.selectedAction = action;
            this.confirming = true;
        },
        cancelConfirmation(){
            this.selectedAction = "";
            this.confirming = false;
        },
        startEditingPaymentMethod(){
            this.isEditingPaymentMethod = true;
        },
        confirmAction(){
            if(this.selectedAction == "delete"){
                this.isSubmitting = true;
                this.$store.dispatch('claims/deleteSingleClaim',this.claim.id).then(()=>{
                this.$notify({
                    type: "success",
                    timeout: 5000,
                    message: this.$t("entry_deleted_successfully"),
                });
                this.$emit('changed');
                }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
                }).finally(()=>{
                    this.isSubmitting = false;
                });
            }
            if(this.selectedAction == "markpaid"){
                this.isSubmitting = true;
                this.$store.dispatch('claims/markSingleClaimAsPaid',this.claim.id).then(()=>{
                this.$notify({
                type: "success",
                timeout: 5000,
                message: this.$t("claim_marked_paid_successfully"),
                });
                this.$emit('changed');
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                    this.isSubmitting = false;
                });;
            }
            if(this.selectedAction == "cancel"){
                this.isSubmitting = true;
                this.$store.dispatch('claims/cancelClaim',this.claim.id).then(()=>{
                this.$notify({
                type: "success",
                timeout: 5000,
                message: this.$t("claim_canceled_successfully"),
                });
                this.$emit('changed');
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                    this.isSubmitting = false;
                });;
            }
            if(this.selectedAction == "initiatepayment"){
                this.isSubmitting = true;
                let data = {
                    execution_date: formatDateToApiFormat(this.paymentExecutionDate),
                    claim_ids:[this.claim.id]
                };
                this.$store.dispatch('claims/initiateClaimPayment',data).then((res)=>{

                    this.paymentExecutionDate = null;
                    window.open(res,'_blank');

                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify)
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
            if(this.selectedAction == "notifyuser"){
                let data = {
                    claim_ids:[this.claim.id]
                };
                this.iNotifying = true;
                this.$store.dispatch('claims/notifyuser',data).then(()=>{
                this.$notify({
                type: "success",
                timeout: 5000,
                message: this.$t("user_notified__successfully"),
                
                });
                setTimeout(()=>{
                    this.$emit('onUserNotified')
                    this.iNotifying = false;
                },7000)
                
                
                this.cancelConfirmation()
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
                this.isSubmitting = false;
            }).finally(()=>{
                    
                });;
            }
            
        },
        onDetailClose(){
            this.$emit('closed');
        }
    }
}
</script>
<style scoped>
.modal.show {
    overflow-y: auto;
}
</style>