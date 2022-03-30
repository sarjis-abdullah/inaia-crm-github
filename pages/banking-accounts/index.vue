<template>
  <div>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{$t('banking_accounts')}}</h6>
          <!--
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
              <route-breadcrumb/>
          </nav>
          -->
        </div>
        <div class="col-lg-6 col-5 text-right">
          <!-- <base-button size="sm" type="neutral">New</base-button> -->
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">

        <div class="col-xl-4 col-md-6">
          <MasterAmountCard />
        </div>

      </div>

      <BankingTransactionsList />

    </div>

  </div>

</template>
<script>
import BankingTransactionsList from "@/components/Banking/BankingTransactionsList"

export default {
  layout: 'DashboardLayout',
  components: {
    BankingTransactionsList
  }
}
</script>
