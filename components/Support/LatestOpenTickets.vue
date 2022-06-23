<template>
    <div>
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-1 my-auto">
                        <img src="/img/icons/support/Chat.png" class="img-size"/>
                    </div>
                    <div class="col-10 ml-1">
                        <h3>{{$t('fast_access')}}</h3>
                        <div class="mt--3 text-muted"><small>{{$t('latest_10_tickets')}}</small></div>
                    </div>
                </div>
            </div>
            <div class="p-3">
                <LatestItem v-for="ticket in data" :key="ticket.id" :ticket="ticket" :isSelected="selctedTicket && ticket.id==selctedTicket.id"/>
            </div>

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import LatestItem from '@/components/Support/LatestItem'
export default {
    components:{
        LatestItem
    },
    props:{
        selctedTicket:{
            type:Object,
            default: null
        }
    },
    computed:{
        ...mapGetters({
            data: "support/latestList",
            statuses: "support/statuses"
        })
    },
    mounted(){
        if(this.statuses.length == 0){
            this.$store.dispatch('support/fetchStatuses').then(()=>{
                if(this.data.length == 0)
                {
                    this.fetchLatestList();
                }
            });
        }
        else
        {
            if(this.data.length == 0)
            {
                this.fetchLatestList();
            }
        }
    },
    methods:{
        fetchLatestList()
        {
            const newStatus = this.statuses.find(x=>x.name_translation_key == 'new');
            const hasMessageStatus = this.statuses.find(x=>x.name_translation_key == 'has_new_message');
            const openStatus = this.statuses.find(x=>x.name_translation_key == 'open');
            const query = `&page=1&per_page=10&support_status_ids=${newStatus.id},${hasMessageStatus.id},${openStatus.id}`;
            this.$store.dispatch('support/fetchLatestChat',query);
        }
    }
}
</script>
<style scoped>
.img-size{
    width: 27px;
}
</style>