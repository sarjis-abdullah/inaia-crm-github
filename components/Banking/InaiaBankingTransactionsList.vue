<template>
    <div>
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-header">

                    </div>
                    <el-table class="table-hover table-responsive table-flush"
                        header-row-class-name="thead-light"
                        :empty-text="$t('no_data')"
                        v-loading="isLoading"
                        :data="data">
                        <el-table-column 
                            label="#"
                            min-width="100px"
                            prop="id"
                        >
                        <template v-slot="{row}">
                            <div class="media align-items-center">
                                <div class="media-body">
                                    <div class="font-weight-300 name">{{row.id}}</div>
                                </div>
                            </div>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui'
export default {
    props:{
        account_id:{
            type:Number,
            default:null
        }
    },
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
    },
    data(){
        return{
            data: [],
            isLoading:false,

        }
    }
}
</script>