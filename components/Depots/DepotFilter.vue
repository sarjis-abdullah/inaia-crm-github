<template>
  <div>
    <form class="pt-4" v-if="showFilter">
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
          <Select
            :placeholder="$t('depot_type')"
            v-model="selectedDepotType"
            clearable
            class="filterElement"
            @clear="removeDepotType"
          >
            <Option
              v-for="option in depotTypes"
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
          >
            <Option
              v-for="option in paymentmethods"
              :value="option.value"
              :label="$t(option.label)"
              :key="option.id"
            >
            </Option>
          </Select>
          <Select
            :placeholder="$t('select_sales_advisor')"
            v-model="salesAdvisorId"
            clearable
            class="filterElement"
            @clear="salesAdvisorId = null"
          >
            <Option
              v-for="option in salesAdvisors"
              :value="option.id"
              :label="formatClientLabel(option)"
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
            class="filterElement"
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
          <Select
            :placeholder="$t('status')"
            v-model="selectedDepotStatus"
            filterable
            class="filterElement"
            @remove-tag="applyFilter"
            multiple
            @clear="removeSelectedDepotStatus"
          >
            <Option
              v-for="option in depotStatus"
              :value="option.id"
              :label="$t(option.name_translation_key)"
              :key="option.id"
            >
            </Option>
          </Select>
          <Select
            :placeholder="$t('interval_day')"
            v-model="selectedIntervalDay"

            class="filterElement"
            clearable
            @clear="removeIntervalDay"
          >
            <Option
              v-for="option in intervalDays"
              :value="option.value"
              :label="$t(option.label)"
              :key="option.id"
            >
            </Option>
          </Select>

          <date-picker
            class="filterElement"
            v-model="fromCreatedDate"
            type="date"
            :placeholder="$t('from_created_date')"
            @clear="removeCreatedDateFilters"
          >
          </date-picker>
          <date-picker
            class="filterElement"
            v-model="toCreatedDate"
            type="date"
            :placeholder="$t('to_created_date')"
            @clear="removeToCreatedDate"
          >
          </date-picker>
        </div>
        <div class="col-md displayFlex flex-column align-content-center">
          <el-input
            v-model="selectedAgio"
            type="number"
            :placeholder="$t('agio')"
            clearable
            @clear="removeAgio"
            class="filterElement"
          />
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
            size="large"
            class="filterElement"
            v-model="intervalstartDateEnd"
            type="date"
            :placeholder="$t('select_interval_start_date__end_placeholder')"
            @clear="removeStartDateRangeEnd"
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
        v-for="stat in selectedDepotStatus"
        v-bind:key="stat"
        >{{ $t(getStatusTranslationKey(stat))
        }}<a class="pointer badgeIcon" @click.prevent="removeStatus(stat)"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedDepotType != null"
        >{{ formatDepotType()
        }}<a class="badgeIcon" @click.prevent="removeDepotType()"
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
        v-if="selectedIntervalDay != null"
        >{{ $t(selectedIntervalDay)
        }}<a class="badgeIcon" @click.prevent="removeIntervalDay()"
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
        v-if="selectedPaymentMethod != null"
        >{{ $t(selectedPaymentMethod)
        }}<a class="badgeIcon" @click.prevent="removeSelectedPaymentMethod()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="salesAdvisorId != null"
        >{{ salesAdvisorName
        }}<a class="badgeIcon" @click.prevent="removeSalesAdviserFilter()"
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
        v-if="intervalstartDate"
        >
        <span v-if="intervalstartDate && intervalstartDateEnd">
          {{ $t("from") }}: ({{ $d(intervalstartDate) }} - {{ $d(intervalstartDateEnd) }})
        </span>
        <span v-else>
          {{ $t("from") }}: {{ $d(intervalstartDate) }}
        </span>
        <span v-if="intervalendDate">
          {{ $t("until") }}: {{ $d(intervalendDate) }}
        </span>
        <a class="badgeIcon" @click.prevent="removeAllDate()">
          <i class="fas fa-window-close"></i>
        </a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="fromCreatedDate"
        >
        <span>{{ $t("from") + ' ' + $t("created_date") }} : {{ $d(fromCreatedDate) }}</span>
        <span v-if="toCreatedDate">{{' - ' + $t("to") + ' ' + $t("created_date")}} : {{ $d(toCreatedDate) }}</span>
        <a class="badgeIcon" @click.prevent="removeCreatedDateFilters()">
          <i class="fas fa-window-close"></i>
        </a>
      </Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="toCreatedDate && !fromCreatedDate"
        >
        <span v-if="!fromCreatedDate">
          {{ $t("to") + ' ' + $t("created_date") }} : {{ $d(toCreatedDate) }}
        </span>
        <a class="badgeIcon" @click.prevent="removeToCreatedDate()">
          <i class="fas fa-window-close"></i>
        </a>
        </Badge>
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
import { formatDateByMoment } from "@/helpers/date";
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
      intervalstartDateEnd: null,
      intervalendDate: null,
      selectedAgio: null,
      selectedAgioPaymentPlan: null,
      selectedCustomer: null,
      selectedSavingPlan: null,
      loadingCustomers: false,
      filterIsActive: false,
      lastRequest: null,
      selectedCustomerInfo: null,
      selectedDepotType:null,
      timer: null,
      customerQuery: "",
      selectedDepotStatus:[],
      savinplans: [
        { id: 1, value: true, label: "saving_plan" },
        { id: 2, value: false, label: "no_saving_plan" },
      ],
      paymentmethods: [
        { id: 1, value: "bank_transfer", label: "bank_transfer" },
        { id: 2, value: "bank_account", label: "bank_account" },
      ],
      agioPaymentPlans: [
        { id: 1, value: "onetime", label: "onetime" },
        { id: 2, value: "installment", label: "installment" },
      ],
      intervalDays:[
      { id: 1, value: 1, label: "1" },
        { id: 2, value: 15, label: "15" },
      ],
      selectedIntervalDay:null,
      selectedPaymentMethod:null,
      fromCreatedDate: null,
      toCreatedDate: null,
      salesAdvisorId:null
    };
  },
  mounted() {
    if(this.depotTypes.length == 0)
    {
      this.$store.dispatch('depots/getDepotTypes')
    }
    if(this.depotStatus.length == 0)
    {
      this.$store.dispatch('depots/getDepotStatuses')
    }
    if (this.salesAdvisors && this.salesAdvisors.length == 0) {
      this.$store.dispatch("salesCommission/fetchSalesAdvisors")
    }
  },
  computed: {
    ...mapGetters("clients", {
      customers: "orderFilterList",
    }),
    ...mapGetters("depots", {
      depotTypes: "depotTypes",
    }),
    ...mapGetters("depots", {
      depotStatus: "depotStatuses",
    }),
    ...mapGetters("salesCommission", {
      salesAdvisors: "salesAdvisors",
    }),
    salesAdvisorName(){
      if (this.salesAdvisorId) {
        const advisor = this.salesAdvisors.find(item=> item.id == this.salesAdvisorId)
        return this.formatClientLabel(advisor)
      }
      return ''
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.query) {
          if (this.$route.query.start_date) {
            this.fromCreatedDate = moment(this.$route.query.start_date)
          }
          if (this.$route.query.end_date) {
            this.toCreatedDate = moment(this.$route.query.end_date)
          }
          if (this.$route.query.depot_type_id) {
            this.selectedDepotType = parseInt(this.$route.query.depot_type_id)
          }
          if (this.$route.query.sales_advisor_id) {
            this.salesAdvisorId = parseInt(this.$route.query.sales_advisor_id)
          }
          this.filterIsActive = true;
          this.applyFilter()
        }
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    formatDateToApiFormat,
    formatDateByMoment,
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
    // loadStatus: function () {
    //   this.$store.dispatch("orderStatus/fetchList", "").then((data) => {
    //     data.data.data.forEach((element) => {
    //       console.log(element.name_translation_key);
    //     });
    //   });
    // },
    quiryBuilder: function () {
      let query = "";
      if (this.selectedAgio && !isNaN(this.selectedAgio)) {
        query += "&agio=" + parseInt(this.selectedAgio * 100);
      }
      if (this.selectedDepotStatus.length>0) {
        query += "&depot_status_ids=" + this.selectedDepotStatus.join(',');
      }
      if (this.selectedAgioPaymentPlan != null) {
        query += "&agio_payment_option=" + this.selectedAgioPaymentPlan;
      }
      if (this.selectedCustomer != null) {
        query += "&account_id=" + this.selectedCustomer;
      }
      if (this.selectedDepotType != null) {
        query += "&depot_type_id=" + this.selectedDepotType;
      }
      if (this.selectedSavingPlan != null) {
        if (this.selectedSavingPlan) query += "&is_savings_plan=1";
        else query += "&is_savings_plan=0";
      }
      if (this.intervalstartDate != null) {
        query +=
          "&interval_startdate=" +
          this.formatDateToApiFormat(this.intervalstartDate);
      }
      if (this.intervalendDate != null) {
        query +=
          "&interval_enddate=" +
          this.formatDateToApiFormat(this.intervalendDate);
      }
      if(this.selectedIntervalDay){
        query+='&interval_day='+this.selectedIntervalDay;
      }
      if(this.selectedPaymentMethod){
        query+='&payment_method='+this.selectedPaymentMethod;
      }
      if(this.salesAdvisorId){
        query+='&sales_advisor_id='+this.salesAdvisorId;
      }
      if(this.fromCreatedDate){
        query+='&from_date='+this.formatDateByMoment(this.fromCreatedDate);
      }
      if(this.toCreatedDate){
        query+='&to_date='+this.formatDateByMoment(this.toCreatedDate);
      }
      if(this.intervalstartDateEnd){
        query+='&interval_startdate_range_end='+this.formatDateByMoment(this.intervalstartDateEnd);
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
    getTypeTranslationKey: function (id) {
      let type = this.types.find((x) => x.id == id);
      return type.name_translation_key;
    },
    removeSelectedPaymentMethod: function (){
      this.selectedPaymentMethod = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeAgioPaymentPlan: function () {
      this.selectedAgioPaymentPlan = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeSalesAdviserFilter: function () {
      this.salesAdvisorId = null;
      if (this.$route.query && this.$route.query.sales_advisor_id) {
        const query = { ...this.$route.query };
        delete query.sales_advisor_id;
        this.$router.push({ path: this.$route.path, query });
      }
      if (this.filterIsActive) this.applyFilter();
    },
    removeAgio: function () {
      this.selectedAgio = null;
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeDepotType: function (){
      this.selectedDepotType = null;
      if (this.$route.query && this.$route.query.depot_type_id) {
        const query = { ...this.$route.query };
        delete query.depot_type_id;
        this.$router.push({ path: this.$route.path, query });
      }
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeSelectedDepotStatus:function (){

    },
    removeIntervalDay:function(){
      this.selectedIntervalDay = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeCreatedDateFilters: function () {
      this.fromCreatedDate = null;
      this.toCreatedDate = null;
      if (this.$route.query) {
        const query = { ...this.$route.query };
        if (query.start_date) {
          delete query.start_date;
        }
        if (query.end_date) {
          delete query.end_date;
        }
        this.$router.push({ path: this.$route.path, query });
      }
      if (this.filterIsActive) this.applyFilter();
    },
    removeToCreatedDate: function () {
      this.toCreatedDate = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeDate: function () {
      this.intervalstartDate = null;
      this.intervalendDate = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeStartDateRangeEnd: function () {
      this.intervalstartDateEnd = null;
      if (this.filterIsActive) this.applyFilter();
    },
    removeAllDate: function () {
      this.intervalstartDate = null;
      this.intervalstartDateEnd = null;
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
    formatDepotType: function () {
      const depotType = this.depotTypes.find(x=>x.id == this.selectedDepotType);
      if(depotType)
      {
        return this.$t(depotType.name_translation_key);
      }
      else
      {
        return '';
      }
    },
    getStatusTranslationKey: function (id) {
      let stat = this.depotStatus.find((x) => x.id == id);
      return stat.name_translation_key;
    },
    removeStatus: function (id) {
      this.selectedDepotStatus = this.selectedDepotStatus.filter((sta) => sta != id);
      const query = this.quiryBuilder();
      this.$emit("filter", query);
    },
    removeQueryFilter(){
      if (this.$route.query) {
        const query = { ...this.$route.query };
        if (query.start_date) {
          delete query.start_date;
        }
        if (query.end_date) {
          delete query.end_date;
        }
        if (query.depot_type_id) {
          delete query.depot_type_id;
        }
        if (query.sales_advisor_id) {
          delete query.sales_advisor_id;
        }
        this.$router.push({ path: this.$route.path, query });
      }
    },
    clearFilter() {
      this.selectedAgioPaymentPlan = null;
      this.selectedAgio = null;
      this.intervalstartDate = null;
      this.intervalstartDateEnd = null;
      this.intervalendDate = null;
      this.selectedCustomer = null;
      this.selectedCustomerInfo = null;
      this.selectedSavingPlan = null;

      this.filterIsActive = false;
      this.selectedDepotStatus = [];
      this.selectedIntervalDay = null;
      this.selectedPaymentMethod = null;
      this.removeQueryFilter()
      this.salesAdvisorId = null;
      this.toCreatedDate = null;
      this.fromCreatedDate = null;
      this.selectedDepotType = null;
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
