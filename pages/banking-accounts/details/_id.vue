<template>
    <BankingAccountDetails v-if="bankingAccountInfo" :bankAccountnfo="bankingAccountInfo" :customerId="customerId"/>
</template>

<script>
import BankingAccountDetails from "@/components/Banking/BankingAccountDetails";

export default {
    layout: 'DashboardLayout',
    props: {
        showViewPage: {
            type: Boolean
        }
    },
    data() {
        return {
            customerId: this.$route.params.id,
            bankingAccountInfo:null
        }
    },
    components: {
      BankingAccountDetails
    },
    watch: {
        customerId: {
            handler() {
                if (this.customerId) {
                    this.initBankingAccount()
                }
            },
            immediate: true
        },
    },
    methods: {
        initBankingAccount() {
            this.$store.dispatch("banking-accounts/getBankingAccountDetails", this.customerId).then((res)=>{
                this.bankingAccountInfo = res.data;
            })
        },
    }
}
</script>
