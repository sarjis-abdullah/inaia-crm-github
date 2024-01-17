<template>
    <span :class="badgeType">
        {{
            $t(
                status
            )
        }}
        <span v-if="amount > 0" class="text-sm">
            ({{ $n(amount / 100) }} €)</span
          >
    </span>
</template>
<script>
    import {Badge} from '@/components/argon-core';
    import {PAYMENT_PENDING,PAYMENT_PAID,PAYMENT_FAILED,CANCELED} from '../../helpers/claims';
    export default {
        components:{
            Badge
        },
        props:{status:{
            type: String
        },
        amount:{
        type:Number
    }},
    computed:{
        badgeType(){
            if(this.status == PAYMENT_PAID)
            {
                return 'badge badge-success'
            }
            if(this.status == PAYMENT_PENDING)
            {
                return 'badge badge-secondary'
            }
            if(this.status == PAYMENT_FAILED)
            {
                return 'badge badge-danger'
            }
            if(this.status == CANCELED)
            {
                return 'badge  badge-warning'
            }
        }
    }
    }
</script>