import axios from "axios"
import { mapGetters } from "vuex"
import { parseFixed, paddingFractionTo2, paddingFractionTo3 } from '@/helpers/helpers'
import { depotAvatar } from '@/helpers/user'

const startingDate   = new Date()
startingDate.setMonth(startingDate.getMonth() - 12)

export default {
    props: {
        opacity: {
            type: Number,
            default: 0
        },
    },
    data() {
        let vm = this

        return {
            depotBalance: 0,
            goldPrice: 0,
            priceChanged: 0.00,
            priceUp: true,
            selection: '',
            series: [{
                data: []
            }],
            sortedDepotBalanceHistory: [],
            chartOptions: {
                dataLabels: {
                    enabled: false
                },

                markers: {
                    size: 0,
                    style: 'hollow',
                },
                yaxis: {
                    labels: {
                        show: false,
                        formatter: function(val) {
                            return vm.$n(val.toFixed(2))+' €'
                        },
                    }
                },
                xaxis: {
                    type: 'datetime',
                    min: startingDate.getTime(),
                        // tickAmount: 200,
                    labels: {
                        show: true,
                        // format: 'MMM yyyy',
                        datetimeFormatter: {
                            year: 'yyyy',
                            month: 'MMM',
                            day: 'dd MMM',
                            hour: 'HH:mm'
                        },
                        style: {
                            colors: '#8898aa',
                        },
                    },
                    axisBorder: {
                        show: false,
                    },
                    axisTicks: {
                        show: true,
                    },

                },
                tooltip: {
                    x: {
                        show: false,
                        format: 'dd MMM yyyy',
                    },
                    marker: {
                        show: false,
                    },
                    // intersect: true,
                    // shared:false
                },
                // markers: {
                //     size: 4
                // },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: this.opacity,
                        opacityTo: 0,
                        stops: [0, 100]
                    }
                },
                stroke: {
                    width: 2,
                },
                chart: {
                    fontFamily: 'Noah',
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                    //height: '300px',
                    events: {
                        mouseMove: (e, chartContext, config) => {
                            // console.error('event:', e)
                            // console.error('pointer context:', chartContext)
                            // console.error('pointed data:', this.series[0].data[config.dataPointIndex])
                            this.indicatedData(config.dataPointIndex)
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
                        left: -10,
                    },
                },
            }
        }
    },

    computed: {
        ...mapGetters({
            currentGoldPrice: "gold/currentPrice",
        }),
        refPrice() {
            if (!this.series[0].data || !Array.isArray(this.series[0].data) || !this.series[0].data.length) {
                return 0
            }
            // gold price series data are in descending order (latest is the first one)
            let rp  = this.series[0].data[this.series[0].data.length - 1][1]
            return rp
        },
        sortedDepotBalanceHistoryLength() {
            if (this.chartForDepot && this.sortedDepotBalanceHistory && this.sortedDepotBalanceHistory.length) {
                return this.sortedDepotBalanceHistory.length
            }
            return 0
        }
    },

    watch: {
        // due to unfortunate reactive issue
        currentGoldPrice: {
            handler(newValue, oldValue) {
                // only for first-time load of gold price
                if (!oldValue && newValue) {
                    // "depotBalance" is for depot-chart
                    this.goldPrice  = (this.depotBalance ? parseFixed(newValue * this.depotBalance / 1000) : newValue)
                }
            }
        }
    },

    methods: {
        parseFixed,
        paddingFractionTo2,
        paddingFractionTo3,
        depotAvatar,

        anonymousDepotAvatar(e) {
            e.target.src    = this.depotAvatar()
        },

        updateTimeline: function (timeline) {
            this.selection = timeline;
        },

        refreshChart(dt) {
            // console.error('prices', dt)
            setTimeout(() => this.series = [{
                name: "Goldpreis / g",
                data: dt
            }]);

            setTimeout(() => this.chartOptions   = {
                ...this.chartOptions,
                xaxis: {
                    ...this.chartOptions.xaxis,
                    min: dt.length ? dt[dt.length - 1][0] : 0,
                    max: dt.length ? dt[0][0] : 0
                },
                tooltip: {
                    ...this.chartOptions.tooltip,
                    x: {
                        show: false,
                        format: this.updateTooltip(),
                    }
                }
            });

            setTimeout(() => {
                if (dt.length) {
                    this.indicatedData()
                }
            }, 100)
        },

        refreshDepotBalanceHistory(history) {
            // console.error('sorted-depot-blanace-history', history)
            this.sortedDepotBalanceHistory = history
        },

        updateTooltip() {
            let op  = 'dd MMM yyyy';
            switch (this.selection) {
                case 'one_day':
                    op = 'H:mm';
                    break;
                case 'one_week':
                    op = 'd.MM.yy  H:mm';
                    break;
                case 'one_month':
                    if (process.env.quandlApiOn) {
                        op = 'dd MMM';
                    } else {
                        op = 'd.MM.yy  H:mm';
                    }
                    break;
                case 'six_months':
                    break;
                case 'one_year':
                    break;
                case 'ytd':
                    break;
                case 'all':
                    if (!this.chartForDepot) {
                        op = 'MMM yyyy';
                    }
                    break;
                default:

            }
            return op;
        },
        
        indicatedData(i) {
            let pointed  = i !== undefined && i !== null
            if (!this.series[0].data || !Array.isArray(this.series[0].data) || !this.series[0].data.length) {
                this.goldPrice      = this.currentGoldPrice || 0.0
                this.priceChanged   = 0.00
                this.priceUp        = true
                return
            }

            // "depotBalance" is for depot-chart
            if (this.sortedDepotBalanceHistoryLength) {
                if (pointed && i > -1) {
                    this.depotBalance = this.sortedDepotBalanceHistory[i]
                } else {
                    this.depotBalance = this.sortedDepotBalanceHistory[0]
                }
            }

            let availablePrice  = parseFloat(this.currentGoldPrice || this.series[0].data[0][1])
            // adjust for depot-chart
            if (this.currentGoldPrice && this.depotBalance) {
                availablePrice  *= this.depotBalance / 1000 // convert to gram
            }
            // gold price series data are in descending order (latest is the first one)
            // ensure to return like 52.10 for number 52.09999994, where single "toFixed" will return 52.1
            this.goldPrice      = parseFixed( pointed && i > -1 ? this.series[0].data[i][1] : availablePrice )
            this.priceChanged   = parseFixed( Math.abs((this.goldPrice - this.refPrice) * 100 / (this.refPrice || 100)) )
            this.priceUp        = this.goldPrice >= parseFixed(this.refPrice)
            // console.error('point', i, this.depotBalance, this.sortedDepotBalanceHistory)
        },

        bitCoin() {
            let qs      = this.getDateRange();
            const url   = 'https://api.coindesk.com/v1/bpi/historical/close.json'+qs;

            axios.get(url)
                .then((response) => {
                    let sortedData    = []
                    let bitcoinData = response.data
                    // console.log('fetched data:', bitcoinData)
                    let count = 0
                    for (let date in bitcoinData.bpi){
                        sortedData.push([
                            new Date(date).getTime(),
                            bitcoinData.bpi[date]
                        ])
                        count++
                    }

                    // let max = sortedData[0][0],
                    //     min = sortedData[sortedData.length - 1][0]

                    this.refreshChart(sortedData)
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        getDateRange() {
            let queryStr    = '';
            switch (this.selection) {
                case 'one_day':
                    queryStr    = 'start='+this.getOldDate(1)+'&end='+this.getOldDate(0);
                    break;
                case 'one_week':
                    queryStr    = 'start='+this.getOldDate(7)+'&end='+this.getOldDate(0);
                    break;
                case 'one_month':
                    queryStr    = 'start='+this.getOldDate(30)+'&end='+this.getOldDate(0);
                    break;
                case 'six_months':
                    queryStr    = 'start='+this.getOldDate(182)+'&end='+this.getOldDate(0);
                    break;
                case 'one_year':
                    queryStr    = 'start='+this.getOldDate(365)+'&end='+this.getOldDate(0);
                    break;
                case 'ytd':
                    this.chartOptions = {
                        xaxis: {
                            min: new Date('01 Jan'+(new Date()).getUTCFullYear()).getTime(),
                            max: new Date(this.getOldDate(0)).getTime(),
                        }
                    }
                    queryStr    = 'start='+(new Date()).getUTCFullYear()+'-01-01&end='+this.getOldDate(0);
                    break;
                case 'all':
                    this.chartOptions = {
                        xaxis: {
                            min: undefined,
                            max: undefined,
                        }
                    }
                    queryStr    = 'start='+this.getOldDate(24)+'&end='+this.getOldDate(0);
                    break;
                default:

            }
            return queryStr ? '?'+queryStr : '';
        },

        getOldDate(days) {
            let d = new Date();
            d.setDate(d.getUTCDate() - days);
            return d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);
        },

        updateTimeLine: function () {
            let op  = {};
            switch (this.selection) {
                case 'one_day':
                    op = {
                        // min: new Date('28 Jan 2013').getTime(),
                        min: new Date(this.getOldDate(1)).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'one_week':
                    op = {
                        min: new Date(this.getOldDate(7)).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'one_month':
                    op = {
                        min: new Date(this.getOldDate(30)).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'six_months':
                    op = {
                        min: new Date(this.getOldDate(182)).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'one_year':
                    op = {
                        min: new Date(this.getOldDate(365)).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'ytd':
                    op = {
                        min: new Date('01 Jan'+(new Date()).getUTCFullYear()).getTime(),
                        max: new Date(this.getOldDate(0)).getTime(),
                    };
                    break;
                case 'all':
                    op = {
                        min: undefined,
                        max: undefined,
                    }
                    break;
                default:

            }
            return op;
        }
    }
}