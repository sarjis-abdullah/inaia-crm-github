<template>
  <Form
    :single-client-data="singleClientData"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/Leads/Form"

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            leadId: this.$route.params.id
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
        leadId: {
            handler() {
                if (this.leadId) {
                    this.initClientData()
                }
            },
            immediate: true
        },
    },
    methods: {
        initClientData() {
            this.$store.dispatch("clients/clientDetailsData", this.leadId)
        },
    }
}
</script>
