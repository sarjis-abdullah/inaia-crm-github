import { getUniqueListBy } from "../helpers/helpers";

const includes = "creater,contacts,support_status,person_data";
const detailsIncludes = "messages,creater,contacts,owner,support_status,person_data";

export const state = () => ({
    list: null,
    details: null,
    ticketDetails: null,
    statuses:[],
    latestList:[],
    isLoadingStatuses:false
});
const initialState  = state();
export const getters = {
    list:state=>state.list,
    details:state=>state.details,
    statuses:state=>state.statuses,
    latestList:state => state.latestList,
    isLoadingStatuses:state => state.isLoadingStatuses,
    ticketDetails:state => state.ticketDetails,
}
export const mutations = {
    list(state, list) {
        let page = list.meta.current_page;
        if(page == 1)
        {
            state.list  = list.data
        }
        else{
            state.list = state.list.concat(list.data);
        }
        
    },
    setTicketDetails(state, data) {
        state.ticketDetails   = data;
        state.list = state.list.map(item => {
            if (item.id == data.id) {
                return {
                    ...item,
                    ...data
                }
            }
            return item
        })
    },
    adNewTicketMessage(state, data) {
        state.ticketDetails.messages.push(data)
    },
    statuses(state,list){
        state.statuses = list;
    },
    latestList(state,list){
        state.latestList = list;
    },
    isLoadingStatuses(state,value)
    {
        state.isLoadingStatuses = value;
    },
    deleteSupportMessage(state,payload)
    {
        state.ticketDetails.messages = state.ticketDetails.messages.filter(item => item.id != payload.id)
    },
}
export const actions = {
    fetchList(context,payload){
        return this.$axios.get(`/support-tickets?include=${includes}${ payload }`)
                .then(res => {
                    context.commit('list', res.data)
                    return res.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    fetchStatuses(context){
        if(!this.isLoadingStatuses)
        {
            context.commit('isLoadingStatuses',true);
            return this.$axios.get(`/support-statuses`)
                .then(res => {
                    context.commit('statuses', res.data.data)
                    return res
                }).catch(err => {
                    return Promise.reject(err)
                }).finally(()=>{
                    context.commit('isLoadingStatuses',false);
                })
        }
        
    },
    getDetails(context,payload){
        return this.$axios.get(`/support-tickets/${ payload }?include=${detailsIncludes}`)
                .then(res => {
                    context.commit('setTicketDetails', res.data.data)
                    return res.data.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    fetchLatestChat(context,payload){
        return this.$axios.get(`/support-tickets?include=${includes}${ payload }`)
                .then(res => {
                    context.commit('latestList', res.data.data)
                    return res.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    sendMessage(context,payload){
        return this.$axios.post('/support-messages?include=owner,contacts,person_data',payload).then(res=>{
            context.commit('adNewTicketMessage',res.data.data);
            return res.data.data;
        })
    },
    deleteSupportMessage(context,payload){
        return this.$axios.delete('/support-messages/' + payload.id).then((result) => {
            context.commit('deleteSupportMessage', payload)
            return Promise.resolve(payload)
        }).catch((err) => {
            return Promise.reject(err)
        });
    },
    updateTicket(context,payload){
        return this.$axios.put(`/support-tickets/${ payload.id }?include=${detailsIncludes}`,payload.data)
        .then(res => {
            context.commit('setTicketDetails', res.data.data)
            return res.data.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    }
}



