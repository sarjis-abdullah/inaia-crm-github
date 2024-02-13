<template>
    <Select
            v-model="selectedCustomer"
            remote
            filterable
            reserve-keyword
            class="filterElement"
            :placeholder="$t('customer_filter_placeholder')"
            :loading="loadingCustomers"
            :remote-method="loadCustomers"
            @change="customerSelected"
            @clear="clearCustomer"
            clearable
          >
            <Option
              v-for="option in customers"
              :value="option.id"
              :label="formatClientLabel(option)"
              :key="option.id"
            >
            </Option>
          </Select>
</template>
<script>
import {
  Select,Option
} from "element-ui";
import moment from "moment";
export default {
    components:{
        Select,
        Option
    },
    data(){
        return {
            loadingCustomers:false,
            selectedCustomer:null,
            timer:null,
            customers:[]
        }
    },
    methods:{
        _getClients() {
      this.loadingCustomers = true;
      this.lastRequest = moment();
      this.$store
        .dispatch("clients/getClientListBySurname", this.customerQuery)
        .then((res) => {this.customers =  res.data.data})
        .finally(() => {
          this.loadingCustomers = false;
        });
    },
        loadCustomers: function (query) {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (query.length >= 3) {
        let update = true;
        this.customerQuery = query;
        if (this.lastRequest != null) {
          let now = moment();
          if (now.diff(this.lastRequest, "second") < 2) {
            update = false;
          }
        }
        if (update) {
          this._getClients();
        } else {
          this.timer = setTimeout(this._getClients, 1000);
        }
      } else {
        this.$store.commit("clients/orderFilterList", []);
        this.customerQuery = "";
      }
    },
    formatClientLabel: function (client) {
      if (client) {
        let email = null;
        if (client.contact.channels) {
          client.contact.channels.forEach((element) => {
            if (element.type == "email") {
              email = element.value;
            }
          });
        }
        let label =
          client.contact.name + " " + client.contact.person_data.surname;
        if (email) {
          label += ` (${email})`;
        }
        return label;
      }
    },
    customerSelected: function (id) {
      console.log(id);
      this.$emit('selected',id);
    },
    clearCustomer(){
        this.selectedCustomer=null;
        this.$emit('cleared');
    }
    }
}
</script>