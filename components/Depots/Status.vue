<template>
    <span class="badge badge-success" v-if="row.status && row.status.name_translation_key=='depot_status_active'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-info" v-else-if="row.status && row.status.name_translation_key=='depot_status_completed'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-warning" v-else-if="row.status && row.status.name_translation_key=='depot_status_paused'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-primary" v-else-if="row.status && row.status.name_translation_key=='depot_status_canceled'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-danger" v-else-if="row.status && row.status.name_translation_key=='depot_status_blocked'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-secondary" v-else-if="row.status && row.status.name_translation_key=='depot_status_applied_for_savings_plan'">
        {{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
</template>
<script>
    import {Badge} from '@/components/argon-core';
    export default {
        components:{
            Badge
        },
        props:{row:{
            type: Object
        }}
    }
</script>
