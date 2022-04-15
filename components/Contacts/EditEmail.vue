<template>
  <modal
    :show.sync="showModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    :allowOutSideClose="false"
    @close="cancelEdit"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("edit_email") }}</h5>
      <span></span>
    </template>
    <div>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        @submit.prevent="validate"
      >
        <div class="row text-danger" v-if="failed && invalid">
          <div class="col-sm-2"></div>
          <div class="col-md-6">
            {{ failed }}
          </div>
        </div>
        <base-input
              :label="$t('email')"
              name="email"
              v-model="newEmail"
              :placeholder="$t('email')"
              rules="required"
              ref="emailProvider"
            />

        <div class="row">
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <base-button
              type="secondary"
              native-type="button"
              @click="() => cancelEdit()"
              >{{ $t("cancel") }}</base-button
            >
            <base-button
              type="primary"
              native-type="submit"
              :disabled="isRequesting"
              >{{ $t("save") }}</base-button
            >
          </div>
        </div>
      </validation-observer>
    </div>
  </modal>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { functionUpdateChannelAndGetObject } from "../../helpers/customer";
export default {
  setup() {},
  props: {
    customer: {
      type: Object,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    email:{
        type:String,
        default:""
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  mounted(){
      this.newEmail  = this.email;
  },
  data() {
    return {
      isRequesting: false,
      failed: "",
      newEmail: "",
    };
  },
  methods: {
    async validate() {
      const isValid = await this.$refs.observer.validate();
      if (isValid && !this.isRequesting) {
        this.submitClient();
      } else {
        console.log("invalid request");
        this.isRequesting = false;
      }
    },
    submitClient() {
      this.isRequesting = true;
      let data = functionUpdateChannelAndGetObject(this.customer,'email',this.newEmail);
      if (data.customer.account && !data.customer.account.password) {
        // if empty then keep the account table intact
        delete data.customer["account"];
        // if empty then keep the old passowrd
        // delete data.customer.account['password']
      }

      this.$store
        .dispatch("clients/submitClient", data)
        .then((response) => {
          this.$store.commit("clients/updateChannels", data.customer.channels);
          this.cancelEdit();
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("email_updated_successfully"),
          });
        })
        .catch((err) => {
          this.failed = err.response.data.message;
          this.$refs.observer.setErrors(err.response.data.errors);
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("email_updated_unsuccessfully"),
          });
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },
    cancelEdit() {
      this.showModal = false;
      this.$emit("cancelEdit");
    }
  },
};
</script>
<style scoped>

</style>