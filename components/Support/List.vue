<template>
    <div class="row">
         <div class="col">
            <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <el-input prefix-icon="el-icon-search" :placeholder="$t('search_by_subject')" clearable style="width: 200px" v-model="supportTicketSearch" @change="doSearchBySubject" @clear="clearSearchBySubject"/>
                    </div>
                    <div class="col-4 text-right">
                      <button @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                        <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                      </button>
                    </div>
                  </div>


                </div>

                <SupportFilter :showFilter="showFilter" @filter="applyFilter"/>

                <el-table class="table-hover table-responsive table-flush"
                        header-row-class-name="thead-light"
                        :empty-text="$t('no_data')"
                        v-loading="isLoading"
                        :data="data">

                    <el-table-column label="#"
                                   min-width="100px"
                                    prop="id"
                                    >
                        <template v-slot="{row}">
                            <div class="media align-items-center">
                                <div class="media-body">

                                    <div class="font-weight-300 name" >{{row.id}}</div>

                                </div>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column v-bind:label="$t('subject')"
                                    prop="subject"
                                    min-width="300px"
                                    >
                        <template v-slot="{row}">
                            <span class="text-body">{{row.subject}}</span>
                        </template>
                    </el-table-column>

                    

                    <el-table-column v-bind:label="$t('client')"
                                    prop="account_id"
                                    min-width="150px"
                                    sortable>
                        <template v-slot="{row}">
                            <span class="text-body">
                                {{row.account && row.account.contact ? row.account.contact.name:''}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('creation_date')"
                                    prop="created_at"
                                    min-width="160px"
                                    sortable>
                        <template v-slot="{row}">
                            <div>{{$d(new Date(row.created_at), 'short')}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('status')"
                                    prop="support_status_id"
                                    min-width="120px"
                                    >
                        <template v-slot="{row}">
                          <Status v-bind:status='row.support_status.name_translation_key'>{{row.support_status ? $t(row.support_status.name_translation_key) : row.support_status_id}}</Status>
                        </template>
                    </el-table-column>

                    <el-table-column>
                        <template v-slot="{row}">
                            <icon-button type="info" @click="() => $router.push('/support-tickets/details/'+row.id)" ></icon-button>
                        </template>
                    </el-table-column>

                </el-table>

                <div class="card-footer py-4 d-flex justify-content-end" v-if="totalPages > 1">
                    <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                </div>
                

            </div>

        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Table, TableColumn} from 'element-ui';
import SupportFilter from '@/components/Support/SupportFilter';
import Status from '@/components/Support/Status';
import IconButton from '@/components/common/Buttons/IconButton';
export default {
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        SupportFilter,
        Status,
        IconButton
    },
    data(){
        return {
            supportTicketSearch:null,
            showFilter:false,
            isLoading:false,
            page:1,
            perPage:10,
            totalTableData:0,
            filterQuery:'',
            search:null
        }
    },
    computed:{
        ...mapGetters({
            data: "support/list"
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
        }
    }
}
</script>
<style scoped>

</style>