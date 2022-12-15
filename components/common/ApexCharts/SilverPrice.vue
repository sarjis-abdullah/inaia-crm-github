<template>
    <card header-classes="bg-transparent _shadow-none border-bottom-0 pb-0">
        <div slot="header" class="row">
            <div class="col">
                <h6 class="surtitle">{{ $t('silver_price_per_gram') }}</h6>
                <h5 class="h1 mb-0 text-nowrap">
                    <!-- {{ $n(goldPrice) }} € -->
                    <i18n-n :value="goldPrice">
                        <template v-slot:integer="slotProps">{{ slotProps.integer }}</template>
                        <template v-slot:group="slotProps">{{ slotProps.group }}</template>
                        <template v-slot:decimal="slotProps">{{ slotProps.decimal }}</template>
                        <template v-slot:fraction="slotProps">
                            <span class="">{{ paddingFractionTo2(slotProps.fraction) }}</span>
                        </template>
                    </i18n-n> €
                    <span class="h5 font-weight-normal text-nowrap">
                        <i :class="{'fas': true, 'fa-arrow-up': priceUp, 'fa-arrow-down': !priceUp, 'ml-2': true, '_mr-1': true, 'text-success': priceUp, 'text-warning': !priceUp}"></i>
                         <!-- {{ $n(priceChanged) }} % -->
                        <i18n-n :value="priceChanged">
                            <template v-slot:integer="slotProps">{{ slotProps.integer }}</template>
                            <template v-slot:group="slotProps">{{ slotProps.group }}</template>
                            <template v-slot:decimal="slotProps">{{ slotProps.decimal }}</template>
                            <template v-slot:fraction="slotProps">
                                <span class="">{{ paddingFractionTo2(slotProps.fraction) }}</span>
                            </template>
                        </i18n-n> %
                    </span>
                </h5>
            </div>
            <div class="col">

                <chart-timelines
                    @update-timeline="updateTimeline"
                    @update-timeline-data="refreshChart"
                    assetType="silver"
                />
            </div>
        </div>
        <div id="chart" class="mx--4 mt--4 mb--4" @mouseleave="() => indicatedData()">
        <!-- <div id="chart" class="mt--4 mb-0" @mouseleave="() => indicatedData()"> -->

            <apexchart
                type=area
                height=395
                :options="chartOptions"
                :series="series"
                :opacity="0"
            />

        </div>
    </card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import ChartTimelines from '@/components/common/ApexCharts/ChartTimelines'
import SilverApexChartMixin from '~/mixins/SilverApexChartMixin'

export default {
    mixins: [SilverApexChartMixin],
    components: {
        apexchart: VueApexCharts,
        ChartTimelines
    },
    props: {
        depot: {
            type: Object,
            default: null
        }
    },
    mounted() {
        this.$root.$on('silverPriceUpdated', () => {
            setTimeout(() => this.indicatedData(), 100)
        })
    }
}

</script>

<style scoped>
    .apexcharts-tooltip { opacity: 0 !important; }
    .apexcharts-xaxistooltip-bottom {
        margin-top: 4px !important;
        padding: 4px 5px !important;
        border-color: #8F9FB3 !important;
        background: #8F9FB3 !important;
        color:#fff !important;
    }
    .apexcharts-xaxistooltip-bottom:before {
        display: none !important;
    }
    .apexcharts-xaxistooltip-bottom:after {
        border-bottom-color: #0074d9 !important;
    }

    .img-container {
        display: inline-block;
        cursor: pointer;
        position:relative;
        border-radius: 50%;
        overflow: hidden;
        /*border: 3px solid #fff;*/

        width: 74px;
        height: 74px;
        transition: all .15s ease;
    }
    .img-container img {
        max-width: 100%;
    }
    .img-container:hover {
        transform: translate(0%,0%) scale(1.03);
    }
    .img-container .overlay {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.3);
        opacity:0;
        transition:opacity 250ms ease-in-out;
    }
    .img-container:hover .overlay {
        opacity:1;
    }
    .overlay div {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        color:#fff;
    }
</style>
