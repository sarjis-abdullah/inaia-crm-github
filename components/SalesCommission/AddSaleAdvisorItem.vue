<template>
    <div class="row d-flex flex-row justify-content-center align-items-center">
                    <div class="col-4">
                        <div>
                            <label>{{ $t('advisor') }}</label>
                        <Select :placeholder="$t('sales_advisors')" v-model="selectedAdvisor" filterable clearable
                            @clear="clearAdvisor" @change="dataChanged">
                            <Option v-for="option in salesAdvisors" :value="option.id" :label="formatClientLabel(option)"
                                :key="option.id">
                            </Option>
                        </Select>
                        </div>
                    </div>
                    <div class="col-3">
                        <div>
                            <label>{{ $t('rate') }}</label>
                            <Input :placeholder="$t('rate')" v-model="rate" type="number" @change="dataChanged"/>
                        </div>
                        </div>
                        <div class="col-4">
                            <div>
                            <label class="text-nowrap">{{ $t('target_amount') }}</label>
                            <Input :placeholder="$t('amount')" v-model="amount" type="number" @change="dataChanged" :class="wrongAmount?'border border-danger':''"/>
                            
                            </div>
                        </div>
                        <div class="col-1">
                            <div class="d-flex justify-content-center">
                            <IconButton type="confirm" class="ml-2" @click="()=>saveInfo()"  :disabled="!enableSaving"/>
                            <span v-if="isSaved">
                                <IconButton type="add"  @click="()=>addNewSaleAdvisor()" v-if="displayAdd"/>
                                <IconButton type="delete" @click="()=>removeSaleAdvisor()" v-else/>
                                </span>
                            </div>
                            
                        </div>
                </div>
</template>
<script>
import {Select,
    Option,
    Input} from 'element-ui';
import IconButton from '@/components/common/Buttons/IconButton';
export default({
    props:{
        salesAdvisors:{
            default:[]
        },
        totalAmount:{
            type:Number,
            default:0
        },
        index:{
            type:Number,
            default:-1
        },
        data:{
            type:Object,
            default:null
        },
        displayAdd:{
            type:Boolean,
            default:false
        }
    },
    components:{
        Select,
        Option,
        Input,
        IconButton
    },
    data(){
        return{
            selectedAdvisor:null,
            rate:null,
            amount:null,
            wrongAmount:false,
            isSaved:false,
        }
    },
    computed:{
        enableSaving(){
            return (this.selectedAdvisor>=0 && this.rate >=0 && this.rate<=100 && !this.wrongAmount && this.amount > 0);
        }
    },
    watch: {
        data:{
            handler() {
                if (this.data != null) {
                    if(this.data.sales_advisor_id > -1){
                        this.selectedAdvisor = this.data.sales_advisor_id;
                    }
                    if(this.data.rate > 0){
                        this.rate = this.data.rate;
                    }
                    if(this.data.target_amount> 0){
                        this.amount = this.data.target_amount;
                    }
                    
                }
            },
            immediate: true,
        }
    },
    methods:{
        formatClientLabel: function (client) {
            if (client) {
                let email = null;
                if (client.contact.channels) {
                    client.contact.channels.forEach((element) => {
                        if (element.type == "email") {
                            email = element.value;
                        }
                    });
                }
                let label =
                    client.contact.name + " " + client.contact.person_data.surname;
                if (email) {
                    label += ` (${email})`;
                }
                return label;
            }
        },
        clearAdvisor(){
            this.selectedAdvisor = null;
        },
        dataChanged(){
            if(this.amount > this.totalAmount){
                this.wrongAmount = true;
            }
            else
            {
                
                this.wrongAmount = false;
            }
        },
        saveInfo(){
            const amount = parseInt(((this.amount/100)*this.rate)*100);
            let data = {
                sales_advisor_id:this.selectedAdvisor,
                rate:this.rate,
                target_amount:this.amount,
                amount:amount
                }
                this.isSaved = true;
            this.$emit('change',{
                    index:this.index,
                    data:data
                })
        },
        addNewSaleAdvisor(){
            this.$emit('add',this.index);
        },
        removeSaleAdvisor(){
            this.$emit('delete',this.index);
        }
    }
})
</script>
