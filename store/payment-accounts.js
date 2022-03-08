export const state = () => ({
    paymentAccounts:[]
})
const initialState  = state()

export const getters = {
    paymentAccounts : (state)=>state.paymentAccounts 
        
}
export const mutations = {
    paymentAccounts(state, list) {
        state.paymentAccounts  = list
    },
    
}
export const actions = {
    getPaymentAccountByUser(context,payload) {
        return this.$axios
                .get(`${ process.env.paymentsApiUrl }/accounts/${payload}/payment-accounts`).then(res=>{
                    context.commit('paymentAccounts', res.data.data)
                    return res.data.data;
                })
    },
}