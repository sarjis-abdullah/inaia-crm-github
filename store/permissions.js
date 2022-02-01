
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
    remove(state, idx) {
        state.list = state.list.splice(idx, 1)
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
            .get('/types?pair')
            .then(res => {
                context.commit('pairs', res.data.data)
                return res
            })
            .catch(err => {
                // console.log('axios error during fetching permission-pairs', err)
                return Promise.reject(err)
            })
    },
    fetchList(context, payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`/permissions?include=${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res
                }).catch(err => {
                    // console.error('axios error during fetching permissions', err)
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    details(context, payload) {
        return this.$axios
            .get(`/permissions/${payload}?include=account,type,person_data,address,country,channels`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post('/permissions', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during storing permission', err)
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put('/permissions/' + payload.id, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during updating permission', err)
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`/permissions/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            })
    }
}