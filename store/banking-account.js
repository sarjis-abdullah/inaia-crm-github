export const actions={
    getInaiaBankingAccountInfo (context){
        return this.$axios
                .get(`${ process.env.bankingApiUrl }/banking-accounts/inaia/master`).then(res=>{
                    return res.data;
                })
    }
}