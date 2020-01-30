export default function({ store, $axios }) {
	$axios.interceptors.request.use(function(config) {
        if (store.getters['auth/auth']) {
            config.headers.Authorization = `Bearer ${ store.getters['auth/auth'] }`
        }
		return config
	})

    $axios.interceptors.response.use(
        response => response,
        error => {
            console.error('axios-error', error)
            if (error.response && error.response.status === 401) {
                store.dispatch('auth/logout')
                return
            }
            return Promise.reject(error)
        }
    )
}
