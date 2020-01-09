<template>
  <div>
    <component :is="componentInstance" />
  </div>
</template>

<script>
import { loadViewsFormElement } from '@/helpers/helpers'

export default {
    computed: {
        componentInstance() {
           return () => loadViewsFormElement(this.myData) 
        }
    },
    async asyncData(context) {
        return {
            myData: context.params.section
        }
    }
}
</script>
