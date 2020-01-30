// const authorize = (store, roles) => {
//     roles.forEach(role => {
//         if (process.env.authenticatedRoles.includes(role.role.title)) {
//             store.commit('auth/authorize', true)
//         }
//     })
// }

let hasRedirect = false

export default function({ route, store, redirect }) {
    const gets = store.getters
    // store.dispatch('auth/logout')

    if (!route.matched.length) {
        return redirect(404, '/Error404')
    }
    // console.log('token', gets['auth/auth'])

    if (route.query.token && route.query.token !== gets['auth/auth']) {
        store.commit('auth/setAuth', route.query.token)
        hasRedirect = true
        redirect('/dashboards/classic')
    } else if (gets['auth/loading'] === 0 && gets['auth/auth']) {
        if (!gets['auth/user']) {
            // in case only cookie exists in localhost
            store.dispatch('auth/fetchLoggedIn')
                .then( () => {
                    // authorize(store, gets['auth/userData'].roles)
                    if (!gets['auth/authorized']) {
                        // console.log('no account')
                        store.dispatch('auth/logout')
                    } else if (gets['types/loading'] === 0) {
                        store.dispatch('types/fetchTypes')
                    }
                }).catch( err => {
                    console.log('err', err)
                })
        } else if (!gets['auth/authorized']) {
            // in case of page-reloaded
            // console.log('unauthorized')
            // authorize(store, gets['auth/userData'].roles)
            store.commit('auth/authorize', true)
        }
    }

    if (!hasRedirect && gets['auth/loading'] !== 1 && !gets['auth/authorized']) {
        // console.log('loading', gets['auth/loading'])
        return store.dispatch('auth/logout')
    }

    // console.log('path', route)
    if (['/', '/dashboards'].includes(route.path)) {
        redirect('/dashboards/classic')
    }
    hasRedirect = false
}
