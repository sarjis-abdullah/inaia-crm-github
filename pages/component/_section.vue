<template>
  <div>
    <component :is="componentInstance" />
  </div>
</template>

<script>
import { loadViewsComponent } from '@/helpers/helpers'

export default {
    computed: {
        componentInstance() {
           return () => loadViewsComponent(this.myData) 
        }
    },
    async asyncData(context) {
        return {
            myData: context.params.section
        }
    }
}
</script>
