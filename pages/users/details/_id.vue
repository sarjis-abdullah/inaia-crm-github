<template>
    <div>
      <base-header class="pb-5">
        <div class="row align-items-center py-4">
          <div class="col-lg-6 col-7">
          </div>
        </div>
      </base-header>
  
      <div class="container-fluid mt--5">
        <div class="row">
          <div class="col-lg-8">
            <AccountDetails :resource="singleAccountUser" />
          </div>
  
          <div class="col-lg-4"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import AccountDetails from "@/components/Contacts/AccountDetails";
  export default {
    layout: 'DashboardLayout',
    components: {
      AccountDetails,
    },  
    computed: {
      ...mapGetters({
        resource: "clients/singleAccountData",
      }),
      accountUserId() {
        return this.$route.params.id;
      },
      singleAccountUser() {
        return this.resource && this.resource.customer;
      },
    },
    watch: {
      accountUserId: {
        handler() {
          if (this.accountUserId) {
            this.initClientData();
          }
        },
        immediate: true,
      },
    },
    methods: {
      initClientData() {
        this.$store.dispatch("clients/accountDetailsData", this.accountUserId);
      },
    },
  };
  </script>
  
