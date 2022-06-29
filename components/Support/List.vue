<template>
    <div class="d-flex flex-fill">
        <div class="the-box" style="width:40%">
           <ListTickets :selctedTicket="selectedTicket" @onselectedTicket="onTicketSelected"/>
        </div>
        <div class="the-box" style="width:60%">
            <MessageBox :ticket="selectedTicket"></MessageBox>
        </div>
    </div>
</template>
<script>

import ListTickets from '@/components/Support/ListTickets';
import MessageBox from '@/components/Support/MessageBox';
export default {
    components:{
        ListTickets,
        MessageBox
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
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.05);
    height:80vh
}
</style>