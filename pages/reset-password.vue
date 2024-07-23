<template>
  <div>
    <div class="header py-7" :class="background">
      <div class="container">
        <div class="header-body text-center mt-4 mb-6">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <h1 class="text-white">{{ $t("reset_password_title") }}</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <div class="container mt--8 pb-5 new-px-8">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7 card bg-secondary">
          <img
            src="~/static/pinscreen.jpg"
            alt="pin"
            class="d-flex w-28 h-auto mt-4 mx-auto"
          />

          <div class="card-body px-lg-5">
            <div v-if="!isLoading && state.email && stillValid">
              <validation-observer
                ref="observer"
                v-slot="{ invalid, handleSubmit }"
              >
                <div v-if="failed" class="text-center text-danger mb-2">
                  {{ failed }}
                </div>

                <form
                  class="space-y-6"
                  @submit.prevent="handleSubmit(resetPassword)"
                  v-if="!success"
                >
                  <div>
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
                    </div>
                  </div>

                  <div>
                    <div class="mt-1">
                      <base-input
                        alternative
                        class="mb-3"
                        name="password"
                        :rules="{
                          required: true,
                          min: 8,
                          special_character: true,
                        }"
                        prepend-icon="ni ni-lock-circle-open"
                        type="password"
                        placeholder="Password"
                        v-model="state.password"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="mt-1">
                      <base-input
                        alternative
                        class="mb-3"
                        name="password"
                        :rules="{
                          required: true,
                          min: 8,
                          special_character: true,
                        }"
                        prepend-icon="ni ni-lock-circle-open"
                        type="password"
                        placeholder="Confirm password"
                        v-model="state.confirmPassword"
                      />
                    </div>
                  </div>
                  <span class="invalid-feedback" style="display: block">{{
                    showConfirmPasswordError
                      ? $t("confirm_password_mismatch")
                      : ""
                  }}</span>

                  <div class="d-flex justify-content-center">
                    <base-button
                      :disabled="
                        disabled || isSubmitting || showConfirmPasswordError
                      "
                      type="primary"
                      native-type="submit"
                      class="my-4 w-full"
                    >
                      {{ $t("confirm") }}
                      <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                    </base-button>
                  </div>
                </form>
              </validation-observer>
              <div class="mt-1" v-if="success">
                <div
                  class="mt-1 d-flex align-items-center justify-content-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    class="h-8 w-8 text-success"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span class="ml-2 text-success">
                    {{ $t("password_reset_with_success") }}
                  </span>
                </div>
                <div class="mt-2 d-flex justify-content-center">
                  <router-link to="/" class=""
                    ><small>
                      {{ $t("back_to_login") }}
                    </small></router-link
                  >
                </div>
              </div>
            </div>
            <div v-else-if="isLoading">
              <p class="text-center">{{ $t("checking") }}...</p>
              <div class="d-flex justify-content-center mt-6">
                <Loader />
              </div>
            </div>
            <div
              v-else-if="!isLoading && (!state.email || !token || !stillValid)"
            >
              <p class="text-center">
                {{ $t("requestNewLink") }}
              </p>
              <div class="d-flex justify-content-center mt-1">
                <NuxtLink
                  to="/request-password"
                  class="cursor-pointer font-semibold"
                  >{{ $t("clickHere") }}</NuxtLink
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/common/Loader/Loader.vue";
import appNames from "../appNames";

export default {
  layout: "AuthLayout",
  components: {
    Loader,
  },
  data() {
    return {
      failed: "",
      state: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      disabled: false,
      isSubmitting: false,
      token: "",
      success: false,
      stillValid: true,
      isLoading: false,
    };
  },
  computed: {
    showConfirmPasswordError() {
      const { password, confirmPassword } = this.state;
      if (!password || !confirmPassword) {
        return false;
      }
      if (password === confirmPassword) {
        return false;
      }
      return true;
    },
    background() {
      let app = process.env.CURRENT_APP;
      let env = process.env.DEPLOYMENT_ENV;
      if (env != "production") {
        return "bg-gradient-warning";
      }
      if (app == appNames.getGreenGold) return "bg-gradient-default";
      else return "bg-gradient-info";
    },
  },
  mounted() {
    const query = this.$route.query;
    if (query.email) {
      this.state.email = query.email;
    }
    this.validateToken(query);
  },
  methods: {
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
      const isValid = this.$refs.observer.validate();
      if (isValid && !this.showConfirmPasswordError && this.token) {
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
        } catch (err) {
          if (err.response) {
            let e = err.response.data;
            this.failed = e.message || e.errors.message;
          } else {
            this.failed = err;
          }
          this.success = false;
        } finally {
          this.isLoading = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.w-28 {
  width: 7rem;
}
.h-auto {
  height: auto;
}
.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}
.font-bold {
  font-weight: 700;
}
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.5rem;
}
.mt-1 {
  margin-top: 0.25rem;
}
.w-full {
  width: 100%;
}

.py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.cursor-pointer {
  cursor: pointer;
}
.font-semibold {
  font-weight: 600;
}
.h-8 {
  height: 2rem;
}
.w-8 {
  width: 2rem;
}
.new-px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
