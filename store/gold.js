
export const state = () => {
    return {
        prices: [],
        currentPrice: null,
        currentBuyPrice: null,
        currentSellPrice: null,
        currency: null,
        timestamp: null,
        historyType: '',
        HMApiDowned: false,
        loading: false
    }
}

const initialState  = state()

export const getters = {
    prices(state) {
        return state.prices
    },
    currentPrice(state) {
        return state.currentPrice
    },
    currentBuyPrice(state) {
        return state.currentBuyPrice
    },
    currentSellPrice(state) {
        return state.currentSellPrice
    },
    currency(state) {
        return state.currency
    },
    timestamp(state) {
        return state.timestamp
    },
    historyType(state) {
        return state.historyType
    },
    HMApiDowned(state) {
        return state.HMApiDowned
    }
}

export const mutations = {
    prices(state, prices) {
        state.prices = prices
    },
    currentPrice(state, price) {
        state.currentPrice = price
    },
    currentBuyPrice(state, price) {
        state.currentBuyPrice = price
    },
    currentSellPrice(state, price) {
        state.currentSellPrice = price
    },
    currency(state, currency) {
        state.currency = currency
    },
    timestamp(state, timestamp) {
        state.timestamp = timestamp
    },
    historyType(state, type) {
        state.historyType = type
    },
    HMApiDowned(state, bool) {
        state.HMApiDowned = bool
    },
    loading(state, bool) {
        state.loading = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    currentPrice({commit, state}) {
        if (state.loading) {
            return Promise.resolve()
        }
        commit('loading', true)
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/current-gold-price`)
            .then(response => {
                if (response && response.data.data) {
                    commit('currentPrice', parseFloat(response.data.data.fixing_gram_eur))
                    commit('currentBuyPrice', parseFloat(response.data.data.fixing_gram_eur))
                    commit('currentSellPrice', parseFloat(response.data.data.fixing_gram_eur))
                    //commit('currency', response.data.data.currency)
                    //commit('timestamp', response.data.data.timestamp)
                    //commit('HMApiDowned', false)
                }
                return Promise.resolve(response)
            }).catch(err => {
                if (state.prices.length) {
                    let currentPrice = state.prices[0][1]
                    commit('currentPrice', currentPrice)
                    commit('currentBuyPrice', currentPrice + 0.2)
                    commit('currentSellPrice', currentPrice - 0.2)
                } else {
                    commit('currentPrice', 0)
                    commit('currentBuyPrice', 0)
                    commit('currentSellPrice', 0)
                }
                commit('currency', 'euro')
                commit('timestamp', Math.round(Date.now() / 1000))
                commit('HMApiDowned', true)
                // return Promise.reject(err)
                return err
            }).finally(() => {
                commit('loading', false)
            })
    },
    prices(context, payload) {
        if (context.state.historyType === payload.type && context.state.prices.length) {
            return Promise.resolve(context.state.prices)
        }
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/historical-price?currency=EUR&type=${ payload.type }${ payload.start ? '&start='+payload.start : ''}${ payload.date ? '&date='+payload.date : ''}`)
            .then(response => {
                let mappedData  = [];
                if (response && response.data.data) {
                    if (process.env.quandlApiOn) {
                        mappedData  = response.data.data.map(p => [(new Date(p.price_date)).getTime(), p.fixing_gram])
                    } else {
                        mappedData  = response.data.data.map(p => [(new Date(p.created_at)).getTime(), p.fixing_gram])
                    }
                }
                console.log(mappedData);
                context.commit('prices', mappedData)
                context.commit('historyType', payload.type)

                if (context.state.HMApiDowned && mappedData.length) {
                    let currentPrice = mappedData[0][1]
                    context.commit('currentPrice', currentPrice)
                    context.commit('currentBuyPrice', currentPrice + 0.2)
                    context.commit('currentSellPrice', currentPrice - 0.2)
                }

                return Promise.resolve(mappedData)
            }).catch(err => {
                return Promise.reject(err)
            })
    },
    getFixingPrice(context, payload) {
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/historical-price?currency=EUR&date=${ payload }`)
            .then(response => {
                let firstEntry = response.data.data[0];
                if(firstEntry)
                {
                    return firstEntry.fixing_gram;
                }
                else{
                    return -1;
                }
            }).catch(err => {
                return Promise.reject(err)
            })
    },
}

