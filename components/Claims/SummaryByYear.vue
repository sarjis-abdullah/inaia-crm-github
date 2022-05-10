<template>
  <div>
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <div class="row align-items-center">
              <div class="col-8">
                <Select v-model="selectedYear" :placeholder="$t('select_year')">
                  <Option
                    v-for="option in years"
                    :value="option"
                    :label="option"
                    :key="option"
                  >
                  </Option>
                </Select>
              </div>
              <div class="col-4 text-right">
                <button
                  type="button"
                  class="btn base-button btn-icon btn-fab btn-neutral btn-sm"
                >
                  <span class="btn-inner--icon"
                    ><i class="fas fa-table"></i></span
                  ><span class="btn-inner--text">{{
                    $t("Download_yearly_report")
                  }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="crad-body pt-2">
            <div class="row p-2" v-for="month in months" :key="month.month">
              <div class="col">
                <MonthItem v-if="month[0]" :item="month[0]" :year="selectedYear"/>
              </div>
              <div class="col">
                <MonthItem v-if="month[1]" :item="month[1]" :year="selectedYear"/>
              </div>
              <div class="col">
                <MonthItem v-if="month[2]" :item="month[2]" :year="selectedYear"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
import { mapGetters } from "vuex";
import MonthItem from "@/components/Claims/MonthItem";
export default {
  components: {
    Select,
    Option,
    MonthItem,
  },
  data() {
    return {
      years: [],
      selectedYear: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      summaries: "claims/summaryByYear",
    }),
    months() {
      let raw = JSON.parse(JSON.stringify(this.summaries(this.selectedYear)));
      if (raw) {
        let data = [];
        while (raw.length > 0) {
          data.push(raw.splice(0, 3));
        }
        return data;
      } else return null;
    },
  },
  watch: {
    selectedYear: {
      handler() {
        if (!this.months) this.fetchData();
      },
      immediate: true,
    },
  },
  mounted() {
    let currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let index = 0; index < 11; index++) {
      this.years[index] = currentYear - index;
    }
    if (this.months == null) {
      this.fetchData();
    }
  },
  methods: {
    fetchData() {
      if (this.selectedYear) {
        this.isLoading = true;
        this.$store
          .dispatch("claims/getClaimSummaryByYear", this.selectedYear)
          .finally(() => (this.isLoading = false));
      }
    },
  },
};
</script>