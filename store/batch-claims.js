export const state = () =>{
    return {
       list:[]
    }
}
const initialState = state();
export const getters = {
    list:state=>state.list
}
export const mutations = {
    list(state,list){
        state.list = list
    }
}
export const actions = {
    getListOfBatchClaims(context,payload){
        return this.$axios
                .get(`${process.env.golddinarApiUrl}/claim-batch-processes?${payload}`)
                .then(res=>{
                    context.commit('list',res.data.data);
                    return res.data;
                })
    },
    createNewBatchProcess(context,payload){
        return this.$axios
                .post(`${process.env.golddinarApiUrl}/claim-batch-processes?`,payload)
                .then(res=>{
                    
                    return res.data;
                })
    }
}