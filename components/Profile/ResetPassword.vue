<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 mb-0">

      <!--
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-secondary" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
      -->
    </div>

    <!-- Page content -->
    <div class="container mt--100 mb-8">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card border-0">

            <div class="card-body px-lg-5">

              <div class="display-4 my-4">Reset Password</div>

              <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                <form class="needs-validation" @submit.prevent="handleSubmit(validate)">

                  <div v-if="failed" class="text-center text-danger">{{ failed }}</div>
                  <div v-if="errors" class="text-center text-danger">
                    <li v-for="(error) in errors">
                      {{ error[0] }}
                    </li>
                  </div>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="Current Password"
                    type="password"
                    name="Current password"
                    rules="required"
                    v-model="old_password"
                  />

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="Password"
                    type="password"
                    name="Password"
                    rules="required|min:6"
                    v-model="password"
                  />
                  <p>Password must contain at least one uppercase letter, one special character and one number</p>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="Confirm Password"
                    type="password"
                    name="Confirmation"
                    :rules="password ? 'required|confirmed:Password' : ''"
                    v-model="password_confirmation"
                  />

                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4" :disabled="isRequesting">Save</button>
                    <button class="btn btn-default mt-4" @click.prevent="() => $router.push('/profile')">Cancel</button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>

          <!--
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/profile" class="text-light"><small>Profile</small></router-link>
            </div>
            <div class="col-6 text-right">
              <router-link to="/logout" class="text-light"><small>Logout</small></router-link>
            </div>
          </div>
          -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    data() {
        return {
          password_confirmation: '',
          password: null,
          old_password: null,
          failed: '',
          isRequesting: false,
          errors: null,
        }
    },
    computed: {
      ...mapGetters({
        auth: "auth/auth",
        account: "auth/user",
      }),
    },
    watch: {
    },
    mounted() {
      if (!this.auth || !this.account) {
        this.$router.push('/logout')
      }
    },
    methods: {
      async validate() {
        const isValid = await this.$refs.observer.validate()
        if (isValid && !this.isRequesting) {
          this.changePassword(this.updatedClientData)
        } else {
          this.isRequesting = false
        }
      },
      changePassword() {
        this.isRequesting   = true
        this.$store
          .dispatch("clients/changePassword", {
            "old_password": this.old_password,
            "password": this.password,
            "password_confirmation": this.password_confirmation
          })
          .then(response => {
            this.$router.push('/profile')
            this.$notify({type: 'success', timeout: 5000, message: 'Password changed successfully!'})
          }).catch( err => {
            console.log(err.response.data)
            this.failed = err.response.data.message
            if (err.response.data.errors) {
              this.errors =  err.response.data.errors
              this.$refs.observer.setErrors(err.response.data.errors)
            }
            this.isRequesting   = false
          }).finally(() => {
          })
      }
    }
}
</script>

<style>
  /*
  .profile-header {
    background-image: url(/img/theme/profile-cover.jpg);
    background-size: cover;
    background-position: center top;
    min-height: 580px;
  }
  */
</style>
