export const actions={
    getMasterAccountInfo (context){
        return this.$axios
                .get(`${ process.env.bankingApiUrl }/banking-accounts/inaia/master`).then(res=>{
                    return res.data;
                })
    },

    getBankingAccountDetails(context, payload) {
      return this.$axios
        .get(process.env.bankingApiUrl + '/banking-accounts/account-id/' + payload)
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.log('error-fetch', error)
          return Promise.reject(error)
        })
    },

    getBankingTransactions(context, payload) {
      return this.$axios
        .get(process.env.bankingApiUrl + '/banking-transactions' + payload)
        .then(response => {
          return response.data
        })
        .catch(error => {
          console.log('error-fetch', error)
          return Promise.reject(error)
        })
    },

}
