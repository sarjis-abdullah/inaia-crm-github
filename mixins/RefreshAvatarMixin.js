import { anonymousUserAvatar, depotAvatar } from '@/helpers/auth'
// import { imageFileValidity } from '@/helpers/helpers'

export default {
    data() {
        return {
            lastAvatarRefreshed: 0,
            lastDepotAvatarRefreshed: {},
            lastLogoRefreshed: {}
        }
    },

    methods: {
        anonymousUserAvatar,
        // depotAvatar,
        // imageFileValidity,
        async refreshAvatar(e, gender) {
            e.target.src = this.anonymousUserAvatar(gender)
            // if (!imageFileValidity(this.loggedin.avatar_file, e)) {
            //     return
            // }
            let now = Math.floor(Date.now() / 1000)
            if (now - this.lastAvatarRefreshed > 21600) {
                // 6 hours
                this.lastAvatarRefreshed  = now
                if (this.loggedin.avatar_file) {
                    await this.$store.dispatch('auth/refreshAvatar', this.loggedin.avatar_file)
                    .then(res => {
                        e.target.src = res.data.url
                    }).catch(err => {
                        console.log('avatar error:', err.response)
                    })
                }
            }
        },
        // async refreshDepotAvatar(e, depot) {
        //     e.target.src    = this.depotAvatar() // temporary
        //     if (!imageFileValidity(depot.avatar_file, e)) {
        //         return
        //     }
        //     let now = Math.floor(Date.now() / 1000),
        //         lastAvatarRefreshed = this.lastDepotAvatarRefreshed[depot.id] || 0
        //     if (now - lastAvatarRefreshed > 21600) {
        //         // 6 hours
        //         this.lastDepotAvatarRefreshed[depot.id]  = now
        //         if (depot.avatar_file) {
        //             await this.$store.dispatch('auth/refreshDepotAvatar', {id: depot.id, file: depot.avatar_file})
        //             .then(res => {
        //                 e.target.src = res.data.url
        //             }).catch(err => {
        //                 console.log('depot avatar error:', err.response)
        //             })
        //         }
        //     }
        // },
        async refreshLogo(e, logoFile, id) {
            if (!imageFileValidity(logoFile, e)) {
                return
            }
            let now = Math.floor(Date.now() / 1000),
                lastRefreshed = this.lastLogoRefreshed[id] || 0
            if (now - lastRefreshed > 21600) {
                // 6 hours
                this.lastLogoRefreshed[id]  = now
                if (logoFile) {
                    await this.$store.dispatch('auth/refreshLogo', logoFile)
                    .then(res => {
                        e.target.src = res.data.url
                    }).catch(err => {
                        console.log('logo error:', err.response)
                    })
                }
            }
        }
    }
}