import { hasAppAccess, logout } from '~/helpers/auth'

let hasRedirect = false

export default async function({ app, route, store, redirect }) {
    const gets = store.getters

    if (!route.matched.length) {
        // return redirect(404, '/Error404')
        return
    }

    if (gets['auth/auth'] && gets['types/loading'] === false) {
        store.dispatch('types/pairs')
    }

    let bearerToken = route.query.token || route.params.token
    if (bearerToken) {
        if (bearerToken !== gets['auth/auth']) {
            store.commit('auth/setAuth', bearerToken)
        }
        store.commit('auth/user', null)
        hasRedirect = true
        redirect(process.env.dashboardPath)
    } else if (gets['auth/loading'] === 0 && gets['auth/auth']) {
        if (!gets['auth/user']) {
            // in case only cookie exists in localhost
            await store.dispatch('auth/fetchLoggedIn')
                .then( () => {
                    // authorize(store, gets['auth/userData'].roles)
                    if (!gets['auth/authorized'] || !hasAppAccess(gets['auth/user'].account)) {
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
