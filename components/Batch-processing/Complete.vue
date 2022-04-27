<template>
    <modal :show.sync="showConfirmComplete"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="cancelConfirmComplete" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
                        <h5 class="modal-title">{{$t('confirm_batch_complete_title')}}</h5>
                        <span></span>
                    </template>
        <div class="d-flex align-align-items-center justify-content-center" v-if="selectedOrderProcess">
          {{$t('confirm_batch_complete_text')+selectedOrderProcess.id+" ?"}}
        </div>
        <template slot="footer">
                        <base-button type="link" class="ml-auto" @click="cancelConfirmComplete()">
                          {{$t('cancel')}}
                        </base-button>
                        <base-button type="primary" @click="() => markAsComplete()"
                            :disabled="isSubmitting">
                          {{$t('mark_as_complete')}}
                        </base-button>
                    </template>
    </modal>
</template>
<script>
export default{
    props:{
        showConfirmComplete:{
            type: Boolean,
            default: false
        },
        selectedOrderProcess:{
            type: Object,
            default: null,
        }
    },
    data(){
        return {
            isSubmitting: false
        }
    },
    methods:{
        cancelConfirmComplete(){
            this.showConfirmComplete = false;
            this.selectedOrderProcess = null;
            this.$emit('canceled');
        },
        markAsComplete()
        {
            this.isSubmitting = true;
            this.$store.dispatch("batch-processing/markAsComplete",this.selectedOrderProcess.id).then(()=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('order_batch_completed_successfully')});
                this.cancelConfirmComplete();
                this.$emit('completed');
            }).catch(()=>{
                this.$notify({type: 'danger', timeout: 5000, message: this.$t('order_batch_completed_unsuccessfully')})
            }).finally(()=>{
                this.isSubmitting = false;
            })
        }
    }
}
</script>