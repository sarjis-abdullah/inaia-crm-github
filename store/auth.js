const userToken = 'inaiaUserToken'
const authToken = 'inaiaAuthToken'
const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => ({
    auth: Cookie ? (Cookie.get(authToken) ? Cookie.get(authToken) : null) : null,
    user: JSON.parse(localStorage.getItem(userToken)) || null,
    authorized: false,
    loading: 0
})

export const getters = {
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
		Cookie.remove(authToken)
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
                context.commit('user', response.data.data)
                context.commit('authorize', response.data.data.id ? true : false)
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
