import { mapCountryCode } from '../helpers/helpers';
export const state = () => {
    return {
        clientData: [],
        singleClientData: null,
        // leadData: [],
        // singleLeadData: {},
        countryList: [],
        countryListLoaded: 0,
        orderFilterList:[],
        latestTransactions:[],
        aggregatedClaims: [],
        claimStatuses:[],
        claims:[],
        countryCodeList:[]
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
    },
    orderFilterList:state=>state.orderFilterList,
    latestTransactions:state=>state.latestTransactions,
    aggregatedClaims:state=>state.aggregatedClaims,
    claimStatuses:state=>state.claimStatuses,
    claims:state=> state.claims,
    countryCodeList:state=>state.countryCodeList
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
    updateAddress(state,address)
    {
        
        state.singleClientData.customer.address = address;
    },
    updateChannels(state,channels)
    {
        state.singleClientData.customer.channels = channels;
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
    },
    orderFilterList(state,list) {
        state.orderFilterList = list;
    },
    latestTransactions(state,list) {
        state.latestTransactions = list;
    },
    aggregatedClaims(state,list)
    {
        state.aggregatedClaims = list;
    },
    claimStatuses(state,list) {
        state.claimStatuses = list;
    },
    claims(state,list) {
        state.claims = list;
    },
    countryCodeList(state,list)
    {
        state.countryCodeList = list
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
            .get(`/contacts/customers?include=account,type,person_data,address,country,channels${ payload }`)
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
    getClientListBySurname(context, payload) {
        return this.$axios
            .get(`/accounts?include=contacts,person_data,channels&only=contacts.name,person_data.surname,channels.value&name=${payload}&type=customer`)
            .then(response => {
                const clientData = response.data.data;
                console.log(clientData);
                context.commit('orderFilterList', clientData)
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
                const countryList = response.data
                // console.log('country-list loaded')
                context.commit('initCountryList', countryList)
                context.commit('countryListLoaded', 2);
                context.commit('countryCodeList',mapCountryCode(countryList));
                return response
            })
    },
    clientDetailsData(context, payload) {
        return this.$axios
            .get(`/contacts/${payload}?include=account,type,person_data,address,country,channels,account_product_class_specs,product_class_specs`)
            .then(response => {
                context.commit('singleClientData', response.data.data);
                console.log(response.data.data);
                return response
            })
    },
    getClientLatestTransactions(context,payload) {
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/orders/account-activities?include=order_transactions,orders_payment_transactions&${payload}`)
            .then(res=>{
                context.commit('latestTransactions',res.data.data);
                return res.data;
            })
    },
    clientAccountDetails(context,payload){
        return this.$axios
            .get(`/accounts/${payload}?include=person_data,address,country,channels`)
            .then(response => {
                
                return response.data.data;
            })
    },
    getClientAggregatedClaims(context,payload){
        return this.$axios
                .get(`/aggregated-claims?include=claim_status${payload}`)
                .then(res=>{
                    context.commit('aggregatedClaims',res.data.data);
                    return res.data;
                })
    },
    getClaimStatuses(context)
    {
        return this.$axios
            .get(`/claim-statuses`)
            .then(response => {
                context.commit('claimStatuses', response.data.data)
                return response
            })
    },
    getClientClaims(context,payload)
    {
        return this.$axios
                .get(`/claims?include=claim_type${payload}`)
                .then(res=>{
                    context.commit('claims',res.data.data);
                    return res.data;
                })
    }
}