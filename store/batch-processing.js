const includes = "order_type,order_process_status";
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
        return this.$axios.post(`${ process.env.golddinarApiUrl }/order-processes/${payload}/complete?include=${includes}`)
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
        let orderIds = '';
        for (let index = 0; index < payload.order_ids.length; index++) {
            orderIds+=`order_ids[${index}]=${payload.order_ids[index]}&`;
            
        }
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes/preview?gold_price_date=${payload.gold_price_date}&${orderIds}`,payload)
                .then(res=>{
                    return res.data.data;
                })
    },
    fetchOrderProcessDetails(context,payload){
        return this.$axios.get(`${ process.env.golddinarApiUrl }/order-processes?include=${includes}&id=${ payload }`)
                .then(res => {
                    context.commit('batchProcess', res.data.data[0]);
                    return res
                })
    }
}