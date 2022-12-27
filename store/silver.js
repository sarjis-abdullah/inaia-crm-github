
export const state = () => {
    return {
        prices: [],
        currentPrice: null,
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
            .get(`${process.env.golddinarApiUrl}/current-silver-price`)
            .then(response => {
                if (response && response.data.data) {
                    commit('currentPrice', parseFloat(response.data.data.fixing_gram_eur))
                    commit('HMApiDowned', false)
                }
                return Promise.resolve(response)
            }).catch(err => {
                if (state.prices.length) {
                    let currentPrice = state.prices[0][1]
                    commit('currentPrice', currentPrice)
                } else {
                    commit('currentPrice', 0)
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
            .get(`${process.env.golddinarApiUrl}/silver-price-historical?period=${ payload.type }${ payload.start ? '&start='+payload.start : ''}`)
            .then(response => {
                let mappedData  = [];
                if (response && response.data.data) {
                    mappedData  = response.data.data.map(p => [(new Date(p.price_date)).getTime(), p.fixing_gram_eur])
                }
                console.log(mappedData);
                context.commit('prices', mappedData)
                context.commit('historyType', payload.type)

                if (context.state.HMApiDowned && mappedData.length) {
                    let currentPrice = mappedData[0][1]
                    context.commit('currentPrice', currentPrice)
                }

                return Promise.resolve(mappedData)
            }).catch(err => {
                return Promise.reject(err)
            })
    },
}