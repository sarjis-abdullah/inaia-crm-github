export const actions={
    getInaiaBankingAccountInfo (context){
        return this.$axios
                .get(`${ process.env.bankingApiUrl }/banking-accounts/inaia/master`).then(res=>{
                    return res.data;
                })
    },

    getBankingAccountDetails (context, payload){
      return this.$axios
        .get(`${ process.env.bankingApiUrl }/banking-accounts/account-id/${ payload }`).then(res=>{
          context.commit('details', res.data.data);
          return res.data;
        }).catch((err) => {
          // console.error('axios error during detailing role', err)
          return Promise.reject(err)
        })
  }

}
