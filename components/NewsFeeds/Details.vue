<template>
    <div class="card">
        <h4 class="card-title mt-3 mb-2">{{ resource.title }}</h4>
        <h5 class="text-muted capitalize">{{ resource.message }}</h5>
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