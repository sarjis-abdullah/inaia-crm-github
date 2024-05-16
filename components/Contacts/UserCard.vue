<template>
  <div>

    <div class="card" style="max-height: 30%;">
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
            v-if="hasEditAccess"
          >
            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item" @click.prevent="displayEditAddress">{{ $t("edit_address") }}</a>
            <a class="dropdown-item" @click.prevent="displayEditPhoneNumber">{{ $t("edit_mobile") }}</a>
            <a class="dropdown-item" @click.prevent="displayEditEmail">{{ $t("edit_email") }}</a>
            <a class="dropdown-item" @click.prevent="editSalesAdvisor">{{ $t("edit_salesadvisor") }}</a>
            <a class="dropdown-item" @click.prevent="resetPin">{{ $t("reset_pin") }}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="displaySettings">{{ $t("account_settings") }}</a>


            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="openKycDocument">{{ $t("documents") }}</a>
            <a class="dropdown-item" @click.prevent="uploadDocument" v-if="info.is_verified">{{ $t("upload_document") }}</a>
            <a class="dropdown-item" @click.prevent="verifyCustomerIdentity" v-else>{{ $t("verify_identity") }}</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click.prevent="unLockAccount" v-if="info.is_locked">{{ $t("unlock_account") }}</a>
            <a class="dropdown-item"  @click.prevent="desactvateAccount" v-if="info.is_active">{{ $t("deactivate_account") }}</a>
            <a class="dropdown-item" @click.prevent="activateAccount" v-if="!info.is_active">{{ $t("activate_account") }}</a>
            <a class="dropdown-item" @click.prevent="deleteAccount">{{ $t("delete_account") }}</a>
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
              <div v-if="info.account.referred_by!=null">{{$t('referred_by')}}: <a v-if="info.account.referred_by.referred_by" @click.prevent="openRefrredByLink" class="text-primary pe-auto">{{ info.account.referred_by.referred_by.name }}</a></div>
              <div>{{$t('sales_advisor')}}: {{info.account.sales_advisor?(info.account.sales_advisor.first_name  + ' '+info.account.sales_advisor.last_name):$t('not_assigned')}}</div>
            </div>

          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.person_data">

            <div class="person_data text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('person_data')}}</div>
              <div>{{$t('gender')}}: <i v-if="info.person_data" class="lnir ml-1" :class="`${info.person_data.gender == 'male' ? 'lnir-male rotate-45' : 'lnir-female lnir-rotate-180'}`" /></div>
              <div>{{$t('birthdate')}}: {{$d(new Date(info.person_data.birthdate),'narrow')}}</div>
              <div>{{$t('birthplace')}}: {{ info.person_data.birth_place }}</div>
              <div>{{$t('nationality')}}: {{ (info.person_data && info.person_data.nationality_details ? info.person_data.nationality_details.nationality_translation_key : '' ) }}</div>
            </div>

          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.address">

            <div class="address text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('address_data')}}</div>
              <div v-if="info.address && info.address.line1"><i class="lnir lnir-map-marker mr-2 text-muted" />{{info.address.line1}}</div>
              <div v-if="info.address && info.address.line2" class="pl-4">{{info.address.line2}}</div>
              <div><i class="lnir lnir-map mr-2 text-muted" />{{info.address.postal_code}} {{info.address.city}}</div>
              <div><i class="lnir lnir-global mr-2 text-muted" />{{ (info.address.region ? info.address.region + ', ' : '' ) + getCountryName(info)}}</div>
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
    <EditSalesAdvisor :showModal="showEditSalesAdvisor" :customer="this.info" @cancelEditAdvisor="cancelEditSalesAdvisor"/>
    <EditPhoneNumber :showModal="showEditPhoneNumber" :customer="this.info" @cancelEdit="cancelEditPhoneNUmber" :phone="getChannelInfo('mobile')"/>
    <EditEmail :showModal="showEditEmail" :customer="this.info" @cancelEdit="cancelEditEmail" :email="getChannelInfo('email')"/>
    <AccountSettings :showModal="showSettings" :settings="this.info.account.settings" @closed="closeSettings" />

    <KycDocumentList :showModal="showKycDocument" :account_id="info.account.id" @closed="closeKycDocument"/>
    <VerifyContact :showModal="showVerifyContact" :account_id="info.id" @closed="closeCustomerIdentity" :client="info"/>
    <UploadDocuments :showUploadDialog="showUploadDocument" :contactId="info.id" @canceled="closeUploadDocument"/>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import EditAddress from '@/components/Contacts/EditAddress';
import EditPhoneNumber from '@/components/Contacts/EditPhoneNumber';
import EditEmail from '@/components/Contacts/EditEmail';
import EditSalesAdvisor from "@/components/Contacts/EditSalesAdvisor.vue";
import AccountSettings from '@/components/Contacts/AccountSettings';
import CommentBox from '@/components/Comment/CommentBox';
import KycDocumentList from "@/components/Contacts/KycDocumentList";
import VerifyContact from '@/components/Contacts/VerifyContact';
import UploadDocuments from "@/components/Contacts/UploadDocuments.vue";
import {  MessageBox } from 'element-ui'
import {functionUpdateAccountAndGetObject} from '@/helpers/customer';
import { canEditCustomers } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
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
      CommentBox,
      KycDocumentList,
      VerifyContact,
      EditSalesAdvisor,
      UploadDocuments
    },
    mounted(){
      this.$confirm = MessageBox.confirm
    },
    computed: {
        info() {
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
          let text = ''
          if (this.info.address) {
            if (this.info.address.line1) {
              text += this.info.address.line1 + "\n"
            }
            if (this.info.address.line2) {
              text += this.info.address.line2
            }
            text += (this.info.address.postal_code ? '<br>' + this.info.address.postal_code : '') +
            (this.info.address.city ? ' ' + this.info.address.city : '') +
            (this.info.address.region ? '<br>' + this.info.address.region : '') +
            (this.info.address.country ? '<br>' + this.info.address.country.name_translation_key : '')
          }
          return text
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
        },
        hasEditAccess(){
          return canEditCustomers();
        }
    },
    data(){
      return {
        showEditAddress:false,
        showEditPhoneNumber:false,
        showEditEmail: false,
        showSettings: false,
        showComments: false,
        showKycDocument: false,
        showVerifyContact:false,
        showEditSalesAdvisor:false,
        showUploadDocument : false
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
      },
      openKycDocument(){
        this.showKycDocument = true;
      },
      closeKycDocument(){
        this.showKycDocument = false;
      },
      verifyCustomerIdentity(){
        this.showVerifyContact = true
      },
      closeCustomerIdentity(){
        this.showVerifyContact = false
      },
      uploadDocument(){
        this.showUploadDocument = true;
      },
      closeUploadDocument(){
        this.showUploadDocument = false;
      },
      resetPin(){
        this.$confirm(this.$t('are_you_sure_you_want_to_reset_account_pin'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.confirmResetPin();
        });
      },
      openRefrredByLink(){
        if(this.info && this.info.account && this.info.account.referred_by && this.info.account.referred_by.referred_by){
          const contactId = this.info.account.referred_by.referred_by.contract_id
          const link = "http://"+window.location.host+"/customers/details/"+contactId;
          window.open(link,'__blank');

        }
      },
      confirmResetPin(){
        this.$store.dispatch('clients/resetAccountPin',this.info.account.id).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('pin_account_reset_successfully'),
          });
        }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
        })
      },
      desactvateAccount(){
        this.$confirm(this.$t('are_you_sure_you_want_to_desactivate_account'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.confirmDesAccount();
        });
      },
      confirmDesAccount(){
        let newAccount = JSON.parse(JSON.stringify(this.info.account));
        newAccount.is_active = 0;
        const data = functionUpdateAccountAndGetObject(this.info,newAccount)
        this.$store.dispatch('clients/submitClient',data).then((res)=>{
          this.$store.dispatch("clients/clientDetailsData", this.info.id)
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('account_desactivated_successfully'),
          });
        }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
        });
      },
      activateAccount(){
        this.$confirm(this.$t('are_you_sure_you_want_to_activate_account'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.confirmActAccount();
        });
      },
      confirmActAccount(){
        let newAccount = JSON.parse(JSON.stringify(this.info.account));
        newAccount.is_active = 1;
        const data = functionUpdateAccountAndGetObject(this.info,newAccount)
        this.$store.dispatch('clients/submitClient',data).then((res)=>{
          this.$store.dispatch("clients/clientDetailsData", this.info.id)
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('account_activated_successfully'),
          });
        }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
        });
      },
      unLockAccount(){
        this.$confirm(this.$t('are_you_sure_you_want_to_unlock_account'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.confirmUnlockAccount();
        });
      },
      getCountryName(info){
        if(info && info.address && info.address.country)
        {
          return info.address.country.name_translation_key;
        }
        else{
          return "";
        }
      },
      confirmUnlockAccount(){
        let newAccount = JSON.parse(JSON.stringify(this.info.account));
        newAccount.is_locked = 0;
        const data = functionUpdateAccountAndGetObject(this.info,newAccount)
        this.$store.dispatch('clients/submitClient',data).then((res)=>{
          this.$store.dispatch("clients/clientDetailsData", this.info.id)
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('account_unlock_successfully'),
          });
        }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
        });
      },
      cancelEditSalesAdvisor(){
        this.showEditSalesAdvisor = false;
      },
      editSalesAdvisor (){
        this.showEditSalesAdvisor = true;
      },
      deleteAccount(){
        this.$confirm(this.$t('are_you_sure_you_want_to_delete_this_account_permanently'),'danger',{
            confirmButtonText: this.$t('ok'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning'
          }).then(() => {
           this.$store.dispatch('clients/deleteAccountPermanently',this.info.account.id).then(()=>{
            this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t("client_deleted_successfully"),
            });
            setTimeout(()=>{
              window.close()
            },6000)
           }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
           });
          }).catch((err) => {
            apiErrorHandler(err,this.$notify);
          });
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
