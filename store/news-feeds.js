
export const state = () => ({
    feeds: null,
    loading: 0,
    placing: 0
})

const initialState  = state()

export const getters = {
    feeds(state) {
        return state.feeds
    },

    loading(state) {
        return state.loading
    },

    placing(state) {
        return state.placing
    }
}

export const mutations = {
    feeds(state, feeds) {
        state.feeds = feeds
    },
  
    loading(state, bool) {
        state.loading = bool
    },
  
    placing(state, bool) {
        state.placing = bool
    },

    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    fetchList(context, payload) {
        context.commit('loading', 1)
    
        return this.$axios
            .get('/news-feeds?' + payload)
            .then(response => {
                context.commit('feeds', response.data.data)
                return response
            })
            .catch(error => {
                console.log('error-fetch', error)
                return Promise.reject(error)
            })
            .finally(() => {
                context.commit('loading', 2)
            })
    },
    details(context, payload) {
        return this.$axios
            .get('/news-feeds/' + payload)
            .then(response => {
                return response
            })
            .catch(error => {
                console.log('error-fetch', error)
                return Promise.reject(error)
            })
    },
    remove(context, payload) {
        if (!context.state.placing && payload) {
            context.commit('placing', 1)
            return this.$axios
            .delete('/news-feeds/' + payload)
            .then(response => {
                return response
            })
            .catch(error => {
                console.log('error-fetch', error)
                return Promise.reject(error)
            })
            .finally(() => {
                context.commit('placing', 0)
            })
        }
    },
    create(context, payload) {
        if (!context.state.placing) {
            context.commit('placing', 1)
            return this.$axios
            .post('/news-feeds', payload)
            .then(response => {
                return response
            })
            .catch(error => {
                // console.log('error-fetch', error)
                return Promise.reject(error)
            })
            .finally(() => {
                context.commit('placing', 0)
            })
        }
    },
    update(context, payload) {
        if (!context.state.placing && payload.id) {
            context.commit('placing', 1)
            const id = payload.id
            delete payload.id

            return this.$axios
            .put('/news-feeds/'+id, payload)
            .then(response => {
                return response
            })
            .catch(error => {
                // console.log('error-fetch', error)
                return Promise.reject(error)
            })
            .finally(() => {
                payload.id  = id
                context.commit('placing', 0)
            })
        }
    }
}

