<template>
  <div>
    <form class="card-header border-0" v-if="showFilter">
      <div class="row">
        <div class="col-md displayFlex flex-column align-content-center">
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

          <Select
            :placeholder="$t('saving_plan')"
            v-model="selectedSavingPlan"
            clearable
            class="filterElement"
            @clear="removeSelectedPlan"
          >
            <Option
              v-for="option in savinplans"
              :value="option.value"
              :label="$t(option.label)"
              :key="option.id"
            >
            </Option>
          </Select>
        </div>
        <div class="col-md displayFlex flex-column align-content-center">
          <Select
            :placeholder="$t('agio_payment_plan')"
            v-model="selectedAgioPaymentPlan"
            filterable
            class="mb-3"
            clearable
            @clear="removeAgioPaymentPlan"
          >
            <Option
              v-for="option in agioPaymentPlans"
              :value="option.value"
              :label="$t(option.label)"
              :key="option.id"
            >
            </Option>
          </Select>
          <el-input
            v-model="selectedAgio"
            type="number"
            :placeholder="$t('agio')"
            clearable
            @clear="removeAgio"
          />
        </div>
        <div class="col-md displayFlex flex-column align-content-center">
          <date-picker
            size="large"
            class="filterElement"
            v-model="intervalstartDate"
            type="date"
            :placeholder="$t('select_interval_start_date_placeholder')"
            @clear="removeDate"
          >
          </date-picker>
          <date-picker
            class="filterElement"
            v-model="intervalendDate"
            type="date"
            :placeholder="$t('select_interval_end_date_placeholder')"
            @clear="removeDate"
          >
          </date-picker>
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
        v-if="selectedCustomerInfo != null"
        >{{ formatClientTag()
        }}<a class="badgeIcon" @click.prevent="removeCustomer()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedSavingPlan != null"
        >{{ $t(formatSelectedSavingPlanTag())
        }}<a class="badgeIcon" @click.prevent="removeSelectedPlan()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedAgioPaymentPlan != null"
        >{{ $t(selectedAgioPaymentPlan)
        }}<a class="badgeIcon" @click.prevent="removeAgioPaymentPlan()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedAgio != null"
        >{{ selectedAgio
        }}<a class="badgeIcon" @click.prevent="removeAgio()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="intervalstartDate && intervalendDate"
        >{{ $t("from") }}: {{ $d(intervalstartDate) }} {{ $t("until") }}:
        {{ $d(intervalendDate) }}
        <a class="badgeIcon" @click.prevent="removeDate()"
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
  props: {
    showFilter: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      intervalstartDate: null,
      intervalendDate: null,
      selectedAgio: null,
      selectedAgioPaymentPlan: null,
      selectedCustomer: null,
      selectedSavingPlan: null,
      loadingCustomers: false,
      filterIsActive: false,
      lastRequest: null,
      selectedCustomerInfo: null,
      timer: null,
      customerQuery: "",
      savinplans: [
        { id: 1, value: true, label: "saving_plan" },
        { id: 2, value: false, label: "no_saving_plan" },
      ],
      agioPaymentPlans: [
        { id: 1, value: "onetime", label: "onetime" },
        { id: 2, value: "installment", label: "installment" },
      ],
    };
  },
  mounted() {},
  computed: {
    ...mapGetters("clients", {
      customers: "orderFilterList",
    }),
  },
  methods: {
    formatDateToApiFormat,
    clearCustomer: function () {
      this.selectedCustomer = null;
      this.selectedCustomerInfo = null;
      if (this.filterIsActive) this.applyFilter();
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
    formatSelectedSavingPlanTag: function () {
      if (this.selectedSavingPlan) {
        return "saving_plan";
      } else {
        return "no_saving_plan";
      }
    },
    loadStatus: function () {
      //console.log(this)
      this.$store.dispatch("orderStatus/fetchList", "").then((data) => {
        data.data.data.forEach((element) => {
          console.log(element.name_translation_key);
        });
      });
    },
    quiryBuilder: function () {
      let query = "";
      if (this.selectedAgio && !isNaN(this.selectedAgio)) {
        query += "&agio=" + parseInt(this.selectedAgio);
      }
      if (this.selectedAgioPaymentPlan != null) {
        query += "&agio_payment_option=" + this.selectedAgioPaymentPlan;
      }
      if (this.selectedCustomer != null) {
        query += "&account_id=" + this.selectedCustomer;
      }
      if (this.selectedSavingPlan != null) {
        if (this.selectedSavingPlan) query += "&is_savings_plan=1";
        else query += "&is_savings_plan=0";
      }
      if (this.intervalstartDate != null && this.intervalendDate != null) {
        query +=
          "&interval_startdate=" +
          this.formatDateToApiFormat(this.intervalstartDate);
        query +=
          "&interval_enddate=" +
          this.formatDateToApiFormat(this.intervalendDate);
      }
      if (query == "") {
        this.filterIsActive = false;
      } else this.filterIsActive = true;
      console.log(query);
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
    getTypeTranslationKey: function (id) {
      let type = this.types.find((x) => x.id == id);
      return type.name_translation_key;
    },
    removeAgioPaymentPlan: function () {
      this.selectedAgioPaymentPlan = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeAgio: function () {
      this.selectedAgio = null;
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeDate: function () {
      this.intervalstartDate = null;
      this.intervalendDate = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeCustomer: function () {
      this.selectedCustomer = null;
      this.selectedCustomerInfo = null;
      const query = this.quiryBuilder();
      this.$emit("filter", query);
    },
    removeSelectedPlan: function () {
      this.selectedSavingPlan = null;
      if (this.filterIsActive) this.applyFilter();
    },
    clearFilter() {
      this.selectedAgioPaymentPlan = null;
      this.selectedAgio = null;
      this.intervalstartDate = null;
      this.intervalendDate = null;
      this.selectedCustomer = null;
      this.selectedCustomerInfo = null;
      this.selectedSavingPlan = null;
      this.filterIsActive = false;
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
</style>
