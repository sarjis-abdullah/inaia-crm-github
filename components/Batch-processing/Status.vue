<template>
    <Badge type="danger" v-if="status=='failed'"><slot></slot></Badge>
    <Badge type="primary" v-else-if="status=='pending'"><slot></slot></Badge>
    <Badge type="success" v-else-if="status=='completed'"><slot></slot></Badge>
    <Badge type="info" v-else-if="status=='in_progress'"><slot></slot></Badge>
    <Badge type="default" v-else><slot></slot></Badge>
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