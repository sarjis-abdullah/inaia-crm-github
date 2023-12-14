<template>
    <div class="card border-0">
        
            
       
      <div class="card-body">
        <div><span v-if="startDate && endDate">{{ startDate?$d(startDate)+' - ':'' }}{{ endDate?$d(endDate):'' }}</span></div>
        <div class="row mt-3">
            <div class="col-md">
                <date-picker type="date" v-model="startDate" :placeholder="$t('select_start_date_placeholder')" @change="changeDate"></date-picker>
            
            </div>
            <div class="col-md">
                <date-picker type="date" v-model="endDate" :placeholder="$t('select_end_date_placeholder')" @change="changeDate"></date-picker>
            </div>
        </div>
        <div id="chart">
        <div v-if="data && !loading"></div>
        <div class="d-flex justify-content-center align-items-center" style="height: 200px;" v-else>
          <Loader/>
        </div>
      </div>
    </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex"
import { DatePicker } from 'element-ui';
import { formatDate } from "@fullcalendar/core";
export default({
    components: {
        DatePicker
    },
    computed: {
        ...mapGetters({
            data: "statistic/monthlyPeformance"
        }),
    },
    data(){
        return {
            startDate:null,
            endDate:null,
            loading:false
        }
    },
    mounted(){
        this.loadData();
    },
    methods:{
        loadData(){
            this.loading = true;
            let payload = '';
            
            if(this.startDate && this.endDate){
                payload= `start_date=${formatDate(this.startDate)}&end_date=${formatDate(this.endDate)}`;
            }
            this.$store.dispatch('statistic/getMonthlyPeformance',payload).finally(()=>{
                this.loading = false
            })
        },
        changeDate(){
            if(this.startDate && this.endDate){

                this.loadData();
            }
        }
    }
})
</script>
