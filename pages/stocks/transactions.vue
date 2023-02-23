<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-4">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t(stockType)+$t("stock_transactions") }}</h6>
        </div>
      </div>
    </base-header>
        <div class="container-fluid mt--6">
        <StockList :depotType="depotType" :stockType="stockType" v-if="depotType!=-1 && stockType"/>
        </div>
    </div>
</template>
<script>
import StockList from '@/components/Stocks/StockList';
import {stockTypes} from '@/helpers/stocks';
export default {
    layout: "DashboardLayout",
    components:{
        StockList
    },
    data(){
        return {
            depotType:-1,
            stockType:null
        }
    },
    mounted(){
        const {depot_type,stock_type} = this.$route.query;
        if(depot_type)
        {
            this.depotType = depot_type;
        }
        if(stock_type)
        {
            this.stockType = stock_type;
        }
    }
}
</script>