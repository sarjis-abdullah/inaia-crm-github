import {hasAdminLoginAccess, getAppsAccess} from '~/helpers/auth'

const userToken = 'inaiaUserToken'
const authToken = 'inaiaAuthToken'
const i18nKey = 'i18n_redirected'
const defaultLocale = 'en'
const Cookie = process.client ? require('js-cookie') : undefined

const initLocale    = Cookie ? (Cookie.get(i18nKey) ? Cookie.get(i18nKey) : defaultLocale) : defaultLocale
const initAuth      = Cookie ? (Cookie.get(authToken) ? Cookie.get(authToken) : null) : null
const initUser      = JSON.parse(localStorage.getItem(userToken))

export const state = () => ({
    locale: initLocale,
    locales: [
        { text: 'Deutsch',  value: 'de' },
        { text: 'English',  value: 'en' }
    ],
    auth: initAuth,
    user: initUser,
    authorized: false,
    loading: 0
})

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

    avatar(state, payload) {
        state.user.avatar    = payload
		localStorage.setItem(userToken, JSON.stringify(state.user))
    },

    authorize(state, bool) {
        state.authorized = bool
    },

    loading(state, bool) {
        state.loading = bool
    }
}

export const actions = {
    setLocale(context, payload) {
        return this.$axios.put('account-settings/' + payload.accountId, {locale: payload.locale})
            .then(res => {
                context.commit('setLocale', payload.locale)
                payload.vm.$i18n.locale = payload.locale
                return res
            }).catch(err => {
                // return err
                return Promise.reject(err)
            }).finally(() => {
            })
    },
    fetchLoggedIn(context) {
        context.commit('loading', 1)

        return this.$axios
            .get('/me?include=account,type,person_data,address,country,channels,account.roles,role.permissions,apps')
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
                context.commit('clients/loadedClients', {customer: dt}, { root: true })
                return response
            })
            .catch(error => {
                console.log('Error fetching logged in user data')
                return Promise.reject(error)
            })
            .finally(() => {
                context.commit('loading', 2)
            })
    },

	postLogin(context, payload) {
		return this.$axios
			.post('/authenticate?for=admin', payload)
			.then(response => {
                let dt  = response.data.success
                if (dt && hasAdminLoginAccess(dt.account.account)) {
                    let st  = dt.account.account.settings,
                        ad  = dt.account.address,
                        lc  = st && st.find(s => s.name_translation_key == 'locale')

                    context.commit('setAuth', dt.accessToken)
                    context.commit('user', dt.account)
                    if (lc && lc.value != context.state.locale) {
                        context.commit('setLocale', lc.value)
                    } else if (!lc && ad && ad.country) {
                        context.commit('setLocale', ad.country.alpha2_code.toLowerCase())
                    }
                } else {
                    throw "Unauthorized"
                }
				return response
			})
			.catch(error => {
				return Promise.reject(error)
			})
	},
	verifyMfa(context, payload) {
        const { pin, token} = payload
        const query = '?include=account,type,person_data,address,country,channels,account.roles,role.activePermissions,apps'
		return this.$axios
			.post('mfa/login/verify' + query, {pin}, {
                headers: {
                  'X-api-key': token
                }
            })
			.then(response => {
                let dt  = response.data.success
                if (dt && hasAdminLoginAccess(dt.account.account)) {
                    let st  = dt.account.account.settings,
                        ad  = dt.account.address,
                        lc  = st && st.find(s => s.name_translation_key == 'locale')

                    context.commit('setAuth', dt.accessToken)
                    context.commit('user', dt.account)
                    if (lc && lc.value != context.state.locale) {
                        context.commit('setLocale', lc.value)
                    } else if (!lc && ad && ad.country) {
                        context.commit('setLocale', ad.country.alpha2_code.toLowerCase())
                    }
                } else {
                    throw "Unauthorized"
                }
				return response
			})
			.catch(error => {
				return Promise.reject(error)
			})
	},
	initialLogin(context, payload) {
		return this.$axios
			.post('/authenticate?for=admin', payload)
			.then(response => {
				return response
			})
			.catch(error => {
				return Promise.reject(error)
			})
	},

    refreshAvatar(context, payload) {
        return this.$axios
            .get('/refresh-s3-file?file=' + payload)
            .then(response => {
                context.commit('avatar', response.data.url)
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            })
    },

    logout(context) {
        return this.$axios
            .get('/logout')
            .then(response => {
                return Promise.resolve(response)
            }).catch(error => {
                return Promise.reject(error)
            }).finally(() => {
                resetState(context.commit)
            })
    },

    unauthorize(context) {
        resetState(context.commit)
    }
}

function resetState(commit) {
    commit('purgeAuth')
    commit('clients/resetState', null, { root: true })
    commit('types/resetState', null, { root: true })
}
