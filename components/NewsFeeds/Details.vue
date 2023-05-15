<template>
    <div class="list-group list-group-flush mt-3">
        <DetailListItem :title="$t('title')"><div slot="value">{{ resource.title }}</div></DetailListItem>
        <DetailListItem :title="$t('message')"><div slot="value">{{ resource.message }}</div></DetailListItem>
        <DetailListItem :title="$t('is_active')"><div slot="value">{{ resource.is_active == 1 ? 'Active' : 'Inactive' }}</div></DetailListItem>
        
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import DetailListItem from '@/components/common/DetailListItem.vue';
export default {
    props: {
        resource: {
            type: Object
        }
    },
    components:{
        DetailListItem
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>