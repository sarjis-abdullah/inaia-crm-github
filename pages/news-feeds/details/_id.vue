<template>
    <Details v-if="singleClientData.customer" :resource="singleClientData" />
</template>

<script>
import { mapGetters } from "vuex"
import Details from "@/components/NewsFeeds/Details"

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            customerId: this.$route.params.id
        }
    },
    components: {
        Details
    },
    computed: {
        ...mapGetters({
            singleClientData: "clients/singleClientData",
        })
    },
    watch: {
        customerId: {
            handler() {
                if (this.customerId) {
                    this.initClientData()
                }
            },
            immediate: true
        },
    },
    methods: {
        initClientData() {
            this.$store.dispatch("clients/clientDetailsData", this.customerId)
        },
    }
}
</script>
