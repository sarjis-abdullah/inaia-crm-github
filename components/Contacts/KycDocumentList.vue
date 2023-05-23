<template>
    <modal
        :show.sync="showModal"
        headerClasses=""
        bodyClasses="pt-0"
        footerClasses="border-top bg-secondary"
        :allowOutSideClose="false"
        @close="closeKyc"
    >
    <template slot="header">
                        <!--<h5 class="modal-title" id="exampleModalLabel">{{$t('order_details')}}</h5>-->
                        <span></span>
                    </template>
    <div class="row">
                <div class="col">
                    <div class="card">
                        <div class="card-header">
            <div class="row align-items-center">
                <div class="col-8">
                    <h5 class="h3 mb-0">{{ $t('documents') }}</h5>
                </div>
            </div>
        </div>
                        <el-table class="table-hover table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="documents">

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

                            <el-table-column v-bind:label="$t('title')"
                                    min-width="180px"
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <a :href="row.link" target="_blank">{{row.title}}</a>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-bind:label="$t('description')"
                                    min-width="180px"
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <div>{{row.title}}</div>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            
                            
                        </el-table>
                        
                    </div>
                </div>
                
            </div>
    </modal>
</template>
<script>
    import { mapGetters } from "vuex";
    import { Table, TableColumn } from 'element-ui';
    export default {
        props: {
            showModal: {
                type: Boolean,
                default: false,
                },
            account_id: {
                type: Number,
                default: -1,
                },
        },
        components: {
            [Table.name]: Table,
            [TableColumn.name]: TableColumn
        },
        computed:{
            ...mapGetters({
                documents: "clients/kycDocuments"
            }),
        },
        destroyed(){
            this.$store.commit('clients/kycDocuments',[])
        },
        watch:{
            showModal:{
                handler(){
                    if(this.showModal && this.documents.length == 0){
                        this.$store.dispatch('clients/getKycDocument',this.account_id);
                    }
                },
                immediate: true
            }
        },
        methods:{
            closeKyc(){
                this.$emit('closed');
            }
        }
    }
</script>