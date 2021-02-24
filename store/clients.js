export const state = () => {
    return {
        clientData: [],
        singleClientData: {},
        // leadData: [],
        // singleLeadData: {},
        countryList: [],
        countryListLoaded: 0
    }
}

const initialState  = state()

export const getters = {

    clientData(state) {
        return state.clientData
    },
    singleClientData(state) {
        return state.singleClientData
    },
    // leadData(state) {
    //     return state.leadData
    // },
    // singleLeadData(state) {
    //     return state.singleLeadData
    // },
    countryList(state) {
        return state.countryList
    },
    countryListLoaded(state) {
        return state.countryListLoaded
    }
}
export const mutations = {

    initClientData(state, clientData) {
        state.clientData = clientData
    },
    removeClient(state, clientIndex) {
        state.clientData = state.clientData.splice(clientIndex, 1)
    },
    singleClientData(state, singleClientData) {
        state.singleClientData = singleClientData
    },
    // initLeadData(state, leadData) {
    //     state.leadData = leadData
    // },
    // removeLead(state, leadIndex) {
    //     state.leadData = state.leadData.splice(leadIndex, 1)
    // },
    // singleLeadData(state, singleLeadData) {
    //     state.singleLeadData = singleLeadData
    // },
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
    submitClient(context, payload) {

        if (!payload.id) {
            // console.log(payload)
            return this.$axios.post('/contacts/store-with-relations', payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
        } else {
            const id = payload.id
            // console.log(id)
            delete payload.id
            return this.$axios.put('/contacts/update-with-relations/' + id, payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                payload.id  = id // for next submit
                return Promise.reject(error)
            })
        }
    },
    initClientData(context, payload) {
        return this.$axios
            .get(`/contacts?include=account,type,person_data,address,country,channels${ payload }`)
            .then(response => {
                const clientData = response.data.data
                context.commit('initClientData', clientData)
                return response
            })
    },
    removeClient(context, payload) {
        return this.$axios
            .delete(`/contacts/${ payload }`)
            .then(response => {
                const clientIndex = context.state.clientData.findIndex( c => c.id == payload)
                context.commit('removeClient', clientIndex)
                return response
            })
    },
    clientDetailsData(context, payload) {
        return this.$axios
            .get(`/contacts/${payload}?include=account,type,person_data,address,country,channels`)
            .then(response => {
                const singleClientData = response.data.data
                context.commit('singleClientData', singleClientData)
                return response
            })
    },
    // submitLead(context, payload) {

    //     if (!payload.id) {
    //         // console.log(payload)
    //         return this.$axios.post('/contacts/store-with-relations', payload).then(response => {
    //             return Promise.resolve(response)
    //         }).catch(error => {
    //             return Promise.reject(error)
    //         })
    //     } else {
    //         const id = payload.id
    //         // console.log(id)
    //         delete payload.id
    //         return this.$axios.put('/contacts/update-with-relations/' + id, payload).then(response => {
    //             return Promise.resolve(response)
    //         }).catch(error => {
    //             payload.id  = id // for next submit
    //             return Promise.reject(error)
    //         })
    //     }
    // },
    initLeadData(context, payload) {
        return this.$axios
            .get(`/contacts/leads?include=type,person_data,address,country,channels${ payload }`)
            .then(response => {
                const leadData = response.data.data
                context.commit('initClientData', leadData)
                return response
            })
    },
    // removeLead(context, payload) {
    //     return this.$axios
    //         .delete(`/contacts/${ payload }`)
    //         .then(response => {
    //             const clientIndex = context.state.clientData.findIndex( c => c.id == payload)
    //             context.commit('removeClient', clientIndex)
    //             return response
    //         })
    // },
    // leadDetailsData(context, payload) {
    //     return this.$axios
    //         .get(`/contacts/${payload}?include=account,type,person_data,address,country,channels`)
    //         .then(response => {
    //             const singleClientData = response.data.data
    //             context.commit('singleClientData', singleClientData)
    //             return response
    //         })
    // },
    initSalesPartnerData(context, payload) {
        return this.$axios
            .get(`/contacts/partners?include=account,type,person_data,address,country,channels${ payload }`)
            .then(response => {
                const leadData = response.data.data
                context.commit('initClientData', leadData)
                return response
            })
    },
    initCountryList(context) {
        context.commit('countryListLoaded', 1)
        return this.$axios
            .get('/countries?order_direction=asc&per_page=500', {headers: {'Content-Language': context.rootState.auth.locale}})
            .then(response => {
                const countryList = response.data.data
                // console.log('country-list loaded')
                context.commit('initCountryList', countryList)
                context.commit('countryListLoaded', 2)
                return response
            })
    },
}