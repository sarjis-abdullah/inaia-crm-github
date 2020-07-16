<template>
  <div>
    <!-- Header -->

    <!--<div class="header profile-header">-->
    <div class="header bg-gradient-info py-7 py-lg-8 pt-lg-9">

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

    <div class="container mt--4 mt-lg-6">

      <div class="card card-profile shadow mt--300 ">
        <div class="px-4">
          <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
              <div class="card-profile-image">
                <a href="#">
                  <img :src="avatar" class="rounded-circle">
                </a>
              </div>
            </div>
          </div>

          <div class="text-center border-0 pt-7 pt-lg-4 pb-0 pb-md-4">
            <div class="d-flex justify-content-center justify-content-lg-end">
              <!-- <nuxt-link to="/profile/edit" class="btn btn-sm btn-primary mr-4 ">Edit Data</nuxt-link>
              <nuxt-link to="/profile/reset-password" class="btn btn-sm btn-primary float-right">Change Password</nuxt-link> -->
            </div>
          </div>

          <div class="col-lg-4 order-lg-1">
            <!--
            <div class="card-profile-stats d-flex justify-content-center">
              <div>
                <span class="heading">22</span>
                <span class="description">Friends</span>
              </div>
              <div>
                <span class="heading">10</span>
                <span class="description">Photos</span>
              </div>
              <div>
                <span class="heading">89</span>
                <span class="description">Comments</span>
              </div>
            </div>
            -->
          </div>

          <div class="text-center mt-5 mt-md-4 mt-lg-3">
            <h1>{{ firstName }} {{ surName }}<!--<span class="font-weight-light" v-if="age">, {{ age }}</span>--></h1>
            <div class="h4 font-weight-300"><i class="ni ni-pin-3 mr-2"></i>{{ address }}</div>
            <!--
            <div class="h4 mt-4"><i class="ni business_briefcase-24 mr-2"></i>Solution Manager - Creative Tim Officer</div>
            <div><i class="ni education_hat mr-2"></i>University of Computer Science</div>
            -->
          </div>
          <div class="mt-5 py-5 border-top text-center">
            <div class="row justify-content-center">
              <div class="col-lg-9">
                <!--
                <p>An artist of considerable range, Ryan — the name taken by Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs and records all of his own music, giving it a warm, intimate feel with a solid groove structure. An artist of considerable range.</p>
                <a href="javascript:;">Show more</a>
                -->

                <!-- <p>Your Apps and Services</p>

                <div class="row justify-content-center shortcuts">
                  <a :href="crm" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-users fa-2x"></i></span> <small>CRM</small></a>
                  <a :href="golddinar" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-coins fa-2x"></i></span> <small>Gold Dinar</small></a>
                  <a :href="admin" class="col-lg-3 shortcut-item"><span class="shortcut-media avatar avatar-xl bg-gradient-info"><i class="fas fa-cog fa-2x"></i></span> <small>Admin Panel</small></a>
                </div> -->

              </div>
            </div>
          </div>
        </div>
      </div>

      <!--
      <div class="row mt-3">
        <div class="col-6">
            <router-link to="/services"><small>Service Dashboard</small></router-link>
        </div>
        <div class="col-6 text-right">
            <router-link to="/logout"><small>Logout</small></router-link>
        </div>
      </div>
      -->

    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"

export default {
    props: {
        resource: {
            type: Object
        }
    },
    computed: {
        // ...mapGetters({
        //     auth: "auth/auth",
        //     account: "auth/account",
        //     contact: "clients/singleClientData"
        // }),
        // crm() {
        //   return process.env.entryPoints.crm + '?token=' + this.auth
        // },
        // admin() {
        //   return process.env.entryPoints.admin + '?token=' + this.auth
        // },
        // golddinar() {
        //   return process.env.entryPoints.golddinar + '?token=' + this.auth
        // },
        info() {
            // return this.contact && this.contact.customer
            return this.resource && this.resource.customer
        },
        avatar() {
            if (this.info) {
                if (!this.info.avatar && this.info.person_data) {
                    let gender    = this.info.person_data.gender && this.info.person_data.gender.toLowerCase()
                    if (gender == 'female' || gender == 'f') {
                        return '/img/theme/avatar_f.png'
                    }
                } else if (this.info.avatar) {
                    return process.env.s3BucketUri + this.info.avatar
                }
            }
            return '/img/theme/avatar_m.png'
        },
        firstName() {
            return (this.info && this.info.name) || ''
        },
        surName() {
            return (this.info && this.info.person_data && this.info.person_data.surname) || ''
        },
        address() {
            let city = (this.info && this.info.address && this.info.address.city) || '',
                country = (this.info && this.info.address && this.info.address.country && this.info.address.country.name_translation_key) || ''
            return city && country ? city + ', ' + country : city + '' + country
        },
        age() {
            let birthDate   = new Date((this.info && this.info.person_data && this.info.person_data.birthdate) || null),
                today       = new Date(),
                age         = today.getFullYear() - birthDate.getFullYear(),
                monthDiff   = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            return age
        }
    },
    // mounted() {
    //     if (!this.auth || !this.account) {
    //         this.$router.push('/logout')
    //     }
    //     this.initClientData()
    // },
    // methods: {
    //     initClientData() {
    //         this.$axios.setToken(`Bearer ${ this.auth }`)
    //         this.$store.dispatch("clients/clientDetailsData", this.account.id)
    //     },
    // }

}
</script>
