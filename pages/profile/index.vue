<template>
    <user-card v-if="account" />
</template>

<script>
import UserCard from '@/components/Profile/UserCard'
import { mapGetters } from "vuex"

export default {
    layout: 'AuthLayout',
    // beforeRouteEnter(to, from, next) {
    //     console.error('to:', to.path, ', from:', from.path)
    //     if (to.path == '/profile' || to.path == '/profile/') {
    //         next(vm => vm.$router.push('/'))
    //     }
    //     next()
    // },
    components: {
        UserCard,
    },
    middleware: ['auth'],
    computed: {
        ...mapGetters({
            account: "auth/user",
        })
    }
}
</script>
