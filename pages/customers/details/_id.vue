<template>
    <Details v-if="singleClientData && singleClientData.customer" :resource="singleClientData"/>
</template>

<script>
import { mapGetters } from "vuex"
import Details from "@/components/Contacts/Details";

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            customerId: this.$route.params.id,
        }
    },
    components: {
        Details
    },
    computed: {
        ...mapGetters({
            // client: "clients/singleClientData",
            singleClientData: "clients/singleClientData",
        }),
        // singleClientData(){
        //     return this.client(this.customerId);
        // }
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
            if(!this.singleClientData)
                this.$store.dispatch("clients/clientDetailsData", this.customerId)
        },
    }
}
</script>
