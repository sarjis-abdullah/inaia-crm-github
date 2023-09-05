<template>
  <div>

    <base-header class="pb-5">
      <div class="row align-items-center py-4">

        <div class="col-lg-6 col-7">

          <h6 class="h2 text-white d-inline-block mb-0">{{$t('customer') + ' '+$t('number_short') + ' ' + getAccountNumber }}</h6>

        </div>
       

      </div>
    </base-header>

    <div class="container-fluid mt--5">

      <div class="row">
        <div class="col-lg-8">

          <UserCard :resource="resource" />

        </div>

        <div class="col-lg-4">

          <!--ProductClassCard :productClassDetails="getProductClass" :accountId="info.account.id" />

          <BankingAmountCard  v-if="hasBankingAcoount && resource && resource.customer && resource.customer.account" :balance="bankingAccountBalance" :iban="bankingAccountIban" :customerId="info.account.id" -->

            <UserComment :account="info"/>
        </div>

      </div>


      <div class="card">
        <div class="card-body">
          <collapse multipleActive v-if="resource && resource.customer && resource.customer.account" @change="handleChange">
            <collapse-item :title="$t('depot')" name="depots" class="mycollapse">
              <template v-slot:title>
                <div>
                  <h3>{{ $t('depots') }}</h3>
                  <span class="tim-icons icon-minimal-down"></span>
                </div>
              </template>

              <DepotList   :accountId="info.account.id" v-if="shouldLoadDepots"/>
            </collapse-item>
          </collapse>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <collapse multipleActive v-if="resource && resource.customer && resource.customer.account" @change="handleChange">
            <collapse-item :title="$t('recent_transactions')" name="lastTransactions" class="mycollapse">
              <template v-slot:title>
                <div>
                  <h3>{{ $t('recent_transactions') }}</h3>
                  <span class="tim-icons icon-minimal-down"></span>
                </div>
              </template>

              <LatestTransactions :account_id="info.account.id" v-if="shouldLoadlastTransactions"/>
            </collapse-item>
          </collapse>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <collapse multipleActive v-if="resource && resource.customer && resource.customer.account" @change="handleChange">
            <collapse-item ::title="$t('claims')" name="aggregatedClaims" class="mycollapse">
              <template v-slot:title>
                <div>
                  <h3>{{ $t('claims') }}</h3>
                  <span class="tim-icons icon-minimal-down"></span>
                </div>
              </template>

              <Claims :account_id="info.account.id" v-if="shouldLoadAggregatedClaims" style="width: 100%;"/>
            </collapse-item>
          </collapse>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <collapse multipleActive v-if="resource && resource.customer && resource.customer.account" @change="handleChange">
            <collapse-item :title="$t('bank_accounts')" name="bankAccount" class="mycollapse">
              <template v-slot:title>
                <div>
                  <h3>{{ $t('bank_accounts') }}</h3>
                  <span class="tim-icons icon-minimal-down"></span>
                </div>
              </template>

              <UserBankAccounts :account_id="info.account.id" v-if="shouldLoadBankAccounts"/>
            </collapse-item>
          </collapse>
        </div>
      </div>
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
import Claims from '@/components/Contacts/AccountClaimList';
import InboxMessageList from '@/components/InboxMessage/List';
import {Collapse,CollapseItem} from 'element-ui';
import UserComment from "@/components/Comment/UserComment";
import UserBankAccounts from "@/components/Contacts/BankAccounts"
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
        Claims,
        InboxMessageList,
        Collapse,
        CollapseItem,
        UserComment,
        UserBankAccounts
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
        shouldLoadInboxMessages:false,
        hasBankingAcoount:false,
        shouldLoadBankAccounts:false
      }
    },

    computed: {
        ...mapGetters({
            types: "types/pairs",
        }),
        info() {
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
        /*this.$store.dispatch("banking-accounts/getBankingAccountDetails", this.info.account.id).then(res=>{
          this.bankingAccountDetails = res.data;
          this.hasBankingAcoount = true;
        })*/
      },
      handleChange(val) {
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
          if(element == "bankAccount" && !this.shouldLoadInboxMessages){
            this.shouldLoadBankAccounts = true;
          }
        });
      }
    }

}
</script>

<style scoped>
.el-collapse .el-icon-arrow-right:before,
.mycollapse i:before {
  display: none;
}
</style>
