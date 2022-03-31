<template>
  <div>

    <base-header class="pb-5">
      <div class="row align-items-center py-4">

        <div class="col-lg-6 col-7">

          <h6 class="h2 text-white d-inline-block mb-0">{{$t('customer') + ' '+$t('number_short') + ' ' + getAccountNumber }}</h6>

        </div>
        <div class="col-lg-6 col-5 text-right">
          <base-button size="sm" type="neutral" @click.prevent="() => $router.push('/customers/edit/'+info.id)">Edit Profile</base-button>
        </div>

      </div>
    </base-header>

    <div class="container-fluid mt--5">

      <div class="row">
        <div class="col-lg-8">

          <user-card :resource="resource"></user-card>

        </div>

        <div class="col-lg-4">

          <ProductClassCard :productClassDetails="productClassDetails" />

          <BankingAmountCard :bankingAccountDetails="bankingAccountDetails" />

          <div>- Products and specs</div>

        </div>

      </div>

      <div>
        <div>- Account settings (language, allow_marketing, privacy) - as a popup??</div>
      </div>
      <DepotList  v-if="resource && resource.customer && resource.customer.account" :accountId="getAccoundId"/>
      <LatestTransactions v-if="resource" :account_id="getAccoundId" />
      <div>- Claims</div>



    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Loader from "../common/Loader/Loader";
import Form from "@/components/Contacts/Form";
import UserCard from "@/components/Contacts/UserCard";
import Products from '@/components/Contacts/Products';
import DepotList from "@/components/Depots/List";
import LatestTransactions from "@/components/Contacts/LatestTransactions"
import BankingAmountCard from "@/components/Banking/BankingAmountCard"
import ProductClassCard from "@/components/ProductClasses/ProductClassCard"

export default {
    components: {
        Loader,
        Form,
        UserCard,
        Products,
        DepotList,
        LatestTransactions,
        BankingAmountCard,
        ProductClassCard
    },
    props: {
        resource: {
            type: Object
        }
    },
    data() {
      return {
        bankingAccountDetails: {
          id: 0
        },
        productClassDetails: {}
      }
    },
    computed: {
        ...mapGetters({
            types: "types/pairs",
        }),
        info() {
            console.log('resource', this.resource)
            return this.resource && this.resource.customer;
        },
        getType() {
            if (this.types && this.info.account) {
                return Object.keys(this.types).find( k => this.types[k] == this.info.account.type_id )
            }
            return null
        },
        getAccountNumber() {
          if (this.info.account) return this.info.account.account_number;
          else return false;
        },
        getAccoundId() {
          if (this.info.account) return this.info.account.id;
          else return false;
        }
    },
    mounted () {
      if(this.bankingAccountDetails.id==0)
      {
        this.$store.dispatch("banking-account/getBankingAccountDetails", this.info.account.id).then(res=>{
          this.bankingAccountDetails = res.data;
        })
      }

    }

}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>
