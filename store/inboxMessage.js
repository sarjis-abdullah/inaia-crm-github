const includes = 'include=documents,message_text'
export const state = () => ( {
    list:[],
    selectedMessage:null
});

const initialState  = state();
export const getters  = {
    list : state=>state.list,
    selectedMessage : state => state.selectedMessage
}

export const mutations = {
    list(state,list){
        state.list = list;
    },
    selectedMessage(state,inboxMessage)
    {
        state.selectedMessage = inboxMessage;
    },
    inboxMessageAdded(state,inboxMessage)
    {
        state.list.push(inboxMessage);
    },
    updateInboxMessage(state,inboxMessage)
    {
        state.selectedMessage = inboxMessage;
        if(state.list && state.list.length>0)
        {
            let message = state.list.find(x=>x.id == inboxMessage.id);
            if(message)
            {
                Object.assign(message,inboxMessage);
            }
        }
    },
    inboxLinkAdded(state,inboxLink)
    {
        if(state.selectedMessage && state.selectedMessage.links)
        {
            state.selectedMessage.links.push(inboxLink);
        }
    },
    inboxLinkDeleted(state,inboxLinkId)
    {
        if(state.selectedMessage && state.selectedMessage.links)
        {
            const index = state.selectedMessage.links.indexOf(x=>x.id == inboxLinkId);
            state.selectedMessage.links.splice(index,1);
        }
    },
    deleteInboxMessage(state,inboxMessageId)
    {
        if(state.list)
        {
            const index = state.list.indexOf(x=>x.id == inboxMessageId);
            state.list.splice(index,1);
        }
        if(state.selectedMessage && state.selectedMessage.id == inboxMessageId)
        {
            state.selectedMessage = null;
        }
    }
}

export const actions = {
    fetchList(context,payload){
        return this.$axios.get(`/inbox-message?include=account${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    getInboxDetail(context,payload)
    {
        return this.$axios.get(`/inbox-message/${ payload }?${includes}`)
                .then(res => {
                    context.commit('selectedMessage', res.data)
                    return res.data.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    postNewInboxMessage(context,payload){
        return this.$axios.post(`/inbox-message?include=account`,payload)
        .then(res => {
            context.commit('inboxMessageAdded', res.data.data)
            return res.data.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    },
    updateInboxMessage(context,payload){
        return this.$axios.put(`/inbox-message/${ payload.id }?${includes}`,payload.data)
        .then(res => {
            context.commit('updateInboxMessage', res.data.data)
            return res.data.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    },
    deleteInboxMessage(context,payload){
        return this.$axios.delete(`/inbox-message/${ payload }`)
        .then(res => {
            context.commit('deleteInboxMessage', payload)
            return res.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    },
    addnewLinkToInboxMessage(context,payload){
        return this.$axios.post(`/inbox-link`,payload)
        .then(res => {
            context.commit('inboxLinkAdded', res.data)
            return res.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    },
    deleteNewLinkFromInboxMessage(context,payload){
        return this.$axios.delete(`/inbox-link/${payload}`)
        .then(res => {
            context.commit('inboxLinkDeleted', payload)
            return res.data;
        }).catch(err => {
            return Promise.reject(err)
        })
    }
}