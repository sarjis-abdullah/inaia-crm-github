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
      <header>
        <span v-if="hasTwoFaEnabled">
          <p class="text-sm text-gray-500">
            <strong>{{ $t("do_you_want_to_disable_two_factor_authentication?") }}</strong>
          </p>
          <p class="text-sm">
            {{ $t("enter_6_digit_code_to_confirm_disable_two_fa") }}
          </p>
        </span>

        <span v-else class="text-center">
          <p class="text-sm text-gray-500">
            <strong>{{ $t("do_you_want_to_enable_two_factor_authentication?") }}</strong>
          </p>
          <p class="text-sm">
            {{ $t("scan_the_qr_code_below_with_your_authenticator_app") }}
          </p>
        </span>
      </header>
    </template>
    <div>
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
        <template v-if="svgContent">
          <!-- <p class="text-sm">
            {{ $t("scan_the_qr_code_below_with_your_authenticator_app") }}
          </p> -->
          <picture>
            <div v-html="svgContent"></div>
          </picture>
        </template>
        <p class="text-sm mb-3">
          Once you have scanned the QR code, enter the 6-digit code from your
          authenticator app to confirm setup.
        </p>
        <CodeInputs v-if="confirmed" @complete="submit" :length="6" />

        <div v-if="isLoading || isMfaVerifying" class="text-center mt-3">
          <Loading />
        </div>

        <template v-if="confirmed">
          <div>
            <p class="text-sm mt-3">{{ $t("enter_6_digit_code_prompt") }}</p>
            <p class="text-sm mt-2">{{ $t("keep_mobile_device_secure") }}</p>
          </div>
        </template>
        <div v-else class="alert alert-success">
          {{ $t("two_factor_authentication_enabled_success") }}
        </div>
      </div>
    </div>
    <template #footer v-if="!confirmed">
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
      isLoading: true,
      confirmed: false,
      isMfaVerifying: false,
      serverErrorMsg: "",
    };
  },
  mounted() {
    this.initTwoFA();
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
    async submit(code) {
      try {
        this.isMfaVerifying = true;
        const res = await this.$axios.post(`mfa/verify`, { pin: code });
        await this.loadAccount();
        this.$emit("enable");
        this.confirmed = false;

        this.svgContent = "";
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isMfaVerifying = false;
      }
    },
    async initTwoFA() {
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
