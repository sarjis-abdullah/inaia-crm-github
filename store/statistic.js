export const state = () => {
    return {
        golddinarStats:null,
        customersStat:null,
    }
}
const initialState  = state();
export const getters = {
    golddinarStats:state=>state.golddinarStats,
    customersStat:state=>state.customersStat
}
export const mutations = {
    golddinarStats(state,list){
        state.golddinarStats = list;
    },
    customersStat(state,list){
        state.customersStat = list;
    }
}
export const actions ={
    getGoldDinarStatistics(context) {
        return this.$axios.get(`${ process.env.golddinarApiUrl }/stats`)
            .then(res => {
                context.commit('golddinarStats', res.data.data)
                return res.data.data;
            })
    },
    getCustomerStatistics(context){
        return this.$axios.get('/stats').then(res=>{
            context.commit('customersStat', res.data.data)
            return res.data;
        })
    },

}