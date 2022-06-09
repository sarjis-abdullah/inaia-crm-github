<template>
<div>
  <div
    class="
      d-flex
      justify-content-end
      align-items-center
      .bg-light.bg-gradient
      p-2
    "
  >
    <Select
      :placeholder="$t('types')"
      v-model="selectedOrderType"
      class="mr-3"
      :loading="loadingTypes"
      @change="onChange"
    >
      <Option
        v-for="option in types"
        :value="option.id"
        :label="$t(option.name_translation_key)"
        :key="option.id"
      >
      </Option>
    </Select>
    <date-picker
      size="large"
      class="mr-3"
      v-model="startDate"
      type="date"
      @change="onChange"
      :placeholder="$t('select_start_date_placeholder')"
    >
    </date-picker>
    <date-picker
      class="mr-3"
      v-model="endDate"
      type="date"
      @change="onChange"
      :placeholder="$t('select_end_date_placeholder')"
    >
    </date-picker>
    <base-button size="sm" type="neutral" @click="cancelCreatingNewBatch">
      {{ $t("cancel") }}
    </base-button>
    <base-button
      size="sm"
      type="neutral"
      @click="saveNewBatchOrderProcess"
      :disabled="!selectedOrderType"
    >
      {{ $t("save_new_batch") }}
    </base-button>
  </div>
  <div class="mt-1 text-light">
    {{$t('check_orders_all_select_all')}}
  </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GOLD_PURCHASE_TYPE, GOLD_SELL_TYPE, ORDER_STATUS_PENDING } from "../../helpers/order";
import { Select, Option, DatePicker } from "element-ui";
import {formatDateToApiFormat} from '../../helpers/helpers';
export default {
  components: {
    Select,
    Option,
    DatePicker,
  },
  computed: {
    ...mapGetters("orderTypes", {
      loadingTypes: "loading",
      allTypes: "orderFilterList",
    }),
    ...mapGetters('orderStatus',{
      status:"list"
   }),
    types() {
      let data = [];
      if (this.allTypes.length > 0) {
        this.allTypes.forEach((element) => {
          if (
            element.name_translation_key == GOLD_PURCHASE_TYPE ||
            element.name_translation_key == GOLD_SELL_TYPE
          ) {
            data.push(element);
          }
        });
      }
      return data;
    },
  },
  mounted() {
    if (this.allTypes.length == 0) {
      this.$store
        .dispatch("orderTypes/fetchOrderFilterList", "")
        .then(() => {});
    }
    if(this.status.length == 0){
        this.$store.dispatch("orderStatus/fetchList","");
    }
  },
  data() {
    return {
      selectedOrderType: null,
      startDate: null,
      endDate: null,
    };
  },
  methods: {
    cancelCreatingNewBatch() {
      this.$emit("canceled");
    },
    saveNewBatchOrderProcess() {
        const criteria = {
            selectedType : this.selectedOrderType,
            startDate : formatDateToApiFormat(this.startDate),
            endDate : formatDateToApiFormat(this.endDate)
        }
      this.$emit("saved",criteria);
    },
    quiryBuilder () {
      let query = "";
      let pendingStatus = this.status.find(x=>x.name_translation_key==ORDER_STATUS_PENDING)
      if (this.selectedOrderType) {
        query += "&order_type_ids=" + this.selectedOrderType;
      }
      if (pendingStatus) {
        query += "&order_status_ids=" + pendingStatus.id;
      }
      if (this.startDate != null) {
        query += "&create_date_start=" + formatDateToApiFormat(this.startDate);
      }
      if (this.endDate != null) {
        query += "&create_date_end=" + formatDateToApiFormat(this.endDate);
      }
      return query;
    },
    onChange(){
        const query = this.quiryBuilder();
        this.$emit('changed',query);
    }
  },
};
</script>
<style scoped>
</style>