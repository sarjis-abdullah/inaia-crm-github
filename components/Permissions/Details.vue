<template>
    <div class="card">
        <h4 class="card-title mt-3 mb-0">{{ resource.short_name }}</h4>
        <h5 class="text-muted capitalize">{{ resource.name_translation_key }}</h5>
        <h5 class="text-muted capitalize">{{ resource.is_active == 1 ? 'Active' : 'Inactive' }}</h5>
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