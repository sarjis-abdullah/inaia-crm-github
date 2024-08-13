<template>
  <modal :show.sync="show" :show-close="true" modal-classes="modal-secondary">
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
        <div v-if="serverErrorMsg" class="alert alert-danger">
          <ExclamationTriangleIcon class="mr-2" />
          {{ serverErrorMsg }}
        </div>
        <!-- <div v-if="svgContent" v-html="svgContent"></div>
          <code-inputs v-if="showCodeInput" @confirm="confirmDisableTwofa" />
          <check-circle-icon v-if="!hasTwoFaEnabled" @click="confrim" />
          <check-circle-icon v-if="hasTwoFaEnabled" @click="cancel" /> -->
      </div>
    </div>
    <div v-if="hasTwoFaEnabled && !isLoading && showCodeInput" class="w-100">
      <div class="alert alert-warning text-center">
        {{ $t("enter_6_digit_code_to_confirm_disable_two_fa") }}
      </div>
      <div class="d-flex justify-content-center">
        <CodeInputs @complete="confirmDisableTwofa" :length="6" />
      </div>
      <div class="alert alert-warning text-center mt-4">
        {{ $t("two_fa_disable_warning_message") }}
      </div>
    </div>
    <div v-else-if="!isLoading && svgContent && !hasTwoFaEnabled" class="w-100">
      <div class="text-center">
        <p>
          {{ $t("scan_the_qr_code_below_with_your_authenticator_app") }}
        </p>
        <picture>
          <div v-html="svgContent" v-if="svgContent"></div>
        </picture>
        <div class="alert alert-success mt-3">
          <check-circle-icon class="mr-2" />
          {{ $t("two_factor_authentication_enabled_success") }}
        </div>
        <div>
          <p>{{ $t("enter_6_digit_code_prompt") }}</p>
          <p>{{ $t("keep_mobile_device_secure") }}</p>
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
      <button
        v-if="!hasTwoFaEnabled"
        type="button"
        :disabled="isLoading"
        class="btn btn-primary"
        @click="svgContent ? enable() : confrim()"
      >
        {{ svgContent && !isLoading ? $t("ok") : $t("confirm") }}
      </button>
    </template>
  </modal>
</template>
<script>
// import {
//   Dialog,
//   DialogPanel,
//   DialogTitle,
//   TransitionChild,
//   TransitionRoot,
// } from "@headlessui/vue";
// import {
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
// } from "@heroicons/vue/24/outline";
import Loading from "@/components/common/Loader/Loader.vue";
import CodeInputs from "@/components/Users/CodeInputs";

export default {
  components: {
    // Dialog,
    // DialogPanel,
    // DialogTitle,
    // TransitionChild,
    // TransitionRoot,
    // ExclamationTriangleIcon,
    // CheckCircleIcon,
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
        if (this.accountId) {
          //   this.account = await AccountService.loadAccount(this.accountId);
          //   AccountStorage.saveAccount(this.account);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async confrim() {
      try {
        this.serverErrorMsg = "";
        this.isLoading = true;
        this.showCodeInput = false;
        const res = await this.$axios.post(`mfa/init`);
        console.log(res, "res");
        // const res = await AccountService.enableTwoFA();
        this.svgContent = res.data.qrCode;
        // await this.loadAccount();
      } catch (error) {
        this.serverErrorMsg = error.message ?? "";
      } finally {
        this.isLoading = false;
      }
    },
    async confirmDisableTwofa(code) {
      try {
        this.isLoading = true;
        const obj = { pin: code };
        const res = await AccountService.disableTwoFA(obj);
        this.svgContent = res.qrCode;
        this.$emit("disable");
        // await this.loadAccount();
      } catch (error) {
        console.log(error.status, error);
        this.serverErrorMsg = error.message ?? "";
      } finally {
        this.isLoading = false;
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
.modal-dialog {
  max-width: 600px;
}
</style>
