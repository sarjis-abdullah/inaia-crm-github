<template>
    <div>
        <base-header class="pb-6">
      <div class="row align-items-center py-4">
        <div class="col-lg-2">
          <h6 class="h2 text-white d-inline-block mb-0">{{ $t("sales_commission") }}</h6>
        </div>
          <div class="col-lg-10 text-right">
                <base-button size="sm" type="neutral" @click="createnewCommission">
                        {{$t('new_commission')}}
                    </base-button>
        </div>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
       <List :salesAdvisorId="advisorId" @onEdit="editCommission"/>
    </div>
    <NewCommission :salesAdvisorId="advisorId" :showPopup="showNewCommission" @closed="closeCreateCommission" :oldCommission="selectedCommission"/>
    </div>
</template>
<script>
import List from '@/components/SalesCommission/List';
import { mapGetters } from "vuex";
import {isSalesAdvisor} from '@/helpers/auth';
import NewCommission from '@/components/SalesCommission/NewCommission'
export default{
    layout: 'DashboardLayout',
    components:{
        List,
        NewCommission
    },
    data(){
        return{
            showNewCommission:false,
            selectedCommission:null
        }
    },
    computed:{
        ...mapGetters("auth", {
            user: "user",
        }),
        advisorId(){
            let id = -1;
            if(isSalesAdvisor(this.user))
            {
                id = this.user.account.id;
            }
            return id;
        }
    },
    methods:{
        createnewCommission(){
            this.showNewCommission = true;
        },
        closeCreateCommission(){
            this.showNewCommission = false;
            this.selectedCommission = null;
        },
        editCommission(commission){
            this.selectedCommission = commission;
            this.showNewCommission = true;
        }
    }
}
</script>
