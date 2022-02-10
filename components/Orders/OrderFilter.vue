<template>
  <div>

    <div class="card-header border-0 pb-0" v-if="showFilter">

        <div class="row">
          <div class="col-md displayFlex flex-column align-content-center">
            <Select
              v-model="selectedCustomer"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Please enter a customer name"
              :remote-method="loadCustomers"
              :loading="loadingCustomers"
              class="filterElement">
              <Option
                v-for="item in customers"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </Option>
            </Select>
            <Select
              v-model="selectedDepots"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="Please enter a depot name"
              :remote-method="loadDepots"
              :loading="loadingDepots"
              class="filterElement">
              <Option
                v-for="item in depots"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </Option>
            </Select>
          </div>
          <div class="col-md displayFlex flex-column align-content-center">
            <Select placeholder="Status"
                    v-model="selectedStatus"
                    filterable
                    multiple
                    class="filterElement">
              <Option v-for="option in status"

                        :value="option.value"
                        :label="option.value"
                        :key="option.id">
              </Option>
            </Select>
             <Select placeholder="Types"
                    v-model="selectedType"
                    filterable
                    multiple
                    class="filterElement">
              <Option v-for="option in types"

                        :value="option.value"
                        :label="option.value"
                        :key="option.value">
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
      <Badge type="secondary" size="md" style="margin-right:10px">from: 01/01/2022 until: 15/02/2022 <a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
      <Badge type="secondary" size="md" style="margin-right:10px">PAID<a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
      <Badge type="secondary" size="md" style="margin-right:10px">Gold purchase<a class="badgeIcon"><i class="fas fa-window-close"></i></a></Badge>
    </div>

  </div>
</template>
<script>
import {Badge} from '@/components/argon-core';
import {Select,Option,DatePicker} from 'element-ui';

export default {
  props:{
    showFilter:Boolean
  },
  components:{
    Badge,
    Select,
    Option,
    DatePicker
  },
  data:function(){
    return {
      startDate:null,
      endDate:null,
      selectedType:[],
      selectedStatus:[],
      selectedCustomer:[],
      selectedDepots:[],
      status:[{id:1,value:'Pending'},{id:2,value:'Paid'},{id:3,value:'Complete'}],
      types:[{value:'Gold purchase'},{value:'Gold sale'},{value:'Gold delivery'}],
      customers:[{value:'Mahdi Njim'},{value:"Yunus"},{value:'Enamul'}],
      depots:[{value:'depot1'},{value:"depot2"},{value:'depot3'}],
      loadingCustomers:false,
      loadingDepots:false,
      showFilter: false,
      filterIsActive: true
    }

  },
  methods:{
    loadCustomers: function()
    {

    },
    loadDepots: function()
    {

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
