<template>
  <Badge type="success" v-if="status=='APPROVED' && lifecycle_status=='COMPLETE'"><slot>{{ $t('completed')}}</slot></Badge>
  <Badge type="secondary" v-else-if="status=='APPROVED' && lifecycle_status=='AUTHORISED'"><slot>{{ $t('pending')}}</slot></Badge>
  <Badge type="danger" v-else-if="status=='DECLINED'"><slot>{{ $t('rejected')}}</slot></Badge>
  <Badge type="default" v-else><slot>{{ status + ' / ' + lifecycle_status }}</slot></Badge>
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
