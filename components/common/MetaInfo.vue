<template>
    <div class="text-sm-left text-muted" v-if="meta && meta.total > 0">
      {{ meta.from }} - {{ meta.to }} {{ $t('of') }} {{ meta.total }}
    </div>
</template>
<script>
export default{
    props:{
        meta:{
            type: Object,
            default:null
        }
    }
}
</script>
