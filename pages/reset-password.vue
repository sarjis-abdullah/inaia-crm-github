<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <nuxt-link to="/">
        <img
          class="flex mx-auto w-36 h-auto"
          src="~/static/logo.png"
          alt="INAIA GmbH"
        />
      </nuxt-link>

      <div class="bg-white py-4 mt-10 mb-10 px-4 shadow sm:rounded-lg sm:px-10">
        <h2
          class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
        >
          {{ $t("reset_password_title") }}
        </h2>
        <img
          src="~/static/pinscreen.jpg"
          alt="pin"
          class="flex w-32 h-auto my-4 mx-auto"
        />

        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div v-if="!isLoading && state.email && stillValid">
            <form
              class="space-y-6"
              @submit.prevent="resetPassword"
              v-if="!success"
            >
              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >{{ $t("email") }}</label
                >
                <div class="mt-1">
                  <base-input
                    alternative
                    class="mb-3"
                    name="email"
                    id="email"
                    rules="required"
                    prepend-icon="fas fa-envelope"
                    placeholder="e.g. Email address"
                    v-model="state.email"
                    disabled
                  />
                  <!-- <input
                    id="email"
                    name="email"
                    autocomplete="off"
                    v-model="state.email"
                    type="email"
                    :class="
                      emailValidated
                        ? 'block w-full bg-slate-200 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        : inputErrorStyle
                    "
                    disabled
                  /> -->
                </div>
                <p
                  class="mt-1 text-center text-sm text-red-500"
                  v-if="!emailValidated"
                >
                  {{ $t("email_is_required") }}
                </p>
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >{{ $t("new_password") }}</label
                >
                <div class="mt-1">
                  <base-input
                    alternative
                    class="mb-3"
                    name="password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="fas fa-envelope"
                    type="password"
                    placeholder="Password"
                    v-model="state.password"
                  />
                  <!-- <input
                    name="newpassword"
                    type="password"
                    autocomplete="off"
                    v-model="state.password"
                    :class="
                      passwordValidated
                        ? 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        : inputErrorStyle
                    "
                  /> -->
                </div>
                <p
                  class="mt-1 text-center text-sm text-gray-500"
                  :class="passwordValidated ? 'text-gray-500' : 'text-red-500'"
                >
                  {{ $t("password_message") }}
                </p>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label
                    for="password"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >{{ $t("confirm_password") }}</label
                  >
                </div>
                <div class="mt-1">
                  <base-input
                    alternative
                    class="mb-3"
                    name="password"
                    :rules="{ required: true, min: 6 }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Confirm password"
                    v-model="state.confirmPassword"
                  />
                  <!-- <input
                    name="password"
                    type="password"
                    autocomplete="off"
                    v-model="state.confirmPassword"
                    :class="
                      confirmedPasswordValidated
                        ? 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        : inputErrorStyle
                    "
                  /> -->
                </div>
                <p
                  class="mt-1 text-center text-sm text-red-500"
                  v-if="!confirmedPasswordValidated"
                >
                  {{ $t("confirm_password_is_required") }}
                </p>
              </div>

              <div class="flex justify-content-center">
                <base-button
                  :disabled="disabled || isSubmitting"
                  type="primary"
                  native-type="submit"
                  class="my-4"
                >
                  {{ $t("confirm") }}
                  <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                </base-button>
                <!-- <button
                  type="submit"
                  :class="
                    disabled || isSubmitting ? 'opacity-50' : 'opacity-100'
                  "
                  :disabled="disabled || isSubmitting"
                  class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {{ $t("confirm") }}
                </button> -->
              </div>
            </form>
            <!-- <InLineApiError :err="error" /> -->
            <div class="mt-1 flex items-center justify-center" v-if="success">
              <!-- <CheckCircleIcon class="h-6 w-6 text-green-500">
              </CheckCircleIcon> -->
              <span class="text-2xl text-green-500 ml-2">{{
                $t("password_reset_with_success")
              }}</span>
            </div>
          </div>
          <div v-else-if="isLoading">
            <p class="text-center">{{ $t("checking") }}...</p>
            <div class="flex justify-center mt-6">
              <!-- <Loading class="" /> -->Loading
            </div>
          </div>
          <div
            v-else-if="!isLoading && (!state.email || !token || !stillValid)"
          >
            <p class="text-center">
              {{ $t("The link is expired, please request a new link by:") }}
            </p>
            <div class="flex justify-center mt-6">
              <NuxtLink
                :to="'/' + locale + '/request-password'"
                class="text-blue-600 cursor-pointer font-semibold"
                >{{ $t("clickHere") }}</NuxtLink
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { redirectPost } from "~/helpers/auth";
import appNames from "../appNames";
export default {
  layout: "no-layout",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      isRequesting: false,
      failed: "",
      rememberMe: false,
      forgetPassword: false,
      message: "",
      state: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      inputErrorStyle:
        "block w-full rounded-md border-0 py-1.5 text-red-900 shadow-sm ring-1 ring-inset ring-red-300 placeholder:text-red-400 focus:ring-2 focus:ring-inset focus:ring-red-600 sm:text-sm sm:leading-6",
      passwordValidated: true,
      emailValidated: true,
      confirmedPasswordValidated: true,
      disabled: false,
      isSubmitting: false,

      token: "",
      error: null,
      success: false,
      stillValid: true,
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      auth: "auth/auth",
      locale: "auth/locale",
    }),
  },
  watch: {},
  mounted() {
    const query = this.$route.query;
    if (query.email) {
      this.state.email = query.email;
    }
    this.validateToken(query);
    // console.log(process.env.CURRENT_APP);
    // console.log(process.env.NODE_ENV);
    // if (this.auth && this.user && this.user.is_active) {
    //   this.$router.push(process.env.dashboardPath);
    // }
  },
  methods: {
    async loginRequest() {},
    async handleForgetPassword() {},
    async validateToken(query) {
      if (query.email && query.token) {
        this.token = query.token;
        if (this.token) {
          this.isLoading = true;
          try {
            const params = `?token=${this.token}&email=${this.state.email}`;
            await this.$axios.get(`/password-reset/check${params}`);
          } catch (err) {
            this.stillValid = false;
          } finally {
            this.isLoading = false;
          }
        }
      }
    },
    async resetPassword() {
      if (true) {
        if (this.token) {
          this.isLoading = true;
          try {
            const object = {
              email: this.state.email,
              password: this.state.password,
              token: this.token,
              password_confirmation: this.state.confirmPassword,
            };
            await this.$axios.post(`/password-reset/apply`, object);
            this.success = true;
            // await ResetPasswordService.verifyRestToken({
            //   email: state.email,
            //   token: this.token,
            // });
          } catch (err) {
            console.log(err, "err");
            // if(err instanceof BadInputException){
            //   stillValid.value = false
            // }
          } finally {
            this.isLoading = false;
          }
        }
      }
    },
  },
};
</script>

<style scoped>
/* Base styles */
.flex {
  display: flex;
}
.min-h-full {
  min-height: 100%;
}
.flex-1 {
  flex: 1 1 0%;
}
.flex-col {
  flex-direction: column;
}
.justify-center {
  justify-content: center;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.lg\:px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

/* Image styles */
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.w-36 {
  width: 9rem;
}
.w-32 {
  width: 8rem;
}
.h-auto {
  height: auto;
}

/* Card styles */
.bg-white {
  background-color: #ffffff;
}
.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
.mt-10 {
  margin-top: 2.5rem;
}
.mb-10 {
  margin-bottom: 2.5rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.sm\:rounded-lg {
  border-radius: 0.5rem;
}
.sm\:px-10 {
  padding-left: 2.5rem;
  padding-right: 2.5rem;
}

/* Text styles */
.text-center {
  text-align: center;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.font-bold {
  font-weight: 700;
}
.leading-9 {
  line-height: 2.25rem;
}
.tracking-tight {
  letter-spacing: -0.025em;
}
.text-gray-900 {
  color: #1a202c;
}

/* Form styles */
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}
.block {
  display: block;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.font-medium {
  font-weight: 500;
}
.leading-6 {
  line-height: 1.5rem;
}
.text-gray-900 {
  color: #1a202c;
}
.mt-1 {
  margin-top: 0.25rem;
}
.w-full {
  width: 100%;
}
.bg-slate-200 {
  background-color: #e2e8f0;
}
.rounded-md {
  border-radius: 0.375rem;
}
.border-0 {
  border-width: 0;
}
.py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.text-gray-900 {
  color: #1a202c;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.ring-1 {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
}
.ring-inset {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
.ring-gray-300 {
  --tw-ring-color: #d1d5db;
}
.placeholder\:text-gray-400::placeholder {
  color: #9ca3af;
}
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px var(--tw-ring-color);
}
.focus\:ring-inset:focus {
  box-shadow: inset 0 0 0 2px var(--tw-ring-color);
}
.focus\:ring-blue-600:focus {
  --tw-ring-color: #2563eb;
}
.sm\:text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.sm\:leading-6 {
  line-height: 1.5rem;
}
.text-red-500 {
  color: #f87171;
}
.text-gray-500 {
  color: #6b7280;
}
.text-blue-600 {
  color: #2563eb;
}
.cursor-pointer {
  cursor: pointer;
}
.font-semibold {
  font-weight: 600;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-100 {
  opacity: 1;
}
.bg-blue-600 {
  background-color: #2563eb;
}
.hover\:bg-blue-500:hover {
  background-color: #3b82f6;
}
.focus-visible\:outline:focus-visible {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-visible\:outline-2:focus-visible {
  outline: 2px solid transparent;
}
.focus-visible\:outline-offset-2:focus-visible {
  outline-offset: 2px;
}
.focus-visible\:outline-blue-600:focus-visible {
  outline: 2px solid #2563eb;
}
@media (min-width: 640px) {
  .sm\:w-full {
    width: 100%;
  }
}
@media (min-width: 640px) {
  .sm\:mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
}
@media (min-width: 640px) {
  .sm\:max-w-md {
    max-width: 28rem;
  }
}
</style>
