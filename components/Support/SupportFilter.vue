<template>
  <div>
    <div v-if="showFilter">
      <Select
        v-model="selectedCustomer"
        remote
        filterable
        reserve-keyword
        class="w-100 mt-3"
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

      <Select
        :placeholder="$t('status')"
        v-model="selectedStatus"
        filterable
        multiple
        class="w-100 mt-3"
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
        :placeholder="$t('country')"
        v-model="selectedCountry"
        filterable
        class="w-100 mt-3"
        @remove-tag="applyFilter"
      >
        <Option
          v-for="option in countryList"
          :value="option.id"
          :label="$t(option.name_translation_key)"
          :key="option.id"
        >
        </Option>
      </Select>

      <div
        class="
          applyContainer
          displayFlex
          flex-row
          align-content-center
          justify-content-center
          mt-3 mb-0
        "
      >
        <base-button type="primary" @click="applyFilter">{{
          $t("apply_filter")
        }}</base-button>
      </div>
    </div>

    <div class="card-header border-0 border-top" v-if="filterIsActive">
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedCustomerInfo != null"
        >{{ formatClientTag()
        }}<a class="pointer badgeIcon" @click.prevent="removeCustomer()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedCountry"
        >
        {{ countryName }}
        <a class="pointer badgeIcon" @click.prevent="removeCountryFilter()">
          <i class="fas fa-window-close"></i>
        </a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-for="stat in selectedStatus"
        v-bind:key="stat.id"
        >{{ $t(getStatusTranslationKey(stat))
        }}<a class="pointer badgeIcon" @click.prevent="removeStatus(stat)"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="startDate && endDate"
        >{{ $t("from") }}: {{ $d(startDate) }} {{ $t("until") }}:
        {{ $d(endDate) }}
        <a class="pointer badgeIcon" @click.prevent="removeDate()"
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
      startDate: null,
      endDate: null,
      selectedStatus: [],
      selectedCustomer: null,
      loadingCustomers: false,
      filterIsActive: false,
      selectedCustomerInfo: null,
      timer: null,
      lastRequest: null,
      customerQuery: "",
      selectedCountry: null,
    };
  },
  watch: {
    showFilter: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        if (this.showFilter) {
          this.initCountryList()
        }
      }
    }
  },
  mounted() {
    if (this.status.length == 0) this.$store.dispatch("support/fetchStatuses");
  },
  computed: {
    ...mapGetters("support", {
      status: "statuses",
      loadingStatus: "isLoadingStatuses",
    }),
    ...mapGetters("clients", {
      customers: "orderFilterList",
    }),
    ...mapGetters('clients', {
      countryList: "countryList",
    }),
    countryName(){
      if (this.selectedCountry) {
        return this.countryList.find(i=> i.id == this.selectedCountry).name_translation_key
      }
      return ''
    }
  },
  methods: {
    initCountryList() {
      if (this.countryList && this.countryList.length == 0) {
        this.$store.dispatch("clients/initCountryList", '&allow=1');
      }
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
    quiryBuilder: function () {
      let query = "";
      if (this.selectedStatus.length > 0) {
        query += "&support_status_ids=" + this.selectedStatus.join(",");
      }
      if (this.selectedCustomer != null) {
        query += "&account_ids=" + this.selectedCustomer;
      }
      if (this.startDate != null && this.endDate != null) {
        query += "&create_date_start=" + formatDateToApiFormat(this.startDate);
        query += "&create_date_end=" + formatDateToApiFormat(this.endDate);
      }
      if (this.startDate != null) {
        query += "&create_date_start=" + formatDateToApiFormat(this.startDate);
      }
      if (this.selectedCountry) {
        query += "&country_id=" + this.selectedCountry;
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
    getStatusTranslationKey: function (id) {
      let stat = this.status.find((x) => x.id == id);
      return stat.name_translation_key;
    },

    removeStatus: function (id) {
      this.selectedStatus = this.selectedStatus.filter((sta) => sta != id);
      const query = this.quiryBuilder();
      this.$emit("filter", query);
    },
    removeDate: function (id) {
      this.startDate = null;
      this.endDate = null;
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
    removeCountryFilter: function () {
      this.selectedCountry = null;
      const query = this.quiryBuilder();
      this.$emit("filter", query);
    },
    clearFilter() {
      this.selectedStatus = [];
      this.startDate = null;
      this.endDate = null;
      this.selectedCustomer = null;
      this.selectedCustomerInfo = null;
      this.filterIsActive = false;
      this.selectedCountry = null;
      this.$emit("filter", "");
    },
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
</style>
