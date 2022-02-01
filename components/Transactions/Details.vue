<template>
    <div class="card">
        <h4 class="card-title mt-3 mb-0">{{ resource.order_id }}</h4>
        <h5 class="text-muted capitalize">{{ resource.type ? resource.type.name_translation_key : resource.transaction_type_id }}</h5>
        <h5 class="text-muted capitalize">{{ resource.fee }}</h5>
        <h5 class="text-muted capitalize">{{ resource.money_amount }}</h5>
        <h5 class="text-muted capitalize">{{ resource.gold_amount }}</h5>
        <h5 class="text-muted capitalize">{{ resource.gold_price_date }}</h5>
        <h5 class="text-muted capitalize">{{ resource.gold_price_trading }}</h5>
        <h5 class="text-muted capitalize">{{ resource.gold_price_raw }}</h5>
        <h5 class="text-muted capitalize">{{ resource.depot_balanace_before }}</h5>
        <h5 class="text-muted capitalize">{{ resource.depot_balanace_after }}</h5>
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