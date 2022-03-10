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
    }
}