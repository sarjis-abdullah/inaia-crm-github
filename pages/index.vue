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
          <div v-if="!showCodeInput" class="card bg-secondary border-0 mb-0">
            <div v-if="!forgetPassword" class="card-body px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>Sign in with credentials</small>
              </div>
              <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                <div v-if="failed" class="text-center text-danger mb-2">{{ failed }}</div>
                <form class="needs-validation" @submit.prevent="handleSubmit(initialLogin)">
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
          <div v-else class="card bg-secondary border-0 mb-0">
            <div class="card-body px-lg-5 py-lg-5">
              <div class="flex flex-row w-full">
                <a @click="closeMfa" class="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    class="h-8 text-blue-500 font-bold"
                    style=""
                  >
                    <path
                      fill-rule="evenodd"
                      d="M20.25 12a.75.75 0 0 1-.75.75H6.31l5.47 5.47a.75.75 0 1 1-1.06 1.06l-6.75-6.75a.75.75 0 0 1 0-1.06l6.75-6.75a.75.75 0 1 1 1.06 1.06l-5.47 5.47H19.5a.75.75 0 0 1 .75.75Z"
                      clip-rule="evenodd"
                    ></path></svg>
                  </a>
              </div>
              <div class="text-center" style="margin-top: 1rem;">
                <div>
                  <img src="~/static/pinscreen.jpg" alt="personal info" class="w-32 h-auto mb-4 mx-auto"/>
                  <h2 class="text-center mb-8 font-normal">
                    <span v-if="primaryResponse?.method">{{$t(getMethodWiseText(primaryResponse.method))}}</span>
                  </h2>              
                </div>
                <template v-if="!isRequesting && !showOnlyLoading">
                  <CodeInputs @complete="verifyMfa" :length="codeInputLength" />
                  <div v-if="alternativeMethods?.length && !isRequesting" class="mt-8">
                    <p>{{ $t('choose_other_confirming_method') }}</p>
                    <ul>
                      <li v-for="(method, index) in alternativeMethods" :key="index" 
                          @click="selectAlternativeMethod(method)" 
                          class="cursor-pointer underline text-blue-500">
                        {{ getMethod(method) }}
                      </li>
                    </ul>
                  </div>
                </template>
                <template v-else>
                  <div class="text-center">
                    <Loader />
                  </div>
                </template>
              </div>
              <!-- <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
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
              </validation-observer> -->
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
  import CodeInputs from "~/components/Users/CodeInputs"
  import Loader from "~/components/common/Loader/Loader.vue"
  import appNames from '../appNames'
  import { CODE_INPUT_LENGTH_FOUR, CODE_INPUT_LENGTH_SIX, CONFIRMATION_METHOD_EMAIL, CONFIRMATION_METHOD_TWO_FA } from '@/helpers/constants.js';
  export default {
    layout: 'AuthLayout',
    components: {
      CodeInputs,
      Loader,
    },
    data() {
      return {
        username: '',
        password: '',
        email: '',
        isRequesting: false,
        failed: "",
        rememberMe: false,
        forgetPassword: false,
        message: '',
        primaryResponse: null,
        codeInputLength: CODE_INPUT_LENGTH_FOUR,
        showCodeInput: false,
        showOnlyLoading: false,
        loginMethod: CONFIRMATION_METHOD_TWO_FA
      };
    },
    computed: {
      ...mapGetters({
        user: "auth/user",
        auth: "auth/auth",
        locale: "auth/locale",
      }),
      loginData() {
        const object = {
          username: this.username,
          password: this.password,
          method: this.loginMethod,
        }
        return object
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
      },
      alternativeMethods(){
        if(this.primaryResponse && this.primaryResponse.alternativeMethods && this.primaryResponse.alternativeMethods.length){
        return this.primaryResponse.alternativeMethods
      }
        return []
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
        const isValid       = this.$refs.observer.validate()
        if (isValid) {
          
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
            console.log(err);
            if (err.response) {
                let e   = err.response.data
                this.failed = e.message || e.errors.message
                if (e.errors) {
                  //  this.$refs.forgetPasswordObserver.setErrors(e.errors)
                }
            } else {
                this.failed = err
            }
            this.isRequesting   = false
          })
        } else {
          this.isRequesting   = false
        }
      },
      async initialLogin(){
        try{
            this.failed = ""
            this.isRequesting   = true
            // const response = await initialLogin(loginData.value);
            const response = await this.$store.dispatch('auth/initialLogin', this.loginData)
            this.showCodeInput = true
            if (response) {
              this.primaryResponse = response.data
              if(response.data.method == CONFIRMATION_METHOD_TWO_FA){
                this.codeInputLength = CODE_INPUT_LENGTH_SIX
              }else{
                this.codeInputLength = CODE_INPUT_LENGTH_FOUR
              }
            }
        }
        catch(err){
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
        }
        finally{
          this.isRequesting   = false
        }
      },
      getMethod(method) {
        switch(method){
          case CONFIRMATION_METHOD_EMAIL:
            return "Email";
          default:
          return "2FA"
        }
      },
      getMethodWiseText (method) {
        if (method == CONFIRMATION_METHOD_EMAIL) {
          return 'email_verify_able_message';
        }
        return 'two_fa_verify_able_message'
      },
      closeMfa(){
        this.showCodeInput = false
        // error.value = null
      },
      selectAlternativeMethod(method) {
        this.loginMethod = method
        initialLogin()
      },
      async verifyMfa(code){
        try{
          console.log(code);
          const token = this.primaryResponse.tempBearerToken
          if (token) {
            this.isRequesting   = true
            const object = {
              pin: code,
              token
            }
            const response = await this.$store.dispatch('auth/verifyMfa', object);
            this.showOnlyLoading = true
            this.primaryResponse = null
            console.log(response.data, 'response.data');
            if(response.data.success.account && response.data.success.account.account && response.data.success.account.account.type.value === "customer") {
              this.$store.commit("auth/purgeAuth")
              this.failed = "You are not authorized to be here!"
            } else {
              this.selectedLocale = this.locale
              this.$axios.setToken(`Bearer ${ response.data.success.accessToken }`)
              console.log(response.data.success, 'response.data.success.accessToken', process.env.dashboardPath);
              this.$router.push(process.env.dashboardPath)
              // location.href = process.env.entryPoints.crm + '?token=' + response.data.success.accessToken
              // this.redirectPost(process.env.entryPoints.crm, { token: response.data.success.accessToken })
            }
          }
        }
        catch(err){
          console.log(err);
          if (err.response) {
                let e   = err.response.data
                this.failed = e.message || e.errors.message
                if (e.errors) {
                  //  this.$refs.observer.setErrors(e.errors)
                }
            } else {
                this.failed = err
            }
            // this.password  = ""
            this.isRequesting   = false
        }
        finally{
          this.isRequesting   = false
        }
      }
    }
  };
</script>
<style scoped>
.w-32 {
  width: 8rem;
} 
.h-auto{
  height: auto;
} 
.mb-5 {
  margin-bottom: 20px;
}
.h-8 {
  height: 2rem;
}
.mb-8 {
  margin-bottom: 2rem !important;
}
.font-normal {
  font-weight: normal;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
