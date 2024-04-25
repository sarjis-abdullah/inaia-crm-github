import moment from 'moment';

const LIFETIME = 10;
function _testIfStillValid(lastUpdate,lifetime)
{
    const now = moment();
    const minutes = now.diff(lastUpdate,'minutes');
    return minutes <= lifetime;

}

export const state = () =>{
    return {
        loadedSummariesByYear : [],
        claimStatuses : [],
        aggregatedClaims : [],
        claims:[],
        claimTypes : [],
    }
}

const initialState = state();

export const getters = {
    summaryByYear:(state)=>(year)=>{
        const loadedYear = state.loadedSummariesByYear.find(x=>x.year == year);
        if(loadedYear && _testIfStillValid(loadedYear.loadTime,LIFETIME))
        {
            return loadedYear.data;
        }
        return null;

    },
    aggregatedClaims:state=>state.aggregatedClaims,
    claimStatuses:state=>state.claimStatuses,
    claims:state=> state.claims,
    claimTypes:state=>state.claimTypes,
}

export const mutations = {
    aggregatedClaims(state,list)
    {
        state.aggregatedClaims = list;
    },
    claimStatuses(state,list) {
        state.claimStatuses = list;
    },
    claimTypes(state,list) {
        state.claimTypes = list;
    },
    claims(state,list) {
        state.claims = list;
    },
    summaryByYear(state,summary)
    {
        state.loadedSummariesByYear.push(summary);
    },
    updateStatus(state,data){
        const newStatus = data.new_status;
        data.updated_ids.forEach(id => {
            let aggClaim = state.aggregatedClaims.find(x=>x.id == id);
            aggClaim.claim_status = newStatus;
        });
    },
    updateClaim(state,data){
        let existingClaim  = state.claims.find( x => data.id == x.id  )
        if (existingClaim) {
            Object.assign(existingClaim, data)
        }
    },
    newclaim(state,data){
        state.claims.unshift(data)
    },
    deleteclaim(state,id){
        let index = state.claims.findIndex(x=>x.id==id);
        if(index>-1){
            state.claims.splice(index,1);
        }
    }
}

export const actions = {
    getClientAggregatedClaims(context,payload){
        return this.$axios
                .get(`${process.env.golddinarApiUrl}/aggregated-claims?include=claim_status${payload}`)
                .then(res=>{
                    context.commit('aggregatedClaims',res.data.data);
                    return res.data;
                })
    },
    getClaimStatuses(context)
    {
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/claim-statuses`)
            .then(response => {
                context.commit('claimStatuses', response.data.data)
                return response
            })
    },
    getClaimTypes(context)
    {
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/claim-types`)
            .then(response => {
                context.commit('claimTypes', response.data.data)
                return response
            })
    },
    getClientClaims(context,payload)
    {
        return this.$axios
                .get(`${process.env.golddinarApiUrl}/claims?include=claim_type,claim_status,claim_payment_transactions${payload}`)
                .then(res=>{
                    context.commit('claims',res.data.data);
                    return res.data;
                })
    },
    getClaimSummaryByYear(context,payload)
    {
        return this.$axios
                .get(`${process.env.golddinarApiUrl}/aggregated-claims/summary/${payload}`)
                .then(res=>{
                    context.commit('summaryByYear',{
                        data:res.data.data,
                        loadTime:moment(),
                        year:payload
                    });
                    return res.data.data;
                })
    },
    markManyAspaid(context,payload){
        return this.$axios
                .post(`${process.env.golddinarApiUrl}/aggregated-claims/mark/paid`,{'aggregated_claims_ids':payload})
                .then(res=>{
                    context.commit('updateStatus',res.data.data);
                    return res.data.data;
                })
    },
    markSingleClaimAsPaid(context,payload){
        return this.$axios
                .put(`${process.env.golddinarApiUrl}/claims/mark-paid/${payload}?include=claim_type,claim_status,claim_payment_transactions`)
                .then(res=>{
                    context.commit('updateClaim',res.data.data);
                    return res.data.data;
                })
    },
    cancelClaim(context,payload){
        return this.$axios
                .put(`${process.env.golddinarApiUrl}/claims/${payload}/cancel?include=claim_type,claim_status,claim_payment_transactions`)
                .then(res=>{
                    context.commit('updateClaim',res.data.data);
                    return res.data.data;
                })
    },
    initiateAggregatedClaimDirectDebit(context,payload){
        return this.$axios.post(`${process.env.golddinarApiUrl}/aggregated-claims/generate-batch-direct-debit-web-form`,payload).then((res)=>{
            return res.data.data.url;
        })
    },
    createNewClaim(context,payload){
        return this.$axios
                .post(`${process.env.golddinarApiUrl}/claims?include=claim_type,claim_status,claim_payment_transactions`,payload)
                .then(res=>{
                    context.commit('newclaim',res.data.data);
                    return res.data;
                })
    },
    deleteSingleClaim(context,payload){
        return this.$axios
                .delete(`${process.env.golddinarApiUrl}/claims/${payload}`)
                .then(()=>{
                    context.commit('deleteclaim',payload);
                    return true;
                })
    },
    initiateClaimPayment(context,payload){
        return this.$axios.post(`${process.env.golddinarApiUrl}/claims/generate-batch-direct-debit-web-form`,payload).then((res)=>{
            return res.data.message.data.url;
        })
    },
    removeClaimsFromBatch(context,payload){
        return this.$axios.post(`${process.env.golddinarApiUrl}/claim-batch-processes/${payload.id}/remove-claims`,payload.data).then((res)=>{
            return true;
        })
    },
    notifyuser(context,payload){
        return this.$axios
                .post(`${process.env.golddinarApiUrl}/notifications/claims/payment`,payload)
                .then(res=>{
                    
                    return true;
                })
    },
}
