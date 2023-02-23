
<template>
  <div>
    {{ $t("client") }}:
      <el-popover
      v-if="info && info.account"
    placement="bottom"
    width="400"
    trigger="click"
    >
    <div>

        <div class="row">
          <div class="col-sm-6 _col-xl-3" v-if="info.account">

            <div class="account_data text-sm mt-1">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('account_data')}}</div>
              <div>{{$t('name')}}:
                <a href="" v-if="singleClientData && singleClientData.customer" @click.prevent="$router.push('/customers/details/' + singleClientData.customer.id)">{{getName}}</a>
              </div>
              <div>{{$t('status')}}:
                <badge :type="`${info.is_active ? 'success' : 'danger'}`" class="ml-1">{{info.is_active ? $t('active') : $t('inactive')}}</badge>
                <badge v-if="info.is_locked" type="danger" class="ml-1"><i class="lnir lnir-lock-alt"></i>{{$t('locked')}}</badge>
              </div>
            </div>


          </div>
          <div class="col-sm-6 _col-xl-3" v-if="info.person_data">

            <div class="person_data text-sm mt-1">
              <div class="h5 text-muted text-uppercase ls-1">{{$t('person_data')}}</div>
              <div>{{$t('gender')}}: <i v-if="info.person_data" class="lnir ml-1" :class="`${info.person_data.gender == 'male' ? 'lnir-male rotate-45' : 'lnir-female lnir-rotate-180'}`" /></div>
              <div>{{$t('birthdate')}}: {{$d(new Date(info.person_data.birthdate),'narrow')}}</div>
              <div>{{$t('nationality')}}: {{ (info.person_data && info.person_data.nationality ? info.person_data.nationality.name_translation_key : '' ) }}</div>
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
    <a href="#" slot="reference">{{ singleClientData.customer.account.account_number }}</a>
  </el-popover>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
/*
* This component can get user info either by passing to it contact_id or accountId
* We had to add this component because most of client information can be got by contact Id
* But most of the operations uses the accountId
* To reduce the api calls we are stroring all the client data that we loaded before so we load it one time
*/
export default {
  props: {
    customerId: {
      type: Number,
      default: -1,
    },
    accountId:{
        type: Number,
      default: -1,
    }
  },
  computed: {
    ...mapGetters({
      client: "clients/singleClientData",
    }),

    singleClientData() {
      return this.client(this.customerId,this.accountId);
    },
    info() {
      //console.log('resource', this.resource)
      return this.singleClientData && this.singleClientData.customer;
    },
    getName() {
      return (
        this.info.name +
        (this.info.person_data ? " " + this.info.person_data.surname : "")
      );
    },
    avatar() {
      if (this.info && this.info.avatar) return this.info.avatar;
      else if (this.info && this.info.person_data) {
        let gender = this.info.person_data.gender
          ? this.info.person_data.gender.toLowerCase()
          : "";
        if (gender == "female" || gender == "f") {
          return "/img/theme/avatar_f.png";
        }
      }
      return "/img/theme/avatar_m.png";
    },
  },
  mounted() {
    if (!this.singleClientData)
    {
        if(this.accountId!=-1)
        {
            this.$store.dispatch('clients/clientAccountDetails',this.accountId).then(res=>{
                      this.$store.dispatch("clients/clientDetailsData", res.contact_id);
                  })
        }
        if(this.customerId!=-1)
        {
            this.$store.dispatch("clients/clientDetailsData", this.customerId);
        }
    }

  },
  methods: {
    getChannelInfo(type) {
      let channel =
        this.info.channels &&
        this.info.channels.length &&
        this.info.channels.find((c) => c.type.value == type);
      if (channel) {
        return channel.value;
      }
      return null;
    },
  },
};
</script>
