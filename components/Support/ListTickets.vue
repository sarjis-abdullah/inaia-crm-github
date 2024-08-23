<template>
    <div class="position-relative d-flex flex-column h-100">
        <div class="search bg-white p-3 border-bottom w-100" v-if="account_id==-1">
          <div class="d-flex">
            <div class="pl-0 pr-3 pb-0 flex-grow-1">
              <el-input prefix-icon="el-icon-search" :placeholder="$t('search_by_subject_or_client_name')" clearable v-model="supportTicketSearch" @change="doSearchBySubject" @clear="clearSearchBySubject" />
            </div>
            <div class="m-auto">
              <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                <span class="btn-inner--icon"><i class="fas fa-filter"></i></span>
              </button>
            </div>
          </div>

          <SupportFilter :showFilter="showFilter" @filter="applyFilter"></SupportFilter>

        </div>

        <div class="flex-fill overflow-auto">
          <div class="list-area">
              <TicketItem v-for="ticket in data" :key="ticket.id" :ticket="ticket" :isSelected="selectedTicket && ticket.id==selectedTicket.id" @ticketSelected="ticketSelected"/>
          </div>

          <div class="py-4 px-2 d-flex justify-content-end">
            <LoadMore :currentPage="page" :lastPage="lastPage" :isLoading="isLoadingMore" @click="loadMore"/>
          </div>

        </div>

    </div>
</template>
<script>
import { mapGetters } from "vuex";
import TicketItem from '@/components/Support/TicketItem';
import SupportFilter from '@/components/Support/SupportFilter';
import LoadMore from "@/components/common/Loader/LoadMore";
export default {
    props:{
        account_id:{
            type:Number,
            default:-1
        }
    },
    components:{
        TicketItem,
        SupportFilter,
        LoadMore
    },
    computed:{
        ...mapGetters({
            data: "support/list",
            statuses: "support/statuses"
        }),
        searchQuery() {
            return (
                '&order_by=updated_at' +
                `&per_page=${this.perPage}`+(this.filterQuery ? this.filterQuery : '')+
                (this.search ? `&search=${this.search}` : '')+
                (this.account_id > -1 ?'&account_ids='+this.account_id : '')
            )
        },
        totalPages() {
            return Math.ceil(this.totalTableData / this.perPage)
        }

    },
    watch: {
        searchQuery: {
            handler() {
                this.fetchList()
            },
            immediate: true,
        }
    },
    data(){
        return {
            showFilter:false,
            isLoading:false,
            page:1,
            perPage:25,
            totalTableData:0,
            filterQuery:'',
            search:null,
            supportTicketSearch:null,
            selectedTicket:null,
            lastPage:0,
            isLoadingMore:false,
            includeClosed:false
        }
    },
    mounted(){
        if(this.statuses.length == 0)
        {
            this.$store.dispatch("support/fetchStatuses").then(()=>{
                this.fetchList();
            });

        }
    },
    methods:{
        doSearchBySubject(subject){
            if(subject.length > 3)
            {
                this.page = 1;
                this.search = subject;
                this.includeClosed = true
            }
            else{
                this.$notify({
                    message:this.$t('at_least_four_caracters'),
                    duration:2000,
                    type:'warning'
                })
            }

        },
        clearSearchBySubject(){
            this.page =1;
            this.search = null;
            this.includeClosed = false;
        },
        toggleFilter(){
            this.showFilter = !this.showFilter
        },
        applyFilter(query){
            this.page = 1;
            if(query!='')
            {
                this.includeClosed = true;
            }
            else{
                this.includeClosed = false;
            }
            this.filterQuery = query;
        },
        loadMore(){
            this.isLoadingMore = true;
            this.page = this.page + 1;
            this.$store
                    .dispatch("support/fetchList", this.searchQuery+'&page='+this.page+this.getClosedParam())
                    .then(data => {
                        this.lastPage = data.meta.last_page

                    }).finally(() => {
                        this.isLoadingMore = false;
                    })
        },
        fetchList(){
            this.isLoading = true;
            if(this.statuses.length == 0)
            {
                return;
            }
            this.$store
                    .dispatch("support/fetchList", this.searchQuery+'&page='+this.page+this.getClosedParam())
                    .then(data => {
                        this.lastPage = data.meta.last_page

                    }).finally(() => {
                        this.isLoading = false
                        this.isLoadingMore = false;
                    })
        },
        ticketSelected(ticket){
            this.selectedTicket = ticket;
            this.$emit('onselectedTicket',ticket);
        },
        getClosedParam(){
            if(this.statuses.length>0 && !this.includeClosed && this.account_id == -1)
            {
                let closedStatus = null;
                this.statuses.forEach(element => {
                    if(element.name_translation_key == 'closed')
                    {
                        closedStatus = element;
                    }
                });
                if(closedStatus){
                    return '&excluded_support_status_ids='+closedStatus.id.toString();
                }

            }
            return '';
        }

    }
}
</script>
<style scoped>
.search {
}
.img-size{
    width: 25px;
    height: 25px;
}
.list-area{
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
}
</style>
