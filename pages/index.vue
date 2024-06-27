<template>
  <div>
    <!-- Header -->
    <div class="header py-7" :class="background">
      <div class="container">
        <div class="header-body text-center mt-4 mb-6">
          <div class="row justify-content-center">
            <div class="col-xl-5 col-lg-6 col-md-8 px-5">
              <h1 class="text-white">{{ $t('administrationPanelTitle') }}</h1>
              <!-- <p class="text-lead text-white">Use these awesome forms to login or create new account in your project for
                free.</p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <div class="container mt--8 pb-5">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card bg-secondary border-0 mb-0">
            <!-- <div class="card-header bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="~/static/img/icons/common/github.svg"></span>
                  <span class="btn-inner--text">Github</span>
                </a>
                <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"><img src="~/static/img/icons/common/google.svg"></span>
                  <span class="btn-inner--text">Google</span>
                </a>
              </div>
            </div> -->
            <div v-if="!forgetPassword" class="card-body px-lg-5 py-lg-5">
              <!-- <div class="text-center text-muted mb-4">
                <small>Or sign in with credentials</small>
              </div> -->
              <div class="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                <div v-if="failed" class="text-center text-danger mb-2">{{ failed }}</div>
                <form class="needs-validation" @submit.prevent="handleSubmit(loginRequest)">
                  <base-input
                    alternative
                    class="mb-3"
                    name="Username"
                    id="Username"
                    rules="required"
                    prepend-icon="fas fa-user"
                    placeholder="Username"
                    v-model="username"
                  />

                  <base-input alternative
                    class="mb-3"
                    name="password"
                    :rules="{required: true, min: 6}"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                  />

                  <base-checkbox v-model="rememberMe">Remember me</base-checkbox>
                  <div class="text-center">
                    <base-button :disabled="isRequesting" type="primary" native-type="submit" class="my-4">Sign in</base-button>
                  </div>
                </form>
              </validation-observer>
            </div>
            <div v-else class="card-body px-lg-5 py-lg-5">
              <validation-observer ref="forgetPasswordObserver" v-slot="{ invalid, handleSubmit }">
                <div v-if="failed" class="text-center text-danger mb-2">{{ failed }}</div>
                
                <form class="needs-validation" @submit.prevent="handleSubmit(handleForgetPassword)">
                  <base-input
                    type="email"
                    class="mb-3"
                    name="email"
                    id="email"
                    rules="required"
                    prepend-icon="fas fa-envelope"
                    placeholder="e.g. Email address"
                    v-model="email"
                  />

                  <div class="d-flex align-items-center flex-column">
                    <base-button :disabled="isRequesting" type="primary" native-type="submit" class="my-4">
                    Submit
                    <i v-if="isRequesting" class="fas fa-spinner fa-spin"></i>
                  </base-button>
                    <router-link to="/" class=""><small>Back to login</small></router-link>
                  </div>
                </form>
                <div v-if="message" class="text-success mt-3">{{message}}</div>
              </validation-observer>
            </div>
          </div>
          <div class="row mt-3" v-if="!forgetPassword">
            <div class="col-6">
              <router-link to="?forgot-password=1" class="text-light"><small>Forgot password?</small></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from "vuex"
  import { redirectPost } from "~/helpers/auth"
  import appNames from '../appNames'
  export default {
    layout: 'AuthLayout',
    data() {
      return {
        username: '',
        password: '',
        email: '',
        isRequesting: false,
        failed: "",
        rememberMe: false,
        forgetPassword: false,
        message: ''
      };
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
        auth: "auth/auth",
        locale: "auth/locale",
      }),
      loginData() {
        return {
          username: this.username,
          password: this.password
        }
      },
      forgetPasswordData() {
        return {
          email: this.email
        }
      },
      background(){
        let app = process.env.CURRENT_APP;
        let env = process.env.DEPLOYMENT_ENV;
        if(env != 'production'){
          return 'bg-gradient-warning';
        }
        if(app == appNames.getGreenGold)
          return 'bg-gradient-default';
        else
          return "bg-gradient-info"
      }
    },
    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler(newValue, oldValue) {
          if (this.$route && this.$route.query && this.$route.query['forgot-password']) {
            this.forgetPassword = true
            this.$nextTick(()=> {
              if (this.$refs && this.$refs.forgetPasswordObserver) {
                this.$refs.forgetPasswordObserver.reset();
              }
            })
          }else {
            this.message = ""
            this.email = ""
            this.forgetPassword = false
          }
        }
      }
    },
    mounted() {
      console.log(process.env.CURRENT_APP)
      console.log(process.env.NODE_ENV)
      if (this.auth && this.user && this.user.is_active) {
        this.$router.push(process.env.dashboardPath)
      }
    //   document.getElementById('Username').focus()
    },
    methods: {
      redirectPost,

      async loginRequest() {
        this.isRequesting   = true
        const isValid       = this.$refs.observer.validate()
        if (isValid) {
          await this.$store.dispatch('auth/postLogin', this.loginData)
          .then( response => {
            if(response.data.success.account.account.type.value === "customer") {
              this.$store.commit("auth/purgeAuth")
              this.failed = "You are not authorized to be here!"
            } else {
              this.selectedLocale = this.locale
              this.$axios.setToken(`Bearer ${ response.data.success.accessToken }`)
              this.$router.push(process.env.dashboardPath)
              // location.href = process.env.entryPoints.crm + '?token=' + response.data.success.accessToken
              // this.redirectPost(process.env.entryPoints.crm, { token: response.data.success.accessToken })
            }

          }).catch( err => {
            if (err.response) {
                let e   = err.response.data
                this.failed = e.message || e.errors.message
                if (e.errors) {
                   this.$refs.observer.setErrors(e.errors)
                }
            } else {
                this.failed = err
            }
            // this.password  = ""
            this.isRequesting   = false
          })
        } else {
          this.isRequesting   = false
        }
      },
      async handleForgetPassword(){
        this.isRequesting   = true
        const isValid       = this.$refs.forgetPasswordObserver.validate()
        if (isValid) {
          await this.$store.dispatch('users/handleForgetPassword', this.forgetPasswordData)
          .then( response => {
            if (response && response.data && response.data.message) {
              this.message = response.data.message
            }
            this.isRequesting = false
          }).catch( err => {
            if (err.response) {
                let e   = err.response.data
                this.failed = e.message || e.errors.message
                if (e.errors) {
                   this.$refs.forgetPasswordObserver.setErrors(e.errors)
                }
            } else {
                this.failed = err
            }
            this.isRequesting   = false
          })
        } else {
          this.isRequesting   = false
        }
      }
    }
  };
</script>
