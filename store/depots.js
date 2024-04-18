import {formatDateToApiFormat} from '~/helpers/helpers';
function changeDepotStatus($axios,context,depot_id,status_id,account_id,date)
{
    if(!date){
        date = formatDateToApiFormat(new Date());
    }
    const data ={
        "status_id": status_id,
        "account_id": account_id,
        "end_date": date
    };
    return $axios.put(`${process.env.golddinarApiUrl}/depots/${depot_id}/status?include=depot_status`,data).then((res)=>{
        context.commit('details', res.data.data);
        return res.data.data;
    })
}
function getStatusId(statuses,status)
{
    let id = -1;
    statuses.forEach(el=>{
        if(el.name_translation_key==status)
        {
            id = el.id;
        }
    })
    return id;
}
export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false,
    orderFilterList:[],
    goldPrice:0,
    silverPrice:0,
    depotStatuses:[],
    agioTransactions: [],
    agioTransactionTypes: [],
    depotTypes:[],
    depotTargetTypes:[],
})

const initialState  = state()

export const getters = {
    list(state) {
        return state.list
    },
    details:state=>state.details,

    pairs(state) {
        return state.pairs
    },
    orderFilterList:state=>state.orderFilterList,
    getGoldPrice:state=>state.goldPrice,
    depotStatuses:state=>state.depotStatuses,
    agioTransactions: state=>state.agioTransactions,
    agioTransactionTypes: state=>state.agioTransactionTypes,
    depotTypes: state=>state.depotTypes,
    silverPrice: state => state.silverPrice,
    depotTargetTypes: state => state.depotTargetTypes
}

export const mutations = {
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    remove(state, idx) {
        state.list = state.list.splice(idx, 1)
    },
    pairs(state, data) {
        state.pairs = data
    },
    loading(state, bool) {
        state.loading   = bool
    },
    resetState(state) {
        Object.assign(state, initialState)
    },
    orderFilterList(state,list){
        state.orderFilterList = list
    },
    setGoldPrice(state,price){
        state.goldPrice = price;
    },
    depotStatuses(state,statuses){
        state.depotStatuses = statuses;
    },
    agioTransactions(state,agios){
        state.agioTransactions = agios;
    },
    agioTransactionTypes(state,types){
        state.agioTransactionTypes = types;
    },
    addAgioTransaction(state,agio)
    {
        state.agioTransactions.unshift(agio);
    },
    deleteAgioTransaction(state,id)
    {
        let index = state.agioTransactions.findIndex(x=>x.id==id);
        state.agioTransactions.splice(index, 1);
    },
    depotTypes(state,list)
    {
        state.depotTypes = list;
    },
    silverPrice(state,price)
    {
        state.silverPrice  = price;
    },
    setDepotTargetTypes(state,depotTargetTypes)
    {
        state.depotTargetTypes  = depotTargetTypes;
    },
    updateAgioTransactionList(state, updatedTransaction)
    {
        state.agioTransactions  = state.agioTransactions.map(item=> {
            if (item.id == updatedTransaction.agio_transaction_id) {
                return {
                    ...item,
                    sales_advisor_id: updatedTransaction.sales_advisor_id
                }
            }
            return item
        });
    },
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(process.env.golddinarApiUrl + '/depots?pair')
            .then(res => {
                context.commit('pairs', res.data.data)
                return res
            })
            .catch(err => {
                return Promise.reject(err)
            })
    },
    fetchList(context, payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${process.env.golddinarApiUrl}/depots?include=depot_status${ payload }`)
                .then(res => {
                    context.commit('list', res.data.data)
                    return res
                }).catch(err => {
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    async details(context, payload) {
        return await this.$axios
            .get(`${process.env.golddinarApiUrl}/depots/${payload}?include=depot_status,depot_status_history,depot_histories`).then(res => {
                context.commit('details', res.data.data);
                return res
            }).catch((err) => {
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(process.env.golddinarApiUrl + '/depots?iinclude=depot_status,depot_status_history', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(process.env.golddinarApiUrl + '/depots/' + payload.id + '?include=depot_status,depot_status_history', payload)
                .then(res => {
                    context.commit('details', res.data.data);
                    return res.data.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`${process.env.golddinarApiUrl}/depots/${ payload }`)
            .then(res => {
                const idx   = context.state.list.findIndex( i => i.id == payload)
                context.commit('remove', idx)
                return res
            })
    },
    fetchDepotsByAccount(context,payload) {
        if (!context.state.loading) {
            context.commit('loading', true)
            return this.$axios.get(`${process.env.golddinarApiUrl}/depots?per_page=250&only=name,target_amount,depot_number&account_id=${ payload }`)
                .then(res => {
                    context.commit('orderFilterList', res.data.data)
                    return res
                }).catch(err => {
                    return Promise.reject(err)
                }).finally(() => {
                    context.commit('loading', false)
                })
        }
    },
    getCurrentGoldPrice(context)
    {
        return this.$axios.get(`${process.env.golddinarApiUrl}/current-gold-price?currency=EUR`)
                .then(res => {
                    context.commit('setGoldPrice',res.data.data.fixing_gram);
                    return res.data.data.fixing_gram;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    getCurrentSilverPrice(context)
    {
        return this.$axios.get(`${process.env.golddinarApiUrl}/current-silver-price?currency=EUR`)
                .then(res => {
                    context.commit('silverPrice',res.data.data.fixing_gram);
                    return res.data.data.fixing_gram;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    getGoldPriceByDate(context,payload)
    {
        return this.$axios.get(`${process.env.golddinarApiUrl}/historical-price?currency=EUR&date=${payload}`)
                .then(res => {
                    return res.data.data[0];
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    getDepotStatuses(context){
        return this.$axios.get(`${process.env.golddinarApiUrl}/depot-statuses`)
        .then(res => {
            context.commit('depotStatuses',res.data.data);
            return res.data.data;

        })
    },
    pauseSavingPlan(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_paused');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id,payload.end_date);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_paused');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    confirmSavingPlanContract(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_active');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_active');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    resumeSavingPlan(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_active');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_active');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    withdrawContract(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_withdrawn');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_withdrawn');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    completeContract(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_completed');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_completed');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    activateContract(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_active');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_active');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    cancelSavingPlan(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_canceled');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_canceled');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    rejectSavingPlan(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_withdrawn');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_withdrawn');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    fetchAgioTransactionList(context,payload){
        return this.$axios.get(`${process.env.golddinarApiUrl}/agio-transaction?include=agio_type${payload}`)
                .then(res => {
                    context.commit('agioTransactions',res.data.data)
                    return res.data;
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    fetchAgioTransactionTypes(context){
        return this.$axios.get(`${process.env.golddinarApiUrl}/agio-transaction-type`)
                .then(res => {
                    context.commit('agioTransactionTypes',res.data.data)
                    return res.data.data
                }).catch(err => {
                    return Promise.reject(err)
                })
    },
    createAgioTransaction(context,payload)
    {
        return this.$axios.post(`${process.env.golddinarApiUrl}/agio-transaction?include=agio_type`,payload)
            .then(res => {
                context.commit('addAgioTransaction',res.data.data)
                return res.data.data
            }).catch(err=>{
                return Promise.reject(err)
            })
    },
    deleteAgioTransaction(context,payload)
    {
        return this.$axios.delete(`${process.env.golddinarApiUrl}/agio-transaction/${ payload }`)
            .then(res => {
                context.commit('deleteAgioTransaction',payload)
                return true
            }).catch(err=>{
                return Promise.reject(err)
            })
    },
    getDepotTypes(context,payload)
    {
        return this.$axios.get(`${process.env.golddinarApiUrl}/depot-types`)
            .then(res => {
                context.commit('depotTypes',res.data.data)
                return true
            }).catch(err=>{
                return Promise.reject(err)
            })
    },
    fetchDepotTargetTypes(context,payload)
    {
        return this.$axios.get(`${process.env.golddinarApiUrl}/target-types`)
            .then(res => {
                context.commit('setDepotTargetTypes',res.data.data)
                return true
            }).catch(err=>{
                return Promise.reject(err)
            })
    },
    blockDepot(context,payload)
    {
        let status = context.getters.depotStatuses;
        if(status.length==0)
        {
            context.dispatch('getDepotStatuses').then((res)=>{
                const status_id = getStatusId(res,'depot_status_blocked');
                return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
            }).catch(err => {
                return Promise.reject(err)
            })
        }
        else{
            const status_id = getStatusId(status,'depot_status_blocked');
            return changeDepotStatus(this.$axios,context,payload.depot_id,status_id,payload.account_id);
        }
    },
    updateAgioTransaction(context, payload)
    {
        return this.$axios.put(`${process.env.golddinarApiUrl}/sales-advisor`, payload)
            .then(res => {
                // context.commit('setDepotTargetTypes',res.data.data)
                context.commit('updateAgioTransactionList', payload)
                return res.data.data
            }).catch(err=>{
                return Promise.reject(err)
            })
    }
}
