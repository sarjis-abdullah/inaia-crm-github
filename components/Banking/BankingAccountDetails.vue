<template>
  <div>
    <base-header class="pb-5">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{
              $t("banking_account") +
              " " +
              $t("number_short") +
              " " +
              bankAccountnfo.account_number
            }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--5">
      <div class="row">
        <div class="col-lg-5">
          <div class="card border-0">
            <div class="card-header">
              <div class="media align-items-center">
                <div
                  class="
                    avatar avatar-lg
                    bg-white
                    shadow
                    rounded-circle
                    mr-3
                    mb-0
                  "
                >
                  <img src="/img/icons/cards/mastercard.png" alt="" />
                </div>

                <div>
                  <div class="media-body">
                    <h5 class="card-title text-uppercase text-muted mb-0">
                      {{ $t("balance") }}
                    </h5>
                    <span class="h1 font-weight-bold mb-0 text-nowrap"
                      >{{ $n(bankAccountnfo.balance / 100) }} {{ bankAccountCurrency }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              
              <div class="text-sm">
                IBAN:
                <span class="text-nowrap iban">{{
                  bankAccountnfo.iban.match(/.{1,4}/g).join(" ")
                }}</span>
              </div>
              <div class="mt-1 mb-0 text-sm">
                <UserInfo :accountId="customerId"></UserInfo>
              </div>
              
            </div>
          </div>
         
          <div class="card border-0">
    <!-- Card header -->
    <div class="card-header">
      <!-- Title -->
      <h5 class="h3 mb-0">{{$t('limits')}}</h5>
    </div>
    <!-- Card body -->
    <div class="card-body">
     <div class="text-sm" v-if="limit">
       
                <div class="row mb-2">
                  <div class="col-6">
                  <strong>{{$t('atm')}} </strong>
                  </div>
                  <div class="col-6"
                    >{{ $n(limit.atm_limit.amount) }} {{ limitCurrency }}
                    {{ limit.atm_limit.constraint }}</div
                  >
                </div>
                <div class="row mb-2">
                  <div class="col-6">
                  <strong>{{$t('master_card')}}</strong>
                  </div>

                  <div class="col-6"
                    >{{ $n(limit.master_card.amount) }} {{ limitCurrency }}
                    {{ limit.master_card.constraint }}</div
                  >
                </div>
                <div class="row mb-2">
                   <div class="col-6">
                  <strong>
                 {{$t('PAYMENT_OUT')}}</strong>
                  </div>
                  <div class="col-6"
                    >{{ $n(limit.sepa.amount) }} {{ limitCurrency }}
                    {{ limit.sepa.constraint }}</div
                  >
                </div>
                <div class="row mb-2">
                  <div class="col-6">
                  <strong>
                  {{$t('PAYMENT_IN')}}</strong>
                  </div>
                  <div class="col-6"
                    >{{ $n(limit.sepa_in.amount) }} {{ limitCurrency }}
                    {{ limit.sepa_in.constraint }}</div
                  >
                </div>
                <div class="row mb-2">
                  <div class="col-6">
                  <strong>
                 {{$t('max_balance')}}</strong>
                  </div>
                 <div class="col-6">{{ $n(limit.max_balance.amount) }} {{ limitCurrency }}</div>
                </div>
              </div>
    </div>
  </div>
        
        </div>
        
        <div class="col-lg-7">
          <BankingCards :cards="bankAccountnfo.cards" :account_id="bankAccountnfo.account_id"/>
        </div>
      </div>
      <BankingTransactionList :bankingAccountId="bankAccountnfo.id"/>
    </div>
  </div>
</template>
<script>
import UserInfo from "@/components/Contacts/UserInfo";
import BankingTransactionList from '@/components/Banking/BankingTransactionsList';
import BankingCards from '@/components/Banking/BankingCards';
import { getCurrencySymbol } from '@/helpers/currency';
export default {
  components: { UserInfo,BankingTransactionList,BankingCards },
  props: {
    bankAccountnfo: {
      type: Object,
      default: null,
    },
    customerId: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      limit: null,
    };
  },
  mounted() {
    this.$store
      .dispatch(
        "banking-accounts/getBankingAccountLimit",
        this.bankAccountnfo.id
      )
      .then((res) => {
        this.limit = res;
      });
  },
  computed: {
    bankAccountCurrency(){
      let currency = undefined
      if (this.bankAccountnfo && this.bankAccountnfo.currency) {
        currency = this.bankAccountnfo.currency
      }
      return getCurrencySymbol(currency);
    },
    limitCurrency(){
      let currency = undefined
      if (this.limit && this.limit.currency) {
        currency = this.limit.currency
      }
      return getCurrencySymbol(currency);
    }
  },
  watch: {},
  methods: {},
};
</script>

