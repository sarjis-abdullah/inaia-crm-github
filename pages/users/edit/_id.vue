<template>
  <Form
    :single-user-data="singleUserData"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/Users/Form"

export default {
    layout: 'DashboardLayout',
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
    components: {
        Form
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
