<template>
  <modal
    :show.sync="showModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    :allowOutSideClose="false"
    @close="onClose"
  >
    <template slot="header">
      <h5 class="modal-title">{{ $t("account_settings") }}</h5>
    </template>
    <div class="list-group list-group-flush mt-3">
         <DetailListItem v-for="item in settings" :key="item.id" :title="$t(item.name_translation_key)"><div slot="value">{{getValue(item.name_translation_key,item.value)}}</div></DetailListItem>
    </div>
  </modal>
</template>
<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
export default {
  setup() {},
  props: {
    settings: {
      type: Array,
      default: [],
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  components:{
      DetailListItem
  },
  methods: {
    onClose() {
      this.showModal = false;
      this.$emit("closed");
    },
    getValue(setting,value){
      if(setting == 'allow_marketing'){
        if(value==1){
          return this.$t('allowed');
        }
        else{
          return this.$t('not_allowed');
        }
      }
      if(setting == 'locale'){
       
          return this.$t(value);
        
      }
    }
  },
};
</script>
<style scoped>
</style>