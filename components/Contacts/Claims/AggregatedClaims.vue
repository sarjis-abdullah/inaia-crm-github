<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header">
          <div class="row align-items-center">
            <div class="col-8">
              <h5 class="h3 mb-0">{{ $t("claims") }}</h5>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <Select
                :placeholder="$t('status')"
                v-model="selectedStatus"
                class="mb-3"
                @clear="applyFilter"
                :loading="loadingStatus"
                clearable
              >
                <Option
                  v-for="option in claimStatuses"
                  :value="option.id"
                  :label="$t(option.name_translation_key)"
                  :key="option.id"
                >
                </Option>
              </Select>
            </div>
            <div class="col">
              <date-picker
                size="large"
                clearable
                v-model="selectedDate"
                @clear="applyFilter"
                type="date"
                :placeholder="$t('select_start_date_placeholder')"
              >
              </date-picker>
            </div>
          </div>
        </div>

        <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="aggregatedClaims"
        >
          <el-table-column label="#" min-width="100px" prop="id">
            <template v-slot="{ row }">
              <div class="media align-items-center">
                <div class="media-body">
                  <div class="font-weight-300 name">{{ row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('amount')"
            min-width="180px"
            align="right"
            prop="amount"
          >
            <template v-slot="{ row }">
              <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('date')"
            min-width="140px"
            prop="claim_date"
          >
            <template v-slot="{ row }">
              {{ $d(new Date(row.claim_date), "short") }}
            </template>
          </el-table-column>
          <el-table-column v-bind:label="$t('status')" min-width="140px">
            <template v-slot="{ row }">
              <Status
                :status="
                  row.claim_status ? row.claim_status.name_translation_key : ''
                "
              />
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot="{ row }">
              <icon-button
                type="info"
                @click="() => displayDetails(row)"
              ></icon-button>
            </template>
          </el-table-column>
        </el-table>

        <div
          class="card-footer py-4 d-flex justify-content-end"
          v-if="totalTableData > 1"
        >
          <base-pagination
            v-model="page"
            :per-page="perPage"
            :total="totalTableData"
          ></base-pagination>
        </div>
        <modal
          :show.sync="showDetails"
          class="orderModal"
          headerClasses=""
          bodyClasses="pt-0"
          footerClasses="border-top bg-secondary"
          :allowOutSideClose="false"
          size="lg"
          @close="selectedAggregatedId = -1"
        >
          <template slot="header" class="pb-0">
            <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
            <span></span>
          </template>
          <div v-if="selectedAggregatedId > -1">
            <Claims :aggregated_id="selectedAggregatedId" />
          </div>
        </modal>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn } from "element-ui";
import Status from "@/components/Contacts/Claims/Status";
import Claims from "@/components/Contacts/Claims/Claims";
import { Select, Option, DatePicker } from "element-ui";
import IconButton from "@/components/common/Buttons/IconButton";
import { formatDateToApiFormat } from "../../../helpers/helpers";
export default {
  props: {
    account_id: {
      type: Number,
      default: null,
    },
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    Status,
    IconButton,
    Select,
    Option,
    DatePicker,
    Claims,
  },
  mounted() {
    if (this.claimStatuses.length == 0) {
      this.$store.dispatch("clients/getClaimStatuses");
    }
  },
  computed: {
    ...mapGetters({
      aggregatedClaims: "clients/aggregatedClaims",
      claimStatuses: "clients/claimStatuses",
    }),
    searchQuery() {
      let base = `&account_id=${this.account_id}&page=${
        this.page | 1
      }&per_page=${this.perPage | 5}`;
      if (this.selectedStatus) {
        base += `&claim_status_id=${this.selectedStatus}`;
      }
      if (this.selectedDate) {
        base += `&claim_date=${formatDateToApiFormat(this.selectedDate)}`;
      }
      return base;
    },
    totalPages() {
      return Math.ceil(this.totalTableData / this.perPage);
    },
  },
  watch: {
    searchQuery: {
      handler() {
        this.fetchAggregatedClaims();
      },
      immediate: true,
    },
  },
  data() {
    return {
      perPage: 5,
      page: 1,
      totalTableData: 0,
      isLoading: false,
      loadingError: null,
      selectedOrder: null,
      showOrderDetails: false,
      selectedStatus: null,
      selectedDate: null,
      loadingStatus: false,
      selectedAggregatedId: -1,
      showDetails: false,
    };
  },
  methods: {
    fetchAggregatedClaims() {
      this.isLoading = true;
      this.$store
        .dispatch("clients/getClientAggregatedClaims", this.searchQuery)
        .then((res) => (this.totalTableData = res.meta.total))
        .catch((err) => (this.loadingError = this.$t("cant_load_list")))
        .finally(() => (this.isLoading = false));
    },
    displayDetails(resource) {
        debugger;
      this.selectedAggregatedId = resource.id;
      this.showDetails = true;
    },
    applyFilter() {
      this.page = 1;
    },
  },
};
</script>
<style scoped>
</style>