// Vuex strict mode slows the routing
export const strict = false

export const state = () => ({
    title: '',
})

export const getters = {
    title(state) {
        return state.title
    }
}

export const mutations = {
    title(state, title) {
        state.title = title
    }
}

export const actions = {
    setPageTitle(context, payload) {
        context.commit('title', payload)
    }
}

// export const actions = {
//     nuxtServerInit({ dispatch }, context) {
//         console.error('running server init', {...context})
//         return Promise.all([
//             // dispatch('types/nuxtServerInit', context),
//             // dispatch('types/fetchTypes', context)
//         ])
//     }
// }
