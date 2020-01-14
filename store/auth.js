const userToken = 'inaiaUserToken'
const authToken = 'inaiaAuthToken'
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
    auth: Cookie ? (Cookie.get(authToken) ? Cookie.get(authToken) : null) : null,
    account: JSON.parse(localStorage.getItem(userToken)) || null,
    authorized: false,
    loading: 0
})

export const getters = {
	account(state) {
		return state.account
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
	setAuth(state, auth) {
		state.auth  = auth
		Cookie.set(authToken, auth) // saving token in cookie for server rendering
	},

	setAccount(state, account) {
		state.account = account;
		localStorage.setItem(userToken, JSON.stringify(account))
	},

    purgeAuth(state) {
		localStorage.removeItem(userToken)
		Cookie.remove(authToken)
		state.auth = null
		state.account = null
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
            .get('/me')
            .then(response => {
                context.commit('setAccount', response.data)
                context.commit('authorize', response.data.id ? true : false)
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
