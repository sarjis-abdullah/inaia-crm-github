<template>
  <modal
    :show.sync="showModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    size="sm"
    :allowOutSideClose="false"
    @close="cancelEdit"
  >
    <template slot="header">
      <h5 class="modal-title">{{ $t("edit_depot_target_type") }}</h5>
      <span></span>
    </template>

    <div>
      <div v-if="!loading" class="row m-auto d-flex py-2 justify-content-center">
        <Select :placeholder="$t('sales_advisor')" v-model="target_type_id" class="w-100">
          <Option
            v-for="option in depotTargetTypes"
            :value="option.id"
            :label="option.title"
            :key="option.id"
          >
          </Option>
        </Select>
      </div>
      <div v-else class="row m-auto py-2 d-flex justify-content-center">
        {{ $t("loading") }}
      </div>
    </div>

    <template slot="footer">
      <base-button
        type="link"
        native-type="button"
        @click="() => cancelEdit()">{{ $t("cancel") }}</base-button>
      <base-button
        type="primary"
        native-type="submit"
        :disabled="isRequesting || target_type_id == null"
        @click="assignSalesAdvivor">{{ $t("save") }}</base-button>
    </template>

  </modal>
</template>
<script>
import { Select, Option } from "element-ui";
import { mapGetters } from "vuex";
import { apiErrorHandler } from "../../helpers/apiErrorHandler";
export default {
  name: "UpdateDepotTargetTypeModal",
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    depot: {
      type: Object,
      default: {},
    },
  },
  components: {
    Select,
    Option,
  },
  computed: {
    ...mapGetters("depots", {
      depotTargetTypes: "depotTargetTypes",
    }),
  },
  data() {
    return {
      target_type_id: null,
      isRequesting: false,
      loading: false,
    };
  },
  watch: {
    showModal: {
      handler() {
        if (this.showModal && this.depotTargetTypes.length == 0) {
          this.loading = true;
          this.$store
            .dispatch("depots/fetchDepotTargetTypes")
            .then((result) => {})
            .catch((err) => {})
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
    depot: {
      handler() {
        if (this.depot) {
          this.target_type_id = this.depot.target_type_id;
        }
      },
      immediate: true,
    },
  },
  methods: {
    assignSalesAdvivor() {
      this.isRequesting = true;
      const data = {
        id: this.depot.id,
        target_type_id: this.target_type_id,
      };
      this.$store
        .dispatch("depots/submit", data)
        .then((response) => {
          this.cancelEdit();
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("depot_target_updated_successfully"),
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
    }
  },
};
</script>
<style scoped></style>
