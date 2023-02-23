<template>
  <div>

    <div class="card">
      <div class="card-body">

        <div class="media align-items-center border-bottom mb-2 pb-4">
          <div class="profile avatar rounded-circle mr-3 mb-0">
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
            title-classes="btn btn-sm btn-link mr-0"
            menu-on-right
            :has-toggle="false"
          >
            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item" @click.prevent="displayEditAddress">{{ $t("edit_address") }}</a>
            <a class="dropdown-item" @click.prevent="displayEditPhoneNumber">{{ $t("edit_mobile") }}</a>
            <a class="dropdown-item" @click.prevent="displayEditEmail">{{ $t("edit_email") }}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="displaySettings">{{ $t("account_settings") }}</a>
            <a class="dropdown-item" @click.prevent="displayComments">{{ $t("account_notes") }}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">{{ $t("kyc_documents") }}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" v-if="info.is_locked">{{ $t("unlock_account") }}</a>
            <a class="dropdown-item" href="#" v-if="info.is_active">{{ $t("deactivate_account") }}</a>
            <a class="dropdown-item" href="#" v-if="!info.is_active">{{ $t("activate_account") }}</a>
          </base-dropdown>
        </div>


        <div class="row">
          <div class="col-sm-6 _col-xl-3" v-if="info.account">

            <div class="account_data text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('account_data')}}</div>
              <div>{{$t('status')}}:
                <badge :type="`${info.is_active ? 'success' : 'danger'}`" class="ml-1">{{info.is_active ? $t('active') : $t('inactive')}}</badge>
                <badge v-if="info.is_locked" type="danger" class="ml-1"><i class="lnir lnir-lock-alt"></i>{{$t('locked')}}</badge>
              </div>
              <div>{{$t('created_at')}}: {{info.account.created_at ? $d(new Date(info.account.created_at),'narrow') : ''}}</div>
              <div>{{$t('mobile_pin')}}: {{info.account.pin_length > 0 ? '*'.repeat(parseInt(info.account.pin_length)) : $t('not_set') }}</div>
              <div>{{$t('referral_code')}}: {{info.account.referral_code}}</div>
            </div>

          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.person_data">

            <div class="person_data text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('person_data')}}</div>
              <div>{{$t('gender')}}: <i v-if="info.person_data" class="lnir ml-1" :class="`${info.person_data.gender == 'male' ? 'lnir-male rotate-45' : 'lnir-female lnir-rotate-180'}`" /></div>
              <div>{{$t('birthdate')}}: {{$d(new Date(info.person_data.birthdate),'narrow')}}</div>
              <div>{{$t('birthplace')}}: </div>
              <div>{{$t('nationality')}}: {{ (info.person_data && info.person_data.nationality_details ? info.person_data.nationality_details.nationality_translation_key : '' ) }}</div>
            </div>

          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.address">

            <div class="address text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('address_data')}}</div>
              <div><i class="lnir lnir-map-marker mr-2 text-muted" />{{info.address.line1}}</div>
              <div v-if="info.address.line2" class="pl-4">{{info.address.line2}}</div>
              <div><i class="lnir lnir-map mr-2 text-muted" />{{info.address.postal_code}} {{info.address.city}}</div>
              <div><i class="lnir lnir-global mr-2 text-muted" />{{ (info.address.region ? info.address.region + ', ' : '' ) + info.address.country.name_translation_key}}</div>
            </div>

          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.channels">
            <div class="contact text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('contact_data')}}</div>
              <div class="text-nowrap"><i class="lnir lnir-mobile-alt-1 mr-2 text-muted" />{{ getChannelInfo('mobile') }}</div>
              <div class="text-nowrap"><i class="lnir lnir-envelope mr-2 text-muted" />{{ getChannelInfo('email') }}</div>
            </div>
          </div>
        </div>

      </div>


    </div>
    <EditAddress :showModal="showEditAddress" :customer="this.info" @cancelEdit="cancelEditAddress"/>
    <EditPhoneNumber :showModal="showEditPhoneNumber" :customer="this.info" @cancelEdit="cancelEditPhoneNUmber" :phone="getChannelInfo('mobile')"/>
    <EditEmail :showModal="showEditEmail" :customer="this.info" @cancelEdit="cancelEditEmail" :email="getChannelInfo('email')"/>
    <AccountSettings :showModal="showSettings" :settings="this.info.account.settings" @closed="closeSettings" />
    <CommentBox :displayModal="showComments" :account="info" @closed="closeComments"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import EditAddress from '@/components/Contacts/EditAddress';
import EditPhoneNumber from '@/components/Contacts/EditPhoneNumber';
import EditEmail from '@/components/Contacts/EditEmail';
import AccountSettings from '@/components/Contacts/AccountSettings';
import CommentBox from '@/components/Comment/CommentBox';
export default {
    props: {
        resource: {
            type: Object
        }
    },
    components:{
      EditAddress,
      EditPhoneNumber,
      EditEmail,
      AccountSettings,
      CommentBox
    },
    computed: {
        info() {
          //console.log('resource', this.resource)
          return this.resource && this.resource.customer;
        },
        getName() {
          return this.info.name + (this.info.person_data ? ' ' + this.info.person_data.surname : '')
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
        firstName() {
            return (this.info && this.info.name) || ''
        },
        surName() {
            return (this.info && this.info.person_data && this.info.person_data.surname) || ''
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
    data(){
      return {
        showEditAddress:false,
        showEditPhoneNumber:false,
        showEditEmail: false,
        showSettings: false,
        showComments: false
      }

    },
    methods: {
      getChannelInfo(type) {
        let channel = this.info.channels && this.info.channels.length && this.info.channels.find( c => c.type.value == type )
        if (channel) {
          return channel.value
        }
        return null
      },
      displayEditAddress(){
        this.showEditAddress = true;
      },
      cancelEditAddress(){
        this.showEditAddress = false;
      },
      displayEditPhoneNumber(){
        this.showEditPhoneNumber = true;
      },
      cancelEditPhoneNUmber(){
        this.showEditPhoneNumber = false;
      },
      displayEditEmail(){
        this.showEditEmail = true;
      },
      cancelEditEmail(){
        this.showEditEmail = false;
      },
      displaySettings(){
        this.showSettings = true;
      },
      closeSettings(){
        this.showSettings = false;
      },
      displayComments(){
        this.showComments = true;
      },
      closeComments(){
        this.showComments = false;
      }

    }

}
</script>

<style scoped>

  .profile {
    width: 90px;
    min-width: 90px;
    height: 90px;
    min-height: 90px;
    overflow: hidden;
    align-items: unset;
  }
  .profile img {
    object-fit: cover;
  }
  .rotate-45 {
    filter: none;
    transform: rotate(45deg);
  }

</style>
