<template>
  <div>

    <div class="card border-0">
      <div class="card-body">
        <div>{{ $t('depots') }} {{ data?'( '+(data.depots.gold.total+data.depots.silver.total)+' )':'' }}</div>
        <div id="chart">
          <apexchart type="bar" height="200" :options="chartOptions" :series="series" v-if="data && !loading"></apexchart>
          <div class="d-flex justify-content-center align-items-center" style="height: 200px;" v-else>
            <Loader/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters } from "vuex"
import VueApexCharts from 'vue-apexcharts'
import Loader from '@/components/common/Loader/Loader'
    export default {
        components:{
            apexchart: VueApexCharts,
            Loader
        },
        computed: {
        ...mapGetters({
            data: "statistic/golddinarStats"
        }),
    },
    data(){
        return {
          series: [],
          loading:false,
          chartOptions: {
            colors:['#adb5bd', '#0074d9', '#ffd600','#8965e0','#fb6340','#f5365c'],
            chart: {
              type: 'bar',
              height: 200,
              stacked: true,
              stackType: '100%',
              fontFamily: 'Noah, Open Sans'
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },

            xaxis: {


                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                      show:false
                    }

            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val
                }
              }
            },
            grid: {
                    xaxis: {
                        lines: {
                            show: false
                        }
                    },
                    yaxis: {
                        lines: {
                            show: false
                        }
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    },
                },
            fill: {
              opacity: 1

            },
            legend: {
              position: 'bottom',
              horizontalAlign: 'center',
              offsetX: 0
            }
          },


        }
    },
    mounted(){
        this.loading = true;
        this.$store.dispatch('statistic/getGoldDinarStatistics').then(()=>{
            if(this.data){
                    const depots = this.data.depots;

                    if(depots && depots.gold && depots.silver){
                        const goldsData = depots.gold;
                        const silverData = depots.silver;
                        this.series.push({
                            name:this.$t("applied"),
                            data:[goldsData.applied_for_saving_plan?goldsData.applied_for_saving_plan:0,silverData.applied_for_saving_plan?silverData.applied_for_saving_plan:0]
                        });
                        this.series.push({
                            name:this.$t("active"),
                            data:[goldsData.active?goldsData.active:0,silverData.active?silverData.active:0]
                        });
                        this.series.push({
                            name:this.$t("paused"),
                            data:[goldsData.paused?goldsData.paused:0,silverData.paused?silverData.paused:0]
                        });
                        this.series.push({
                            name:this.$t("completed"),
                            data:[goldsData.completed?goldsData.completed:0,silverData.completed?silverData.completed:0]
                        });
                        this.series.push({
                            name:this.$t("blocked"),
                            data:[goldsData.blocked?goldsData.blocked:0,silverData.blocked?silverData.blocked:0]
                        });
                        this.series.push({
                            name:this.$t("canceled"),
                            data:[goldsData.canceled?goldsData.canceled:0,silverData.canceled?silverData.canceled:0]
                        });
                        const categories = ['Gold ('+this.data.depots.gold.total+')','Silver ('+this.data.depots.silver.total+')'];
                        this.chartOptions.xaxis.categories = categories
                        this.loading = false;
                    }

                }
        }).catch((err)=>console.log(err));
    }
    }

</script>
