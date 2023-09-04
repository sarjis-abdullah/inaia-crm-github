export const state = () => ({
    paymentAccounts:[],
    paymentMethods:[]
})
const initialState  = state()

export const getters = {
    paymentAccounts : (state)=>state.paymentAccounts,
    paymentMethods : (state)=>state.paymentMethods
        
}
export const mutations = {
    paymentAccounts(state, list) {
        state.paymentAccounts  = list
    },
    paymentMethods(state,list){
        state.paymentMethods  = list
    },
    deletePaymentAccount(state,id){
        let index = state.paymentAccounts.findIndex(x=>x.id == id);
        state.paymentAccounts.splice(index,1);
    },
    addPaymentAccounts(state,data){
        state.paymentAccounts.unshift(data);
    }
    
}
export const actions = {
    getPaymentAccountByUser(context,payload) {
        return this.$axios
                .get(`${ process.env.paymentsApiUrl }/accounts/${payload}/payment-accounts`).then(res=>{
                    context.commit('paymentAccounts', res.data.data)
                    return res.data.data;
                })
    },
    getPaymentMethods(context,payload) {
        return this.$axios
        .get(`${ process.env.paymentsApiUrl }/payment-methods`).then(res=>{
            context.commit('paymentMethods', res.data.data)
            return res.data.data;
        })
    },
    deletebankaccount(context,payload){
        return this.$axios
        .delete(`${ process.env.paymentsApiUrl }/payment-account/${payload}`).then(res=>{
            context.commit('deletePaymentAccount', payload)
            return true;
        })
    },
    addbankaccount(context,payload){
        return this.$axios
                .post(`${ process.env.paymentsApiUrl }/payment-account/create`,payload).then(res=>{
                    context.commit('addPaymentAccounts', res.data.data)
                    return res.data.data;
                })
    }
}