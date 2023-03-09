
const includes="depot_name";
export const state =()=>({
    commissions:[],
    salesAdvisors:[]
})
const initialState  = state();
export const getters = {
    commissions:state=>state.commissions,
    salesAdvisors:state=>state.salesAdvisors
}
export const mutations = {
    commissions(state,list){
        state.commissions = list;
    },
    salesAdvisors(state,list){
        state.salesAdvisors = list;
    },
    addNew(state,commission){
        state.commissions.unshift(commission);
    },
    delete(state,id){
        const index = state.commissions.findIndex(x=>x.id == id);
            state.commissions.splice(index,1);
    },
    edit(state,commission){
        let edited = state.commissions.find(c=>c.id==commission.id);
        Object.assign(edited,commission);
    }
}
export const actions ={
    fetchList(context, payload) {
        return this.$axios.get(`${ process.env.golddinarApiUrl }/sales-commissions?include=${includes}${ payload?payload:'' }`)
            .then(res => {
                context.commit('commissions', res.data.data)
                return res.data.meta;
            })
    },
    fetchSalesAdvisors(context){
        return this.$axios.get('/sales-advisors?include=contacts,person_data,channels&only=contacts.name,person_data.surname,channels.value').then(res=>{
            context.commit('salesAdvisors', res.data.data)
            return res.data.meta;
        })
    },
    addNew(context,payload){
        return this.$axios.post(`${ process.env.golddinarApiUrl }/sales-commissions?include=${includes}`,payload)
            .then(res => {
                context.commit('addNew', res.data.data)
                return res.data.data;
            })
    },
    deleteCommission(context,payload){
        return this.$axios.delete(`${ process.env.golddinarApiUrl }/sales-commissions/${payload}`).then(res=>{
            context.commit('delete',payload);
        })
    },
    edit(context,payload){
        return this.$axios.put(`${ process.env.golddinarApiUrl }/sales-commissions/${payload.id}?include=${includes}`,payload)
            .then(res => {
                context.commit('edit', res.data.data)
                return res.data.data;
            })
    }

}