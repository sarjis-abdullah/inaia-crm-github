<template>
  <div>

    <base-header class="pb-5">
      <div class="row align-items-center py-4">

        <div class="col-lg-6 col-7">

          <h6 class="h2 text-white d-inline-block mb-0">{{$t('customer') + ' '+$t('number_short') + ' ' + getAccountNumber }}</h6>

        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral" @click.prevent="() => $router.push('/customers/edit/'+info.id)">Edit Profile</base-button>
        </div>

      </div>
    </base-header>

    <div class="container-fluid mt--5">

      <div class="row">
        <div class="col">

          <div class="card">
            <div class="card-body">

              <div class="media align-items-center border-bottom mb-2 pb-4">
                <div class="avatar rounded-circle mr-3 mb-0">
                  <img :src="avatar" alt="" />
                </div>

                <div>
                  <div class="h1 mb-0">{{ getName }}</div>
                  <div>
                    <span class="mr-2"><i class="fa mr-1" :class="`${info.is_verified ? 'fa-check-circle text-success' : 'fa-times text-danger'}`"></i>{{ info.is_verified ? $t('verified') : $t('not_verified') }}</span>
                  </div>
                </div>
              </div>

              <div class="position-absolute" style="right: 1.5rem; top:1.5rem;">
                <base-dropdown
                  title-classes="btn btn-sm btn-neutral mr-0"
                  menu-on-right
                  :has-toggle="false"
                >
                  <template slot="title">
                    <i class="fas fa-ellipsis-h"></i>
                  </template>

                  <a class="dropdown-item" href="#">{{ $t("edit_address") }}</a>
                  <a class="dropdown-item" href="#">{{ $t("edit_mobile") }}</a>
                  <a class="dropdown-item" href="#">{{ $t("edit_email") }}</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">{{ $t("kyc_documents") }}</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#" v-if="info.is_locked">{{ $t("unlock_account") }}</a>
                  <a class="dropdown-item" href="#" v-if="info.is_active">{{ $t("deactivate_account") }}</a>
                  <a class="dropdown-item" href="#" v-if="!info.is_active">{{ $t("activate_account") }}</a>
                </base-dropdown>
              </div>


              <div class="row">
                <div class="col-sm-6 col-xl-3">

                  <div class="account_data mt-3" v-if="info.account">
                    <div class="h5 text-muted text-uppercase ls-1">{{$t('account_data')}}</div>
                    <div>{{$t('created_at')}}: </div>
                    <div>{{$t('referral_code')}}: {{info.account.referral_code}}</div>
                    <div>{{$t('mobile_pin')}}: {{info.account.pin_length > 0 ? '*'.repeat(parseInt(info.account.pin_length)) : $t('not_set') }}</div>
                    <div>{{$t('status')}}:
                      <badge :type="`${info.is_active ? 'success' : 'danger'}`" class="ml-1">{{info.is_active ? $t('active') : $t('inactive')}}</badge>
                      <badge v-if="info.is_locked" type="danger" class="ml-1"><i class="lnir lnir-lock-alt"></i>{{$t('locked')}}</badge>
                    </div>
                  </div>

                </div>
                <div class="col-sm-6 col-xl-3">

                  <div class="person_data mt-3" v-if="info.person_data">
                    <div class="h5 text-muted text-uppercase ls-1">{{$t('person_data')}}</div>
                    <div>{{$t('gender')}}: <i v-if="info.person_data" class="lnir ml-1" :class="`${info.person_data.gender == 'male' ? 'lnir-male rotate-45' : 'lnir-female lnir-rotate-180'}`" /></div>
                    <div>{{$t('birthdate')}}: {{$d(new Date(info.person_data.birthdate),'narrow')}}</div>
                    <div>{{$t('birthplace')}}: </div>
                    <div>{{$t('nationality')}}: </div>
                  </div>

                </div>
                <div class="col-sm-6 col-xl-3">

                  <div class="address mt-3" v-if="info.address">
                    <div class="h5 text-muted text-uppercase ls-1">{{$t('address_data')}}</div>
                    <div><i class="lnir lnir-map-marker mr-2 text-muted" />{{info.address.line1}}</div>
                    <div v-if="info.address.line2" class="pl-4">{{info.address.line2}}</div>
                    <div><i class="lnir lnir-map mr-2 text-muted" />{{info.address.postal_code}} {{info.address.city}}</div>
                    <div><i class="lnir lnir-global mr-2 text-muted" />{{ (info.address.region ? info.address.region + ', ' : '' ) + info.address.country.name_translation_key}}</div>
                  </div>

                </div>
                <div class="col-sm-6 col-xl-3">
                  <div class="contact mt-3" v-if="info.channels">
                    <div class="h5 text-muted text-uppercase ls-1">{{$t('contact_data')}}</div>
                    <div class="text-nowrap"><i class="lnir lnir-mobile-alt-1 mr-2 text-muted" />{{ getChannelInfo('mobile') }}</div>
                    <div class="text-nowrap"><i class="lnir lnir-envelope mr-2 text-muted" />{{ getChannelInfo('email') }}</div>
                  </div>
                </div>
              </div>

            </div>


          </div>

        </div>

      </div>


      <div>- Account settings (language, allow_marketing, privacy)</div>
      <div>- Products and specs</div>
      <div>- Money account</div>
      <div>- Cards</div>
      <div>- Depots</div>
      <div>- Orders</div>



      <div class="row">
        <div class="col-xl-4 order-xl-2">
          <user-card :resource="resource"></user-card>
          <products />
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
          <!-- <Form :single-client-data="resource" /> -->
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
import Products from '@/components/Contacts/Products';

export default {
    components: {
        Form,
        UserCard,
        Products
    },
    props: {
        resource: {
            type: Object
        }
    },
    computed: {
        ...mapGetters({
            types: "types/pairs"
        }),
        info() {
            console.log('resource', this.resource)
            return this.resource && this.resource.customer;
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
        getAccountNumber() {
            if (this.info.account) return this.info.account.account_number;
            else return false;
        },
        getAddress() {
            return this.info.address ?
                this.info.address.line1 +
                (this.info.address.line2 ? "\n" + this.info.address.line2 : '') +
                (this.info.address.postal_code ? '<br>' + this.info.address.postal_code : '') +
                (this.info.address.city ? ' ' + this.info.address.city : '') +
                (this.info.address.region ? '<br>' + this.info.address.region : '') +
                (this.info.address.country ? '<br>' + this.info.address.country.name_translation_key : '')
                : ''
        },
        avatar() {
          if (this.info && this.info.avatar) return this.info.avatar;
          else if (this.info && this.info.person_data) {
            let gender = this.info.person_data.gender ? this.info.person_data.gender.toLowerCase() : ''
            if (gender == 'female' || gender == 'f') {
              return '/img/theme/avatar_f.png'
            }
          }
          return '/img/theme/avatar_m.png'
        },

    },
    methods: {
      getChannelInfo(type) {
        let channel = this.info.channels && this.info.channels.length && this.info.channels.find( c => c.type.value == type )
        if (channel) {
          return channel.value
        }
        return null
      }

    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
.avatar {
  width: 80px;
  min-width: 80px;
  height: 80px;
  min-height: 80px;
  overflow: hidden;
  align-items: unset;
}
.avatar img {
  object-fit: cover;
}
.rotate-45 {
  filter: none;
  transform: rotate(45deg);
}
</style>
