<template>
  <div>
    <component :is="componentInstance" />
  </div>
</template>

<script>
// import { async } from 'q'
const loadMyComponent = (c) => {
    let section = c.replace(/(\-\w)/g, m => m[1].toUpperCase().replace('-', '')) // camelized
    section = section[0].toUpperCase() + section.substr(1) // pascalized
    return import('@/views/components/vuesax/' + c + '/' + section)    
}

export default {
    // components: {
    //     MyComponent: () => loadMyComponent()
    // },
    computed: {
        componentInstance() {
           return () => loadMyComponent(this.myData) 
        }
    },
    async asyncData(context) {
        return {
            myData: context.params.section
        }
    }
}
</script>
