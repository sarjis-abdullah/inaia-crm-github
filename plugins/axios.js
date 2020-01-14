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
            if (error.response.status === 401) {
                store.dispatch('auth/logout')
                return
            }
            return Promise.reject(error)
        }
    )
}
