<template>
    <div class="card">
        <h4 class="card-title mt-3 mb-0">{{ resource.depot_id }}</h4>
        <!-- <h5 class="text-muted">{{ resource.vault_id }}</h5> -->
        <h5 class="text-muted">{{ resource.type ? resource.type.name_translation_key : resource.order_type_id }}</h5>
        <h5 class="text-muted">{{ resource.banking_account_id }}</h5>
        <h5 class="text-muted">{{ resource.amount }} {{ resource.unit }}</h5>
        <h5 class="text-muted capitalize">{{ resource.status ? resource.status.name_translation_key : resource.depot_status_id }}</h5>
    </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    props: {
        resource: {
            type: Object
        }
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>