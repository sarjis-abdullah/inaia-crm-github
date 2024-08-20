<template>
    <div class="d-flex flex-fill flex-column justify-content-center">
        <div class="p-3 my-2 rounded-lg" :style="background">
            <div>
                <div class="d-flex justify-content-between">
                    <span>
                        <span>{{name}}</span> 
                        <span class="text-muted">
                            <small>
                                {{formatTime(message.created_at)}}
                            </small>
                        </span>
                    </span>
                    <span v-if="checkAbilityToDelete">
                        <base-dropdown 
                        title-classes="btn btn-sm mr-0"
                        menu-on-right
                        :has-toggle="false">
                            <template slot="title">
                                <i class="fas fa-ellipsis-v"></i>
                            </template>
                            <a href="#!" class="px-3" @click.prevent="showConfirmModal = true">
                                <span>{{ $t('delete') }}</span>
                            </a>
                        </base-dropdown>
                    </span>
                </div>
                <div>{{message.message}}</div>
            </div>
        </div>
        <modal
            :show.sync="showConfirmModal"
            headerClasses=""
            bodyClasses="pt-0"
            footerClasses="border-top bg-secondary"
            @close="closeModal"
            :allowOutSideClose="false"
        >
            <template slot="header">
                <h5 class="modal-title">{{ $t("delete_message_confirmation") }}</h5>
                <span></span>
            </template>
            <template slot="footer">
                <base-button type="link" class="ml-auto" @click="closeModal()">
                    {{ $t("cancel") }}
                </base-button>
                <base-button
                    type="danger"
                    @click="() => confirmDeleteMessage()"
                    :disabled="isSubmitting"
                >
                    {{ $t("delete") }}
                </base-button>
            </template>
        </modal>
    </div>
    
</template>
<script>
import { mapGetters } from "vuex";
import moment from 'moment'

export default {
    data() {
        return {
            showConfirmModal: false,
            isSubmitting: false,
        }
    },
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
        },
        ...mapGetters({
            authUser: "auth/user",
        }),
        authUserId(){
            if (this.authUser && this.authUser.account && this.authUser.account.id) {
                return this.authUser.account.id
            }
            return null
        },
        checkAbilityToDelete(){
            if (!this.message.created_at || !this.message.created_by) {
                return false
            }

            const givenDate = moment(this.message.created_at);
            const now = moment();

            const isMoreThan7Days = now.diff(givenDate, 'days') > 7;
            if (isMoreThan7Days) {
                return false
            }

            const messageCreatedByAuthUser = this.authUserId && this.authUserId == this.message.created_by
            if (messageCreatedByAuthUser) {
                return true
            }
            return false
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
        },
        closeModal(){
            this.showConfirmModal = false
        },
        confirmDeleteMessage(){
            this.showConfirmModal = false
        },
    }
}
</script>
<style scoped>

</style>