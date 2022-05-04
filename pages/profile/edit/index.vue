<template>
    <edit v-if="account" />
</template>

<script>
import Edit from '@/components/Profile/Edit'
import { mapGetters } from "vuex"

export default {
    layout: 'AuthLayout',
    components: {
        Edit,
    },
    middleware: ['auth'],
    computed: {
        ...mapGetters({
            account: "auth/user",
        })
    }
}
</script>
