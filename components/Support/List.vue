<template>
    <div class="card the-box">
      <div class="d-flex h-100">
        <div class="border-right pr-0 overflow-hidden" style="width:400px; min-width:400px;">
           <ListTickets :selctedTicket="selectedTicket" @onselectedTicket="onTicketSelected" :account_id="account_id"/>
        </div>
        <div class="flex-grow-1">
            <MessageBox :ticket="selectedTicket"></MessageBox>
        </div>
      </div>
    </div>
</template>
<script>

import ListTickets from '@/components/Support/ListTickets';
import MessageBox from '@/components/Support/MessageBox';
export default {
    props:{
        account_id:{
            type:Number,
            default:-1
        }
    },
    components:{
        ListTickets,
        MessageBox
    },
    mounted(){
        this.selectedTicket = null;
    },
    data(){
        return {

            selectedTicket:null
        }
    },
    methods:{
        onTicketSelected(ticket)
        {
            this.selectedTicket = ticket;
        }
    }
}
</script>
<style scoped>
.the-box{
    /*
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.05);
    height:80vh;
    z-index: 1000;
    */
    overflow: hidden;
    height: calc(100vh - 185px);
    min-height: 500px;
}
</style>
