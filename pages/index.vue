<template>
  <div>
    <loading
        loader="dots"
        :active.sync="loading"
        :is-full-page="true" 
    />
  </div>
</template>
<script>
  import Loading from 'vue-loading-overlay'
  import 'vue-loading-overlay/dist/vue-loading.css'
  export default {
    // layout: 'AuthLayout',
    name: 'home-page',
    middleware: ['auth'],
    components: {
        Loading
    },
    data() {
        return {
            loading: true
        }
    },
  };
</script>
