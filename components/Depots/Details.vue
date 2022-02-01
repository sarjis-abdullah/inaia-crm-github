<template>
    <div class="card">
        <h4 class="card-title mt-3 mb-0">{{ resource.depot_number }}</h4>
        <h5 class="text-muted">{{ resource.account_id }}</h5>
        <h5 class="text-muted">{{ resource.banking_account_id }}</h5>
        <h5 class="text-muted">{{ resource.gold_amount }}</h5>
        <h5 class="text-muted capitalize">{{ getProductClass(resource.product_class_id) }}</h5>
        <h5 class="text-muted">{{ resource.primary_serial_number }}</h5>
        <h5 class="text-muted capitalize">{{ resource.status ? resource.status.name_translation_key : resource.depot_status_id }}</h5>
    </div>
</template>

<script>
export default {
    props: {
        resource: {
            type: Object
        },
        productClasses: {
            type: Object
        }
    },
    methods: {
        getProductClass(cid) {
            if (this.productClasses) {
                let c   = Object.keys(this.productClasses).find(cl => this.productClasses[cl] == cid)
                return c || cid
            }
            return cid
        }
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>