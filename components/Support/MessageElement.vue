<template>
    <div class="d-flex flex-fill flex-column justify-content-center">
        <div class="p-3 my-2 rounded-lg" :style="background">
            <h4>{{name}} <span class="text-muted"><small>{{formatTime(message.created_at)}}</small></span></h4>
            <div>{{message.message}}</div>
        </div>
    </div>
    
</template>
<script>
export default {
    props:{
        ticket:{
            type:Object,
            default:null
        },
        message:{
            type:Object,
            default:null
        }
    },
    computed:{
        background(){
            return{
                "background-color":this.ticket.account_id == this.message.created_by?"#F9F9F9":"#DFEEFF",
                "align-self":this.ticket.account_id == this.message.created_by?"flex-start":"flex-end",
                'width':'400px'
            }
        },
        name(){
            let name = "";
            if( this.message && this.message.owner){
                name = this.message.owner.contact.name;
                if(this.message.owner.contact.person_data)
                {
                    name+=' '+this.message.owner.contact.person_data.surname;
                }
                return name;
            }
        }
    },
    methods:{
        formatTime(date)
        {
            let d = new Date(date);
            let hours = d.getHours();
            if(hours<10)
            {
                hours = "0"+hours;
            }
            let minutes = d.getMinutes();
            if(minutes < 10 )
            {
                minutes = "0"+minutes;
            }
            return hours+":"+minutes;
        }
    }
}
</script>
<style scoped>

</style>