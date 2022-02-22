<template>
  <div>

    <div class="card-header border-0 pb-0" v-if="showFilter">
       
        <div class="row">
          <div class="col-md displayFlex flex-column align-content-center">
             <autocomplete 
          v-model="selectedCustomer"
          :fetch-suggestions="searchCustomer"
          class="filterElement"
          placeholder="Please enter customer name/email"
          :trigger-on-focus="false">
         </autocomplete>
            <autocomplete 
          v-model="selectedDepots"
          :fetch-suggestions="searchDepot"
          class="filterElement"
          placeholder="Please enter depot name"
          :trigger-on-focus="false">
         </autocomplete>
          </div>
          <div class="col-md displayFlex flex-column align-content-center">
            <Select placeholder="Status"
                    v-model="selectedStatus"
                    filterable
                    multiple
                    class="filterElement"
                    :loading="loadingStatus"
                    >
              <Option v-for="option in status"

                        :value="$t(option.name_translation_key)"
                        :label="$t(option.name_translation_key)"
                        :key="option.id">
              </Option>
            </Select>
             <Select placeholder="Types"
                    v-model="selectedType"
                    filterable
                    multiple
                    class="filterElement"
                    :loading="loadingTypes">
              <Option v-for="option in types"

                        :value="$t(option.name_translation_key)"
                        :label="$t(option.name_translation_key)"
                        :key="option.id">
              </Option>
            </Select>
          </div>
          <div class="col-md displayFlex flex-column align-content-center">
            <date-picker
            size="large"
              class="filterElement"
              v-model="startDate"
              type="date"
              placeholder="Select start date">
            </date-picker>
          <date-picker
          class="filterElement"
            v-model="endDate"
            type="date"
            placeholder="Select end date">
          </date-picker>
          </div>
        </div>
        <div class="applyContainer displayFlex flex-row align-content-center justify-content-center">
          <base-button outline type="primary">Apply filter</base-button>
        </div>

    </div>

    <div class="card-header border-0 border-top" v-if="filterIsActive">
      
      <Badge type="secondary" size="md" style="margin-right:10px" v-if="startDate && endDate">from: {{$d(startDate)}}  until: {{$d(endDate)}} <a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
      <Badge type="secondary" size="md" style="margin-right:10px" v-for="(stat, idx) in selectedStatus" :key="'badg-'+idx">{{stat}}<a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
      <Badge type="secondary" size="md" style="margin-right:10px" v-for="(type, idx) in selectedType" :key="'badg-'+idx">{{type}}<a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
    </div>

  </div>
</template>
<script>
import {Badge} from '@/components/argon-core';
import {Select,Option,DatePicker,Autocomplete,Form,FormItem} from 'element-ui';
import { mapGetters } from "vuex";
export default {
  props:{
    showFilter:{
      type:Boolean,
      default:false
    }
  },
  components:{
    Badge,
    Select,
    Option,
    DatePicker,
    Autocomplete,
    Form,
    FormItem
  },
  data:function(){
    return {
      startDate:null,
      endDate:null,
      selectedType:[],
      selectedStatus:[],
      selectedCustomer:null,
      selectedDepots:null,
      customers:[{value:'Mahdi Njim'},{value:"Yunus"},{value:'Enamul'}],
      loadingCustomers:false,
      loadingDepots:false,
      filterIsActive: true
    }

  },
  mounted(){
     this.$store.dispatch("orderStatus/fetchList","");
     this.$store.dispatch("orderTypes/fetchOrderFilterList","");
     this.$store.dispatch("depots/fetchOrderFilterList","name").then(data=>console.log(data));
  },
  computed :{
   ...mapGetters('orderStatus',{
     loadingStatus:'loading',
      status:"list"
   }),
   ...mapGetters('orderTypes',{
     loadingTypes:'loading',
      types:"orderFilterList"
   }),
   ...mapGetters('depots',{
     depots:"orderFilterList"
   })
  },
  methods:{
    searchCustomer: function(query,cb)
    {
      let possibleValues = this.customers.filter(element=>element.value.toLowerCase().includes(query));
      
      cb(possibleValues)
    },
    searchDepot: function(query,cb)
    {
      let possibleValues = this.depots.filter(element=>
      {
        return element.name.includes(query);
      });
      console.log(possibleValues);
      cb(possibleValues.slice(0,2))
    },
    loadStatus: function()
    {
      //console.log(this)
      this.$store
                .dispatch("orderStatus/fetchList","").then(data=>{
                  console.log(data)
                  data.data.data.forEach(element => {
                    console.log(element.name_translation_key);
                  });
                })
    }
  }
}
</script>
<style scoped>
.container {
  min-height: 40px;
  margin-bottom: 2px;


}
.header {
  height: 40px;
  background-color: #fff;
  width: 100%;

}
.filter {
  height: 18px !important;
  width: 18px !important;
  color: #212529;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  padding:2px
}
.displayFlex {
  display: flex;
}
.badgeIcon {
  margin-left: 3px;
}
.filterElement {
  margin-bottom: 15px;
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
.filterElement input {

    height: 40px !important;
    line-height: 40px !important;
    font-size: 0.875rem;
}
</style>
