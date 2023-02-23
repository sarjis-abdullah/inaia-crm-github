<template>
    <reset-password v-if="account" />
</template>

<script>
import ResetPassword from '@/components/Profile/ResetPassword'
import { mapGetters } from "vuex"

export default {
    layout: 'AuthLayout',
    components: {
        ResetPassword,
    },
    middleware: ['auth'],
    computed: {
        ...mapGetters({
            account: "auth/user",
        })
    }
}
</script>
