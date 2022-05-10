<template>
    <span class="badge badge-success" v-if="isPaid()">
        {{
            $t(
                status
            )
        }}
    </span>
    <span class="badge badge-secondary" v-else-if="isPending()">
        {{
            $t(
                status
            )
        }}
    </span>
</template>
<script>
    import {Badge} from '@/components/argon-core';
    import {PAYMENT_PENDING,PAYMENT_PAID} from '../../helpers/claims';
    export default {
        components:{
            Badge
        },
        props:{status:{
            type: String
        }},
        methods:{
            isPaid()
            {
                return this.status == PAYMENT_PAID;
            },
            isPending()
            {
                return this.status == PAYMENT_PENDING;
            }
        }
    }
</script>