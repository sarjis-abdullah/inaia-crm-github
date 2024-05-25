<template>
  <div>
    <div class="row m-auto d-flex justify-content-center">
      <Select
        :placeholder="
          salesAdvisorId ? $t('sales_advisor') : $t('select_sales_advisor')
        "
        @change="handleChange"
        v-model="sales_advisor_id"
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
    <div
      class="d-flex justify-content-center mt-1"
      style="flex-direction: row; gap: 0.5rem"
    >
      <div class="">
        <button
          v-if="!salesAdvisorId"
          class="btn base-button btn-icon btn-fab btn-primary btn-sm"
          @click="add"
          :disabled="updating"
        >
          {{ updating ? $t('loading') : $t('add') }}
        </button>
        <button
          v-else-if="changeSalesAdvisor && sales_advisor_id != salesAdvisorId && !removing"
          class="btn base-button btn-icon btn-fab btn-primary btn-sm"
          :disabled="updating"
          @click="update(false)"
        >
          {{ updating ? $t('loading') : $t('update') }}
        </button>
      </div>
      <div>
        <button
          v-if="sales_advisor_id"
          :disabled="removing"
          class="btn base-button btn-icon btn-fab btn-danger btn-sm"
          @click="update(true)"
        >
          {{ removing ?  $t('loading') : $t('remove') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { Select, Option } from "element-ui";
import { apiErrorHandler } from "../../helpers/apiErrorHandler";
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
      updating: false,
      removing: false,
      changeSalesAdvisor: false,
    };
  },
  watch: {
    salesAdvisorId: {
      handler() {
        if (this.salesAdvisorId) {
          this.sales_advisor_id = this.salesAdvisorId;
        }else {
          this.sales_advisor_id = null;
        }
      },
      deep: true,
      immediate: true,
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
    add() {
      if (!this.sales_advisor_id) {
        return;
      }
      const obj = {
        agio_transaction_id: this.agioTransaction.id,
        sales_advisor_id: this.sales_advisor_id,
      };
      this.updating = true;
      this.updateAgioTransaction(obj);
    },
    update(isRemove = false) {
      if (isRemove) {
        this.sales_advisor_id = null;
      }
      if (!this.salesAdvisorId) {
        return;
      }
      const obj = {
        agio_transaction_id: this.agioTransaction.id,
        sales_advisor_id: this.sales_advisor_id,
      };
      if (isRemove) {
        obj.sales_advisor_id = 0;
        this.removing = true
      }else {
        this.updating = true;
      }
      this.updateAgioTransaction(obj);
    },
    updateAgioTransaction(obj) {
      
      this.$store
        .dispatch("depots/updateAgioTransaction", obj)
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("entry_deleted_successfully"),
          });
          this.$emit('updateListKey')
        })
        .catch((err) => {
          apiErrorHandler(err, this.$notify);
        })
        .finally(() => {
          this.updating = false;
          this.removing = false;
        });
    },
    handleChange(){
      this.changeSalesAdvisor = true
    }
  },
};
</script>
<style scoped></style>
