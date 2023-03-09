<template>
    <div class="row p-2 d-flex align-items-center">
        <div class="col-9">
            <Input :placeholder="$t('supplier_name')" v-model="supplierName"/>
        </div>
        <div class="col-3 float-right" v-if="!isSaving">
            <div v-if="isEdit">
                <IconButton type="edit" @click="saveTheCompany()" :disabled="supplierName==null || supplierName==''"/>
                <IconButton type="cancel"  @click="cancelEdit()"/>
            </div>
            <div v-else>
                <IconButton type="add" @click="saveTheCompany()" :disabled="supplierName==null || supplierName==''"/>
            </div>
        </div>
        <div class="col-3 float-right" v-else>
           <Loader :width="25" :height="25"/>
        </div>
    </div>
</template>
<script>
import { Input } from 'element-ui';
import IconButton from '@/components/common/Buttons/IconButton';
import Loader from '@/components/common/Loader/Loader';
export default {
    props:{
        isEdit:{
            type:Boolean,
            default:false
        },
        supplier:{
            type: Object,
            default: null
        },

    },
    components:{
        Input,
        IconButton,
        Loader
    },
    watch:{
        supplier:{
            handler(){
                if(this.supplier)
                {
                    this.supplierName = this.supplier.name;
                }
            },
            immediate: true
        }
    },
    data(){
        return {
            isSaving:false,
            supplierName:null,
        }
    },
    methods:{
        saveTheCompany(){
            const data = {
                name:this.supplierName
            }
            this.isSaving = true;
            if(this.isEdit)
            {
                data.id = this.supplier.id;
                const payload = {
                    id:this.supplier.id,
                    data:data
                }
                this.$store.dispatch('suppliers/editSupplier',payload).then(()=>{
                    this.supplierName =null; 
                    this.$emit('editCanceled');
                }).catch(()=>{
                this.$notify({
                    type:'error',
                    message:this.$t('error_editing_supplier'),
                    duration:5000})
                }).finally(()=>{
                        this.isSaving = false;
                    })
            }
            else{
                this.$store.dispatch('suppliers/addNew',data).then(()=>{
                    this.supplierName =null; 
                    this.$emit('saved');
                }).catch(()=>{
                this.$notify({
                    type:'error',
                    message:this.$t('error_adding_supplier'),
                    duration:5000})
                }).finally(()=>{
                        this.isSaving = false;
                    })
            }
        },
        cancelEdit(){
            this.$emit('editCanceled');
        }
    }   
}
</script>
<style scoped>

</style>