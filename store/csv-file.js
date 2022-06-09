export const state = ()=>{
    return {
        csvFiles:[]
    }
}
const initialState = state();
export const getters = {
    csvFiles:state=>state.csvFiles
}
export const mutations = {
    csvFiles(state,list){
        state.csvFiles = list;
    }
}
export const actions = {
    downloadCsv(context,payload){
        return this.$axios.post(`${ process.env.golddinarApiUrl }/orders/savings-plan/export?order_process_id=${ payload }`)
                .then(res => {
                    return res.data.data;
                })
    },
    fetchList(context,payload){
        return this.$axios.get(`${ process.env.golddinarApiUrl }/orders/savings-plan/csv?${ payload }`)
                .then(res => {
                    context.commit('csvFiles',res.data.data)
                    return res.data;
                })
    }
}