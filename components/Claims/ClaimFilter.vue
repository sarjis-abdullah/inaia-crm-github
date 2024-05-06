<template>
    <div>
      <form class="pt-4" v-if="showFilter">
        <div class="row">
          <div
            class="col-md displayFlex flex-column align-content-center"
            v-if="!isDepotSet"
          >
            <el-input v-if="isFiltersVisible('id')" :placeholder="$t('search_by')+`: ID`" class="mb-1rem" clearable v-model="claimId"/>
            <el-input v-if="isFiltersVisible('amount')" :placeholder="$t('search_by')+`: Amount`" class="mb-1rem" clearable v-model="claimAmount"/>
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
              v-if="isFiltersVisible('customer')"
            >
              <Option
                v-for="option in customers"
                :value="option.id"
                :label="formatClientLabel(option)"
                :key="option.id"
              >
              </Option>
            </Select>
  
            <Select
              :placeholder="$t('depots')"
              v-model="selectedDepots"
              filterable
              clearable
              @clear="clearDepot"
              class="filterElement"
              :disabled="selectedCustomer == null"
              v-if="isFiltersVisible('depots')"
            >
              <Option
                v-for="option in depots"
                :value="option.id"
                :label="option.name"
                :key="option.id"
              >
              </Option>
            </Select>
          </div>
          <div class="col-md displayFlex flex-column align-content-center">
            <Select
              :placeholder="$t('status')"
              v-model="selectedStatus"
              filterable
              v-if="isFiltersVisible('status')"
              class="mb-3"
              @remove-tag="applyFilter"
              :loading="loadingStatus"
            >
              <Option
                v-for="option in status"
                :value="option.id"
                :label="$t(option.name_translation_key)"
                :key="option.id"
              >
              </Option>
            </Select>
            <Select
              :placeholder="$t('types')"
              v-model="selectedType"
              filterable
              
              class="mb-3"
              @remove-tag="applyFilter"
              :loading="loadingTypes"
              v-if="isFiltersVisible('types') && displayTypes"
            >
              <Option
                v-for="option in types"
                :value="option.id"
                :label="$t(option.name_translation_key)"
                :key="option.id"
              >
              </Option>
            </Select>
            <Select
              :placeholder="$t('payment_method')"
              v-model="selectedPaymentMethod"
              clearable
              class="filterElement"
              @clear="removeSelectedPaymentMethod"
              v-if="isFiltersVisible('payment_method')"
            >
              <Option
                v-for="option in paymentmethods"
                :value="option.value"
                :label="$t(option.label)"
                :key="option.id"
              >
              </Option>
            </Select>
          </div>
         
        </div>
        <div
          class="
            applyContainer
            displayFlex
            flex-row
            align-content-center
            justify-content-center
            mb-0
          "
        >
          <base-button type="primary" @click="applyFilter">{{
            $t("apply_filter")
          }}</base-button>
        </div>
      </form>
  
      <div class="card-header border-0 border-top" v-if="filterIsActive">
        <Badge
          type="secondary"
          size="md"
          style="margin-right: 10px"
          v-if="selectedCustomerInfo != null && !isDepotSet"
          >{{ formatClientTag()
          }}<a class="pointer badgeIcon" @click.prevent="removeCustomer()"
            ><i class="fas fa-window-close"></i></a
        ></Badge>
        <Badge
          type="secondary"
          size="md"
          style="margin-right: 10px"
          v-if="selectedDepots != null && !isDepotSet"
          >{{ formatDepotTag()
          }}<a class="pointer badgeIcon" @click.prevent="removeDepot()"
            ><i class="fas fa-window-close"></i></a
        ></Badge>
        <Badge
          type="secondary"
          size="md"
          style="margin-right: 10px"
          v-if="selectedPaymentMethod != null"
          >{{ $t(selectedPaymentMethod)
          }}<a class="badgeIcon" @click.prevent="removeSelectedPaymentMethod()"
            ><i class="fas fa-window-close"></i></a
        ></Badge>
        <Badge
          type="secondary"
          size="md"
          style="margin-right: 10px"
          v-if="selectedStatus != null"
          >{{ $t(getStatusTranslationKey())
          }}<a class="pointer badgeIcon" @click.prevent="removeStatus()"
            ><i class="fas fa-window-close"></i></a
        ></Badge>
        <Badge
          type="secondary"
          size="md"
          style="margin-right: 10px"
          v-if="selectedType != null"
          >{{ $t(getTypeTranslationKey())
          }}<a class="pointer badgeIcon" @click.prevent="removeType()"
            ><i class="fas fa-window-close"></i></a
        ></Badge>
        
        <ClearFilter @cleared="clearFilter" />
      </div>
    </div>
  </template>
  <script>
  import ClearFilter from "@/components/common/ClearFilter";
  import { Badge } from "@/components/argon-core";
  import {
    Select,
    Option,
    DatePicker,
    Autocomplete,
    Form,
    FormItem,
  } from "element-ui";
  import { mapGetters, mapMutations } from "vuex";
  import { formatDateToApiFormat } from "../../helpers/helpers";
  import moment from "moment";
  export default {
    props: {
      showFilter: {
        type: Boolean,
        default: false,
      },
      isDepotSet: {
        type: Boolean,
        default: false,
      },
      displayTypes: {
        type: Boolean,
        default: true,
      },
      showSelectedFilters: {
        type: Array,
        default: ['status', 'customer','depots', 'payment_method', 'types', 'amount'],
      },
    },
    components: {
      Badge,
      Select,
      Option,
      DatePicker,
      Autocomplete,
      Form,
      FormItem,
      ClearFilter,
    },
    data: function () {
      return {
        selectedType: null,
        selectedStatus: null,
        selectedCustomer: null,
        selectedDepots: null,
        loadingCustomers: false,
        loadingDepots: false,
        filterIsActive: false,
        lastRequest: null,
        selectedCustomerInfo: null,
        timer: null,
        customerQuery: "",
        paymentmethods: [
          { id: 1, value: "bank_transfer", label: "bank_transfer" },
          { id: 2, value: "bank_account", label: "bank_account" },
        ],
        selectedPaymentMethod:null,
        claimAmount: null,
        claimId: null
      };
    },
    mounted() {
      this.$store.dispatch("claims/getClaimTypes", "");
      this.$store.dispatch("claims/getClaimStatuses", "");
    },
    computed: {
      ...mapGetters("claims", {
        loadingStatus: "loading",
        status: "claimStatuses",
      }),
      ...mapGetters("claims", {
        loadingTypes: "loading",
        types: "claimTypes",
      }),
      ...mapGetters("depots", {
        depots: "orderFilterList",
      }),
      ...mapGetters("clients", {
        customers: "orderFilterList",
      }),
    },
    watch: {
      selectedCustomer: {
        handler() {
          if (this.selectedCustomer != null) {
            this.selectedDepots = null;
            this.$store
              .dispatch("depots/fetchDepotsByAccount", this.selectedCustomer)
              .then((data) => console.log(data));
          }
        },
        immediate: true,
      },
    },
    methods: {
      clearDepot: function () {
        this.selectedDepots = null;
        this.applyFilter();
      },
      clearCustomer: function () {
        this.selectedCustomer = null;
        this.selectedCustomerInfo = null;
        this.selectedDepots = null;
        this.applyFilter();
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
      _getClients() {
        this.loadingCustomers = true;
        this.lastRequest = moment();
        this.$store
          .dispatch("clients/getClientListBySurname", this.customerQuery)
          .then(() => {})
          .finally(() => {
            this.loadingCustomers = false;
          });
      },
      customerSelected: function (id) {
        let client = this.customers.find((x) => x.id == id);
        if (client) {
          this.selectedCustomerInfo = client;
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
      formatClientTag: function () {
        return (
          this.selectedCustomerInfo.contact.name +
          " " +
          this.selectedCustomerInfo.contact.person_data.surname
        );
      },
      formatDepotTag: function () {
        let depot = this.depots.find((x) => x.id == this.selectedDepots);
        if (depot) {
          return depot.name;
        }
      },
      searchDepot: function (query, cb) {
        let possibleValues = this.depots.filter((element) => {
          return element.name.includes(query);
        });
        cb(possibleValues.slice(0, 2));
      },
      // loadStatus: function () {
      //   this.$store.dispatch("orderStatus/fetchList", "").then((data) => {
      //     data.data.data.forEach((element) => {
      //       console.log(element.name_translation_key);
      //     });
      //   });
      // },
      quiryBuilder: function () {
        let query = "";
        if (this.selectedType) {
          query += "&claim_type_id=" + this.selectedType;
        }
        if (this.selectedStatus) {
          query += "&claim_status_id=" + this.selectedStatus;
        }
        if (this.selectedCustomer != null) {
          query += "&account_id=" + this.selectedCustomer;
        }
        if (this.selectedDepots != null) {
          query += "&depot_id=" + this.selectedDepots;
        }
        if(this.selectedPaymentMethod){
          query+='&payment_method='+this.selectedPaymentMethod;
        }
        if (this.claimAmount) {
          query+='&amount_eq='+parseFloat(this.claimAmount)*100
        }
        if (this.claimId) {
          query+='&id='+this.claimId
        }
        if (query == "") {
          this.filterIsActive = false;
        } else this.filterIsActive = true;
        return query;
      },
      applyFilter: function () {
        const query = this.quiryBuilder();
  
        this.$emit("filter", query);
      },
      getStatusTranslationKey: function () {
        let stat = this.status.find((x) => x.id == this.selectedStatus);
        return stat.name_translation_key;
      },
      getTypeTranslationKey: function () {
        let type = this.types.find((x) => x.id == this.selectedType);
        return type.name_translation_key;
      },
      removeStatus: function (id) {
        this.selectedStatus = null;
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      },
      removeSelectedPaymentMethod: function (){
        this.selectedPaymentMethod = null;
        if (this.filterIsActive) this.applyFilter();
      },
      removeType: function (id) {
        this.selectedType = null;
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      },
      removeCustomer: function () {
        this.selectedCustomer = null;
        this.selectedDepots = null;
        this.selectedCustomerInfo = null;
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      },
      removeDepot: function () {
        this.selectedDepots = null;
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      },
      clearFilter() {
        this.selectedStatus = null;
        this.selectedType = null;
        this.selectedCustomer = null;
        this.selectedDepots = null;
        this.selectedCustomerInfo = null;
        this.selectedDepots = null;
        this.selectedPaymentMethod = null;
        this.filterIsActive = false;
        this.claimAmount = null
        this.claimId = null
        this.$emit("filter", "");
      },
      isFiltersVisible(key){
        const found = this.showSelectedFilters.find(item=> item == key)
        if (found) {
          return true
        }
        return false
      }
    },
  };
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
    padding: 2px;
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
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .filterElement input {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 0.875rem;
  }
  .applyContainer {
    margin-bottom: 15px;
  }
  
  .pointer {
    cursor: pointer;
  }
  .mb-1rem{
    margin-bottom: 16px;
  }
  </style>
  