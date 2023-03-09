<template>
    <div class="row">
        <div class="col-8">
            <span>{{supplier?supplier.name:''}}</span>
        </div>
        <div class="col-4">
            <IconButton type="edit" @click="acivateEditing"/>
            <IconButton type="delete" @click="askToDelete"/>
        </div>
        
    </div>
</template>
<script>
import IconButton from '@/components/common/Buttons/IconButton';
import AddSupplier from '@/components/Suppliers/AddSupplier';
export default {
    props:{
        supplier:{
            type:Object,
            default:null
        }
    },
    components:{
        IconButton,
        AddSupplier
    },
    data(){
        return {
            isEditing:false,
            isDeleting:false
        }
    },
    methods:{
        acivateEditing(){
            this.$emit('editing',this.supplier);
        },
        askToDelete(){
            this.$emit('onDelete',this.supplier);
        }
    }
}
</script>
<style scoped>

</style>