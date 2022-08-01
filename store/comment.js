export const state = ()=>{
    return {
        comments:[]
    }
}

const initialState = state();
export const getters = {
    comments: state=>state.comments
}
export const mutations = {
    comments(state,data){
        if(data.meta.current_page == 1)
        {
            state.comments = data.data;
        }
        else{
            state.comments = state.comments.concat(data.data)
        }
        
    },
    addComment(state,comment){
        state.comments.unshift(comment);
    },
    updateComment(state,comment){
        let oldComment = state.comments.find(c=>c.id==comment.id);
        if(oldComment)
            Object.assign(oldComment,comment);
    },
    deleteComment(state,commentId){
        let index = state.comments.indexOf(x=>x.id==commentId);
        if(index > -1)
        {
            state.comments.splice(index,1);
        }
    }
}
export const actions = {
    fetchList(context,payload){
        return this.$axios.get(`/comments?include=created_by,contacts,person_data${payload}`).then(res=>{
            context.commit('comments',res.data);
            return Promise.resolve(res.data);
        })
    },
    addComment(context,payload){
        return this.$axios.post(`/comments?include=created_by,contacts,person_data`,payload).then(res=>{
            context.commit('addComment',res.data.data);
            return res.data.data;
        })
    },
    updateComment(context,payload){
        return this.$axios.put(`/comments/${payload.id}?include=created_by,contacts,person_data`,payload.data).then(res=>{
            context.commit('updateComment',res.data.data);
            return res.data.data;
        })
    },
    deleteComment(context,payload){
        return this.$axios.delete(`/comments/${payload}`).then((res)=>{
            context.commit('deleteComment',payload);
        })
    }
}