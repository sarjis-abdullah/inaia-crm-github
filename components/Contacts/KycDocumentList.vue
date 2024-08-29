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
                                    
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <a :href="row.link" target="_blank">{{row.title ? row.title : $t('download')}}</a>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-bind:label="$t('description')"
                                    
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <div>{{row.title}}</div>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column 
                                    
                                    >
                                <template v-slot="{row}">
                                    <IconButton type="delete" @click="()=>deleteDocument(row)" :disabled="isDeleting"/>
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
    import { Table, TableColumn,MessageBox } from 'element-ui';
    import { apiErrorHandler } from "../../helpers/apiErrorHandler";
    import IconButton from "@/components/common/Buttons/IconButton";
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
            [TableColumn.name]: TableColumn,
            MessageBox,
            IconButton
        },
        computed:{
            ...mapGetters({
                documents: "clients/kycDocuments"
            }),
        },
        destroyed(){
            this.$store.commit('clients/kycDocuments',[])
        },
        data(){
            return{
                isDeleting:false
            }
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
        mounted(){
            this.$confirm = MessageBox.confirm;
        },
        methods:{
            closeKyc(){
                this.$emit('closed');
            },
            deleteDocument(document){
                this.$confirm(this.$t('do_you_want_to_delete_document'), 'Warning', {
                    confirmButtonText: this.$t('ok'),
                    cancelButtonText: this.$t('cancel'),
                    type: 'warning'
                }).then(() => {
                    this.isDeleting = true;
                    this.$store.dispatch('clients/removeDocument',document.id).then(()=>{
                        this.$store.dispatch('clients/getKycDocument',this.account_id);
                    }).catch((err)=>{
                        apiErrorHandler(err, this.$notify);
                    }).finally(()=>{
                        this.isDeleting = false
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    }
</script>