<template>
  <Form
    :product-class-details="productClassDetails"
    :show-view-page="showViewPage"
  />
</template>

<script>
import { mapGetters } from "vuex"
import Form from '@/components/ProductClasses/Form'

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            productClassId: this.$route.params.id
        }
    },
    components: {
        Form
    },
    computed: {
        ...mapGetters({
            productClassDetails: "product-classes/details",
        })
    },
    watch: {
        productClassId: {
            handler() {
                if (this.productClassId) {
                    this.getProductClassDetails()
                }
            },
            immediate: true
        },
    },
    methods: {
        getProductClassDetails() {
            this.$store.dispatch("product-classes/details", this.productClassId)
        },
    }
}
</script>
