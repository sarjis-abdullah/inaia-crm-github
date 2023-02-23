
export const state = () => ({
    list: [],
    loading: false,
    orderFilterList:[]
})

const initialState  = state()

export const getters = {
    list:state=>state.list,
    loading:state=>state.loading,
    
}

export const mutations = {
    list(state, list) {
        state.list  = list
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
            return this.$axios.get(`${ process.env.golddinarApiUrl }/order-statuses`)
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
    }
}