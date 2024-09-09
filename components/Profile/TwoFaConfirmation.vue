<template>
  <modal
    :show.sync="showModal"
    class="orderModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    :allowOutSideClose="false"
    @update:show="cancel()"
    @close="cancel()"
  >
    <header class="d-flex justify-content-between align-items-start mt-3 gap-x-4">
      <span v-if="hasTwoFaEnabled">
        <h5 class="text-sm font-medium text-gray-500">{{
            $t("do_you_want_to_disable_two_factor_authentication?")
          }}
        </h5>
      </span>

      <span v-else>
        <h5 class="text-sm font-medium text-gray-500">
          {{
            $t("do_you_want_to_enable_two_factor_authentication?")
          }}
        </h5>
        <p class="text-sm" v-if="svgContent">
          {{ $t("scan_the_qr_code_below_with_your_authenticator_app") }}
        </p>
      </span>
      <button
        type="button"
        class="close"
        @click="cancel"
        data-dismiss="modal"
        aria-label="Close"
      >
        <span>×</span>
      </button>
    </header>
    <div v-if="isLoading && !hasTwoFaEnabled" class="text-center mt-3">
        <Loading />
      </div>
    <div v-if="serverErrorMsg" class="alert alert-danger text-white mt-3">
      {{ serverErrorMsg }}
    </div>
    <div v-if="hasTwoFaEnabled && showCodeInput" class="w-100 mt-4">
      <div class="text-sm text-center">
        {{ $t("enter_6_digit_code_to_confirm_disable_two_fa") }}
      </div>
      <div class="d-flex justify-content-center mt-4">
        <CodeInputs @complete="confirmDisableTwofa" :length="6" />
      </div>
      <div v-if="isLoading" class="text-center mt-3">
          <Loading />
        </div>
      <div class="text-sm text-center mt-4">
        {{ $t("two_fa_disable_warning_message") }}
      </div>
    </div>
    <div v-else-if="!isLoading && svgContent && !hasTwoFaEnabled" class="w-100">
      <div class="text-center">
        <template v-if="svgContent">
          <picture>
            <div v-html="svgContent"></div>
          </picture>
        </template>
        <p class="text-sm mb-3">
          {{ $t('two_fa_confirmation') }}
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
    showModal: {
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
    if (!this.hasTwoFaEnabled) this.initTwoFA();
    else this.isLoading = false;
  },
  methods: {
    cancel() {
      this.$emit("cancel");
      this.svgContent = "";
    },
    enable() {
      this.$emit("enable");
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
.gap-x-4 {
  gap: 1rem;
}
</style>
