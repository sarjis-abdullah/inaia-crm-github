<template>
    <div class="position-relative d-flex flex-column h-100">
        <div class="search bg-white p-3 border-bottom w-100">
            <div class="row">
                <div class="col-8 ml-1 my-auto">
                    <div>
                        <i class="lnir lnir-comments"></i>
                        <h3 class="d-inline ml-1">{{$t('ticket_list')}}</h3>
                    </div>
                </div>
                <div class="col my-auto">
                    <button @click.prevent="toggleFilter()" type="button" class="float-right btn base-button btn-icon btn-fab btn-neutral btn-sm">
                    <span class="btn-inner--icon"><i class="fas fa-filter"></i></span>
                  </button>
                </div>
            </div>

            <SupportFilter :showFilter="showFilter" @filter="applyFilter"/>

            <div class="pt-3 px-0 pb-0">
              <el-input prefix-icon="el-icon-search" :placeholder="$t('search_by_subject')" clearable v-model="supportTicketSearch" @change="doSearchBySubject" @clear="clearSearchBySubject"/>
            </div>
        </div>

        <div class="flex-fill overflow-auto">
          <div class="list-area">
              <TicketItem v-for="ticket in data" :key="ticket.id" :ticket="ticket" :isSelected="selectedTicket && ticket.id==selectedTicket.id" @ticketSelected="ticketSelected"/>
          </div>

          <div class="py-4 px-2 d-flex justify-content-end" v-if="totalPages > 1">
            <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
          </div>

        </div>

    </div>
</template>
<script>
import { mapGetters } from "vuex";
import TicketItem from '@/components/Support/TicketItem';
import SupportFilter from '@/components/Support/SupportFilter';

export default {
    components:{
        TicketItem,
        SupportFilter
    },
    computed:{
        ...mapGetters({
            data: "support/list",
        }),
        searchQuery() {
            return (
                `&page=${this.page}` +
                `&per_page=${this.perPage}`+(this.filterQuery ? this.filterQuery : '')+
                (this.search ? `&search=${this.search}` : '')
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
            perPage:10,
            totalTableData:0,
            filterQuery:'',
            search:null,
            supportTicketSearch:null,
            selectedTicket:null
        }
    },
    mounted(){

    },
    methods:{
        doSearchBySubject(subject){
            this.page = 1;
            this.search = subject;
        },
        clearSearchBySubject(){
            this.page =1;
            this.search = null;
        },
        toggleFilter(){
            this.showFilter = !this.showFilter
        },
        applyFilter(query){
            this.page = 1;
            this.filterQuery = query;
        },
        fetchList(){
            this.isLoading = true;
            this.$store
                    .dispatch("support/fetchList", this.searchQuery)
                    .then(data => {
                        this.totalTableData = data.meta.total

                    }).finally(() => {
                        this.isLoading = false
                    })
        },
        ticketSelected(ticket){
            this.selectedTicket = ticket;
            this.$emit('onselectedTicket',ticket);
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
