<template>
    <span class="badge badge-success ml-2" v-if="row.status && row.status.name_translation_key=='depot_status_active'">
        <font-awesome-icon icon="fa fa-play" class="mr-1" />{{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-info ml-2" v-else-if="row.status && row.status.name_translation_key=='depot_status_completed'">
        <font-awesome-icon icon="fa fa-check" class="mr-1" />{{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-warning ml-2" v-else-if="row.status && row.status.name_translation_key=='depot_status_paused'">
        <font-awesome-icon icon="fa fa-pause" class="mr-1" />{{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-primary ml-2" v-else-if="row.status && row.status.name_translation_key=='depot_status_canceled'">
        <font-awesome-icon icon="fa fa-ban" class="mr-1" />{{
            $t(
            row.status
                ? row.status.name_translation_key
                : row.depot_status_id
            )
        }}
    </span>
    <span class="badge badge-danger ml-2" v-else-if="row.status && row.status.name_translation_key=='depot_status_blocked'">
        <font-awesome-icon icon="fa fa-ban" class="mr-1" />{{
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