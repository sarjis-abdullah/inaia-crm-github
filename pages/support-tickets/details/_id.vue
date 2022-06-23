<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">
            {{ $t("support_ticket") }} > {{ ticket?ticket.subject:'' }}
          </h6>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <page-loader :loaddingText="$t('loading_ticket_details')" v-if="isLoading"></page-loader>
      <div v-else class="row">
        <div class="col-5">
           <LatestOpenTickets :selctedTicket="ticket"/>
        </div>
        <div class="col-7">
            <MessageBox :ticket="ticket"></MessageBox>
        </div>
    </div>
    </div>
    
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import PageLoader from '@/components/common/Loader/PageLoader';
import LatestOpenTickets from '@/components/Support/LatestOpenTickets';
import MessageBox from '@/components/Support/MessageBox';
export default {
    layout: 'DashboardLayout',
    components:{
        PageLoader,
        LatestOpenTickets,
        MessageBox
    },
    data() {
        return {
            ticketId: this.$route.params.id,
            isLoading:false
            
        }
    },
    computed:{
        ...mapGetters('support',{
            ticket:"details",
        }),
    },
    mounted(){
        this.isLoading = true;
        this.$store.dispatch('support/getDetails',this.ticketId).finally(()=>{
            this.isLoading = false;
        })
    }
}
</script>