<template>
  <Form
    :product-spec-details="productSpecDetails"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Form from '@/components/ProductSpecs/Form'

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            productSpecId: this.$route.params.id
        }
    },
    components: {
        Form
    },
    computed: {
        ...mapGetters({
            productSpecDetails: "product-specs/details",
        })
    },
    watch: {
        productSpecId: {
            handler() {
                if (this.productSpecId) {
                    this.getProductSpecDetails()
                }
            },
            immediate: true
        },
    },
    methods: {
        getProductSpecDetails() {
            this.$store.dispatch("product-specs/details", this.productSpecId)
        },
    }
}
</script>
