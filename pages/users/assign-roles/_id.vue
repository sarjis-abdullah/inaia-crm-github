<template>
  <Role
    :single-user-data="singleUserData"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Role from "@/components/Users/Role"

export default {
    layout: 'DashboardLayout',
    components: {
        Role
    },
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            userId: this.$route.params.id
        }
    },
    computed: {
        ...mapGetters({
            singleUserData: "users/singleUserData",
        })
    },
    watch: {
        userId: {
            handler() {
                if (this.userId) {
                    this.initUserData()
                }
            },
            immediate: true
        },
    },
    methods: {
        initUserData() {
            this.$store.dispatch("users/userDetailsData", this.userId)
        },
    }
}
</script>
