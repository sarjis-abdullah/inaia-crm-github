<template>
 <modal :show.sync="openDetailsModal" class="orderModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onDetailClose" :allowOutSideClose="false" @show="loadMessageBox">
                    <template slot="header" class="pb-0">
                        <div class="row w-100">
                            <div class="col-10 d-flex  align-items-center">
                                <h5 class="modal-title" v-if="!inboxMessage" >{{$t('new_inbox_message')}}</h5>
                                <h5 class="modal-title" v-else>{{inboxMessage.title}}</h5>
                            </div>
                             <div class="col-2 d-flex justify-content-end align-items-center">
                                <span v-if="!inboxMessage && local">
                                    <img src="/img/icons/flags/DE.png" v-if="local=='de'"/>
                                    <img src="/img/icons/flags/GB.png" v-if="local=='en'"/>
                                </span>
                                <span v-if="inboxMessage">
                                    <Badge type="default" v-if="isDraft">{{$t('draft')}}</Badge>
                                    <Badge type="success" v-if="!isDraft && inboxMessage.is_read">{{$t('read')}}</Badge>
                                    <Badge type="default" v-if="!isDraft && !inboxMessage.is_read">{{$t('unread')}}</Badge>
                                </span>
                            </div>
                        </div>
                    </template>
    <div class="row" v-if="!isLoading">
        <div class="col">
            <el-input class="my-3"  :placeholder="$t('title')" v-model="title" :disabled="inboxMessage && !isDraft">

            </el-input>
            <el-input
                type="textarea"
                class="mb-3"
                :autosize="{ minRows: 2, maxRows: 4}"
                v-model="summary"
                :placeholder="$t('summary')"
                :disabled="inboxMessage && !isDraft">
            </el-input>
            <h5>{{$t('message_text')}}</h5>
            <client-only>
                <VueEditor :editorToolbar="customToolbar" v-model="text" v-if="!inboxMessage || isDraft"/>
                <div v-if="!isDraft" v-html="text">

                </div>
            </client-only>
            <div class="my-3" >
                <Document  v-for="doc in documents" 
                :key="doc.key" class="mt-3" 
                :index="doc.key" 
                @deleted="deleteNewDocument"
                @dataChanged="onDataChanged"
                :document="doc.doc"
                :isDraft="isDraft"
                :inboxMessagesId="inboxMessage?inboxMessage.id:-1"
                :contactId="account?account.contact_id:-1"
                @documentAdded="onDocumentAdded"/>
            </div>
            <base-button class="my-3 w-100" type="link" @click="addNewDocument" v-if="isDraft">
                {{$t('add_new_document')}}
            </base-button>
        </div>
    </div>
    <div v-else class="d-flex flex-fill justify-content-center align-items-center">
        <loader />
    </div>
   
    <template slot="footer" v-if="!inboxMessage && hasEditAccess">
      <base-button type="link" class="ml-auto" @click="onDetailClose()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="secondary"
        @click="() => sendMessage(true)"
        :disabled="isSubmitting || !shouldEnableSave()"
      >
        {{ $t("save_as_draft") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => sendMessage(false)"
        :disabled="isSubmitting || !shouldEnableSave()"
      >
        {{ $t("send_message") }}
      </base-button>
    </template>
    <template slot="footer" v-if="inboxMessage && isDraft && hasEditAccess">
     <base-button
        type="danger"
        @click="() => deleteMessageBox()"
        :disabled="isSubmitting"
      >
        {{ $t("delete") }}
      </base-button>
      <base-button
        type="secondary"
        @click="() => updateMessage(true)"
        :disabled="isSubmitting || !shouldEnableSave()"
      >
        {{ $t("update_as_draft") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => updateMessage(false)"
        :disabled="isSubmitting || !shouldEnableSave()"
      >
        {{ $t("save_and_send") }}
      </base-button>
    </template>
    <template slot="footer" v-if="inboxMessage && !isDraft && hasEditAccess">
      <base-button type="link" class="ml-auto" @click="onDetailClose()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="danger"
        @click="() => deleteMessageBox()"
        :disabled="isSubmitting"
      >
        {{ $t("delete") }}
      </base-button>
    </template>
    
 </modal>
</template>
<script>
import { VueEditor } from "vue2-editor";
import Document from '@/components/InboxMessage/Document';
import Loader from '../common/Loader/Loader.vue';
import {Badge} from '@/components/argon-core';
import { canEditCustomers } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    props:{
        inboxMessage:{
            type: Object,
            default:null,
            
        },
        openDetailsModal:{
            type:Boolean,
            default:false
        },
        account:{
            type:Object,
            default:null
        }
    },
    components:{
        VueEditor,
        Document,
        Loader,
        Badge
    },
    data(){
        return {
            customToolbar: [
                ["bold", "italic", "underline"],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ['link']
      ],
      title:null,
      summary:null,
      text:null,
      documents:[],
      isSubmitting:false,
      isLoading : false
        }
    },
    mounted(){
        
    },
    computed:{
        local(){
            let local = null;
            if(this.account){
                this.account.settings.forEach(element=>{
                    if(element.name_translation_key == "locale")
                    {
                        local = element.value;
                    }
                })
            }
            return local;
        },
        isDraft(){
            if(this.inboxMessage){
                return this.inboxMessage.is_draft;
            }
            return true;
        },
        hasEditAccess(){
          return canEditCustomers();
        }
    },
    methods:{
        deleteNewDocument(index){
            const deletedIndex = this.documents.findIndex(x=>x.key==index);
            this.documents.splice(deletedIndex,1);
        },
        addNewDocument(){
            this.documents.push({
                key:this.documents.length,
                data:{}
            })
        },
        onDataChanged(data){
            const document = this.documents.find(x=>x.key==data.key);
            if(document)
            {
                document.data = data;
            }

        },
        onDetailClose(){

            this.openDetailsModal = false;
            this.$emit('close')
            this.title = null;
            this.summary = null;
            this.text = null;
            this.documents = [];
        },
        shouldEnableSave(){
            const messageDataFilled = this.title && this.summary && this.text;
            let documentDataFilled  = true;
            if(this.documents.length>0)
            {
                
                this.documents.forEach(element=>{
                    if(element.data && (!element.data.title || !element.data.file))
                    {
                        documentDataFilled = false;
                    }
                })
            }
            return messageDataFilled && documentDataFilled;
        },
        sendMessage(isDraft){
            let data ={
                title:this.title,
                summary:this.summary,
                message_text:this.text,
                is_draft:isDraft,
                account_id:this.account.id
            };
            let links = [];
            let formData = new FormData();
            this.documents.forEach(element=>{
                const linkData = {
                    display_text:element.data.title,
                    document_name:element.data.file.name,
                    contact_id:this.account.contact_id
                }
                links.push(linkData);
                formData.append('documents[]',element.data.file.raw);
            })
            if(links.length > 0)
            {
                data.links = links;
            }
            formData.append('data',JSON.stringify(data));
            this.isSubmitting = true;
            this.$store.dispatch('inboxMessage/postNewInboxMessage',formData).then(res=>{
                this.$notify({
                    type:'success',
                    message:this.$t('message_sent_successfully'),
                    duration:5000
                })
                this.onDetailClose();
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        updateMessage(isDraft){
            let newdata ={
                title:this.title,
                summary:this.summary,
                message_text:this.text,
                is_draft:isDraft
            };
            let data = {
                id:this.inboxMessage.id,
                data:newdata
            }
            this.isSubmitting = true;
            this.$store.dispatch('inboxMessage/updateInboxMessage',data).then(res=>{
                this.$notify({
                    type:'success',
                    message:this.$t('message_sent_successfully'),
                    duration:5000
                })
                this.onDetailClose();
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        loadMessageBox(){
            
            if(this.inboxMessage)
            {
                this.isLoading = true;
                this.$store.dispatch('inboxMessage/getInboxDetail',this.inboxMessage.id).then(res=>{
                    this.title = res.title;
                    this.summary = res.summary;
                    this.text = res.message_text;
                    res.documents.forEach((element,index)=>{
                        this.documents.push({
                            key:index,
                            doc:element
                        })
                    })
                }).finally(()=>{
                    this.isLoading = false;
                })
            }
        },
        deleteMessageBox(){
            this.isSubmitting = true;
            this.$store.dispatch('inboxMessage/deleteInboxMessage',this.inboxMessage.id).then(()=>{
                this.$notify({
                    type:'success',
                    message:this.$t('message_deleted_successfully'),
                    duration:5000
                })
                this.onDetailClose();
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        onDocumentAdded(data)
        {
            const deletedIndex = this.documents.findIndex(x=>x.key==data.key);
            this.documents.splice(deletedIndex,1);
            this.documents.push({
                key:this.documents.length,
                doc:data.document
            })
        }
    },
    
}
</script>
<style scoped>

</style>