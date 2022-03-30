<template>
  <Badge type="success" v-if="status=='APPROVED' || lifecycle_status=='COMPLETED'"><slot></slot></Badge>
  <Badge type="danger" v-else-if="status=='DECLINED'"><slot></slot></Badge>
  <Badge type="secondary" v-else-if="status=='order_status_pending'"><slot></slot></Badge>
  <Badge type="info" v-else-if="status=='order_status_paid'"><slot></slot></Badge>
  <Badge type="info" v-else-if="status=='order_status_payment_outstanding'"><slot></slot></Badge>
  <Badge type="warning" v-else-if="status=='order_status_canceled'"><slot></slot></Badge>
  <Badge type="primary" v-else-if="status=='order_status_processing'"><slot></slot></Badge>
  <Badge type="default" v-else><slot></slot></Badge>
</template>
<script>
import {Badge} from '@/components/argon-core';
export default {
  components:{
    Badge
  },
  props:{
    status:{
      type: String
    },
    lifecycle_status:{
      type: String
    }
  }
}
</script>
