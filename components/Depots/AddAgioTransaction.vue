<template>
    <div class="mb-3 flex-fill">
        <div class="d-flex flex-row justify-content-center align-items-center">
            <div class="flex-fill">
                <div class="d-flex flex-row justify-content-center align-items-center flex-fill">
                    <Loader v-if='isLoadingTypes' :width="32" :height="32" />
                    <TextError :textError ="$t(typesError)" v-if="!isLoadingTypes && textError"/>
                    <div class="w-100">
                        <Select :placeholder="$t('type')"
                                class="d-block"
                                v-if="!isLoadingTypes && !textError"

                                    v-model="selectedAgioTransactionType"
                                    @change="typeSelected"
                                    >
                                <Option v-for="option in filtredAgioTransactionTypes"
                                        :value="option.id"
                                        :label="$t(option.name_translation_key)"
                                        :key="option.id"
                                        >
                                </Option>
                        </Select>

                    </div>
                    <Input :placeholder="$t('amount')" v-model="amount" type="number" class="ml-3"/>
                </div>
                <Input :placeholder="$t('comment')" v-model="comment"  class="mt-3"/>
            </div>
            <div class="ml-3 d-flex flex-fill flex-row align-content-end">
                <Button @click="cancelAddTransaction" :disabled="isSubmitting">{{$t('cancel')}}</Button>
                <Button type="primary" :disabled="shouldDisableSave() || isSubmitting" @click="saveAddTransaction">{{$t('save')}}</Button>
            </div>
        </div>
        
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Loader from '@/components/common/Loader/Loader';
import TextError from '@/components/common/Errors/TextError';
import {Select,Option,Input,Checkbox,Button} from 'element-ui';
import { apiErrorHandler } from "../../helpers/apiErrorHandler";
export default ({
    setup() {

    },
    props:{
        depot_id:{
            type:Number,
            default:null
        }
    },
    components:{
        Loader,
        TextError,
        Select,
        Option,
        Input,
        Checkbox,
        Button
    },
    mounted(){
        if(this.agioTransactionsTypes.length == 0)
        {
            this.isLoadingTypes = true;
            this.$store.dispatch('depots/fetchAgioTransactionTypes')
                .then(()=>{
                    this.removeClaim();
                })
                .catch(
                (err)=>{
                    console.error('cant load agio transactions types');
                    this.typesError = 'cant_load_agio_transactions_types'
                }
            ).finally(()=>this.isLoadingTypes = false);
        }else
        {
            this.removeClaim();
        }
    },
    data(){
        return{
            isLoadingTypes:false,
            typesError:null,
            filtredAgioTransactionTypes:[],
            selectedAgioTransactionType:null,
            amount:null,
            paymentSelected:false,
           
            isSubmitting:false,
            comment:null
        }
    },
    computed:{
        ...mapGetters({
            agioTransactionsTypes: "depots/agioTransactionTypes",
            }),
    },
    methods:{
        removeClaim(){
            //this.filtredAgioTransactionTypes = this.agioTransactionsTypes.filter(x=>x.name_translation_key!='claim');
            this.filtredAgioTransactionTypes = this.agioTransactionsTypes;
        },
        typeSelected(){
            let type = this.agioTransactionsTypes.find(x=>x.id==this.selectedAgioTransactionType);
            if(type)
            {
                if(type.name_translation_key=="payment")
                {
                    this.paymentSelected = true;
                    return;
                }
            }
            this.paymentSelected = false;
            
        },
        cancelAddTransaction()
        {
            this.selectedAgioTransactionType = null;
            this.amount =  null;
            
            this.paymentSelected = false;
            this.$emit('canceled');
        },
        saveAddTransaction()
        {
            let payload = {
                "depot_id":this.depot_id,
                "amount":Number(this.amount)*100,
                "agio_type_id":this.selectedAgioTransactionType,
                "is_manual":true,
                "comment":this.comment
            }
            this.isSubmitting = true;
            this.$store.dispatch('depots/createAgioTransaction',payload).then(res=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('entry_added_successfully')})
            }).catch((err)=>{
                apiErrorHandler(err,this.$notify);
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        shouldDisableSave()
        {
            const num = Number(this.amount);
            return (!this.depot_id ||!this.selectedAgioTransactionType || !this.amount || Number.isNaN(num) || num <= 0 || !this.comment)
        }
    }
})
</script>
<style scoped>

</style>
