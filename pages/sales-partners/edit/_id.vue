<template>
  <Form
    :single-client-data="singleClientData"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/SalesPartners/Form"

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            salesPartnerId: this.$route.params.id
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
        salesPartnerId: {
            handler() {
                if (this.salesPartnerId) {
                    this.initClientData()
                }
            },
            immediate: true
        },
    },
    methods: {
        initClientData() {
            this.$store.dispatch("clients/clientDetailsData", this.salesPartnerId)
        },
    }
}
</script>
