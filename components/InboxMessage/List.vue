<template>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-8">
                             <h5 class="h3 mb-0" v-if="account_id==-1">{{$t('inbox_messages')}}</h5>
                        </div>
                        <div class="col-4" v-if="hasEditAccess">
                            <div  class="d-flex justify-content-end" v-if="!createNewBatch">
                                <base-button size="sm" type="neutral" @click="createNewInboxMessage">
                                        {{$t('new_inbox_message')}}
                                    </base-button>
                            </div>
                        </div>
                    </div>
                </div>
                <el-table class="table-hover table-responsive table-flush"
                        header-row-class-name="thead-light"
                        :empty-text="$t('no_data')"
                        v-loading="isLoading"
                        :data="data">
                    <el-table-column label="#" min-width="100px" prop="id">
                        <template v-slot="{ row }">
                        <div class="media align-items-center">
                            <div class="media-body">
                                <div class="font-weight-300 name">{{ row.id }}</div>
                            </div>
                        </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind:label="$t('title')"
                        min-width="200px"
                        prop="title"
                    >
                        <template v-slot="{ row }">
                            {{row.title}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind:label="$t('summary')"
                        min-width="300px"
                        prop="summary"
                    >
                        <template v-slot="{ row }">
                            {{row.summary}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind:label="$t('is_draft')"
                        min-width="100px"
                        prop="is_draft"
                    >
                        <template v-slot="{ row }">
                            <Badge type="default" v-if="row.is_draft">{{$t('draft')}}</Badge>
                            <Badge type="success" v-else>{{$t('published')}}</Badge>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-bind:label="$t('is_read')"
                        min-width="100px"
                        prop="is_read"
                    >
                        <template v-slot="{ row }">
                            <Badge type="success" v-if="row.is_read">{{$t('read')}}</Badge>
                            <Badge type="default" v-else>{{$t('unread')}}</Badge>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template v-slot="{row}">
                            <icon-button type="info" @click="() => openDetails(row)"></icon-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="card-footer py-4 d-flex justify-content-end" v-if="totalPagesNumber>1">
                    <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                </div>
            </div>
        </div>
        <Detail :inboxMessage="selectedMessageBox" :openDetailsModal="openDetailsModal" @close="onDetailClose" :account="account"/>
    </div>

</template>
<script>
import { Table, TableColumn } from "element-ui";
import { mapGetters } from "vuex"
import IconButton from '@/components/common/Buttons/IconButton';
import {Badge} from '@/components/argon-core';
import Detail from '@/components/InboxMessage/Detail';
import { canEditCustomers } from '@/permissions';
export default {
  props: {
    account: {
      type: Object,
      default:-1
    },
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    IconButton,
    Badge,
    Detail
  },
  computed:{
    ...mapGetters({
        data:'inboxMessage/list'
    }),
    searchQuery(){
        return '&page='+this.page+'&per_page='+this.perPage+'&account_id='+this.account.id;
    },
    hasEditAccess(){
        return canEditCustomers();
    }
  },
  data(){
    return{
        isLoading:false,
        page:1,
        perPage:10,
        totalTableData:0,
        totalPagesNumber:0,
        selectedMessageBox:null,
        openDetailsModal:false,
        isSubmitting:false,
    }
  },
  mounted(){
    if(this.account)
    {
        this.isLoading = true;
        this.fetchList();
    }
  },
  methods:{
    fetchList(){
        if(this.account)
        {
            this.$store.dispatch('inboxMessage/fetchList',this.searchQuery).then(res=>{
                this.totalTableData = res.meta.total;
                this.totalPagesNumber = res.meta.last_page;
            }).finally(()=>{
                this.isLoading = false;
            });
        }
    },
    deleteInboxMessage(inboxMessage){

    },
    openDetails(inboxMessage){
        this.selectedMessageBox = inboxMessage;
        this.openDetailsModal = true;
    },
    createNewInboxMessage(){
        this.openDetailsModal = true;
    },
    onDetailClose(){
        this.openDetailsModal = false;
        this.selectedMessageBox = null;
    }
  }
};
</script>
<style scoped>
</style>