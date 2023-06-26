<template>
    <div class="mb-3 flex-fill">
        <div class="d-flex flex-row justify-content-center align-items-center">
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
            <div class="ml-3 d-flex flex-fill flex-row align-content-end">
                <Button @click="cancelAddTransaction" :disabled="isSubmitting">{{$t('cancel')}}</Button>
                <Button type="primary" :disabled="shouldDisableSave() || isSubmitting" @click="saveAddTransaction">{{$t('save')}}</Button>
            </div>
        </div>
        <Checkbox v-model="includeClaim" :label="$t('include_getting_money_from_bank_account')" class="mt-2" v-if="paymentSelected"></Checkbox>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import Loader from '@/components/common/Loader/Loader';
import TextError from '@/components/common/Errors/TextError';
import {Select,Option,Input,Checkbox,Button} from 'element-ui';
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
            includeClaim:false,
            isSubmitting:false
        }
    },
    computed:{
        ...mapGetters({
            agioTransactionsTypes: "depots/agioTransactionTypes",
            }),
    },
    methods:{
        removeClaim(){
            this.filtredAgioTransactionTypes = this.agioTransactionsTypes.filter(x=>x.name_translation_key!='claim');
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
            this.includeClaim = false;
        },
        cancelAddTransaction()
        {
            this.selectedAgioTransactionType = null;
            this.amount =  null;
            this.includeClaim = false;
            this.paymentSelected = false;
            this.$emit('canceled');
        },
        saveAddTransaction()
        {
            let payload = {
                "depot_id":this.depot_id,
                "amount":Number(this.amount)*100,
                "include_claim":this.includeClaim,
                "agio_type_id":this.selectedAgioTransactionType,
                "is_manual":true
            }
            this.isSubmitting = true;
            this.$store.dispatch('depots/createAgioTransaction',payload).then(res=>{
                this.$notify({type: 'success', timeout: 5000, message: this.$t('agio_transaction_created_successfully')})
            }).catch((err)=>{
                this.$notify({type: 'danger', timeout: 5000, message: this.$t('agio_transaction_created_unsuccessfully')})
            }).finally(()=>{
                this.isSubmitting = false;
            })
        },
        shouldDisableSave()
        {
            const num = Number(this.amount);
            return (!this.depot_id ||!this.selectedAgioTransactionType || !this.amount || Number.isNaN(num) || num <= 0)
        }
    }
})
</script>
<style scoped>

</style>
