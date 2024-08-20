<template>
    <div v-if="ticket" class="ticket d-flex flex-column">
        <div class="card-header p-3" style="height: 77px;">
            <div class="row">
                <div class="col-4 text-truncate">
                    <div><small>{{$t('client')}}</small></div>
                    <h4 class="mt--1 mb-0"><a @click.prevent="$router.push('/customers/details/'+ticket.account.contact.id)" v-if="ticket && ticket.account && ticket.account.contact">{{name}}</a></h4>
                </div>
                <div class="col-4 text-truncate mx-auto text-center">
                    <h4 class="mb-0">{{ticket.subject}}</h4>
                    <div class="badge badge-light">{{$t('created_at')}} {{$d(new Date(ticket.created_at), 'short')}}</div>
                </div>
                <div class="col-4 my-auto">
                    <div class="float-right">
                        <Status v-bind:status='ticket.support_status' class="mr-2" />
                     <base-dropdown
            title-classes="btn btn-sm mr-0"
            menu-on-right
            :has-toggle="false"
            v-if="hasEditAccess"

          >
            <template slot="title">
              <i class="fas fa-ellipsis-v"></i>
            </template>

            <a class="dropdown-item"  @click.prevent="confirmClosing" v-if="shouldShowMessageBoxAndCloseTicket()">
                <div class="d-flex" style="min-width:200px">
                    <div>
                        <i class="lnir lnir-lock-alt"></i>
                    </div>
                    <div class="flex-fill ml-2">
                        <h4 class="mb-0">{{ $t("close_ticket") }}</h4>
                        <div class="text-wrap"><small>{{$t('close_ticket_message')}}</small></div>
                    </div>
                </div>

            </a>
            <a class="dropdown-item"  @click.prevent="confirmOpening" v-else>
                <div class="d-flex" style="min-width:200px">
                    <div>
                        <i class="lnir lnir-unlock-alt"></i>
                    </div>
                    <div class="flex-fill ml-2">
                        <h4 class="mb-0">{{ $t("open_ticket") }}</h4>
                        <div class="text-wrap"><small>{{$t('open_ticket_message')}}</small></div>
                    </div>
                </div>
            </a>
          </base-dropdown>
          </div>
                </div>
            </div>
        </div>
        <div class="post-box p-3 d-flex flex-column justify-content-between overflow-hidden">
            <div class="message-area" id="message-area flex-grow-1">
            <div v-for="m in groupedMessages" :key="m.id" class="mx-auto">

              <div class="d-flex justify-content-center align-items-center">
                <div class="badge badge-light">{{displayDate(m.date)}}</div>
              </div>
              

              <MessageElement v-for="message in m.messages" :key="message.id" :ticket="ticket" :message="message" :id="'message-'+message.id" @handleDeletedMessage="handleDeletedMessage"></MessageElement>

            </div>
              <div class="badge badge-light" v-if="displayClosedBy()">{{formatTextClosedBy()}}</div>
            </div>

            <div class="write-area" v-if="shouldShowMessageBoxAndCloseTicket()">
              <textarea type="text" class="chat-input mt-3" :placeholder="$t('write_answer')" rows="5" v-model="messageText"></textarea>
              <base-button type="primary" class="float-right mt-2" @click="sendMessage"  :disabled="isSending || !messageText ||messageText==''">{{$t('send_message')}}<span class="btn-inner--icon ml-1"><i class="fa fa-paper-plane"></i></span></base-button>
            </div>
        </div>

    </div>
    <div v-else class="d-flex flex-fill justify-content-center align-items-center h-100">
      <div class="text-center">
        <i class="lnir lnir-message-incoming lnir-32"></i>
        <div>{{$t('select_ticket')}}</div>
      </div>
    </div>
</template>
<script>
import {Badge} from '@/components/argon-core';
import moment from 'moment';
import MessageElement from '@/components/Support/MessageElement';
import Status from '@/components/Support/Status';
import { mapGetters } from "vuex";
 import {  MessageBox } from 'element-ui';
import { canEditSupportTicket } from '@/permissions';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    props:{
        propsTicket:{
            type: Object,
            default: null
        }
    },
    components:{
        Badge,
        MessageElement,
        Status
    },
    data(){
        return{
            groupedMessages:[],
            messageText:null,
            isSending:false,
            refresher:null,
            ticket:null
        }
    },
    destroyed(){
        if(this.refresher)
        {
            clearInterval(this.refresher);
        }
    },
    mounted(){
        this.$confirm = MessageBox.confirm
        if(this.ticket && this.ticket.messages.length > 0 )
        {
            this.groupMessages();
            var messageArea = this.$el.querySelector("#message-area");
            messageArea.scrollTop = messageArea.scrollHeight;
        }
        if(this.ticket && this.ticket.support_status.name_translation_key != 'closed')
        {
            /*this.refresher = setInterval(()=>{
                this.fetchDetails();
            },5000);
            if(this.statuses.length == 0){
                this.$store.dispatch('support/fetchStatuses');
            }*/

        }
        if(this.statuses.length == 0)
        {
            this.$store.dispatch("support/fetchStatuses");
        }
    },
    computed:{
        ...mapGetters({
            data: "support/latestList",
            statuses: "support/statuses"
        }),
        name(){
            if(this.ticket && this.ticket.account && this.ticket.account.contact)
            {
                let name = this.ticket.account.contact.name;
                if(this.ticket.account.contact.person_data)
                {
                    name+=' '+this.ticket.account.contact.person_data.surname;
                }
                return name;
            }
            else
            {
                return '';
            }
        },
        hasEditAccess(){
          return canEditSupportTicket() ;
        }
    },
    watch:{
        propsTicket:{
            handler(newval, oldval){
                if((newval && !oldval)||(oldval && newval && oldval.id!=newval.id))
                {
                    this.fetchDetails(this.propsTicket.id)
                }
            },immediate:true
        }
    },
    updated(){
        if(this.ticket && this.ticket.messages && this.ticket.messages.length>0)
        {
            let lastMessage = this.ticket.messages[this.ticket.messages.length-1]
            var messageArea = this.$el.querySelector("#message-"+lastMessage.id.toString());
            if(messageArea)
                messageArea.scrollIntoView();
        }

    },
    methods:{
        groupMessages()
        {
            if(this.ticket && this.ticket.messages.length > 0 )
            {
                this.ticket.messages.forEach((element,index)=>{
                    const creationDate = moment(element.created_at);
                    const pureDate = moment({year:creationDate.get('year'),month:creationDate.get('month'),date:creationDate.get('date')});
                    let goupMessage = this.groupedMessages.find(x=>pureDate.isSame(x.date));
                    if(goupMessage)
                    {
                        goupMessage.messages.push(element);
                    }
                    else
                    {
                        this.groupedMessages.push({
                            id:index,
                            date:pureDate,
                            messages:[element]
                        })
                    }
                })
            }
        },
        displayDate(date)
        {
            const today = moment();
            if(date.get('year') == today.get('year') && date.get('month') == today.get('month') && date.get('date') == today.get('date'))
            {
                return this.$t('today')
            }
            else
            {
                return this.$d(date);
            }
        },
        shouldShowMessageBoxAndCloseTicket()
        {
            return (this.ticket && this.ticket.support_status && this.ticket.support_status.name_translation_key!='closed' && this.hasEditAccess);
        },
        sendMessage(){
            const user = this.$store.getters["auth/user"];
            let data ={
            "created_by": user.account.id,
            "message": this.messageText,
            "support_ticket_id": this.ticket.id
            };
            this.isSending = true;
            this.$store.dispatch('support/sendMessage',data).then((data)=>{
                this.groupedMessages = [];
                this.groupMessages();
                this.messageText = null;
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSending = false;
            })
        },
        closeTicket(){
            if(this.statuses.length>0)
            {
                const closedStatus = this.statuses.find(x=>x.name_translation_key == 'closed');
                if(closedStatus)
                {
                    const payload = {
                        id:this.ticket.id,
                        data:{
                            support_status_id : closedStatus.id
                        }
                    }
                    this.isSending = true;
                    this.$store.dispatch('support/updateTicket',payload).then((data)=>{
                        this.ticket = {...data};
                        this.$notify({type:'success',message:this.$t('ticket_closed_successfully'),duration:5000});
                    }).catch((err)=>{
                        apiErrorHandler(err,this.$notify);
                    }).finally(()=>{
                        this.isSending = false
                    })
                }
            }
        },
        openTicket(){
            if(this.statuses.length>0)
            {
                const openStatus = this.statuses.find(x=>x.name_translation_key == 'open');
                if(openStatus)
                {
                    const payload = {
                        id:this.ticket.id,
                        data:{
                            support_status_id : openStatus.id
                        }
                    }
                    this.isSending = true;
                    this.$store.dispatch('support/updateTicket',payload).then((data)=>{
                        this.ticket = {...data};
                        this.$notify({type:'success',message:this.$t('ticket_opened_successfully'),duration:5000});
                    }).catch((err)=>{
                        apiErrorHandler(err,this.$notify);
                    }).finally(()=>{
                        this.isSending = false
                    })
                }
            }
        },
        confirmOpening() {
        this.$confirm(this.$t('are_you_sure_you_want_to_open_ticket'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.openTicket();
        });

      },
        confirmClosing() {
        this.$confirm(this.$t('are_you_sure_you_want_to_close_ticket'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          this.closeTicket();
        });

      },
      fetchDetails(id){
        if(this.propsTicket)
        {
            this.$store.dispatch('support/getDetails',id).then((data)=>{
                    this.ticket = {...data};
                    this.groupedMessages = [];
                    this.groupMessages();


                })
        }

      },
      displayClosedBy()
        {
            return this.ticket && this.ticket.support_status && this.ticket.support_status.name_translation_key=="close" && this.ticket.updatedBy && this.ticket.updated_at;
        },
        formatTextClosedBy()
        {
            if(this.ticket && this.ticket.updatedBy && this.ticket.updated_at && this.ticket.updatedBy.contact)
            {
                let name = this.ticket.updatedBy.contact.name;
                if(this.ticket.updatedBy.contact.person_data)
                {
                    name+=' '+this.ticket.updatedBy.contact.person_data;
                }
                let updatedAt = this.$d(new Date(this.ticket.updated_at),'short');
                return this.$t('ticket_closed_by')+'<strong>'+name+'</strong>'+this.$t('at')+'<strong>'+updatedAt+'</strong>'
            }

        },
        handleDeletedMessage(deletedMessageId){
            const oldTicket = {...this.ticket}
            this.ticket.messages = this.ticket.messages.filter(item => item.id != deletedMessageId)
            this.groupedMessages = []
            this.groupMessages()
            this.$store.dispatch('support/deleteSupportMessage', deletedMessageId)
            .then((result) => {
                this.$notify({type:'success',message:this.$t('entry_deleted_successfully'),duration:5000});
            }).catch((err) => {
                this.$notify({type:'danger',message:this.$t('entry_deleted_failed'),duration:5000});
                this.ticket = oldTicket
                this.groupedMessages = []
                this.groupMessages()
            });
        }
    }
}
</script>
<style scoped>
.chat-input {

  background-color : #F5F5F5;
  width: 100%;
    border: white 0 solid;
    padding: 10px;
}
.chat-icon{
    position: absolute;
    width: 20px;
    right: 45px;
    bottom: 35px
}
.message-area{
    overflow-x: hidden;
  /*
    height: 40vh;
    max-height: 40vh;
    */

    width: 100%;

    margin: 0 auto;
}
.write-area {
     margin: 0 auto;
  position: relative;
  bottom: 0;
  height: auto;
  width: 100%;
}

.ticket {
  height: 100%;
  max-height: 100%;
}
.post-box {
  flex:1;
}
</style>
