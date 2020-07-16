<template>
  <div>

    <div class="header pb-6 d-flex align-items-center profile-header">
      <!-- Mask -->
      <span class="mask bg-gradient-default opacity-8"></span>
      <!-- Header container -->
      <div class="container-fluid d-flex align-items-center">
        <div class="row">
          <div class="col-lg-8 col-md-10">
            <h1 class="display-2 text-white">Hello {{ getName }}</h1>
            <p class="text-white mt-0 mb-5">This is your profile page. You can see the progress you've made with your
              work and manage your projects or assigned tasks</p>
            <nuxt-link :to="'/profile/edit/'+info.id" class="btn btn-neutral">Edit Profile</nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid mt--4">
      <div class="row">
        <div class="col-xl-4 order-xl-2">
          <user-card :resource="resource"></user-card>
          <progress-track-list></progress-track-list>
        </div>
        <div class="col-xl-8 order-xl-1">
          <div class="row">
            <div class="col-lg-6">

              <card gradient="info" class="border-0">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0 text-white">Total traffic</h5>
                    <span class="h2 font-weight-bold mb-0 text-white">350,897</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                      <i class="ni ni-active-40"></i>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-white mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap text-light">Since last month</span>
                </p>
              </card>

            </div>
            <div class="col-lg-6">

              <card gradient="danger" class="border-0">
                <div class="row">
                  <div class="col">
                    <h5 class="card-title text-uppercase text-muted mb-0 text-white">Performance</h5>
                    <span class="h2 font-weight-bold mb-0 text-white">49,65%</span>
                  </div>
                  <div class="col-auto">
                    <div class="icon icon-shape bg-white text-dark rounded-circle shadow">
                      <i class="ni ni-spaceship"></i>
                    </div>
                  </div>
                </div>
                <p class="mt-3 mb-0 text-sm">
                  <span class="text-white mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>
                  <span class="text-nowrap text-light">Since last month</span>
                </p>
              </card>

            </div>
          </div>
          <Form :single-client-data="resource" />
        </div>
      </div>
    </div>
  </div>

    <!-- <div class="card">
        <img
            :src="require('@/static/img/theme/unknown.jpg')"
            alt="user"
            class="rounded-circle"
            width="100"
        />
        <h4 class="card-title mt-3 mb-0">{{ getName() }}</h4>
        <h5 class="text-muted capitalize">{{ getType() }}</h5>
        <div class="mt-3 pt-3">
            <address class="mb-0" v-if="resource.address">
                {{ getAddress() }}
            </address>
            <address class="mb-0" v-if="getChannelInfo('mobile')">
                <br />
                <i class="mdi mdi-cellphone-iphone mr-2"></i>
                {{ getChannelInfo('mobile') }}
            </address>
            <address class="mb-0" v-if="getChannelInfo('email')">
                <br />
                <i class="mdi mdi-email mr-2"></i>
                {{ getChannelInfo('email') }}
            </address>
        </div>
    </div> -->
</template>

<script>
import { mapGetters } from "vuex"
import Form from "@/components/Contacts/Form";
import UserCard from "@/components/Contacts/UserCard";
import ProgressTrackList from '@/components/widgets/ProgressTrackList';

export default {
    components: {
        Form,
        UserCard,
        ProgressTrackList
    },
    props: {
        resource: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            types: "types/types"
        }),
        info() {
            return this.resource && this.resource.customer
        },
        getName() {
            return this.info.name + (this.info.person_data ? ' ' + this.info.person_data.surname : '')
        },
        getType() {
            if (this.types && this.info.account) {
                return Object.keys(this.types).find( k => this.types[k] == this.info.account.type_id )
            }
            return null
        },
        getAddress() {
            return this.info.address ?
                    this.info.address.line1 + (this.info.address.line2 ? ' ' + this.info.address.line2 : '') +
                    (this.info.address.city ? ', ' + this.info.address.city : '') +
                    (this.info.address.region ? ', ' + this.info.address.region : '') +
                    (this.info.address.postal_code ? ', ' + this.info.address.postal_code : '')
                : ''
        },
        getChannelInfo(type) {
            let channel = this.info.channels && this.info.channels.length && this.info.channels.find( c => c.type.value == type )
            if (channel) {
                return channel.value
            }
            return null
        },
    },
    methods: {
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>