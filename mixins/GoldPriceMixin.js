export default {
    data() {
        return {
            disabledPriceUpdate: process.env.quandlApiOn,
            goldPriceIntervalSetup: false,
            goldPriceUpdateInterval: null,
            goldPriceUpdateNotification: true,
        }
    },

    created() {
        // delaying gold-price-request due to pipelined with many other request
        if (!this.disabledPriceUpdate) {
            setTimeout(() => this.setGoldPriceInterval(), 1000)
        }
    },

    beforeDestroy() {
        if (!this.disabledPriceUpdate) {
            this.destroyGoldPriceInterval()
        }
    },

    methods: {
        async fetchGoldPrice() {
            return await this.$store.dispatch('gold/currentPrice')
                .then(res => {
                    if (this.goldPriceUpdateNotification) {
                        this.$root.$emit('goldPriceUpdated')
                    }
                }).catch(err => {
                    if (this.goldPriceUpdateNotification) {
                        this.$root.$emit('goldPriceServerDowned')
                    } else {
                        console.error('H+M API server downed!')
                    }
                })
        },

        setGoldPriceInterval() {
            if (!this.goldPriceIntervalSetup && !this.goldPriceUpdateInterval) {
                this.goldPriceIntervalSetup = true
                // initial fetch
                // this.fetchGoldPrice()
                console.error('gold price interval started!')
                this.goldPriceUpdateInterval    = setInterval(async () => {
                    if (this.goldPriceUpdateNotification) {
                        this.$root.$emit('goldPriceUpdating')
                    }
                    this.fetchGoldPrice()
                }, 60000)
            }
        },

        destroyGoldPriceInterval() {
            if (this.goldPriceUpdateInterval) {
                clearInterval(this.goldPriceUpdateInterval)
                this.goldPriceUpdateInterval = null
                this.goldPriceIntervalSetup = false
                console.error('gold price interval shutdown!')
            }
        },

        bindGoldPriceEvents() {
            if (!this.goldPriceIntervalSetup) {
                this.goldPriceUpdateNotification    = true
                this.$root.$on('startGoldPriceInterval', () => {
                    this.setGoldPriceInterval()
                })
                this.$root.$on('stopGoldPriceInterval', () => {
                    this.destroyGoldPriceInterval()
                })
            }
        },

        unbindGoldPriceEvents() {
            this.$root.$off(['startGoldPriceInterval', 'stopGoldPriceInterval'])
            this.goldPriceUpdateNotification    = false
        }
    }
}