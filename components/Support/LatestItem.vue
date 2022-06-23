<template>
    <a @click.prevent="() => $router.push('/support-tickets/details/'+ticket.id)">
    <div class="row item-container border-bottom p-3" v-if="ticket">
        <div class="col-2 my-auto">
            <div class="rounded-circle avatar" v-if="ticket.account && ticket.account.contact">
                <img :src="avatar"/>
            </div>
        </div>
        <div class="col-7 my-auto text-truncate">
            <div class="text-muted"><small>{{name}}</small></div>
            <div class="h3 mt--1" :style="selectedStyle">{{ticket.subject}}</div>
            <div class="text-muted mt--2"><small># {{ticket.id}}</small></div>
        </div>
        <div class="col-3  my-auto">
            <Status v-bind:status='ticket.support_status.name_translation_key' class="float-right">{{ticket.support_status ? $t(ticket.support_status.name_translation_key) : ticket.support_status_id}}</Status>
             <div class="text-muted float-right"><small>{{$d(new Date(ticket.created_at), 'short')}}</small></div>
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
        }
    }
}
</script>
<style scoped>
.item-container{
    cursor: pointer;
}
.item-container:hover{
    opacity: 0.7;
}
</style>