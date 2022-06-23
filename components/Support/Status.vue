<template>
    <Badge type="success" v-if="status=='new'"><slot></slot></Badge>
    <Badge type="primary" v-else-if="status=='closed'"><slot></slot></Badge>
    <Badge type="info" v-else-if="status=='open'"><slot></slot></Badge>
    <Badge type="info" v-else-if="status=='has_new_answer'"><slot></slot></Badge>
    <Badge type="danger" v-else-if="status=='has_new_message'"><slot></slot></Badge>
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