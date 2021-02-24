const userToken = 'inaiaUserToken'
const authToken = 'inaiaAuthToken'
const i18nKey = 'i18n_redirected'
const defaultLocale = 'en'
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
    locale: Cookie ? (Cookie.get(i18nKey) ? Cookie.get(i18nKey) : defaultLocale) : defaultLocale,
    locales: [
        { text: 'Deutsch',  value: 'de' },
        { text: 'English',  value: 'en' },
        { text: 'Français', value: 'fr' },
        { text: 'Español',  value: 'es' },
    ],
    auth: Cookie ? (Cookie.get(authToken) ? Cookie.get(authToken) : null) : null,
    user: JSON.parse(localStorage.getItem(userToken)) || null,
    authorized: false,
    loading: 0
})

const initialState  = state()

export const getters = {
    locale(state) {
        return state.locale
    },

    locales(state) {
        return state.locales
    },

    user(state) {
		return state.user
    },
    
	auth(state) {
		return state.auth
    },

    authorized(state) {
        return state.authorized
    },

    loading(state) {
        return state.loading
    }
}

export const mutations = {
    setLocale(state, locale) {
        if (state.locales.find(l => l.value == locale)) {
            state.locale = locale
            if (Cookie) {
                Cookie.set(i18nKey, locale) // saving token in cookie for server rendering
            }
        }
    },

    setAuth(state, auth) {
		state.auth  = auth
		Cookie.set(authToken, auth) // saving token in cookie for server rendering
	},

	user(state, user) {
		state.user  = user;
		localStorage.setItem(userToken, JSON.stringify(user))
	},

    purgeAuth(state) {
		localStorage.removeItem(userToken)
        if (Cookie) {
		    Cookie.remove(authToken)
        }
		state.auth          = null
		state.user          = null
		state.authorized    = false
    },

    authorize(state, bool) {
        state.authorized = bool
    },
  
    loading(state, bool) {
        state.loading = bool
    }
}

export const actions = {
    fetchLoggedIn(context) {
        context.commit('loading', 1)
    
        return this.$axios
            .get('/me?include=account,type,person_data,address,country,channels')
            .then(response => {
                let dt  = response.data.data,
                    ad  = dt.address,
                    st  = dt.account.settings,
                    lc  = st && st.find(s => s.name_translation_key == 'locale')

                context.commit('user', dt)
                context.commit('authorize', dt.id ? true : false)
                if (lc && lc.value != context.state.locale) {
                    context.commit('setLocale', lc.value)
                } else if (!lc && ad && ad.country) {
                    context.commit('setLocale', ad.country.alpha2_code.toLowerCase())
                }
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
    
    logout(context) {
        context.commit('purgeAuth')
        window.location.href = process.env.universalLogin + '/logout'
    }
}
