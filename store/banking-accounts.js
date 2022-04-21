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

    getBankingAccounts(context, payload) {
      return this.$axios
        .get(process.env.bankingApiUrl + '/banking-accounts' + payload)
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
    getBankingAccountLimit(context,payload)
    {
        return this.$axios
                .get(process.env.bankingApiUrl +`/banking-accounts/${payload}/limits`)
                .then(res=>{
                    return res.data.data;
                })
    },
    blockCard(context,payload)
    {
      return this.$axios
              .post(process.env.bankingApiUrl+'/stop-card',payload).then(res=>{
                return res.data.data;
              })
    },
    resumeCard(context,payload)
    {
      return this.$axios
                .post(process.env.bankingApiUrl +`/cards/${payload}/resume`)
                .then(res=>{
                    console.log(res.data);
                    return res.data.data;
                })
    },
    reIssueCard(context,payload)
    {
      return this.$axios
                .post(process.env.bankingApiUrl +`/cards/${payload.id}/reissue`,payload.data)
                .then(res=>{
                    return res.data.data;
                })
    }

}
