export const state = () => ({
    types: null,
    loading: 0
})

const initialState  = state()

export const getters = {
    types(state) {
        return state.types
    },

    loading(state) {
        return state.loading
    }
}

export const mutations = {
    types(state, types) {
        state.types = types
    },
  
    loading(state, bool) {
        state.loading = bool
    },

    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    fetchTypes(context) {
        context.commit('loading', 1)
    
        return this.$axios
            .get('/types?pair')
            .then(response => {
                context.commit('types', response.data.data)
                return response
            })
            .catch(error => {
                console.log('error-fetch', error)
                return Promise.reject(error)
            })
            .finally(() => {
                context.commit('loading', 2)
            })
    }
}
