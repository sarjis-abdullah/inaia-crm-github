<template>
    <div>
        <Select v-model="selectedSupplier" :placeholder="$t('select_supplier')" class="mb-3" v-if="!showEdit && !showDelete" @change="onSelectionChanged">
            <Option v-for="supplier in suppliers" :key="supplier.id" :label="supplier.name" :value="supplier.id">
                <SupplierItem :supplier="supplier" @editing="editSupplier" @onDelete="askToDeleteSupplier"/>
            </Option>
            <AddSupplier/>
        </Select>
        <AddSupplier class="mb-3" :isEdit="true" 
        :supplier="supplierToModify" 
        @edited="finishEditing" @editCanceled="finishEditing" v-else-if="showEdit"/>
        <div class="row mb-3" v-else-if="showDelete">
            <div class="col-9">
                <span class="text-sm-left text-muted">{{$t('ask_to_delete_supplier')}} {{companyToDelete?companyToDelete.name:''}}?</span>
            </div>
            <div class="col-3" v-if="!isDeleting">
                <IconButton type="cancel"  @click="finishDeleting()"/>
                <IconButton type="confirm" @click="confirmDeleting()"/>
            </div>
            <div class="col-3 float-right" v-else>
                <Loader :width="25" :height="25"/>
            </div>
        </div>
    </div>
    
</template>
<script>
import { Select,Option } from 'element-ui';
import { mapGetters } from "vuex";
import SupplierItem from '@/components/Suppliers/SupplierItem';
import AddSupplier from '@/components/Suppliers/AddSupplier';
import IconButton from '@/components/common/Buttons/IconButton';
import Loader from '@/components/common/Loader/Loader';

export default {
    components:{
        Select,
        Option,
        SupplierItem,
        AddSupplier,
        IconButton,
        Loader
    },
    computed:{
        ...mapGetters({
            suppliers:'suppliers/list'
        })
    },
    data(){
        return {
            isLoading:false,
            selectedSupplier:null,
            showEdit:false,
            supplierToModify:null,
            showDelete:false,
            companyToDelete:null,
            isDeleting:false
        }
    },
    mounted(){
        if(this.suppliers.length == 0)
        {
            this.isLoading =  true;
            this.$store.dispatch('suppliers/getList').finally(()=>{
                this.isLoading = false;
            })
        }
    },
    methods:{
        editSupplier(supplier){
            this.supplierToModify =  supplier;
            this.showEdit = true;
        },
        finishEditing(){
            this.supplierToModify =  null;
            this.showEdit = false;
        },
        askToDeleteSupplier(supplier)
        {
            this.companyToDelete = supplier;
            this.showDelete = true;
        },
        finishDeleting(){
            this.companyToDelete = null;
            this.showDelete = false;
        },
        confirmDeleting(){
            this.isDeleting = true;
            this.$store.dispatch('suppliers/deleteSupplier',this.companyToDelete.id).then(()=>{
                this.selectedSupplier = null;
                
            }).catch(()=>{
                this.$notify({
                    type:'error',
                    message:this.$t('error_deleting_supplier'),
                    duration:5000})
            }).finally(()=>{
                this.isDeleting = false;
                this.finishDeleting();
            })
        },
        onSelectionChanged(){
            this.$emit('change',this.selectedSupplier);
        }
    }
}
</script>
<style scoped>

</style>