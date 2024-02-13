<template>
    <div class="row justify-content-center align-items-center" v-if="!document">
                    <div class="col-5">
                        <el-input :placeholder="$t('document_title')" v-model="documentTitle" @change="onDataChanged"></el-input>
                    </div>
                    <div class="col-4">
                        <Upload
                            class="upload-demo"
                            :on-remove="handleRemove"
                            :multiple="false"
                            :on-change="onfileChanged"
                            >
                            <Button size="small" type="primary">{{$t('upload_document')}}</Button>
                            </Upload>
                    </div>
                    <div class="col-3">
                        <icon-button type="delete" @click="() => deleteNewDocument()"></icon-button>
                        <icon-button type="confirm" @click="() => saveDocument()" v-if="isDraft" :disabled="isSubmitting"></icon-button>
                    </div>
                </div>
    <div v-else class="row">
        <div class="col-10">
                        <a :href="document.document.link" target="_blanc">{{document.display_text}}</a>
                    </div>
                    <div class="col-1" v-if="isDraft">
                        <icon-button type="delete" @click="() => deleteOldDocument()" :disabled="isSubmitting"></icon-button>
                        
                    </div>
    </div>
</template>
<script>
import { Upload,Button } from "element-ui";
import IconButton from '@/components/common/Buttons/IconButton';
import { json } from 'd3';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    props:{
        document:{
            type:Object,
            default:null
        },
        index:{
            type:Number,
            default:-1
        },
        isDraft:{
            type:Boolean,
            default:true
        },
        contactId:{
            type:Number,
            default:-1
        },
        inboxMessagesId:{
            type:Number,
            default:-1
        }
    },
    components:{
        Upload,
        Button,
        IconButton
    },
    data(){
        return{
            documentTitle:null,
            file:null,
            isSubmitting:false
        }
    },
    methods:{
        deleteNewDocument(){
            this.$emit('deleted',this.index);
        },
        onfileChanged(file){
            this.file = file;
            this.onDataChanged()
        },
        onDataChanged(){
            this.$emit('dataChanged',{
                key:this.index,
                title:this.documentTitle,
                file:this.file,
            })
        },
        handleRemove(){
            this.file = null;
            this.onDataChanged();
        },
        saveDocument(){
            if(this.file && this.documentTitle)
            {
                let data = {
                    "display_text":this.documentTitle,
                    "document_name":this.file.name,
                    "inbox_messages_id":this.inboxMessagesId,
                    "contact_id":this.contactId
                }
                let formData = new FormData();
                formData.append("data",JSON.stringify(data));
                formData.append('document',this.file.raw);
                this.isSubmitting = true;
                this.$store.dispatch('inboxMessage/addnewLinkToInboxMessage',formData).then((res)=>{
                    this.$emit('documentAdded',{
                        key:this.index,
                        document:res
                    });
                        this.$notify({
                        type:'success',
                        message:this.$t('document_saved_successfully'),
                        duration:5000
                    })
                    
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
                    
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
            else if(!this.file)
            {
                this.$notify({
                    type:'warning',
                    message:this.$t('plesae_select_file'),
                    duration:5000
                })
            }
            else if(!this.documentTitle)
            {
                this.$notify({
                    type:'warning',
                    message:this.$t('please_choose_document_title'),
                    duration:5000
                })
            }
        },
        deleteOldDocument(){
            if(this.document)
            {
                this.isSubmitting = true;
                this.$store.dispatch('inboxMessage/deleteNewLinkFromInboxMessage',this.document.id).then(()=>{
                    this.$emit('deleted',this.index);
                    this.$notify({
                        type:'success',
                        message:this.$t('document_deleted_successfully'),
                        duration:5000
                    })
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
                }).finally(()=>{
                    this.isSubmitting = false;
                })
            }
        }
    }
}
</script>