<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-1">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t("stocks") }}</h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
        <div class="row">
            <div class="col">
                <stock-summary :stockType="gold"/>
            </div>
            <div class="col">
                <stock-summary :stockType="silver"/>
            </div>
        </div>
    </div>
    </div>
</template>
<script>
import StockSummary from '@/components/Stocks/StockSummary';
import {assetTypes} from '@/helpers/depots'
export default {
    layout: "DashboardLayout",
    components:{
        StockSummary
    },
    data(){
        return {
            gold : assetTypes.gold,
            silver : assetTypes.silver
        }
    }
}
</script>
<style scoped>

</style>