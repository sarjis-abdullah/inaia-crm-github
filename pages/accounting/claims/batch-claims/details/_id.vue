<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("claim_batch_process") + " : " + processId }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row" v-if="batchDetails">
        <div class="col-xl-4 col-md-6">
        <div class="card border-0">
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <h5 class="card-title text-uppercase text-muted mb-0 mr-2">
                    {{ $t("progress") }}
                  </h5>
                  <div>
                    {{ $t("total_claim_count") }}:
                    {{ batchDetails.total_claims }}
                  </div>
                  <div>
                    {{ $t("paid") }}:
                    {{ batchDetails.paid_claims }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="float-right mt-2">
                    <div>
                    {{ $t("total_amount") }}:
                    <i18n-n :value="batchDetails.total_amount/100"></i18n-n>
                    €
                    </div>
                    <div>
                        {{ $t("paid_amount") }}:
                        <i18n-n :value="batchDetails.paid_amount/100"></i18n-n>
                    €
                    </div>
                    
                  </div>
                </div>
                
              </div>
              
            </div>
          </div>
      </div>
      <div class="col-xl-4 col-md-6">
          <div class="card border-0">
            <div class="card-body d-flex justify-content-center">
            <Progress
                      type="dashboard"
                      :percentage="progressPercentage"
                      color="#2dce89"
                      :width="70"
                    />
                </div>
          </div>
      </div>
    </div>
      <ClaimList :batch_process_id="processId" />
    </div>
    </div>
</template>
<script>
import ClaimList from '@/components/Claims/ClaimList';
import { Progress } from 'element-ui'
export default {
  layout: "DashboardLayout",
  components : {
    ClaimList,
    Progress
  },
  data(){
    return{
        processId: this.$route.params.id,
        batchDetails:null
    }
  },
  computed:{
    progressPercentage(){
        if(this.batchDetails && this.batchDetails.total_amount > 0){
            return Math.floor((this.batchDetails.paid_amount/this.batchDetails.total_amount) *100)
        }
    }
  },
  mounted(){
    if(this.processId>-1){
        this.$store.dispatch('batch-claims/getDetailsOfBatch',this.processId).then((data)=>{
            this.batchDetails = data;
        })
    }
    
  }
}
</script>