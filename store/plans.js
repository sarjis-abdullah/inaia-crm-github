const defaultLocale = 'en';
const i18nKey = 'i18n_redirected'
const Cookie = process.client ? require('js-cookie') : undefined
const locale    = Cookie ? (Cookie.get(i18nKey) ? Cookie.get(i18nKey) : defaultLocale) : defaultLocale;

export const state = () => ({
    list: null,
    loading: false
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    }
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
    fetchList(context, payload=null) {
        if (!context.state.loading) {
            return this.$axios.get(`plans`)
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
}
