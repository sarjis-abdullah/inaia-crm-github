<template>
  <modal
    :show.sync="show"
    class="orderModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    :allowOutSideClose="false"
  >
    <template #header>
      <h5>
        {{
          hasTwoFaEnabled
            ? $t("confirm_disable_two_factor_authentication")
            : $t("confirm_enable_two_factor_authentication")
        }}
        <p class="text-sm text-gray-500" v-if="hasTwoFaEnabled">
          {{ $t("do_you_want_to_disable_two_factor_authentication?") }}
        </p>
        <p class="text-sm text-gray-500" v-else>
          {{ $t("do_you_want_to_enable_two_factor_authentication?") }}
        </p>
      </h5>
    </template>
    <div class="" v-if="isLoading || serverErrorMsg">
      <div v-if="isLoading" class="text-center">
        <Loading />
      </div>
      <div v-else>
        <div v-if="serverErrorMsg" class="alert alert-danger text-white">
          {{ serverErrorMsg }}
        </div>
      </div>
    </div>
    <div v-if="hasTwoFaEnabled && !isLoading && showCodeInput" class="w-100">
      <div class="text-sm text-center">
        {{ $t("enter_6_digit_code_to_confirm_disable_two_fa") }}
      </div>
      <div class="d-flex justify-content-center mt-4">
        <CodeInputs @complete="confirmDisableTwofa" :length="6" />
      </div>
      <div class="text-sm text-center mt-4">
        {{ $t("two_fa_disable_warning_message") }}
      </div>
    </div>
    <div v-else-if="!isLoading && svgContent && !hasTwoFaEnabled" class="w-100">
      <div class="text-center">
        <p class="text-sm">
          {{ $t("scan_the_qr_code_below_with_your_authenticator_app") }}
        </p>
        <picture>
          <div v-html="svgContent" v-if="svgContent"></div>
        </picture>
        <div class="alert alert-success">
          {{ $t("two_factor_authentication_enabled_success") }}
        </div>
        <div>
          <p class="text-sm">{{ $t("enter_6_digit_code_prompt") }}</p>
          <p class="text-sm mt-2">{{ $t("keep_mobile_device_secure") }}</p>
        </div>
      </div>
    </div>
    <template #footer>
      <button
        v-if="!svgContent"
        type="button"
        :disabled="isLoading"
        class="btn btn-secondary"
        @click="cancel"
        ref="cancelButtonRef"
      >
        {{ $t("cancel") }}
      </button>
      <template v-if="!hasTwoFaEnabled">
        <button
          v-if="!confirmed"
          type="button"
          :disabled="isLoading"
          class="btn btn-primary"
          @click="confirmEnableTwoFa()"
        >
          {{ $t("confirm") }}
        </button>
        <button
          v-if="confirmed"
          type="button"
          :disabled="isLoading"
          class="btn btn-primary"
          @click="submit()"
        >
          {{ $t("submit") }}
        </button>
      </template>
    </template>
  </modal>
</template>
<script>
import Loading from "@/components/common/Loader/Loader.vue";
import CodeInputs from "@/components/Users/CodeInputs";

export default {
  components: {
    Loading,
    CodeInputs,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    hasTwoFaEnabled: {
      type: Boolean,
      default: false,
    },
    confirm: {},
  },
  data() {
    return {
      accountId: null,
      account: null,
      svgContent: "",
      showCodeInput: true,
      isLoading: false,
      confirmed: false,
      serverErrorMsg: "",
    };
  },
  computed: {
    computedAccountId() {
      return null;
      //   return AccountStorage.getContactId();
    },
  },
  watch: {
    // computedAccountId(newVal) {
    //   this.accountId = newVal;
    //   this.loadAccount();
    // },
  },
  methods: {
    cancel() {
      this.$emit("cancel", this.account);
      this.svgContent = "";
    },
    enable() {
      this.$emit("enable", this.account);
      this.svgContent = "";
    },
    async loadAccount() {
      try {
        await this.$store.dispatch("auth/fetchLoggedIn");
      } catch (error) {
        console.error(error);
      }
    },
    async submit() {
      try {
        this.isLoading = true;
        await this.loadAccount();
        this.$emit("enable");
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async confirmEnableTwoFa() {
      try {
        this.serverErrorMsg = "";
        this.isLoading = true;
        this.showCodeInput = false;
        const res = await this.$axios.post(`mfa/init`);
        this.svgContent = res.data.qrCode;
        this.confirmed = true;
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async confirmDisableTwofa(code) {
      this.confirmed = false;
      try {
        this.isLoading = true;
        const obj = { pin: code };
        const res = await this.$axios.post(`mfa/reset`, obj);
        this.$emit("disable");
        await this.loadAccount();
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    },
    handleError(error) {
      if (error.response && error.response.data && error.response.data.message)
        this.serverErrorMsg = error.response.data.message;
      else {
        this.serverErrorMsg = error.message ? error.message : "";
      }
    },
  },
  created() {
    // this.accountId = this.computedAccountId;
    // this.loadAccount();
  },
};
</script>
<style scoped>
.orderModal {
  overflow-y: auto;
}
.text-sm {
  font-size: 14px !important;
  margin-bottom: 0;
}
.modal-header {
  padding-bottom: 0.5rem !important;
}
</style>
