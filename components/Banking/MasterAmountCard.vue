<template>
    <div class="card border-0">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="media">
              <img src="/img/icons/cards/mastercard.png" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3" />
              <div class="media-body">
                <h5 class="card-title text-uppercase text-muted mb-0">{{ $t('banking_master_account')}}</h5>
                <span class="h2 font-weight-bold mb-0 text-nowrap" v-if="masterAccountBalance">{{$n(masterAccountBalance)}} {{ currency }}</span>
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

              <a class="dropdown-item" href="#">{{$t('make_payment')}}</a>
            </base-dropdown>
          </div>
        </div>
        <div class="mt-3 mb-0 text-sm">IBAN:
          <span class="text-nowrap iban" v-if="masterAccountIban">{{masterAccountIban}}</span>
          <span v-else><Loader :width="14" :height="14"></Loader></span>
        </div>
      </div>
    </div>
</template>
<script>
import { getCurrencySymbol } from '@/helpers/currency';
import Loader from "../common/Loader/Loader";

export default {
  components: {
    Loader
  },
  data() {
    return {
      masterAccountBalance:0,
      masterAccountIban:"",
      bankAccountnfo:null,
    }
  },
  computed: {
    currency(){
      let currency = undefined
      if (this.bankAccountnfo && this.bankAccountnfo.currency) {
        currency = this.bankAccountnfo.currency
      }
      return getCurrencySymbol(currency);
    },
  },
  methods: {
    initBankingAccountDetails() {
      this.$store.dispatch('banking-accounts/getMasterAccountInfo').then(res => {
        this.bankAccountnfo = res
        this.masterAccountBalance = res.balance / 100;
        this.masterAccountIban = res.iban.match(/.{1,4}/g).join(' ');
      })
    }
  },
  mounted() {
    this.initBankingAccountDetails()
  }
}
</script>

