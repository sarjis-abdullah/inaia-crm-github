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
        claims:[]
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
}

export const mutations = {
    aggregatedClaims(state,list)
    {
        state.aggregatedClaims = list;
    },
    claimStatuses(state,list) {
        state.claimStatuses = list;
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
    }
}

export const actions = {
    getClientAggregatedClaims(context,payload){
        return this.$axios
                .get(`/aggregated-claims?include=claim_status${payload}`)
                .then(res=>{
                    context.commit('aggregatedClaims',res.data.data);
                    return res.data;
                })
    },
    getClaimStatuses(context)
    {
        return this.$axios
            .get(`/claim-statuses`)
            .then(response => {
                context.commit('claimStatuses', response.data.data)
                return response
            })
    },
    getClientClaims(context,payload)
    {
        return this.$axios
                .get(`/claims?include=claim_type${payload}`)
                .then(res=>{
                    context.commit('claims',res.data.data);
                    return res.data;
                })
    },
    getClaimSummaryByYear(context,payload)
    {
        return this.$axios
                .get(`/aggregated-claims/summary/${payload}`)
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
                .post(`/aggregated-claims/mark/paid`,{'aggregated_claims_ids':payload})
                .then(res=>{
                    context.commit('updateStatus',res.data.data);
                    return res.data.data;
                })
    }
}
