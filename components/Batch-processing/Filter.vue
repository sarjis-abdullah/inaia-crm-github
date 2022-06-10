<template>
    <div>
        <form class="card-header border-0" v-if="showFilter">
        <div class="row">
            <div class="col-md d-flex justify-content-center">
                <Select :placeholder="$t('status')"
                        v-model="selectedStatus"
                        filterable
                        clearable
                        @clear = "clearFilterItem"
                        class="mb-3"
                        
                        :loading="loadingStatus"

                        >
                <Option v-for="option in status"

                            :value="option.id"
                            :label="$t(option.name_translation_key)"
                            :key="option.id">
                </Option>
                </Select>
            </div>
            <div class="col-md d-flex justify-content-center">
                <Select :placeholder="$t('types')"
                        v-model="selectedType"
                        filterable
                        clearable
                        @clear = "clearFilterItem"
                        class="mb-3"
                        
                        :loading="loadingTypes">
                <Option v-for="option in types"

                            :value="option.id"
                            :label="$t(option.name_translation_key)"
                            :key="option.id">
                </Option>
                </Select>
            </div>
        </div>
        <div class="d-flex flex-row align-items-center justify-content-center mt-3 mb-2">
          <base-button type="primary" @click="applyFilter">{{$t('apply_filter')}}</base-button>
        </div>
        </form>
    <div class="card-header border-0 border-top" v-if="filterIsActive">
      <Badge type="secondary" size="md" style="margin-right:15px" v-if = "selectedStatus">{{$t(getStatusName(selectedStatus))}}<a class="badgeIcon" @click.prevent="removeStatus(stat)"><i class="fas fa-window-close"></i></a></Badge>
      <Badge type="secondary" size="md" style="margin-right:15px" v-if = "selectedType">{{$t(getTypeName(selectedType))}}<a class="badgeIcon" @click.prevent="removeType(type)"><i class="fas fa-window-close"></i></a></Badge>
      <ClearFilter @cleared="clearFilter"/>
    </div>
    </div>
</template>
<script>
import ClearFilter from '@/components/common/ClearFilter';
import {Badge} from '@/components/argon-core';
import {Select,Option,Form} from 'element-ui';
import { mapGetters } from "vuex";
export default {
    props:{
    showFilter:{
      type:Boolean,
      default:false
    },
  },
  components:{
    Badge,
    Select,
    Option,
    Form,
    ClearFilter,
  },
  data:function(){
    return {
      selectedType:null,
      selectedStatus:null,
      filterIsActive: false,
      loadingStatus:false,
        loadingTypes:false
    }

  },
  computed :{
   ...mapGetters('batch-processing',{
      status:"batchProcessStatuses"
   }),
   ...mapGetters('orderTypes',{
     loadingTypes:'loading',
      types:"orderFilterList"
   }),
  },
  mounted(){
      if(this.status.length == 0)
      {
          this.$store.dispatch("batch-processing/fetchProcessStatuses");
      }
     if(this.types.length == 0)
     {
         this.$store.dispatch("orderTypes/fetchOrderFilterList","");
     }
     

  },
  methods:{
      createQuery(){
          let query = '';
          if(this.selectedType)
          {
              query+="&order_type_id="+this.selectedType;
          }
          if(this.selectedStatus)
          {
              query+="&order_process_status_id="+this.selectedStatus;
          }
          return query;
      },
      applyFilter(){
          const query = this.createQuery();
          this.$emit('filter',query);
          if(query !='')
          {
              this.filterIsActive = true;
          }
          else
          {
              this.filterIsActive = false;
          }
      },
      clearFilterItem(){
          if(this.filterIsActive)
          {
              this.applyFilter();
          }
      },
      getTypeName(id){
          const type = this.types.find(x=>x.id==id);
          return type.name_translation_key;
      },
      getStatusName(id){
          const stat = this.status.find(x=>x.id==id);
          return stat.name_translation_key;
      },
      removeStatus(id){
          this.selectedStatus = null;
          this.applyFilter();
      },
      removeType(id){
          this.selectedType = null;
          this.applyFilter();
      },
      clearFilter(){
      this.selectedStatus = null;
      this.selectedType = null;
      this.filterIsActive = false;
      this.$emit('filter','');
    }
  }
}
</script>
