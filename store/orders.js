
export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false
})

const initialState  = state()

export const getters = {
    list(state) {
        state.list
    },
    details(state) {
        state.details
    },
    pairs(state) {
        state.pairs
    }
}

export const mutations = {
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    remove(state, id) {
        const idx   = state.list.findIndex( i => i.id == id)
        state.list  = state.list.splice(idx, 1)
    },
    updateStatus(state, order) {
        const item  = state.list.find( i => i.id == order.id)
        Object.assign(item.order_status, order.order_status)
    },
    pairs(state, data) {
        state.pairs = data
    },
    loading(state, bool) {
        state.loading   = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(process.env.golddinarApiUrl + '/orders?pair')
            .then(res => {
                context.commit('pairs', res.data.data)
                return res
            })
            .catch(err => {
                // console.log('axios error during fetching role-pairs', err)
                return Promise.reject(err)
            })
    },
    fetchList(context, payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${ process.env.golddinarApiUrl }/orders?include=order_type,order_status,order_depot,order_transactions,orders_payment_transactions,orders_updated_at${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res
                }).catch(err => {
                    // console.error('axios error during fetching roles', err)
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    async details(context, payload) {
        return await this.$axios
            .get(`${ process.env.golddinarApiUrl }/orders/${payload}?include=order_type,order_status`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            }).catch((err) => {
                // console.error('axios error during detailing role', err)
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(process.env.golddinarApiUrl + '/orders?include=order_type,order_status', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during storing role')
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(process.env.golddinarApiUrl + '/orders/' + payload.id + '?include=order_type,order_status', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during updating role', err)
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`${ process.env.golddinarApiUrl }/orders/${ payload }`)
            .then(res => {
                context.commit('remove', payload)
                return res
            })
    },
    complete(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/complete`,payload.data)
            .then(res => {
                context.commit('updateStatus', res.data.data)
                return res.data.data.order_status
            })
    },
    paid(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload }/paid`)
            .then(res => {
                context.commit('updateStatus', res.data.data)
                return res.data.data.order_status
            })
    },
    cancel(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/cancel`,payload.data)
            .then(res => {
                context.commit('updateStatus', res.data.data)
                return res
            })
    },
    getPaymentMethod(context,payload) {
        return this.$axios
                .get(`${ process.env.paymentsApiUrl }/payment-transactions/${payload}?include=payment_account`).then(res=>{
                    return res.data.data;
                })
    },
    getCompleteOrderPreview(context,payload) {
        return this.$axios
                .get(`${ process.env.golddinarApiUrl }/orders/${payload.id}/complete/preview?price_date=${payload.date}`).then(res=>{
                    return res.data;
                })
    }
}
