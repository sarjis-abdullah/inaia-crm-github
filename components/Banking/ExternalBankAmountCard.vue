<template>
    <div class="card border-0">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <div class="media">
              <img src="/img/icons/cards/mastercard.png" alt="" class="avatar avatar-lg bg-white shadow rounded-circle mr-3" />
              <div class="media-body">
                <h5 class="card-title text-uppercase text-muted mb-0">Volksbank Böblingen</h5>
                <span class="h2 font-weight-bold mb-0 text-nowrap" v-if="!isLoading && bankAccount">{{ bankAccount.balance/100 }} €</span>
                <Loader :width="24" :height="24" v-else/>
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

              <a class="dropdown-item" @click.prevent="refreshData">{{$t('refresh_data')}}</a>
              <a class="dropdown-item" @click.prevent="syncWithFinApi" :disabled="isLoading">{{$t('sync_with_FinApi')}}</a>
            </base-dropdown>
          </div>
        </div>
        <div class="mt-3 mb-0 text-sm">IBAN:
          <span class="text-nowrap iban" v-if="!isLoading && bankAccount">{{ iban }}</span>
          <Loader :width="14" :height="14" v-else/>
        </div>
      </div>
      
    </div>
</template>
<script>
import Loader from "../common/Loader/Loader";

export default {
  components: {
    Loader
  },
  data() {
    return {
        bankAccount:null,
        isLoading:false
    }
  },
  computed:{
    iban(){
        return this.bankAccount && this.bankAccount.iban.match(/.{1,4}/g).join(' ')

    }
  },
  methods: {
    refreshData(isFirst){
      this.isLoading = true;
      this.$store.dispatch('banking-accounts/getExternalBankSummary').then((res)=>{
        this.bankAccount = res;
        this.$emit('loaded',this.bankAccount.id)
      }).catch((err)=>{
        console.log(err);
      }).finally(()=>{
        this.isLoading = false
      })
    },
    syncWithFinApi(){
      this.$store.dispatch('banking-accounts/syncWithFinApi').then((res)=>{
        if(res)
          window.open(res,'_self');
        else{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("bank_connection_done_succesfully"),
          });
        }
      }).catch((err)=>{
        this.$notify({type: 'danger', timeout: 5000, message: this.$t('bank_connection_unsuccessfully')})
      }).finally(()=>{
        this.isLoading = false
      })
    }
  },
  mounted() {
    this.refreshData(true)
  }
}
</script>

