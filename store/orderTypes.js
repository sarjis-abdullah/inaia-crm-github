
export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false,
    orderFilterList:[]
})

const initialState  = state()

export const getters = {
    list:state=>state.list,
    loading:state=>state.loading,
    orderFilterList:state=>state.orderFilterList,
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
    },
    orderFilterList(state,list){
        state.orderFilterList = list;
    },
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(process.env.golddinarApiUrl + '/orderType?pair')
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
            return this.$axios.get(`${ process.env.golddinarApiUrl }/order-types`)
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
            .get(`${ process.env.golddinarApiUrl }/orderType/${payload}`)
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
            return this.$axios.post(process.env.golddinarApiUrl + '/orderType', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    // console.error('axios error during storing role')
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(process.env.golddinarApiUrl + '/orderType/' + payload.id, payload)
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
            .delete(`${ process.env.golddinarApiUrl }/orderType/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            })
    },
    fetchOrderFilterList(context){
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${ process.env.golddinarApiUrl }/order-types`)
                .then(res => {
                    let data = [];
                   
                    res.data.data.forEach(element=>{
                        console.log(element.name_translation_key);
                        if(element.name_translation_key.startsWith('gold'))
                        {
                            data.push(element);
                        }
                    })
                    context.commit('orderFilterList',data)
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