<template>
  <div class="row">

    <div class="col-lg-4 col-sm-6 col-12">

      <stats-card :title="$t('support_ticket')" type="gradient-info"
                  :sub-title="data ? data.customers.support_tickets.has_new_message+' '+$t('new_messages') : ''"
                  icon="lnir lnir-bubble">
        <!--<template slot="footer"></template>-->
      </stats-card>

    </div>

    <!--
    <div class="col-lg-4 col-sm-6 col-12">

      <stats-card :title="$t('customers')" type="gradient-info"
                  :sub-title="data ? data.customers.total : ''"
                  icon="lnir lnir-user">
        <template slot="footer">

          <div v-if="data && !loading" style="height: 250px;overflow: scroll;">
            <div>
              {{ $t('average_age') }} : {{ data.customers.average_age }}

            </div>
            <div>
              {{ $t('status') }} : {{ data.customers.verified }} v {{ data.customers.active }} a
            </div>
            <div>
              {{ $t('gender') }} : {{ data.customers.male }} m {{ data.customers.female }} w
            </div>

            <ul class="list-group list-group-flush list my-1">
              <li class="list-group-item px-0" v-for="country in tableData" :key="country.country">

                <div class="row align-items-center">
                  <div class="col-auto">
                    <img :src="'/img/icons/flags/'+country.country.toUpperCase()+'.png'" alt="Country flag" />
                  </div>
                  <div class="col">
                    <small>{{ $t('country') }}:</small>
                    <h5 class="mb-0">{{ $t(country.country) }}</h5>
                  </div>
                  <div class="col">
                    <small>{{ $t('active') }}:</small>
                    <h5 class="mb-0">{{ country.active }}</h5>
                  </div>
                  <div class="col">
                    <small>{{ $t('male') }}:</small>
                    <h5 class="mb-0">{{ country.male }}</h5>
                  </div>
                  <div class="col">
                    <small>{{ $t('female') }}:</small>
                    <h5 class="mb-0">{{ country.female }}</h5>
                  </div>
                  <div class="col">
                    <small>{{ $t('verified') }}:</small>
                    <h5 class="mb-0">{{ country.verified }}</h5>
                  </div>
                  <div class="col">
                    <small>{{ $t('total') }}:</small>
                    <h5 class="mb-0">{{ country.total }}</h5>
                  </div>
                </div>
              </li>

            </ul>

          </div>
          <div class="d-flex justify-content-center align-items-center" style="height: 250px;" v-else>
            <Loader/>
          </div>

        </template>
      </stats-card>

    </div>
    -->

  </div>
</template>
<script>
import { mapGetters } from "vuex"
import VueApexCharts from 'vue-apexcharts'
import Loader from '@/components/common/Loader/Loader'
    export default {
        components:{
            apexchart: VueApexCharts,
            Loader
        },
        computed: {
        ...mapGetters({
            data: "statistic/customersStat"
        }),
    },
    data(){
        return {
            loading:false,
            tableData:[]
        }
    },
    mounted(){
        this.loading = true;
        this.$store.dispatch('statistic/getCustomerStatistics').then(()=>{
            if(this.data && this.data.customers_by_country){

                for (const [key, value] of Object.entries(this.data.customers_by_country)) {
                    let object = value;
                    object.country = key.toLocaleLowerCase();
                    this.tableData.push(object);

                    }
                    this.tableData.sort((a,b)=>a.total>=b.total?-1:1)
            }
        }).catch((err)=>console.log(err)).finally(()=>{
            this.loading = false;
        });
    }
    }

</script>
