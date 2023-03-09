<template>
    <div>
        <form class="card-header border-0" v-if="showFilter">
            <div class="row">
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select v-model="selectedCustomer" remote filterable reserve-keyword
                        :placeholder="$t('customer_filter_placeholder')" :loading="loadingCustomers"
                        :remote-method="loadCustomers" @change="customerSelected" @clear="clearCustomer" clearable>
                        <Option v-for="option in customers" :value="option.id" :label="formatClientLabel(option)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('depots')" v-model="selectedDepots" filterable clearable @clear="clearDepot"
                        :disabled="selectedCustomer == null">
                        <Option v-for="option in depots" :value="option.id" :label="option.name" :key="option.id">
                        </Option>
                    </Select>
                </div>

            </div>
            <div class="row mt-3" v-if="salesAdvisorId == -1">
                <div class="col-md d-flex flex-row justify-content-center">
                    <Select :placeholder="$t('sales_advisors')" v-model="selectedAdvisor" filterable clearable
                        @clear="clearAdvisor">
                        <Option v-for="option in salesAdvisors" :value="option.id" :label="formatClientLabel(option)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
                <div class="col-md"></div>
            </div>
            <div class="
              d-flex
              flex-row
              align-content-center
              justify-content-center
              mb-0
            ">
                <base-button type="primary" @click="applyFilter">{{
                    $t("apply_filter")
                }}</base-button>
            </div>
        </form>
        <div class="card-header border-0 border-top" v-if="filterIsActive">
            <Badge type="secondary" size="md" style="margin-right: 10px" v-if="selectedCustomerInfo != null && !isDepotSet">
                {{ formatClientTag()
                }}<a class="pointer badgeIcon" @click.prevent="removeCustomer()"><i class="fas fa-window-close"></i></a>
            </Badge>
            <Badge type="secondary" size="md" style="margin-right: 10px" v-if="selectedDepots != null && !isDepotSet">{{
                formatDepotTag()
            }}<a class="pointer badgeIcon" @click.prevent="removeDepot()"><i class="fas fa-window-close"></i></a>
            </Badge>
            <Badge type="secondary" size="md" style="margin-right: 10px" v-if="selectedAdvisor != null">{{
                formatSalesAdvisorTag()
            }}<a class="pointer badgeIcon" @click.prevent="clearAdvisor"><i class="fas fa-window-close"></i></a>
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
    Autocomplete,
    Form,
    FormItem,
} from "element-ui";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
    props: {
        showFilter: {
            type: Boolean,
            default: true
        },
        salesAdvisorId:{
            type:Number,
            default:-1
        }
    },
    components: {
        Badge,
        Select,
        Option,
        Autocomplete,
        Form,
        FormItem,
        ClearFilter,
    },
    computed: {
        ...mapGetters("depots", {
            depots: "orderFilterList",
        }),
        ...mapGetters("clients", {
            customers: "orderFilterList",
        }),
        ...mapGetters("salesCommission", {
            salesAdvisors: "salesAdvisors",
        }),
    },
    watch: {
        selectedCustomer: {
            handler() {
                if (this.selectedCustomer != null) {
                    this.selectedDepots = null;
                    this.$store
                        .dispatch("depots/fetchDepotsByAccount", this.selectedCustomer);
                }
            },
            immediate: true,
        },
    },
    mounted() {
        if (this.salesAdvisors.length == 0 && this.salesAdvisorId==-1) {
            this.$store.dispatch("salesCommission/fetchSalesAdvisors")
        }
    },
    data: function () {
        return {
            selectedCustomer: null,
            loadingCustomers: false,
            filterIsActive: false,
            lastRequest: null,
            selectedCustomerInfo: null,
            timer: null,
            customerQuery: "",
            selectedDepots: null,
            selectedAdvisor: null
        };
    },
    methods: {
        clearDepot: function () {
            this.selectedDepots = null;
            if(this.filterIsActive){
                const query = this.buildQuery();
                if(query=='')
                {
                    this.filterIsActive = false;
                }
                this.$emit("filter", query);
            }
        },
        clearCustomer: function () {
            this.selectedCustomer = null;
            this.selectedCustomerInfo = null;
            this.selectedDepots = null;
            if(this.filterIsActive){
                const query = this.buildQuery();
                if(query=='')
                {
                    this.filterIsActive = false;
                }
                this.$emit("filter", query);
            }
        },
        buildQuery() {
            let query = "";
            if (this.selectedDepots) {
                query += "depot_id=" + this.selectedDepots;
            }
            if (this.selectedAdvisor) {
                query += "sales_advisor_id=" + this.selectedAdvisor;
            }
            return query;
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
                .then(() => { })
                .finally(() => {
                    this.loadingCustomers = false;
                });
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
        formatSalesAdvisorTag() {
            let advisor = this.salesAdvisors.find((x) => x.id == this.selectedAdvisor);
            if (advisor) {
                return (advisor.contact.name +
                    " " +
                    advisor.contact.person_data.surname)
            }
            return "";
        },
        removeCustomer: function () {
            this.selectedCustomer = null;
            this.selectedDepots = null;
            this.selectedCustomerInfo = null;
            if(this.filterIsActive){
                const query = this.buildQuery();
                if(query=='')
                {
                    this.filterIsActive = false;
                }
                this.$emit("filter", query);
            }
            
        },
        removeDepot: function () {
            this.selectedDepots = null;
            if(this.filterIsActive){
                const query = this.buildQuery();
                if(query=='')
                {
                    this.filterIsActive = false;
                }
                this.$emit("filter", query);
            }
        },
        clearAdvisor() {
            this.selectedAdvisor = null;
            if(this.filterIsActive){
                const query = this.buildQuery();
                if(query=='')
                {
                    this.filterIsActive = false;
                }
                this.$emit("filter", query);
            }
        },
        applyFilter() {
            const query = this.buildQuery();
            this.filterIsActive = true;
            this.$emit('filter', query);
        },
        clearFilter() {
            this.selectedCustomer = null;
            this.selectedAdvisor = null;
            this.selectedDepots = null;
            this.filterIsActive = false;
            this.$emit('filter', '');
        }
    }
}
</script>