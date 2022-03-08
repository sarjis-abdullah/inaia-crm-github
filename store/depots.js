
export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false,
    orderFilterList:[]
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    },
    details(state) {
        return state.details
    },
    pairs(state) {
        return state.pairs
    },
    orderFilterList:state=>state.orderFilterList
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
    },
    orderFilterList(state,list){
        state.orderFilterList = list
    }
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(process.env.golddinarApiUrl + '/depots?pair')
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
            return this.$axios.get(`${process.env.golddinarApiUrl}/depots?include=depot_status${ payload }`)
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
            .get(`${process.env.golddinarApiUrl}/depots/${payload}?include=depot_status`)
            .then(response => {
                context.commit('details', response.data.data)
                return response
            }).catch((err) => {
                // console.error('axios error during detailing role', err)
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(process.env.golddinarApiUrl + '/depots?include=depot_status', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during storing role')
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(process.env.golddinarApiUrl + '/depots/' + payload.id + '?include=depot_status', payload)
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
            .delete(`${process.env.golddinarApiUrl}/depots/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            })
    },
    fetchDepotsByAccount(context,payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${process.env.golddinarApiUrl}/depots?only=name&account_id=${ payload }`)
                .then(res => {
                    context.commit('orderFilterList', res.data.data)
                    return res
                }).catch(err => {
                    // console.error('axios error during fetching roles', err)
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    }
}
