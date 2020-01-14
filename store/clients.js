export const state = () => {
    return {
        locale: 'en',
        locales: [
            { text: 'Deutsch',  value: 'de' },
            { text: 'English',  value: 'en' },
            { text: 'français', value: 'fr' },
            { text: 'español',  value: 'es' },
        ],
        clientData: [],
        singleClientData: {},
        countryList: [],
    }
}
export const getters = {

    locale(state) {
        return state.locale
    },
    locales(state) {
        return state.locales
    },
    singleClientData(state) {
        return state.singleClientData
    },
    countryList(state) {
        return state.countryList
    },
}
export const mutations = {

    setLocale(state, locale) {
        state.locale = locale
    },
    initClientData(state, clientData) {
        state.clientData = clientData
    },
    singleClientData(state, singleClientData) {
        state.singleClientData = singleClientData
    },
    initCountryList(state, countryList) {
        state.countryList = countryList
    },
}
export const actions = {
    setLocale(context, payload) {
        context.commit('setLocale', payload)
    },
    submitClient(context, payload) {

        if (!payload.id) {
            console.log(payload)
            return this.$axios.post('/contacts/store-with-relations', payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
        } else {
            const id = payload.id
            console.log(id)
            delete payload.id
            return this.$axios.put('/contacts/update-with-relations/' + id, payload).then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
        }
    },
    initClientData(context, payload) {
        return this.$axios
            .get('/contacts?type_id=3&include=account,person_data,address,country' + payload)
            .then(response => {
                const clientData = response.data.data
                context.commit('initClientData', clientData)
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
    initCountryList(context) {
        return this.$axios
            .get('/countries?order_direction=asc&per_page=500', {headers: {'Content-Language': context.state.locale}})
            .then(response => {
                const countryList = response.data.data
                console.log('country-list loaded')
                context.commit('initCountryList', countryList)
                return response
            })
    },
}