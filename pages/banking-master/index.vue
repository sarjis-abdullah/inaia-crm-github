<template>
  <div>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{$t('banking_master_account')}}</h6>
          <!--
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
              <route-breadcrumb/>
          </nav>
          -->
        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral">{{ $t('make_payment') }}</base-button>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">

        <div class="col-xl-4 col-md-6">
          <MasterAmountCard />
        </div>

      </div>

      <BankingTransactionsList :bankingAccountId="bankingAccountId" />

    </div>

  </div>
</template>
<script>
import MasterAmountCard from "@/components/Banking/MasterAmountCard"
import BankingTransactionsList from "@/components/Banking/BankingTransactionsList"

export default {
  layout: 'DashboardLayout',
  components: {
    MasterAmountCard,
    BankingTransactionsList
  },
  data() {
    return {
      bankingAccountId: 0,
      masterAccountDetails: {
        type: Object
      }
    }
  },
  computed: {
  },
  watch: {
    masterAccountDetails: {
      handler() {
        if (this.masterAccountDetails) {
          this.bankingAccountId = this.masterAccountDetails.id;
        }
      },
      immediate: true
    },
  },
  methods: {
    initMasterAccountDetails() {
      this.$store.dispatch('banking-accounts/getMasterAccountInfo').then(res => {
        this.masterAccountDetails = res;
      })
    }
  },
  mounted() {
    this.initMasterAccountDetails();
  }
}
</script>
