const includes = "order_type,order_status,order_depot,order_transactions,orders_payment_transactions,order_shipping_details";
export const state = () => ({
    list: null,
    details: null,
    pairs: null,
    loading: false,
    commissionList:[],
    selectedOrders:[]
})

const initialState  = state()

export const getters = {
    list:state=>state.list,
    details(state) {
        state.details
    },
    pairs(state) {
        state.pairs
    },
    commissionList:state=>state.commissionList,
    selectedOrders:state=>state.selectedOrders,
}

export const mutations = {
    list(state, list) {
        state.list  = list
    },
    details(state, data) {
        state.details   = data
    },
    remove(state, id) {
        const idx   = state.list.findIndex( i => i.id == id)
        state.list  = state.list.splice(idx, 1)
    },
    updateStatus(state, order) {
        const item  = state.list.find( i => i.id == order.id)
        Object.assign(item.order_status, order.order_status)
    },
    update(state, order) {
      
            const item  = state.list.find( i => i.id == order.id)
            Object.assign(item, order)
        
       
    },
    updateShippment(state, shippment) {
        
        const item  = state.list.find( i => i.id == shippment.order_id)
        Object.assign(item.order_shipping_details, shippment.data)
        
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
    commissionList(state,list){
        state.commissionList = list;
    },
    addRemoveOrder(state, payload){
        const index = state.selectedOrders.findIndex(item=> item.id == payload.id)
        if (index > -1) {
            state.selectedOrders.splice(index, 1)
        } else {
            state.selectedOrders.push(payload)
        }
    }
}

export const actions = {
    pairs(context) {
        return this.$axios
            .get(process.env.golddinarApiUrl + '/orders?pair')
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
            return this.$axios.get(`${ process.env.golddinarApiUrl }/orders?include=${includes}${ payload }`)
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
            .get(`${ process.env.golddinarApiUrl }/orders/${payload}?include=order_type,order_status`)
            .then(res => {
                context.commit('details', res.data.data)
                return res
            }).catch((err) => {
                return Promise.reject(err)
            })
    },
    submit(context, payload) {
        if (!payload.id) {
            return this.$axios.post(process.env.golddinarApiUrl + '/orders?include=order_type,order_status', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        } else {
            return this.$axios.put(process.env.golddinarApiUrl + '/orders/' + payload.id + '?include=order_type,order_status', payload)
                .then(res => {
                    return Promise.resolve(res)
                }).catch(err => {
                    return Promise.reject(err)
                })
        }
    },
    remove(context, payload) {
        return this.$axios
            .delete(`${ process.env.golddinarApiUrl }/orders/${ payload }`)
            .then(res => {
                context.commit('remove', payload)
                return res
            })
    },
    complete(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/complete?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res.data.data.order_status
            })
    },
    paid(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload }/paid?include=${includes}`)
            .then(res => {
                context.commit('update', res.data.data)
                return res.data.data.order_status
            })
    },
    failed(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload }/failed?include=${includes}`)
            .then(res => {
                context.commit('update', res.data.data)
                return res.data.data.order_status
            })
    },
    cancel(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/cancel?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res
            })
    },
    refund(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/refund?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res
            })
    },
    revert(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/revert?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res
            })
    },
    getPaymentMethod(context,payload) {
        return this.$axios
                .get(`${ process.env.paymentsApiUrl }/payment-transactions/${payload}?include=payment_account`).then(res=>{
                    return res.data.data;
                })
    },
    getCompleteOrderPreview(context,payload) {
        return this.$axios
                .get(`${ process.env.golddinarApiUrl }/orders/${payload.id}/complete/preview?price_date=${payload.date}${payload.transaction_fee>=0?'&transaction_fee='+payload.transaction_fee:''}`).then(res=>{
                    return res.data;
                })
    },
    updatePaymentMethod(context,payload){
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/change-payment-account?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res.data.data;
            })
    },
    retryPayment(context,payload){
        return this.$axios
            .post(`${ process.env.golddinarApiUrl }/orders/${ payload }/retry-payment?include=${includes}`,payload.data)
            .then(res => {
                context.commit('update', res.data.data)
                return res.data.data;
            })
    },
    sellGold(context, payload) {
        return this.$axios
            .put(`${ process.env.golddinarApiUrl }/orders/${ payload.id }/sell?include=${includes}`,payload.data)
            .then(res => {
                debugger;
                context.commit('update', res.data.data)
                return res.data.data.order_status
            })
    },
    orderGoldGift(context,payload){
        return this.$axios
            .post(`${ process.env.golddinarApiUrl }/orders/gift`,payload).then(res=>{
                return res;
            })
    },
    updateShippmentInfo(context,payload){
        return this.$axios
        .put(`${ process.env.golddinarApiUrl }/order-shipping-details/${ payload.id }`,payload.data)
        .then(res => {
            context.commit('updateShippment', {data:res.data.data,order_id:payload.order_id})
            return res.data.data;
        })
    },
    executeBankPayment(context,payload){
        
        return this.$axios
        .post(`${ process.env.golddinarApiUrl }/generate-batch-direct-debit-form`,payload)
        .then(res => {
            return res.data.message.data.url;
        })
    },
    executeSellBankPayment(context,payload){
        
        return this.$axios
        .post(`${ process.env.golddinarApiUrl }/orders/sell/initiate-money-transfer`,payload)
        .then(res => {
            return res.data.data.url;
        })
    },
    fetchCommissionList(context,payload){
        return this.$axios.get(`${ process.env.golddinarApiUrl }/sales-commission/orders?include=${includes}${ payload }`).then(res=>{
            context.commit('commissionList',res.data.data)
        })
    },
    deposit(context,payload){
        return this.$axios
        .post(`${ process.env.golddinarApiUrl }/orders/deposit?include=${includes}`,payload)
        .then(res => {
            return res.data.data;
        })
    },
    getClientLatestTransactions(context,payload) {
        return this.$axios
            .get(`${process.env.golddinarApiUrl}/orders/account-activities?include=${includes}&${payload}`)
            .then(res=>{
                context.commit('list',res.data.data);
                return res.data;
            })
    },
    addRemoveOrder(context, payload){
        context.commit('addRemoveOrder', payload);
    }
}
