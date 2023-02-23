const includes = "order_type,order_process_status,orders_count";
export const state = () => {
    return {
        batchProcesses : [],
        batchProcessStatuses: [],
        batchProcess:null
    }
}
const initialState  = state();
export const getters = {
    batchProcesses:state=>state.batchProcesses,
    batchProcessStatuses:state=>state.batchProcessStatuses,
    batchProcess:state=>state.batchProcess
}
export const mutations = {
    batchProcesses(state,list){
        state.batchProcesses = list;
    },
    batchProcessStatuses(state,list){
        state.batchProcessStatuses = list;
    },
    update(state,process)
    {
        let currentP = state.batchProcesses.find(x=>x.id==process.id);
        if(currentP)
            Object.assign(currentP,process);
        if(state.batchProcess.id == process.id)
        {
            Object.assign(state.batchProcess,process);
        }
    },
    batchProcess(state,process){
        state.batchProcess = process;
    }
}
export const actions = {
    fetchList(context, payload) {
            return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes?include=${includes}${ payload }`)
                .then(res => {
                    context.commit('batchProcesses', res.data.data)
                    return res
                })
    },
    fetchProcessStatuses(context){
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-process-statuses`)
                .then(res => {
                    context.commit('batchProcessStatuses', res.data.data)
                    return res
                })
    },
    markAsComplete(context,payload)
    {
        return this.$axios.post(`${ process.env.golddinarApiUrl }/order-processes/complete?include=${includes}`,payload)
                .then(res => {
                    context.commit('update', res.data.data)
                    return res
                })
    },
    createNew(context,payload)
    {
        return this.$axios.post(`${ process.env.golddinarApiUrl }/order-processes?include=${includes}`,payload)
                .then(res=>{
                    return res.data.data;
                })
    },
    previewNewBatch(context,payload){
        
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes/preview?order_process_id=${payload.order_process_id}&gram_price_date=${payload.gram_price_date}`,payload)
                .then(res=>{
                    return res.data.data;
                })
    },
    fetchOrderProcessDetails(context,payload){
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes/${ payload }?include=${includes}`)
                .then(res => {
                    context.commit('batchProcess', res.data.data);
                    return res.data.data;
                })
    },
    retryFailed(context,payload){
        return this.$axios.put(`${ process.env.golddinarApiUrl }/order-processes/${payload}/failed/retry?include=${includes}`)
                .then(res => {
                    context.commit('update', res.data.data)
                    return res
                })
    },
    retryPayment(context,payload){
        return this.$axios.put(`${ process.env.golddinarApiUrl }/order-processes/retry-payment?include=${includes}`,payload)
                .then(res => {
                    context.commit('update', res.data.data)
                    return res
                })
    },
    sellGoldPreview(context,payload)
    {
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes/sell/preview?order_process_id=${payload.order_process_id}&gold_price_date=${payload.gold_price_date}&order_type=${payload.order_type}`)
                .then(res=>{
                    return res.data.data;
                })
    },
    sellGold(context,payload)
    {
        return this.$axios.put(`${ process.env.golddinarApiUrl }/order-processes/sell?include=${includes}`,payload)
                .then(res => {
                    context.commit('update', res.data.data)
                    return res
                })
    },
}