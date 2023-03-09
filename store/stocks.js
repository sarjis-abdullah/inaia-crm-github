
const includes = "&include=document,supplier"
import {assetTypes} from '@/helpers/depots';
import {stockTypes} from '@/helpers/stocks';
export const state = () =>{
    return {
        inaiaGoldStock : 0,
        inaiaSilverStock : 0,
        operationGoldStock : 0,
        operationSilverStock : 0
    }
}

const initialState = state();

export const getters = {
    inaiaGoldStock:state=>state.inaiaGoldStock,
    inaiaSilverStock:state=>state.inaiaSilverStock,
    operationGoldStock:state=>state.operationGoldStock,
    operationSilverStock:state=>state.operationSilverStock,
}

export const mutations = {
    inaiaGoldStock(state,amount){
        state.inaiaGoldStock = amount;
    },
    inaiaSilverStock(state,amount){
        state.inaiaSilverStock = amount;
    },
    operationGoldStock(state,amount){
        state.operationGoldStock = amount;
    },
    operationSilverStock(state,amount){
        state.operationSilverStock = amount;
    }
}

export const actions = {
    getStocksBalance(context){
        return this.$axios.get(`${process.env.golddinarApiUrl}/stocks-summary`)
                .then(res=>{
                    let data = res.data.data;
                    data.forEach(element => {
                        let inaiaStocks = element.inaia_stock;
                        if(inaiaStocks)
                        {
                            inaiaStocks.forEach(stock=>{
                                if(stock.depot_type.name == assetTypes.gold)
                                {
                                    context.commit('inaiaGoldStock',stock.balance);
                                }
                                if(stock.depot_type.name == assetTypes.silver)
                                {
                                    context.commit('inaiaSilverStock',stock.balance);
                                }
                            })
                        }
                        let operationStocks = element.operation_stock;
                        if(operationStocks)
                        {
                            operationStocks.forEach(stock=>{
                                if(stock.depot_type.name == assetTypes.gold)
                                {
                                    context.commit('operationGoldStock',stock.balance);
                                }
                                if(stock.depot_type.name == assetTypes.silver)
                                {
                                    context.commit('operationSilverStock',stock.balance);
                                }
                            })
                        }
                    });
                })
    },
    createNewStock(context,payload){
        return this.$axios.post(`${process.env.golddinarApiUrl}/stocks`,payload.data).then(res=>{
            return res.data.data;
        })
    },
    transferStock(context,payload){
        return this.$axios.post(`${process.env.golddinarApiUrl}/stocks-transfer`,payload.data).then(res=>{
            return true;
        })
    },
    getStockList(context,payload){
        let url = '';
        if(payload.type == stockTypes.inaiaStock)
        {
            url = `${process.env.golddinarApiUrl}/inaia-stocks${payload.filter}${includes}`;
        }
        else{
            url = `${process.env.golddinarApiUrl}/operation-stocks${payload.filter}${includes}`;
        }
        return this.$axios.get(url).then(res=>{
            
            return res.data;
        })
    }
}