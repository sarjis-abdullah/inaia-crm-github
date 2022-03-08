<template>
    
    <Badge type="success" v-if="row.status.name_translation_key=='depot_status_active'">{{row.status.translated_name}}</Badge>
    <Badge type="info" v-else-if="row.status.name_translation_key=='depot_status_completed'">{{row.status.translated_name}}</Badge>
    <Badge type="warning" v-else-if="row.status.name_translation_key=='depot_status_paused'">{{row.status.translated_name}}</Badge>
    <Badge type="primary" v-else-if="row.status.name_translation_key=='depot_status_canceled'">{{row.status.translated_name}}</Badge>
    <Badge type="danger"  v-else-if="row.status.name_translation_key=='depot_status_blocked'">{{row.status.translated_name}}</Badge>
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