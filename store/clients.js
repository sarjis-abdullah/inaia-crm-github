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
        countryCodeList:[],
        loadedClients:[],
        amlStatuses:[],
        kycDocuments:[],
        kycStatuses:[],
    }
}

const initialState  = state()

export const getters = {

    clientData:state=>state.clientData,
    singleClientData:(state)=>(contactId,accountId)=> {
        if(contactId && contactId!=-1)
        {
            let client = state.loadedClients.find(
                 x => contactId == x.customer.id
            );
            if(client)
            {
                return client;
            }
        }
        if(accountId && accountId!=-1)
        {
            let client = state.loadedClients.find(
                x => x.customer.account && accountId == x.customer.account.id
            );
            if(client)
            {
                return client;
            }
        }
        return null;
    },
    // leadData:state=>state.leadData,
    // singleLeadData:state=>state.singleLeadData,
    countryList:state=>state.countryList,
    countryListLoaded:state=>state.countryListLoaded,
    orderFilterList:state=>state.orderFilterList,
    latestTransactions:state=>state.latestTransactions,
    countryCodeList:state=>state.countryCodeList,
    amlStatuses: state=>state.amlStatuses,
    kycDocuments: state=>state.kycDocuments,
    kycStatuses : state => state.kycStatuses
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
    countryCodeList(state,list)
    {
        state.countryCodeList = list
    },
    loadedClients(state, client)
    {
        let existingClient  = state.loadedClients.find( x => client.customer.id == x.customer.id  )
        if (existingClient) {
            Object.assign(existingClient, client)
        } else {
            state.loadedClients.push(client);
        }
    },
    amlStatuses(state,list)
    {
        state.amlStatuses = list;
    },
    kycDocuments(state,list)
    {
        state.kycDocuments = list;
    },
    updateAccount(state,account){
        state.singleClientData.account = account;
    },
    kycStatuses(state,list){
        state.kycStatuses = list;
    }
}
export const actions = {
    submitClient(context, payload) {
        if (!payload.id) {
            return this.$axios.post('/contacts/store-with-relations', payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
        } else {
            const id = payload.id
            delete payload.id;
            return this.$axios.put('/contacts/update-with-relations/' + id, payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                payload.id  = id // for next submit
                return Promise.reject(error)
            })
        }
    },
    changePassword(context, payload) {
      return this.$axios.post('/password-update', payload).then(response => {
        return Promise.resolve(response)
      }).catch(error => {
        return Promise.reject(error)
      })
    },
    saveAvatar(context, payload) {
        const id = payload.id
        delete payload.id
        return this.$axios.put('/contacts/update-avatar/' + id, payload).then(response => {
            context.commit('auth/avatar', response.data.data.avatar, { root: true })
            return Promise.resolve(response)
        }).catch(error => {
            return Promise.reject(error)
        })
    },
    initClientData(context, payload) {
        return this.$axios
            .get(`/accounts?include=contacts,type,person_data,address,country,channels${ payload }`)
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
            .get(`/accounts?include=contacts,person_data,channels&only=contacts.name,person_data.surname,channels.value&name=${payload}&type=customer&per_page=250`)
            .then(response => {
                const clientData = response.data.data;
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
            .get('/countries?order_direction=asc&per_page=250', {headers: {'Content-Language': context.rootState.auth.locale}})
            .then(response => {
                const countryList = response.data
                context.commit('initCountryList', countryList)
                context.commit('countryListLoaded', 2);
                context.commit('countryCodeList',mapCountryCode(countryList));
                return response
            })
    },
    clientDetailsData(context, payload) {
        return this.$axios
            .get(`/contacts/${payload}?include=account,type,person_data,address,country,channels,account_product_class_specs,product_class_specs,nationality_details,sales_advisor,referred_by`)
            .then(response => {
                const singleClientData = response.data.data
                context.commit('singleClientData', singleClientData);
                context.commit('loadedClients', singleClientData)
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
    getAmlStatuses(context,payload){
        return this.$axios
            .get('/aml-statuses')
            .then(response=>{
                context.commit('amlStatuses',response.data.data);
                return response.data.data;
            })
    },
    getKycDocument(context,payload){
        return this.$axios
            .get(`/documents?account_id=${payload}&per_page=250`)
            .then(response => {
                context.commit('kycDocuments',response.data.data);
                return response.data.data;
            })
    },
    updateAccountInformation(context,payload){
        return this.$axios.put('/accounts/' + payload.id, payload.data).then(response => {
            context.commit('updateAccount',response.data.data);
            return response.data.data;
        }).catch(error => {
            payload.id  = id // for next submit
            return Promise.reject(error)
        })
    },
    resetAccountPin(context,payload){
        return this.$axios.get(`/accounts/${payload}/pin-reset-request-by-staff`);
    },
    getKycStatuses(context){
        return this.$axios
            .get(`/kyc-statuses`)
            .then(response => {
                context.commit('kycStatuses',response.data.data);
                return response.data.data;
            })
    },

}
