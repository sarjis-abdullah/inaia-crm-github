<template>
     <modal :show.sync="show"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" >
            <h5 class="modal-title">{{$t('create_claim')}}</h5>
        </template>
        <form>
            <div class="d-flex flex-row align-content-center">
                <div class="col-4">
                    {{ $t('claim_type') }}
                </div>
                <div class="col-8">
                    <Select
                :placeholder="$t('claim_type')"
                v-model="selectedClaimType"
                
                >
                    <Option
                    v-for="option in claimTypes"
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
                    {{ $t('amount') }}
                </div>
                <div class="col-8">
                    <Input v-model="amount" :placeholder="$t('amount')" type="numeric"/>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('reference') }}
                </div>
                <div class="col-8">
                    <Input v-model="reference" :placeholder="$t('reference')"/>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('reference') }}
                </div>
                <div class="col-8">
                    <Input v-model="reference" :placeholder="$t('reference')"/>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('comment') }}
                </div>
                <div class="col-8">
                    <Input v-model="comment" :placeholder="$t('comment')"/>
                </div>
            </div>
        </form>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose()">
                {{$t('cancel')}}
            </base-button>
            <base-button type="primary" @click="() => createNewClaim()"
            :disabled="isSubmitting || notValid">
                {{$t('save')}}
            </base-button>
        </template>
     </modal>
</template>
<script>
import { Select,Option,Input } from 'element-ui';
    export default {
        components:{
            Select,Option,Input
        },
        props:{
            account_id:{
                type:Number,
                default:-1
            },
            show:{
                type: Boolean,
                default: false
            },
        },
        watch:{
            show:{
                handler(){
                    if(!this.show){
                        this.selectedClaimType = null;
                        this.amount = null;
                        this.reference = null;
                        this.comment = null;
                        this.isSubmitting = false;
                        this.notValid = true;
                    }
                }
            },
            selectedClaimType:{
                handler(){
                    if(this.amount && this.selectedClaimType){
                        this.notValid = false
                    }else{
                        this.notValid = true
                    }
                },
                immediate:true
            },
            amount:{
                handler(){
                    if(this.amount && this.selectedClaimType){
                        this.notValid = false
                    }else{
                        this.notValid = true
                    }
                },
                immediate:true
            }
        },
        data(){
            return{
                selectedClaimType:null,
                claimTypes:[
                    {
                        id:1,
                        value:'agio',
                        text:this.$t('agio')
                    },
                    {
                        id:2,
                        value:'gold_storage_fee',
                        text:this.$t('gold_storage_fee')
                    },
                    {
                        id:3,
                        value:'gold_storage_fee',
                        text:this.$t('silver_storage_fee')
                    },
                    {
                        id:4,
                        value:'direct_debit_return',
                        text:this.$t('direct_debit_return')
                    }
                ],
                amount:null,
                reference:null,
                comment:null,
                isSubmitting : false,
                notValid:true
            }
        },
        methods:{
            onClose(){
                this.$emit('closed');
            },
            createNewClaim(){
                let data = {
                    'account_id' : this.account_id,
                    'amount' : this.amount*100,
                    'claim_type':this.selectedClaimType
                }
                if(this.comment){
                    data.comment = this.comment;
                }
                if(this.reference){
                    data.reference = this.reference;
                }
                this.isSubmitting = true;
                this.$store.dispatch('claims/createNewClaim',data).then(()=>{
                    this.$notify({
                    type:'success',
                    message:this.$t('success_creating_claim'),
                    duration:5000})
                    this.onClose();
                }).catch(err=>{
                    
                    this.$notify({
                    type:'error',
                    message:err.message,
                    duration:5000})
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
        }
    }
</script>