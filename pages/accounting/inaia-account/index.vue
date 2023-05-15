<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{$t('inaia_banking_account')}}</h6>
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
            <ExternalBankAmountCard @loaded="onSummaryLoaded"/>
            </div>
        </div>
        

    </div>
    <div class="container-fluid" v-if="isSummryLoaded">
            <BankingTransactionsList :bankingAccountId="accountId"/>
        </div>
    </div>
</template>
<script>
import ExternalBankAmountCard from '@/components/Banking/ExternalBankAmountCard';
import BankingTransactionsList from '@/components/Banking/BankingTransactionsList';
export default {
    layout: 'DashboardLayout',
    components:{
        ExternalBankAmountCard,
        BankingTransactionsList
    },
    data(){
        return {
            isSummryLoaded:false,
            accountId:null
        }
    },
    methods:{
        onSummaryLoaded(id){
            this.accountId = id;
            this.isSummryLoaded = true;
        }
    }
}
</script>