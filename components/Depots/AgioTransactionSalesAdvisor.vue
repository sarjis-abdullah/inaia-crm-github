<template>
  <div>
    <div class="row m-auto d-flex justify-content-center">
      <Select
        :placeholder="$t('sales_advisor')"
        v-model="sales_advisor_id"
        :disabled="!!sales_advisor_id"
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
import { updateSalesAdvisorAndGetObject } from "../../helpers/customer";
import { Select, Option } from "element-ui";
import { mapGetters } from "vuex";
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
  computed: {
    // ...mapGetters("salesCommission", {
    //   advisors: "salesAdvisors",
    // }),
  },
  data() {
    return {
      sales_advisor_id: null,
      isRequesting: false,
    };
  },
  watch: {
    // advisors: {
    //   handler(n, p) {
    //     if (n?.length != p?.length) {
    //       this.$store.dispatch("salesCommission/fetchSalesAdvisors");
    //     }
    //   },
    //   deep: false,
    //   immediate: true,
    // },
    salesAdvisorId: {
      handler() {
        if (this.salesAdvisorId) {
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
    assignSalesAdvivor() {
      this.isRequesting = true;
      let data = {
        id: this.depot.id,
        sales_advisor_id: this.sales_advisor_id,
      };
      this.$store
        .dispatch("depots/submit", data)
        .then((response) => {
          this.cancelEdit();
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("salesadvisor_updated_successfully"),
          });
        })
        .catch((err) => {
          apiErrorHandler(err, this.$notify);
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },
    cancelEdit() {
      this.showModal = false;
      this.$emit("cancelEditAdvisor");
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
