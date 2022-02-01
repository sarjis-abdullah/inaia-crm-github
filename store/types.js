export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    },
    details(state) {
        state.details
    },
    pairs(state) {
        return state.pairs
    },
    loading(state) {
        return state.loading
    }
}

export const mutations = {
    pairs(state, data) {
        state.pairs = data
    },
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    remove(state, idx) {
        state.list = state.list.splice(idx, 1)
    },
    loading(state, bool) {
        state.loading = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    pairs(context) {
        context.commit('loading', 1)

        return this.$axios
            .get('/types?pair')
            .then(response => {
                context.commit('pairs', response.data.data) 
                return response
            })
            .catch(err => {
                // console.log('axios error during fetching type-pairs', err)
                return Promise.reject(err)
            })
            .finally(() => {
                context.commit('loading', 2)
            })
    },
    fetchList(context, payload) {
        return this.$axios.get(`/types?${ payload }`)
            .then(res => {
                context.commit('list', res.data.data)
                return res
            }).catch(err => {
                // console.error('axios error during fetching types')
                return Promise.reject(err)
            }).finally(() => {
            })
    },
    details(context, payload) {
        return this.$axios
            .get(`/types/${payload}`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            // console.log(payload)
            return this.$axios.post('/types', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during storing type')
                    return Promise.reject(err)
                })
        } else {
            const id = payload.id
            // console.log(id)
            return this.$axios.put('/types/' + id, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during updating type', id)
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`/types/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            })
    }
}
