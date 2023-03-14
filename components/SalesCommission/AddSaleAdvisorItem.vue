<template>
    <div class="row">
                    <div class="col-md d-flex flex-row justify-content-center">
                        <div>
                            <label>Advisor</label>
                        <Select :placeholder="$t('sales_advisors')" v-model="selectedAdvisor" filterable clearable
                            @clear="clearAdvisor" @change="dataChanged">
                            <Option v-for="option in salesAdvisors" :value="option.id" :label="formatClientLabel(option)"
                                :key="option.id">
                            </Option>
                        </Select>
                        </div>
                    </div>
                    <div class="col-md">
                        <div>
                            <label>Rate</label>
                            <Input :placeholder="$t('rate')" v-model="rate" type="number" @change="dataChanged"/>
                        </div>
                        </div>
                        <div class="col-md">
                            <div>
                            <label>Target amount</label>
                            <Input :placeholder="$t('amount')" v-model="amount" type="number" @change="dataChanged" :class="wrongAmount?'border border-danger':''"/>
                            
                            </div>
                        </div>
                </div>
</template>
<script>
import {Select,
    Option,
    Input} from 'element-ui';
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
        }
    },
    components:{
        Select,
        Option,
        Input
    },
    data(){
        return{
            selectedAdvisor:null,
            rate:null,
            amount:null,
            wrongAmount:false,
        }
    },
    watch: {
        data:{
            handler() {
                if (this.data != null) {
                    if(this.data.sales_advisor_id > -1){
                        this.selectedAdvisor = this.data.salesAdvisors;
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
                const amount = parseInt(((this.amount/100)*this.rate)*100);
                this.wrongAmount = false;
                let data = {
                sales_advisor_id:this.selectedAdvisor,
                rate:this.rate,
                target_amount:this.amount,
                amount:amount
                }
            this.$emit('change',{
                    index:this.index,
                    data:data
                })
            }
        }
    }
})
</script>
