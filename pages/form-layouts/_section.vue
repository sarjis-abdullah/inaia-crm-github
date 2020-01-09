<template>
  <div>
    <component :is="componentInstance" />
  </div>
</template>

<script>
import { loadViewsFormLayout } from '@/helpers/helpers'

export default {
    computed: {
        componentInstance() {
           return () => loadViewsFormLayout(this.myData) 
        }
    },
    async asyncData(context) {
        return {
            myData: context.params.section
        }
    }
}
</script>
