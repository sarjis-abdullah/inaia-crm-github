<template>
    <modal :show.sync="showDetail" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
        </template>
        
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
                        <i18n-n :value="parseInt(claim.amount) / 100" ></i18n-n> €
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
                <detail-list-item :title="$t('comment')" >
                    <div slot="value">
                        {{
                    claim.comment
                  }}
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
            </div>
        <template slot="footer" v-if="!confirming">
            
                       
                        <base-button type="white" class="text-danger" 
                        @click="askToConfirm('delete')"
                        :disabled="isSubmitting" v-if="claim.claim_status && (claim.claim_status.name_translation_key=='pending' || claim.claim_status.name_translation_key=='payment_failed')">
                          <i class="lnir lnir-trash mr-1"></i>{{$t('delete')}}
                        </base-button>
                        <base-button @click="askToConfirm('cancel')" type="danger" :disabled="isSubmitting" v-if="claim.claim_status && (claim.claim_status.name_translation_key=='pending' || claim.claim_status.name_translation_key=='payment_failed')">
                        {{$t('cancel_claim')}}
                        </base-button>
                        <base-button type="primary" @click="askToConfirm('markpaid')" :disabled="isSubmitting" v-if="claim.claim_status && (claim.claim_status.name_translation_key=='pending' || claim.claim_status.name_translation_key=='payment_failed')">
                        {{$t('mark_as_paid')}}
                        </base-button>
        </template>
        <template v-else slot="footer">
            <base-button type="link" class="ml-auto" @click="cancelConfirmation">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="primary" class="ml-auto" @click="confirmAction()">
                          {{$t('confirm')}}
                        </base-button>
        </template>
    </modal>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import Status from "@/components/Claims/Status";
import UserInfo from '@/components/Contacts/UserInfo';
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
        UserInfo
    },
    data(){
        return{
            confirming:false,
            selectedAction:'',
            isSubmitting:false

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
        confirmAction(){
            if(this.selectedAction == "delete"){
                this.isSubmitting = true;
                this.$store.dispatch('claims/deleteSingleClaim',this.claim.id).then(()=>{
                this.$notify({
                    type: "success",
                    timeout: 5000,
                    message: this.$t("claim_deleted_successfully"),
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
            
        },
        onDetailClose(){
            this.$emit('closed');
        }
    }
}
</script>
