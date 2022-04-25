const defaultLocale = 'en';
const i18nKey = 'i18n_redirected'
const Cookie = process.client ? require('js-cookie') : undefined
const locale    = Cookie ? (Cookie.get(i18nKey) ? Cookie.get(i18nKey) : defaultLocale) : defaultLocale;

export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    productClasses: [],
    loading: false
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    },
    details(state) {
        return state.details
    },
    pairs(state) {
        return state.pairs
    },
    productClasses:state=>state.productClasses
}

export const mutations = {
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    pairs(state, data) {
        state.pairs   = data
    },
    remove(state, idx) {
        state.list = state.list.splice(idx, 1)
    },
    productClasses(state, data) {
        state.productClasses = data
    },
    loading(state, bool) {
        state.loading   = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    }
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(`${ process.env.productApiUrl }/product-classes?pair`)
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
            return this.$axios.get(`${process.env.productApiUrl}/product-classes?include=product${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res
                }).catch(err => {
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    async details(context, payload) {
        return await this.$axios
            .get(`${process.env.productApiUrl}/product-classes/${payload}?include=product`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            }).catch((err) => {
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(`${process.env.productApiUrl}/product-classes`, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(`${process.env.productApiUrl}/product-classes/${payload.id}`, payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`${process.env.productApiUrl}/product-classes/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            }).catch(err => {
                return Promise.reject(err)
            })
    },
    productClasses(context) {
        return this.$axios
            .get(`/products/gloddinar/pricing`,{headers:{'X-localization':locale}})
            .then(response => {

                context.commit('productClasses', Object.values(response.data.data))
                return response
            })
            .catch(err => {
                return Promise.reject(err)
            })
            .finally(() => {
            })
    }
}
