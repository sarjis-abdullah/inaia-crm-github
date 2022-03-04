export const actions = {
    getPaymentAccountByUser(context,payload) {
        return this.$axios
                .get(`${ process.env.paymentsApiUrl }/accounts/${payload}/payment-accounts`).then(res=>{
                    return res.data.data;
                })
    },
}