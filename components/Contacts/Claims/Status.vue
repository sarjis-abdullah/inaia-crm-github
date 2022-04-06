<template>
    <span class="badge badge-success" v-if="status=='paid'">
        {{
            $t(
                status
            )
        }}Ò
    </span>
    <span class="badge badge-secondary" v-else-if="status=='pending'">
        {{
            $t(
                status
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
        props:{status:{
            type: String
        }}
    }
</script>