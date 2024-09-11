<template>
  <div>
    <div class="card" style="max-height: 30%">
      <div class="card-body">
        <div
          class="media align-items-center border-bottom mb-2 pb-4"
          v-if="userData"
        >
          <div class="profile avatar rounded-circle mr-3 mb-0">
            <img :src="userData.avatar" alt="" />
          </div>

          <div>
            <div class="h1 mb-0">{{ userData.getName }}</div>
            <div>
              <span class="mr-2"
                ><i
                  class="fa mr-1"
                  :class="`${
                    info.is_verified
                      ? 'fa-check-circle text-success'
                      : 'fa-times text-danger'
                  }`"
                ></i
                >{{
                  info.is_verified ? $t("verified") : $t("not_verified")
                }}</span
              >
            </div>
            <div
              v-if="info.verifier_account_id"
              class="d-flex text-sm"
              style="gap: 0.25rem"
            >
              <span>{{ $t("verified_by") }}:</span>
              <UserInfo :accountId="info.verifier_account_id" :isLazy="true" />
            </div>
            <div
              v-if="info.verified_at"
              class="d-flex text-sm"
              style="gap: 0.25rem"
            >
              <span>{{ $t("verified_at") }}:</span>
              <span>{{
                formatDateByMoment(info.verified_at, "YYYY-MM-DD HH:MM:SS")
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="position-absolute"
          style="right: 1.5rem; top: 1.5rem"
          v-if="info"
        >
          <base-dropdown
            title-classes="btn btn-sm btn-link mr-0"
            menu-on-right
            :has-toggle="false"
            v-if="hasEditAccess"
          >
            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>
            <a class="dropdown-item" @click.prevent="resetPin">{{
              $t("reset_pin")
            }}</a>
            <a class="dropdown-item" @click.prevent="resetPassword">{{
              $t("reset_password")
            }}</a>
          </base-dropdown>
        </div>

        <div class="row" v-if="info">
          <div class="col-sm-6 _col-xl-3" v-if="info.account">
            <div class="account_data text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">
                {{ $t("account_data") }}
              </div>
              <div>
                {{ $t("status") }}:
                <badge
                  :type="`${info.is_active ? 'success' : 'danger'}`"
                  class="ml-1"
                  >{{ info.is_active ? $t("active") : $t("inactive") }}</badge
                >
                <badge v-if="info.is_locked" type="danger" class="ml-1"
                  ><i class="lnir lnir-lock-alt"></i>{{ $t("locked") }}</badge
                >
              </div>
              <div>
                {{ $t("created_at") }}:
                {{
                  info.account.created_at
                    ? $d(new Date(info.account.created_at), "narrow")
                    : ""
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.person_data">
            <div class="person_data text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">
                {{ $t("person_data") }}
              </div>
              <div>
                {{ $t("gender") }}:
                <span v-if="info.person_data">{{
                  $t(info.person_data.gender)
                }}</span>
              </div>
              <div>
                {{ $t("birthdate") }}:
                {{ $d(new Date(info.person_data.birthdate), "narrow") }}
              </div>
              <div>
                {{ $t("birthplace") }}: {{ info.person_data.birth_place }}
              </div>
              <div>
                {{ $t("nationality") }}:
                {{
                  userData.nationality
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.address">
            <div class="address text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">
                {{ $t("address_data") }}
              </div>
              <div v-if="info.address && info.address.line1">
                <i class="lnir lnir-map-marker mr-2 text-muted" />{{
                  info.address.line1
                }}
              </div>
              <div v-if="info.address && info.address.line2" class="pl-4">
                {{ info.address.line2 }}
              </div>
              <div>
                <i class="lnir lnir-map mr-2 text-muted" />{{
                  info.address.postal_code
                }}
                {{ info.address.city }}
              </div>
              <div>
                <i class="lnir lnir-global mr-2 text-muted" />{{
                  (info.address.region ? info.address.region + ", " : "") +
                  userData.getCountryName
                }}
              </div>
            </div>
          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.channels">
            <div class="contact text-sm mt-3">
              <div class="h5 text-muted text-uppercase ls-1">
                {{ $t("contact_data") }}
              </div>
              <div class="text-nowrap">
                <i class="lnir lnir-mobile-alt-1 mr-2 text-muted" />{{
                  userData.mobile
                }}
              </div>
              <div class="text-nowrap">
                <i class="lnir lnir-envelope mr-2 text-muted" />{{
                  userData.email
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import { formatDateByMoment } from "@/helpers/date";
import { canEditCustomers } from "@/permissions";
import { apiErrorHandler } from '@/helpers/apiErrorHandler';
import { useUserDetails } from "@/helpers/useUserDetails";

export default {
  props: {
    resource: {
      type: Object,
    },
  },
  components: {
  },
  mounted() {
    this.$confirm = MessageBox.confirm;
  },
  computed: {
    info() {
      return this.resource;
    },
    userData() {
      if (!this.resource) {
        return null;
      }
      return this.useUserDetails(this.resource);
    },
    hasEditAccess() {
      return canEditCustomers();
    },
  },
  data() {
    return {
      showEditAddress: false,
    };
  },
  methods: {
    formatDateByMoment,
    useUserDetails,
    resetPin() {
      this.$confirm(
        this.$t("are_you_sure_you_want_to_reset_account_pin"),
        "Warning",
        {
          confirmButtonText: this.$t("ok"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      ).then(() => {
        this.confirmResetPin();
      });
    },
    resetPassword() {
      this.$confirm(
        this.$t("send_reset_password_link_confirmation"),
        "Warning",
        {
          confirmButtonText: this.$t("ok"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      ).then(() => {
        this.confirmResetPassword();
      });
    },
    resetTwoFA() {
      this.$confirm(
        this.$t("send_reset_password_link_confirmation"),
        "Warning",
        {
          confirmButtonText: this.$t("ok"),
          cancelButtonText: this.$t("cancel"),
          type: "warning",
        }
      ).then(() => {
        this.confirmResetPassword();
      });
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
      confirmResetPassword(){
        const email = this.userData.email
        this.$store.dispatch('users/handleForgetPassword', {email}).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('password_reset_link_sent_successfully'),
          });
        }).catch((err)=>{
          apiErrorHandler(err,this.$notify);
        })
      },
  },
};
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
