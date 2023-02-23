<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">

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
        <div class="col-lg-6 col-md-8">
          <div class="card border-0">

            <div class="card-body px-lg-5">

              <div class="display-4 my-4">Edit Profile</div>

              <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                <form class="needs-validation" @submit.prevent="handleSubmit(validate)">

                  <div v-if="failed" class="text-center text-danger">{{ failed }}</div>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="fas fa-user"
                    mode="lazy"
                    placeholder="username"
                    id="Username"
                    name="Username"
                    rules="required"
                    v-model="customer.account.account_number"
                  />

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="example@email.com"
                    type="email"
                    name="Email"
                    rules="required|email"
                    v-model="customer.channels.email.value"
                  />

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="password"
                    type="password"
                    name="Password"
                    rules="min:5"
                    v-model="customer.account.password"
                  />

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="confirm password"
                    type="password"
                    name="Confirmation"
                    :rules="customer.account.password ? 'required|confirmed:Password' : ''"
                    v-model="password_confirmation"
                  />

                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4" :disabled="isRequesting">Save</button>
                    <button class="btn btn-default mt-4" @click="() => $router.go(-1)">Cancel</button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-6">
              <router-link to="/services" class="text-light"><small>Service Dashboard</small></router-link>
            </div>
            <div class="col-6 text-right">
              <router-link to="/logout" class="text-light"><small>Logout</small></router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
    layout: 'AuthLayout',
    data() {
        return {
          customerId: this.$route.params.id,
          customer: {
            type_id: 0,
            is_active: 1,
            account: {
                type_id: 0,
                is_active: 0,
            },
            person_data: {
                nationality: {}
            },
            address: {
                type_id: 0,
                is_primary: 1,
                is_active: 1,
            },
            channels: {
                email: {},
                mobile: {}
            }
          },
          password_confirmation: '',
          failed: '',
          isRequesting: false
        }
    },
    computed: {
      ...mapGetters({
        singleClientData: "clients/singleClientData",
      }),
      updatedClientData() {
        return {
          id: this.customer.id,
          customer: {
            contact: {
              id: this.customer.id,
              name: this.customer.name,
              type_id: this.customer.type_id,
              is_active: this.customer.is_active
            },
            person_data: {
              ...this.customer.person_data,
              contact_id: this.customer.id
            },
            address: {
              ...this.customer.address,
              contact_id: this.customer.id
            },
            account: {
              ...this.customer.account,
              contact_id: this.customer.id,
              username: this.customer.account.account_number
            },
            channels: this.customer.channels
          }
        }
      }
    },
    watch: {
      customerId: {
        handler() {
          if (this.customerId) {
            this.initClientData()
          }
        },
        immediate: true
      },
      singleClientData: {
        handler(value) {
          if (this.singleClientData) {
            Object.keys(value).forEach(key => {
              if (this[key] !== undefined) {
                this.$set(this, key, JSON.parse(JSON.stringify(value[key])))
              }
            })
            this.customer.channels  = this.filterChannels(this.customer.channels)
          }
        },
        immediate: true
      },
    },
    mounted() {
      if (!this.$store.getters['auth/auth']) {
        this.$router.push('/logout')
      }
    },
    methods: {
      initClientData() {
        this.$axios.setToken(`Bearer ${ this.$store.getters['auth/auth'] }`)
        this.$store.dispatch("clients/clientDetailsData", this.customerId)
      },
      async validate() {
        const isValid       = await this.$refs.observer.validate()
        if (isValid && !this.isRequesting) {
          this.submitClient(this.updatedClientData)
        } else {
          console.log('invalid request')
          this.isRequesting   = false
        }
      },
      submitClient(data) {
        this.isRequesting   = true

        this.$store
          .dispatch("clients/submitClient", data)
          .then(response => {
            // location.href   = document.referrer
            this.$router.go(-1)
          }).catch( err => {
            this.failed = err.response.data.message
            this.$refs.observer.setErrors(err.response.data.errors)
            this.isRequesting   = false
          }).finally(() => {
          })
      },
      filterChannels(obj) {
        if (obj && Array.isArray(obj) && obj.length) {
          let channels  = {}
          obj.forEach(channel => {
            channels[channel.type.value]  = channel
          })
          return {
            email:{},
            mobile: {},
            ...channels
          }
        }
        return {
          email:{},
          mobile: {}
        }
      }
    }
}
</script>
