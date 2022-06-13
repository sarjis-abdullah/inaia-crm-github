<template>
  <a class="float-right pointer" @click.prevent="clearFilter">
    <Badge type="secondary" size="md"
      >{{ $t("clear_filter") }} <i class="ml-1 fas fa-window-close"></i></Badge
  ></a>
</template>
<script>
import {Badge} from '@/components/argon-core';
export default {
    components:{
        Badge
    },
    methods:{
        clearFilter(){
            this.$emit('cleared');
        }
    }
};
</script>
<style scoped>
.pointer{
  cursor:pointer;
}
</style>
