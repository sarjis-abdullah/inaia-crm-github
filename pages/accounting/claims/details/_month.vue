<template>
    <div>

    <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-7">
          <h6 class="h2 text-white d-inline-block mb-0">{{tite}}</h6>
          <!--
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
              <route-breadcrumb/>
          </nav>
          -->
        </div>
        <div class="col-lg-6 col-5 text-right" v-if="hasEditAccess">
          <base-button size="sm" type="neutral" @click="actDecMarkAsMany" v-if="!markManyAsPaid">{{$t('mark_many_as_paid')}}</base-button>
          <div class="d-flex justify-content-end" v-else>
                <base-button size="sm" type="neutral" @click="cancelMarkMany">
                    {{$t('cancel')}}
                </base-button>
                <base-button size="sm" type="neutral" @click="completeMarkManyAsPaid" :disabled="selectedAggregatedClaims.length==0">
                    {{$t('mark_as_paid')}}
                </base-button>
                
            </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
        <AggregatedClaims ref="list" 
        :month="month" :perPage="10" 
        :status="status" 
        :markManyAsPaid="markManyAsPaid"
        @markAsPayedAdded="markAsPayedAdded"
        @markAsPayedDeleted="markAsPayedDeleted"
        />
    </div>
    <modal
      :show.sync="showConfirmMarAsPaid"
      bodyClasses="pt-0"
      footerClasses="border-top bg-secondary"
      :allowOutSideClose="false"
      size="lg"
      @close="showConfirmMarAsPaid = false"
      >
      <template slot="header" class="pb-0">
        <h5 class="modal-title" id="exampleModalLabel">{{$t('confirm_as_paid')}}</h5>
      </template>
      <el-table
          class="table-hover table-responsive table-flush"
          header-row-class-name="thead-light"
          :data="selectedAggregatedClaims"
        >
          <el-table-column label="#" min-width="100px" prop="id">
            <template v-slot="{ row }">
              <div class="media align-items-center">
                <div class="media-body">
                  
                  <div class="font-weight-300 name">{{ row.id }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('amount')"
            min-width="100px"
            header-align="right"
            align="right"
            prop="amount"
          >
            <template v-slot="{ row }">
              <i18n-n :value="parseInt(row.amount) / 100"></i18n-n> €
            </template>
          </el-table-column>

          <el-table-column
            v-bind:label="$t('date')"
            min-width="100px"
            prop="claim_date"
          >
            <template v-slot="{ row }">
              {{ $d(new Date(row.claim_date), "short") }}
            </template>
          </el-table-column>
        </el-table>
      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="showConfirmMarAsPaid = false">
                          {{$t('cancel')}}
                        </base-button>
        <base-button type="primary" @click="() => confirmMarlAllAsPaid()"
                            :disabled="isSubmitting">
                          {{$t('mark_as_paid')}}
                        </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import AggregatedClaims from '@/components/Claims/AggregatedClaims';
import { getMonthName } from "../../../../helpers/helpers";
import { Table, TableColumn } from "element-ui";
import { canEditClaims } from '@/permissions';
export default {
  layout: "DashboardLayout",
  components: {
    AggregatedClaims,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data(){
      return {
          month:this.$route.params.month,
          status:this.$route.query.status,
          markManyAsPaid:false,
          selectedAggregatedClaims:[],
          showConfirmMarAsPaid: false,
          isSubmitting:false
      }
  },
  computed:{
      tite(){
          let dates = this.month.split('-');
          const monthName = getMonthName(dates[1]);
          return monthName + ' ' + dates[0];
      },
    hasEditAccess(){
      return canEditClaims()
    }
  },
  methods:{
    actDecMarkAsMany(){
      this.markManyAsPaid = !this.markManyAsPaid;
    },
    cancelMarkMany(){
       this.markManyAsPaid = false;
       this.$refs.list.cancelAddingMany();
       this.selectedAggregatedClaims=[];
    },
    completeMarkManyAsPaid(){
      this.showConfirmMarAsPaid = true;
    },
    markAsPayedAdded(aggregatedClaim)
    {
      this.selectedAggregatedClaims.push(aggregatedClaim);
      
    },
    markAsPayedDeleted(aggregatedClaim)
    {
      let index = this.selectedAggregatedClaims.indexOf(aggregatedClaim);
      this.selectedAggregatedClaims.splice(index,1);
    },
    confirmMarlAllAsPaid()
    {
      this.$notify({type: 'info', timeout: 5000, message: this.$t('marking_many_as_paid')})
      this.isSubmitting = true;
      let data = [];
      this.selectedAggregatedClaims.forEach(element => {
        data.push(element.id);
      });
      this.$store.dispatch('claims/markManyAspaid',data).then(()=>{
        this.$notify({type: 'success', timeout: 5000, message: this.$t('mark_many_as_paid_successfully')})
        this.$refs.list.refresh();
        this.showConfirmMarAsPaid = false;
        this.cancelMarkMany();
      }).catch(()=>{
        this.$notify({type: 'danger', timeout: 5000, message: this.$t('mark_many_as_paid_unsuccessfully')})
      }).finally(()=>{
        this.isSubmitting = false;
      })
    }
  }
};
</script>