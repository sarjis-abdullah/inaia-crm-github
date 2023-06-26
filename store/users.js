export const state = () => {
    return {
        userData: [],
        singleUserData: {},
        countryList: [],
        countryListLoaded: 0
    }
}

const initialState  = state()

export const getters = {

    userData(state) {
        return state.userData
    },
    singleUserData(state) {
        return state.singleUserData
    },
    countryList(state) {
        return state.countryList
    },
    countryListLoaded(state) {
        return state.countryListLoaded
    }
}
export const mutations = {

    initUserData(state, userData) {
        state.userData = userData
    },
    removeUser(state, userIndex) {
        state.userData = state.userData.splice(userIndex, 1)
    },
    singleUserData(state, singleUserData) {
        state.singleUserData = singleUserData
    },
    initCountryList(state, countryList) {
        state.countryList = countryList
    },
    countryListLoaded(state, bool) {
        state.countryListLoaded = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}
export const actions = {
    submitUser(context, payload) {

        if (!payload.id) {
            return this.$axios.post('/contacts/store-with-relations', payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
        } else {
            const id = payload.id
            delete payload.id
            return this.$axios.put('/contacts/update-with-relations/' + id, payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                payload.id  = id // for next submit
                return Promise.reject(error)
            })
        }
    },
    removeUser(context, payload) {
        return this.$axios
            .delete(`/contacts/${ payload }`)
            .then(response => {
                const userIndex = context.state.userData.findIndex( c => c.id == payload)
                context.commit('removeUser', userIndex)
                return response
            })
    },
    userDetailsData(context, payload) {
        return this.$axios
            .get(`/contacts/${payload}?include=account,type,person_data,address,country,channels,account.activeRoles`)
            .then(response => {
                const singleUserData = response.data.data
                context.commit('singleUserData', singleUserData)
                return response
            })
    },
    assignRoles(context, payload) {
        return this.$axios
            .put(`/accounts/assign-roles/${payload.id}`, payload)
            .then(response => {
                return response
            })
    },
    initUserData(context, payload) {
        return this.$axios
            .get(`/contacts/employees?include=account,type,person_data,address,country,channels,account.activeRoles${ payload }`)
            .then(response => {
                const leadData = response.data.data
                context.commit('initUserData', leadData)
                return response
            })
    },
    initCountryList(context) {
        context.commit('countryListLoaded', 1)
        return this.$axios
            .get('/countries?order_direction=asc&per_page=500', {headers: {'Content-Language': context.rootState.auth.locale}})
            .then(response => {
                context.commit('initCountryList', response.data)
                context.commit('countryListLoaded', 2)
                return response
            })
    },
}
