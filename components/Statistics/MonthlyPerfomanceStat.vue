<template>
    <div class="card border-0">
        
            
       
      <div class="card-body">
        <div><span v-if="startDate && endDate">{{ startDate?$d(startDate)+' - ':'' }}{{ endDate?$d(endDate):'' }}</span></div>
        <div class="row mt-3">
            <div class="col-md">
                <date-picker type="date" v-model="startDate" :placeholder="$t('select_start_date_placeholder')" ></date-picker>
            
            </div>
            <div class="col-md">
                <date-picker type="date" v-model="endDate" :placeholder="$t('select_end_date_placeholder')"></date-picker>
            </div>
            <div class="col-md">
                <Checkbox v-model="groupBySalesPerson">Group by sales advisor</Checkbox>
            </div>
            <div class="col-md text-right">
                <button @click.prevent="changeDate()" type="button" class="btn base-button btn-icon btn-fab btn-neutral btn-sm">
                            <span class="btn-inner--icon"><i class="fas fa-filter"></i></span><span class="btn-inner--text">{{$t('filter')}}</span>
                          </button>
            </div>
            </div>
        <div id="chart">
        <div v-if="data && !loading">
            <div v-if="groupBySalesPerson">
                <div class="row" >
                    

                    <div class="col" v-for="sales in salesAdvisors" :key="sales.id">
                    <div class="font-weight-bold mt-6 mb-3 text-primary" v-if="sales.id!='unassigned'">Sales advisor {{ sales.name }}</div>
                    <div class="font-weight-bold mt-6 mb-3 text-primary" v-else>Unassigned data</div>
                    <table v-if="sales.id!='unassigned'">
                        <tr v-for="[key,value] in Object.entries(sales)" :key="key">
                            <td v-if="key!='id'">
                                {{ $t(key) }} : 
                            </td>
                            <td class="px-3" v-if="key!='id'">
                                {{ value }}
                            </td>
                        </tr>
                    </table>
                    <div v-for="asset in assets" :key="asset" class="mt-3">
                        <div class="font-weight-bold text-info">{{ asset.id }} data</div>
                        <div class="font-weight-bold my-3">
                            Depots:
                        </div>
                        <table v-for="depot in depots.filter(a=>a.sales_advisor==sales.id && a.asset == asset.id)" :key="depot.asset">
                            <tr v-for="[key,value] in Object.entries(depot)" :key="key" >
                                <template v-if="key!='asset' && key!='sales_advisor'">
                                    <template v-if="key == 'total_no_of_depots'">
                                        <td>
                                            {{ $t(key)}} :
                                        </td>
                                        <td class="px-3">
                                            <nuxt-link :to="getDepotsRouteWithSalesAdvisor(asset.key, sales.id)">
                                                {{ value }}
                                            </nuxt-link>
                                        </td>
                                    </template>
                                    <template v-else>
                                        <td>
                                            {{ $t(key)}} :
                                        </td>
                                        <td class="px-3">
                                            {{ value }}
                                        </td>
                                    </template>
                                </template>
                            </tr>
                        </table>
                        <div class="font-weight-bold my-3">
                            Agio:
                        </div>
                        <table v-for="agio in agios.filter(a=>a.sales_advisor==sales.id && a.asset == asset.id)" :key="agio.asset">
                            <tr v-for="[key,value] in Object.entries(agio)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $t(key) }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $n(value) }} €
                                </td>
                            </tr>
                        </table>
                        
                        
                        <div class="font-weight-bold my-3">
                            Transactions:
                        </div>
                        <table v-for="transaction in transactions.filter(a=>a.sales_advisor==sales.id && a.asset == asset.id)" :key="transaction.asset">
                            <tr v-for="[key,value] in Object.entries(transaction)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ key }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ value }} 
                                </td>
                            </tr>
                        </table>
                        <div class="font-weight-bold my-3">
                            Claims:
                        </div>
                        <table v-for="claim in claims.filter(a=>a.sales_advisor==sales.id && a.asset == asset.id)" :key="claim.asset">
                            <tr v-for="[key,value] in Object.entries(claim)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $t(key) }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $n(value) }} €
                                </td>
                            </tr>
                        </table>
                    </div>
                
                </div>
                </div>

            </div>
            <div v-else class="row">
                
                    
                    <div v-for="asset in assets" :key="asset" class="mt-3 col">
                        
                        <div class="font-weight-bold text-info">{{ asset.id }} data</div>
                        <div class="font-weight-bold my-3">
                            Depots:
                        </div>
                        <table v-for="depot in depots.filter(a=>a.asset == asset.id)" :key="depot.asset">
                            <tr v-for="[key,value] in Object.entries(depot)" :key="key" >
                                <template v-if="key!='asset' && key!='sales_advisor'">
                                    <template v-if="key == 'total_no_of_depots'">
                                        <td>
                                            {{ $t(key)}} :
                                        </td>
                                        <td class="px-3">
                                            <nuxt-link :to="getDepotsRoute(asset.key)">
                                                {{ value }}
                                            </nuxt-link> 
                                        </td>
                                    </template>
                                    <template v-else>
                                        <td>
                                            {{ $t(key)}} :
                                        </td>
                                        <td class="px-3">
                                            {{ value }} 
                                        </td>
                                    </template>
                                </template>
                            </tr>
                        </table>
                        <div class="font-weight-bold my-3">
                            Agio:
                        </div>
                        <table v-for="agio in agios.filter(a=>a.asset == asset.id)" :key="agio.asset">
                            <tr v-for="[key,value] in Object.entries(agio)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $t(key) }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $n(value) }} €
                                </td>
                            </tr>
                        </table>
                        <div class="font-weight-bold my-3">
                            Transactions:
                        </div>
                        <table v-for="transaction in transactions.filter(a=>a.asset == asset.id)" :key="transaction.asset">
                            <tr v-for="[key,value] in Object.entries(transaction)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ key }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ value }} 
                                </td>
                            </tr>
                        </table>
                        <div class="font-weight-bold my-3">
                            Claims:
                        </div>
                        <table v-for="claim in claims.filter(a=>a.asset == asset.id)" :key="claim.asset">
                            <tr v-for="[key,value] in Object.entries(claim)" :key="key" >
                                <td v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $t(key) }} :
                                </td>
                                <td class="px-3" v-if="key!='asset' && key!='sales_advisor'">
                                    {{ $n(value) }} €
                                </td>
                            </tr>
                        </table>
                        
                        
                    </div>
                
                </div>
            
        </div>
        <div class="d-flex justify-content-center align-items-center" style="height: 200px;" v-else>
          <Loader/>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { DatePicker,Checkbox } from 'element-ui';
import {formatDateToApiFormat} from '@/helpers/helpers'
export default({
    components: {
        DatePicker,
        Checkbox
    },
    computed: {
        ...mapGetters({
            data: "statistic/monthlyPeformance"
        }),
        ...mapGetters("depots", {
            depotTypes: "depotTypes",
        }),
        assets(){
            return this.depotTypes.map(item=> {
                return {
                    ...item,
                    key: item.id,
                    id: item.name_translation_key ? item.name_translation_key.toLowerCase() : ''
                }
            })
        },
        salesAdvisors(){
            let advisors = [];
            if(this.data){
                if(this.data.sales_advisors){
                    for(const [key,value] of Object.entries(this.data.sales_advisors)){
                        let advisor = {
                            id:key
                        }
                        for(const [key1,value1] of Object.entries(value)){
                            if(key1!="gold" && key1!='silver'){
                                advisor[key1] = value1
                            }
                        }
                        advisors.push(advisor)
                    }
                }
                
            }
            return advisors;
        },
        agios(){
            let agios = [];
            if(this.data){
                if(this.data.sales_advisors){
                    for(const [key,value] of Object.entries(this.data.sales_advisors)){
                        
                        for(const [key1,value1] of Object.entries(value)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='agio'){
                                    let agio = {
                                    sales_advisor:key,
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        agio[key3] = value3.amount/100
                                    }
                                    agios.push(agio)
                                }
                               }
                            }
                        }
                        
                    }
                }
                else{
                    for(const [key1,value1] of Object.entries(this.data)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='agio'){
                                    let agio = {
                                    
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        agio[key3] = value3.amount/100
                                    }
                                    agios.push(agio)
                                }
                               }
                            }
                        }
                }
            }
            return agios;
        },
        claims(){
            let d = [];
            if(this.data){
                if(this.data.sales_advisors){
                    for(const [key,value] of Object.entries(this.data.sales_advisors)){
                        
                        for(const [key1,value1] of Object.entries(value)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='claims'){
                                    let entry = {
                                    sales_advisor:key,
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        entry[key3] = value3.amount/100
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                        
                    }
                }
                else{
                    for(const [key1,value1] of Object.entries(this.data)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='claims'){
                                    let entry = {
                                    
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        entry[key3] = value3.amount/100
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                }
            }
            return d;
        },
        depots(){
            let d = [];
            if(this.data){
                if(this.data.sales_advisors){
                    for(const [key,value] of Object.entries(this.data.sales_advisors)){
                        
                        for(const [key1,value1] of Object.entries(value)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='depots'){
                                    let entry = {
                                    sales_advisor:key,
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        if(key3!='total_no_of_depots' && key3!='total_no_of_savings_plans')
                                            entry[key3] = this.$n(value3/100) +' €'
                                        else{
                                            entry[key3] = value3
                                        }
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                        
                    }
                }
                else{
                    for(const [key1,value1] of Object.entries(this.data)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='depots'){
                                    let entry = {
                                    
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        if(key3!='total_no_of_depots' && key3!='total_no_of_savings_plans')
                                            entry[key3] = this.$n(value3/100) +' €'
                                        else{
                                            entry[key3] = value3
                                        }
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                }
            }
            return d;
        },
        transactions(){
            let d = [];
            if(this.data){
                if(this.data.sales_advisors){
                    for(const [key,value] of Object.entries(this.data.sales_advisors)){
                        
                        for(const [key1,value1] of Object.entries(value)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='transactions'){
                                    let entry = {
                                    sales_advisor:key,
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        entry[key3]='';
                                        for(const [key4,value4] of Object.entries(value3)){
                                            if(key4 == 'gram_amount'){
                                                if(entry[key3].length != 0){
                                                    entry[key3]+=" / "
                                                }
                                                entry[key3]+=this.$n(value4/1000) + " g"
                                            }
                                            if(key4 == 'money_amount'){
                                                if(entry[key3].length != 0){
                                                    entry[key3]+=" / "
                                                }
                                                entry[key3]+=this.$n(value4/100) + " €"
                                            }
                                        }
                                        
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                        
                    }
                }
                else{
                    for(const [key1,value1] of Object.entries(this.data)){
                            if(key1=="gold" || key1=='silver'){
                               
                               for(const [key2,value2] of Object.entries(value1)){
                                
                                if(key2=='transactions'){
                                    let entry = {
                                    
                                    asset:key1
                                    }
                                    for(const [key3,value3] of Object.entries(value2)){
                                        entry[key3]='';
                                        for(const [key4,value4] of Object.entries(value3)){
                                            if(key4 == 'gram_amount'){
                                                if(entry[key3].length != 0){
                                                    entry[key3]+=" / "
                                                }
                                                entry[key3]+=this.$n(value4/1000) + " g"
                                            }
                                            if(key4 == 'money_amount'){
                                                if(entry[key3].length != 0){
                                                    entry[key3]+=" / "
                                                }
                                                entry[key3]+=this.$n(value4/100) + " €"
                                            }
                                        }
                                    }
                                    d.push(entry)
                                }
                               }
                            }
                        }
                }
            }
            return d;
        },
        getStartAndEndDates(){
            if (this.startDate && this.endDate) 
                return `&start_date=${formatDateToApiFormat(this.startDate)}&end_date=${formatDateToApiFormat(this.endDate)}`;
            return ''
        }
    },
    data(){
        return {
            startDate:null,
            endDate:null,
            loading:false,
            groupBySalesPerson:false
        }
    },
    mounted(){
        this.loadData();
        if(this.depotTypes.length == 0) {
            this.$store.dispatch('depots/getDepotTypes')
        }
    },
    watch:{
        groupBySalesPerson:{
            handler() {this.loadData()},immediate:true
        },
    },
    methods:{
        loadData(){
            this.loading = true;
            let payload = '';
            
            if(this.startDate && this.endDate){
                payload= `start_date=${formatDateToApiFormat(this.startDate)}&end_date=${formatDateToApiFormat(this.endDate)}`;
            }
            if(this.groupBySalesPerson){
                payload+=`&group_by=sales_advisor`;
            }
            this.$store.dispatch('statistic/getMonthlyPeformance',payload).finally(()=>{
                console.log(this.data);
                this.loading = false
                
            })
        },
        changeDate(){
            if(this.startDate && this.endDate){

                this.loadData();
            }
        },
        getDepotsRoute(depotTypeId){
            let query = `?depot_type_id=${depotTypeId}`
            if(this.startDate && this.endDate){
                query += this.getStartAndEndDates
            }
            return `/depots${query}`
        },
        getDepotsRouteWithSalesAdvisor(depotTypeId, salesAdvisorId){
            const query = this.getDepotsRoute(depotTypeId)
            return query + '&sales_advisor_id=' + salesAdvisorId
        }
    }
})
</script>
