<template>
    <a @click.prevent="() =>selectTicket()" class="d-block">
      <div class="d-flex justify-content-between align-items-center item-container border-bottom px-3 py-2" v-if="ticket">

        <div class="media align-items-center my-auto">
          <div class="avatar mr-3" v-if="ticket.account && ticket.account.contact">
            <img v-bind:src="avatar" alt="" />
          </div>
          <div class="media-body">
            <div class="text-muted"><small>{{name}}</small></div>
            <div class="title h3 mb-0 mt--1 text-truncate" :style="selectedStyle">{{ticket.subject}}</div>
            <!--<div class="text-muted mt--3"><small># {{ticket.id}}</small></div>-->
          </div>
        </div>

        <div class="text-right">
          <div><Status v-bind:status='ticket.support_status.name_translation_key'>{{ticket.support_status ? $t(ticket.support_status.name_translation_key) : ticket.support_status_id}}</Status></div>
          <div class="text-muted"><small>{{$d(new Date(ticket.created_at), 'short')}}</small></div>
        </div>
      </div>
    </a>
</template>
<script>
import Status from '@/components/Support/Status';

export default {
    props:{
        ticket:{
            typpe:Object,
            default:null
        },
        isSelected:{
            type:Boolean,
            default:false
        }
    },
    components:{
        Status
    },
    computed:{
        avatar() {
          if (this.ticket && this.ticket.account && this.ticket.account.contact && this.ticket.account.contact.avatar) return this.ticket.account.contact.avatar;
          else if (this.ticket.account && this.ticket.account.contact && this.ticket.account.contact.person_data) {
            let gender = this.ticket.account.contact.person_data.gender ? this.ticket.account.contact.person_data.gender.toLowerCase() : ''
            if (gender == 'female' || gender == 'f') {
              return '/img/theme/avatar_f.png'
            }
          }
          return '/img/theme/avatar_m.png'
        },
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
        selectedStyle(){
            return{
                color:this.isSelected ? '#0074d9' : '#000'
            }
        },

    },
    methods:{
        selectTicket()
        {
            this.$emit('ticketSelected',this.ticket);
        }
    }
}
</script>
<style scoped>
.item-container{
    cursor: pointer;
}
.item-container:hover{
    background:#f6f9fc;
}
.avatar {
  border-radius: 100%;
  overflow: hidden;
  align-items: unset;
}
.avatar img {
  object-fit: cover;
}
.title {
  max-width: 220px
}
</style>
