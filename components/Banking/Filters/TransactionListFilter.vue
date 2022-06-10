<template>
  <div>
    <form class="card-header border-0" v-if="showFilter">
      <div class="row">
        <div class="col-md displayFlex flex-column align-content-center">
          <Select
            :placeholder="$t('status')"
            v-model="selectedStatus"
            filterable
            clearable
            class="mb-3"
            @clear="removeStatus"
            :loading="loadingStatus"
          >
            <Option
              v-for="option in status"
              :value="option.name_translation_key"
              :label="$t(option.name_translation_key)"
              :key="option.id"
            >
            </Option>
          </Select>
          <Select
            :placeholder="$t('lifecycle_status')"
            v-model="selectedLifeCycleStatus"
            filterable
            clearable
            class="mb-3"
            @clear="removeLifeCycleStatus"
          >
            <Option
              v-for="option in lifeCycleStatus"
              :value="option.name_translation_key"
              :label="$t(option.name_translation_key)"
              :key="option.id"
            >
            </Option>
          </Select>
          <Select
            :placeholder="$t('types')"
            v-model="selectedType"
            filterable
            clearable
            multiple
            class="mb-3"
            @remove-tag="removeType"
            :loading="loadingTypes"
          >
            <Option
              v-for="option in types"
              :value="option.name_translation_key"
              :label="$t(option.name_translation_key)"
              :key="option.id"
            >
            </Option>
          </Select>
        </div>
        <div class="col-md displayFlex flex-column align-content-center">
          <date-picker
            size="large"
            class="filterElement"
            v-model="startDate"
            type="date"
            :placeholder="$t('select_start_date_placeholder')"
          >
          </date-picker>
          <date-picker
            class="filterElement"
            v-model="endDate"
            type="date"
            :placeholder="$t('select_end_date_placeholder')"
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
        v-if="selectedStatus"
        >{{ $t(selectedStatus)
        }}<a class="badgeIcon" @click.prevent="removeStatus()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-for="type in selectedType"
        :key="type"
        >{{ $t(type)
        }}<a class="badgeIcon" @click.prevent="removeType(type)"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedLifeCycleStatus"
        >{{ $t(selectedLifeCycleStatus)
        }}<a class="badgeIcon" @click.prevent="removeLifeCycleStatus()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="startDate && endDate"
        >{{ $t("from") }}: {{ $d(startDate) }} {{ $t("until") }}:
        {{ $d(endDate) }}
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

import { formatDateToApiFormat } from "../../../helpers/helpers";
import {
  STATUS,
  lifecycle_status,
  TYPES,
} from "../../../helpers/bankingTransactions";
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
      selectedType: [],
      selectedStatus: null,
      selectedLifeCycleStatus: null,
      filterIsActive: false,
      lastRequest: null,
      status: [],
      lifeCycleStatus: [],
      types: [],
    };
  },
  mounted() {
    this.status = STATUS;
    this.types = TYPES;
    this.lifeCycleStatus = lifecycle_status;
  },
  computed: {},
  watch: {},
  methods: {
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
      if (this.selectedType.length > 0) {
        query += "&types=" + this.selectedType.join(",");
      }
      if (this.selectedStatus) {
        query += "&status=" + this.selectedStatus;
      }
      if (this.startDate != null && this.endDate != null) {
        query += "&create_date_start=" + formatDateToApiFormat(this.startDate);
      }
      if (this.selectedLifeCycleStatus) {
        query += "&lifecycle_status=" + this.lifecycle_status;
      }
      if (this.startDate != null) {
        query += "&startDate=" + formatDateToApiFormat(this.startDate);
      }
      if (this.endDate != null) {
        query += "&endDate=" + formatDateToApiFormat(this.startDate);
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
    removeStatus: function () {
      this.selectedStatus = null;
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeType: function (type) {
      this.selectedType = this.selectedType.filter(
        (x) => x.name_translation_key != type
      );
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeDate: function () {
      this.startDate = null;
      this.endDate = null;
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    removeLifeCycleStatus() {
      this.selectedLifeCycleStatus = null;
      if (this.filterIsActive) {
        const query = this.quiryBuilder();
        this.$emit("filter", query);
      }
    },
    clearFilter() {
      this.selectedStatus = null;
      this.selectedType = [];
      this.startDate = null;
      this.endDate = null;
      this.selectedLifeCycleStatus = null;
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
