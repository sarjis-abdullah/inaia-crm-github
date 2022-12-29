export const state = () => {
    return{
        list:[],    
    }
}
export const getters = {
    list:state => state.list
}
export const mutations = {
    list(state,data)
    {
        state.list = data;
    },
    add(state,supplier){
        state.list.unshift(supplier);
    },
    edit(state,supplier){
        let item = state.list.find(x=>x.id == supplier.id);
        if(item)
        {
            Object.assign(item,supplier);
        }
    },
    delete(state,id){
        const index = state.list.findIndex(x => x.id == id);
        state.list.splice(index,1);
    }
}
export const actions = {
    getList(context){
        return this.$axios.get(`${process.env.golddinarApiUrl}/suppliers`)
                .then(res=>{
                    let data = res.data.data;
                    context.commit('list',data);
                    return data;
                })
    },
    addNew(context,payload){
        return this.$axios.post (`${process.env.golddinarApiUrl}/suppliers`,payload)
                .then(res=>{
                    let data = res.data.data;
                    context.commit('add',data);
                    return data;
                })
    },
    editSupplier(context,payload){
        return this.$axios.put(`${process.env.golddinarApiUrl}/suppliers/${payload.id}`,payload.data)
                .then(res=>{
                    let data = res.data.data;
                    context.commit('edit',data);
                    return data;
                })
    },
    deleteSupplier(context,payload){
        return this.$axios.delete(`${process.env.golddinarApiUrl}/suppliers/${payload}`)
                .then(res=>{
                    context.commit('delete',payload);
                    return true;
                })
    }
}