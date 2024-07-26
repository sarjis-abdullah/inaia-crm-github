export const state = () => {
    return {
    }
}

const initialState  = state()

export const getters = {
}
export const mutations = {
}
export const actions = {
    fetchData(context, payload) {
        return this.$axios
            .get(`/blacklist${payload}`)
            .then(response => {
                return response
            })
    },
    remove(context, payload) {
        return this.$axios
            .delete(`/blacklist/${ payload }`)
            .then(response => {
                return response
            })
    },
    addToBlacklist(context, payload) {
        return this.$axios
            .post(`/blacklist/create/${ payload }`)
            .then(response => {
                return response
            })
    }
}
