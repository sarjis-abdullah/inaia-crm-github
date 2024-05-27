<template>
    <div class="row">
        <div class="col">
            <div class="card">
                <div class="card-header">
                    <div class="row">
                        <div class="col-4">

                        </div>
                        <div class="col-8 text-right">
                            <button  @click.prevent="toggleFilter()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                            <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                          </button>
                         
                        </div>
                    </div>
                </div>
                <CommissionFilter :showFilter="showFilter" @filter="applyFilter" :salesAdvisorId="salesAdvisorId"/>
                <el-table
                    class="table-hover table-responsive table-flush"
                    header-row-class-name="thead-light"
                    :data="commissions"
                    
                    >
                    <el-table-column label="#"
                                        min-width="120px"
                                        prop="id"
                                        >
                            <template v-slot="{row}">
                                <div>{{row.id}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('reason')"
                                        prop="reason"
                                        
                                        >
                                <template v-slot="{row}">
                                
                                    <div>
                                        <div>{{$t(row.reason)}}</div>
                                        <div class="text-sm-left text-muted">{{$d(new Date(row.created_at))}}</div>
                                    </div>
                                </template>
                        </el-table-column>
                        <el-table-column :label="$t('amount')"
                                        prop="amount"
                                        
                                        >
                                <template v-slot="{row}">
                                
                                    <div>
                                        <div>{{$n(row.amount/100)}} €</div>
                                        <div class="text-sm-left text-muted">{{$n(row.rate)}} %</div>
                                    </div>
                                </template>
                        </el-table-column>
                        <el-table-column :label="$t('depot')"
                                        prop="depot_name"
                                        
                                        >
                                <template v-slot="{row}">
                                
                                    <div>
                                        <div>{{row.depot_name}}</div>
                                    </div>
                                </template>
                        </el-table-column>
                        <el-table-column :label="$t('target_amount')"
                                        prop="target_amount"
                                       
                                        >
                                <template v-slot="{row}">
                                        <div>{{$n(row.target_amount/100)}} €</div>
                                </template>
                        </el-table-column>
                        <el-table-column :label="$t('direction')"
                                        prop="direction"
                                       
                                        >
                                <template v-slot="{row}">
                                        <div>{{$t(row.direction)}}</div>
                                </template>
                        </el-table-column>
                        <el-table-column v-if="hasEditAccess">
                            <template v-slot="{row}">
                                <IconButton type="edit" @click="()=>editTicket(row)"/>
                                <IconButton type="delete" @click="()=>confirmDelete(row.id)" :disabled="isDeleting"/>
                            </template>
                        </el-table-column>
                </el-table>
                <div class="card-footer py-4 d-flex justify-content-end" v-if="totalTableData>perPage">
                        <base-pagination v-model="page" :per-page="perPage" :total="totalTableData"></base-pagination>
                    </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Table, TableColumn,MessageBox } from 'element-ui';
import { mapGetters } from "vuex";
import IconButton from '@/components/common/Buttons/IconButton';
import CommissionFilter from '@/components/SalesCommission/Filter';
import { canEditSalesCimmission } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default{
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        IconButton,
        CommissionFilter
    },
    props:{
        salesAdvisorId:{
            type:Number,
            default:-1
        }
    },
    data(){
    return {
        isLoading:true,
        page:1,
        perPage:10,
        totalTableData:1,
        filterQuery:'',
        showFilter:false,
        isDeleting:false
    }
    },
    computed : {
        ...mapGetters({
            commissions:"salesCommission/commissions"
        }),
    hasEditAccess(){
      return canEditSalesCimmission()
    }
    },
    watch:{
        page:{
            handler(){
                this.loadCommissions();
            },
            immediate:true
        },
        filterQuery:{
            handler(){
                this.loadCommissions();
            }
        }
    },
    mounted(){
        this.$confirm = MessageBox.confirm
    },
    methods:{
        loadCommissions(){
            this.isLoading = true;
            const payload = this.getQuery();
            this.$store.dispatch('salesCommission/fetchList',payload)
            .then((res)=>{
                this.totalTableData = res.per_page * res.last_page;
            })
            .finally(()=>{
                this.isLoading = false;
            });
        },
        getQuery(){
            let query = '&per_page='+this.perPage+'&page='+this.page;
            if(this.salesAdvisorId > 0){
                query+="&sales_advisor_id="+this.salesAdvisorId
            }
            if(this.filterQuery!=''){
                query+='&'+this.filterQuery;
            }
            
            return query;
        },
        toggleFilter(){
            this.showFilter = !this.showFilter;
        },
        applyFilter(query){
            this.page = 1;
            this.filterQuery = query;
        },
        confirmDelete(id) {
            this.$confirm(this.$t('are_you_sure_you_want_to_delete_commission'), 'Warning', {
                confirmButtonText: this.$t('ok'),
                cancelButtonText: this.$t('cancel'),
                type: 'warning'
                }).then(() => {
                this.deleteTicket(id);
            });
        },
        deleteTicket(id){
            this.isDeleting = true;
            this.$store.dispatch('salesCommission/deleteCommission',id).then(()=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('entry_deleted_successfully')})
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isDeleting = false;
            })
        },
        editTicket(commission){
            this.$emit('onEdit',commission);
        }

    }
}
</script>