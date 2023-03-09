<template>
    <div class="card border-0">
        <div class="card-body">
            <h3 class="card-title text-uppercase text-muted mb-0"> <span :class="getClass()" class="mr-2"></span>{{ $t(stockType) }}</h3>
            <div class="d-flex flex-column justify-content-center align-items-center p-4" v-if="isLoading">
                <Loader/>
            </div>
            <div v-else class=" d-flex flex-column justify-content-center align-items-center">
                <h4 class="mb-2 text-muted">{{$t('total_stock')}} {{getTotal()}} g</h4>
                <pie-chart
                class="my-3"
              :height="150"
              ref="barChart"
              :chart-data="getChartData()"
            >
            </pie-chart>

                        <el-table class="table-hover table-responsive table-flush"
                            header-row-class-name="thead-light"
                            :data="getData()">
                            <el-table-column label="asset"
                                        prop="title"
                                        >
                            <template v-slot="{row}">
                                <div><div :class="row.styling"></div>{{row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="value"

                                        prop="id"
                                        >
                            <template v-slot="{row}">
                                <div>{{row.value/1000}} g</div>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template v-slot="{row}">
                              <icon-button type="info" @click="() => gotoDetails(row)" :disabled="depotTypes.length == 0"></icon-button>
                              <icon-button type="add" @click="() => addStock(row)"></icon-button>
                            </template>
                        </el-table-column>
                        </el-table>
            </div>
        </div>
        <AddStock :show="showStock" :assetType="stockType" :target="selectedTarget" @closed="onClosed" @added="onAdded"/>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { stockTypes } from '@/helpers/stocks';
import Loader from '@/components/common/Loader/Loader';
import { Table, TableColumn } from 'element-ui'
import IconButton from '@/components/common/Buttons/IconButton';
import {assetTypes} from '@/helpers/depots'
import PieChart from '@/components/argon-core/Charts/PieChart';
import AddStock from '@/components/Stocks/AddStock';
export default {
    props:{
        stockType:{
            type: String,
            default: assetTypes.gold
        }
    },
    components:{
        Loader,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        IconButton,
        PieChart,
        AddStock
    },
    mounted(){
        if(this.depotTypes.length == 0)
        {
            this.$store.dispatch('depots/getDepotTypes');
        }
        this.getAmounts();

    },
    computed:{
        ...mapGetters({
            inaiaGoldSock:'stocks/inaiaGoldStock',
            inaiaSilverSock:'stocks/inaiaSilverStock',
            operationGoldSock:'stocks/operationGoldStock',
            operationSilverSock:'stocks/operationSilverStock',
            depotTypes : 'depots/depotTypes'
        })
    },
    data(){
        return {
            isLoading:false,
            showStock:false,
            selectedTarget:stockTypes.inaiaStock
        }
    },
    methods:{
        getChartData(){
            let chartData = {labels:[this.$t(stockTypes.inaiaStock),this.$t(stockTypes.operationStock)]};
            if(this.stockType == assetTypes.gold)
            {
                chartData.datasets = [
                    {

                        data:[this.inaiaGoldSock/1000,this.operationGoldSock/1000],
                        backgroundColor:['#0065D3','#4DA1FF']
                    }
                ];
            }
            if(this.stockType == assetTypes.silver)
            {
                chartData.datasets = [
                    {
                        data:[this.inaiaSilverSock/1000,this.operationSilverSock/1000],
                        backgroundColor:['#0065D3','#4DA1FF']
                    }
                ];
            }
            return chartData;
        },
        getTotal(){
            let sum = 0;
            if(this.stockType == assetTypes.gold)
            {
                sum = (this.inaiaGoldSock + this.operationGoldSock)/1000;
            }
            if(this.stockType == assetTypes.silver)
            {
                sum = (this.inaiaSilverSock + this.operationSilverSock)/1000;
            }
            return sum;
        },
        getClass(){
            let className = '';
            if(this.stockType == assetTypes.gold)
            {
                className = 'circle-gold';
            }
            if(this.stockType == assetTypes.silver)
            {
                className = 'circle-silver';
            }
            return className;
        },
        calculateTranformation() {
            let degree = 0;
            if(this.stockType == assetTypes.gold)
            {
                if(inaiaGoldSock == 0)
                {
                    degree = 180;
                }
                degree = inaiaGoldSock/operationGoldSock
            }
            if(this.stockType == assetTypes.silver)
            {

            }
            return degree;
        },
        getAmounts() {
            this.$store.dispatch('stocks/getStocksBalance').catch(err=>{
                        console.log(err);
                    }).finally(
                        ()=>{

                                this.isLoading = false;

                        }
                    )
        },
        getData(){
            let data = [];
            if(this.stockType == assetTypes.gold)
            {
                data.push({
                    title : this.$t(stockTypes.inaiaStock),
                    value : this.inaiaGoldSock,
                    styling:'circle-inaia',
                    target:stockTypes.inaiaStock
                },{
                    title : this.$t(stockTypes.operationStock),
                    value : this.operationGoldSock,
                    styling:'circle-operation',
                    target:stockTypes.operationStock
                })
            }
            if(this.stockType == assetTypes.silver)
            {
                data.push({
                    title : this.$t(stockTypes.inaiaStock),
                    value : this.inaiaSilverSock,
                    styling:'circle-inaia',
                    target:stockTypes.inaiaStock
                },{
                    title : this.$t(stockTypes.operationStock),
                    value : this.operationSilverSock,
                    styling:'circle-operation',
                    target:stockTypes.operationStock
                })
            }
            return data;
        },
        gotoDetails(row){
            let depotType =  this.depotTypes.find(x=>x.name_translation_key == this.stockType)
            if(depotType)this.$router.push('/stocks/transactions?depot_type='+depotType.id+'&stock_type='+row.target);
        },
        addStock(row){
            this.selectedTarget = row.target;
            this.showStock = true;
        },
        onClosed(){
            this.selectedTarget = null;
            this.showStock = false;
        },
        onAdded(){
            this.getAmounts();
        }
    }
}
</script>
<style scoped>
.circle-gold {
   display: inline-block;
    border: 6px solid #DAB518;
    border-radius: 6px;

}
.circle-silver {
    display: inline-block;
    border: 6px solid #8F9FB3;
    border-radius: 6px;

}
.circle-inaia {
    display: inline-block;
    border: 5px solid #0065D3;
    border-radius: 5px;
    margin-right: 4px;
    margin-top: auto;
    margin-bottom: auto;
}
.circle-operation {
    display: inline-block;
    border: 5px solid #4DA1FF;
    border-radius: 5px;
    margin-right: 4px;
    margin-top: auto;
    margin-bottom: auto;
}
</style>
