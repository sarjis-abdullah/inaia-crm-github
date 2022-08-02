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

          <UserCard :resource="resource" />

        </div>

        <div class="col-lg-4">

          <ProductClassCard :productClassDetails="getProductClass" :accountId="info.account.id" />

          <BankingAmountCard  v-if="resource && resource.customer && resource.customer.account" :balance="bankingAccountBalance" :iban="bankingAccountIban" :customerId="info.account.id" />

        </div>

      </div>
        <Collapse v-if="resource && resource.customer && resource.customer.account" @change="handleChange">
          <CollapseItem :title="$t('depot')" name="depots">
            <DepotList   :accountId="info.account.id" v-if="shouldLoadDepots"/>
         </CollapseItem>
          <CollapseItem :title="$t('recent_transactions')" name="lastTransactions">
            <LatestTransactions :account_id="info.account.id" v-if="shouldLoadlastTransactions"/>
          </CollapseItem>
          <CollapseItem :title="$t('aggregated_claims')" name="aggregatedClaims">
            <AggregatedClaims :account_id="info.account.id" v-if="shouldLoadAggregatedClaims"/>
          </CollapseItem>
          <CollapseItem :title="$t('inbox_messages')" name="inboxMessages">
            <InboxMessageList :account="info.account" v-if="shouldLoadInboxMessages"/>
          </CollapseItem>
        </Collapse>
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
import AggregatedClaims from '@/components/Claims/AggregatedClaims';
import InboxMessageList from '@/components/InboxMessage/List';
import {Collapse,CollapseItem} from 'element-ui';
export default {
    components: {
        Loader,
        Form,
        UserCard,
        Products,
        DepotList,
        LatestTransactions,
        BankingAmountCard,
        ProductClassCard,
        AggregatedClaims,
        InboxMessageList,
        Collapse,
        CollapseItem
    },
    props: {
        resource: {
            type: Object
        }
    },
    data() {
      return {
        bankingAccountDetails: {
          type:Object
        },
        productClassDetails: {},
        shouldLoadDepots:false,
        shouldLoadlastTransactions:false,
        shouldLoadAggregatedClaims:false,
        shouldLoadInboxMessages:false
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
        getAccountId() {
          if (this.info.account) {
            
            return this.info.account.id;
          } else {
            return false;
          }
        },
        getProductClass() {
          if (this.info.account)
          {

            return {...this.info.account.plan,payment_period:this.info.account.payment_cycle,next_billing_date:this.info.account.next_billing_date};
          }

          else return false;
        },
        bankingAccountBalance() {
          if (this.bankingAccountDetails) return  this.bankingAccountDetails.balance;
          else return false;
        },
        bankingAccountIban() {
          if (this.bankingAccountDetails) return  this.bankingAccountDetails.iban;
          else return false;
        },


    },
    watch: {
      resource: {
        handler() {
          if (this.resource) {
            this.initBankingAccountDetails();
          }
        },
        immediate: true
      },
    },
    methods: {
      initBankingAccountDetails() {
        this.$store.dispatch("banking-accounts/getBankingAccountDetails", this.info.account.id).then(res=>{
          this.bankingAccountDetails = res.data;
        })
      },
      handleChange(val) {
        console.log(val);
        val.forEach(element => {
          if(element == 'depots' && !this.shouldLoadDepots)
          {
            this.shouldLoadDepots = true;
          }
          if(element == "lastTransactions" && !this.shouldLoadlastTransactions){
            this.shouldLoadlastTransactions = true;
          }
          if(element == "aggregatedClaims" && !this.shouldLoadAggregatedClaims){
            this.shouldLoadAggregatedClaims = true;
          }
          if(element == "inboxMessages" && !this.shouldLoadInboxMessages){
            this.shouldLoadInboxMessages = true;
          }
        });
      }
    }

}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
</style>
