<template>
  <div class="card border-0">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <div class="media">
            <img src="/img/icons/cards/mastercard.png" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3" />
            <div class="media-body">
              <h5 class="card-title text-uppercase text-muted mb-0">{{ $t('banking_account') }}</h5>
              <span class="h2 font-weight-bold mb-0 text-nowrap" v-if="balance>=0">{{ $n(balance/100) }} {{ currency }}</span>
              <span v-else><Loader :width="24" :height="24"></Loader></span>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <base-dropdown title-classes="btn btn-sm btn-link mr-0"
                         menu-on-right
                         :has-toggle="false">

            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item" @click="$router.push('/banking-accounts/details/'+customerId)">{{$t('details')}}</a>
          </base-dropdown>
        </div>
      </div>
      <div class="mt-3 mb-0 text-sm">IBAN:
        <span class="text-nowrap iban" v-if="iban">{{ iban.match(/.{1,4}/g).join(' ') }}</span>
        <span v-else><Loader :width="14" :height="14"></Loader></span>
      </div>
    </div>
  </div>
</template>
<script>
import { getCurrencySymbol } from "@/helpers/currency";
import Loader from "../common/Loader/Loader";

export default {
  components: {
    Loader
  },
  props:{
    balance: {
      type: Number
    },
    iban: '',
    customerId:{
      type: Number,
      default:-1
    }
  },
  data() {
    return {
    }
  },
  computed: {
    currency(){
      let currency = undefined
      return getCurrencySymbol(currency);
    },
  },
  watch: {

  },
  methods: {

  },
  mounted() {

  }
}
</script>

