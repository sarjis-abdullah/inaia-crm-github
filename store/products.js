
export const state = () => ({
    list: null,
    details: null,
    productList: null,
    loading: false
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    },
    details(state) {
        return state.details
    },
    productList(state) {
        return state.productList
    }
}

export const mutations = {
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    remove(state, idx) {
        state.list = state.list.splice(idx, 1)
    },
    initProductList(state, data) {
        state.productList = data
    },
    loading(state, bool) {
        state.loading   = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    fetchList(context, payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${process.env.productApiUrl}/products?${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res
                }).catch(err => {
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    async details(context, payload) {
        return await this.$axios
            .get(`${process.env.productApiUrl}/products/${payload}?include=role.permissionIds`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            }).catch((err) => {
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(`${process.env.productApiUrl}/products`, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(`${process.env.productApiUrl}/products/${payload.id}`, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`${process.env.productApiUrl}/products/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            }).catch(err => {
                return Promise.reject(err)
            })
    },
    initProductList(context) {
        return this.$axios
            .get(`${process.env.productApiUrl}/products?order_direction=asc&per_page=250`)
            .then(response => {
                context.commit('initProductList', response.data.data)
                return response
            })
            .catch(err => {
                return Promise.reject(err)
            })
            .finally(() => {
            })
    },
}
