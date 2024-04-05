<template>
  <div>
    <div class="row m-auto d-flex justify-content-center">
      <Select
        :placeholder="$t('sales_advisor')"
        v-model="sales_advisor_id"
        :disabled="disabledSelect"
      >
        <Option
          v-for="option in advisors"
          :value="option.id"
          :label="formatClientLabel(option)"
          :key="option.id"
        >
        </Option>
      </Select>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
export default {
  props: {
    agioTransaction: {
      type: Object,
      default: {},
    },
    advisors: {
      type: Array,
      required: true,
      default: [],
    },
    salesAdvisorId: {
      type: [Number, null],
      required: true,
      default: null,
    },
  },
  components: {
    Select,
    Option,
  },
  data() {
    return {
      sales_advisor_id: null,
      isRequesting: false,
      disabledSelect: false,
    };
  },
  watch: {
    salesAdvisorId: {
      handler() {
        if (this.salesAdvisorId) {
          this.disabledSelect = true
          this.sales_advisor_id = this.salesAdvisorId;
        }
      },
      immediate: true,
    },
    sales_advisor_id: {
      handler() {
        const obj = {
          agioTransactionId: this.agioTransaction.id,
          salesAdvisorId: this.sales_advisor_id
        }
        this.$emit('updateSalesAdvisorId', obj)
      },
      immediate: false,
      deep: true,
    },
  },
  methods: {
    cancelEdit() {
      this.showModal = false;
      this.$emit("cancelEditAdvisor");
    },
    toggleDisabledSelect() {
      this.disabledSelect = true;
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
  },
};
</script>
<style scoped></style>
