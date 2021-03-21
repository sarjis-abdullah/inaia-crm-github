// const authorize = (store, roles) => {
//     roles.forEach(role => {
//         if (process.env.authenticatedRoles.includes(role.role.title)) {
//             store.commit('auth/authorize', true)
//         }
//     })
// }

let hasRedirect = false

export default function({ app, route, store, redirect }) {
    const gets = store.getters
    // logout(store)

    if (!route.matched.length) {
        // return redirect(404, '/Error404')
        return
    }
    // console.log('token', gets['auth/auth'])
    if (gets['auth/auth'] && gets['types/loading'] === 0) {
        store.dispatch('types/fetchTypes')
    }

    // if (route.query.token && route.query.token !== gets['auth/auth']) {
    if (route.query.token) {
        if (route.query.token !== gets['auth/auth']) {
            store.commit('auth/setAuth', route.query.token)
        }
        store.commit('auth/user', null)
        hasRedirect = true
        redirect(process.env.dashboardPath)
    } else if (gets['auth/loading'] === 0 && gets['auth/auth']) {
        if (!gets['auth/user']) {
            // in case only cookie exists in localhost
            store.dispatch('auth/fetchLoggedIn')
                .then( () => {
                    // authorize(store, gets['auth/userData'].roles)
                    if (!gets['auth/authorized']) {
                        // console.log('no account')
                        logout(store)
                    } else {
                        if (app.i18n.locale !== gets['auth/locale']) {
                            app.i18n.locale = gets['auth/locale']
                        }
                    }
                }).catch( err => {
                    // console.log('err', err)
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
        return logout(store)
    }

    // console.log('path', route)
    if (['/', '/dashboards'].includes(route.path)) {
        redirect(process.env.dashboardPath)
    }
    hasRedirect = false
}

function logout(store) {
    return store.dispatch('auth/logout')
    .catch(err => {})
    .finally(() => {
        window.location.href    = process.env.universalLogin + '/logout'
    })
}
