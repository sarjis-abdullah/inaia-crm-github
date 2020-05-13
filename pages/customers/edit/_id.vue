<template>
    <Form :single-client-data="singleClientData" />
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/Contacts/Form"

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
        Form
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
