<template>
  <div class="card">
    <div class="card-header">
        <div class="row">
            <div class="col">
                 {{ getMonthName(item.month) }}
            </div>
            <div class="col">
                <icon-button type="info" class="float-right" @click="openDetails"></icon-button>
            </div>
        </div>
    </div>
    <div class="class-body">
      <div
        class="d-flex flex-column align-items-center justify-content-center p-3"
      >
      <div>
          <i class="fa fa-file" style="font-size:35px;color:#0074d9"></i>
      </div>
        <div class="d-inline m-3">
          <Status :status="item.status" />
          <span v-if="item.unpaid_sum > 0" class="text-sm">
            ({{ $n(item.unpaid_sum / 100) }} €)</span
          >
        </div>
        
      </div>
    </div>
  </div>
</template>
<script>
import { getMonthName } from "../../helpers/helpers";
import Status from "@/components/Claims/Status";
import IconButton from '@/components/common/Buttons/IconButton';
export default {
  components: {
    Status,
    IconButton
  },
  props: {
    item: {
      type: Object,
    },
    year:{
        type:String
    }
  },
  methods: {
    getMonthName,
    openDetails(){
        let month = this.year+'-';
        if(this.item.month<10)
        {
            month+="0"+this.item.month;
        }
        else
        {
            month+=this.item.month;
        }
        this.$router.push('/accounting/claims/details/'+month+'?status='+this.item.status)
    }
  },
};
</script>
