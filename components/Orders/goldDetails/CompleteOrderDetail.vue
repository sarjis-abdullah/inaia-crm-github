<template>
    <div class="list-group list-group-flush">
        <date-picker
            class="align-self-center"
            v-model="selectedDate"
            type="date"
            @change="getPreview"
            :placeholder="$t('select_end_date_placeholder')">
          </date-picker>
        <div v-if="isLoading">
            <p class="mt-2 text-sm text-center text-muted">{{$t('loading')}}...</p>
        </div>
        <div v-else-if="!isLoading && error!=null">
            <p class="mt-2 text-sm text-center text-danger">{{$t(error)}}</p>
        </div>
        <div v-else-if="!isLoading && error==null && preview!=null" >
            <!--<detail-list-item title="ID"><div slot="value">{{preview.order_id}}</div></detail-list-item>-->
            <detail-list-item :title="$t('date')"><div slot="value"> {{$d(new Date(preview.gold_price_date),'short')}}</div></detail-list-item>
            <detail-list-item :title="$t('depot')"><div slot="value">{{order.depotName}}</div></detail-list-item>
            <detail-list-item :title="$t('course')"><div slot="value"> <i18n-n :value="preview.gold_price_trading/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('agio')" v-if="preview.fee!=0"><div slot="value"> <i18n-n :value="preview.fee/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('amount')"><div slot="value"> <i18n-n :value="preview.money_amount/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('gold_amount')"><div slot="value"> <i18n-n :value="preview.gold_amount/1000"></i18n-n> g</div></detail-list-item>
            <!--
            <detail-list-item :title="$t('depot_balance_before')"><div slot="value"><i18n-n :value="preview.depot_balance_before/100"></i18n-n> €</div></detail-list-item>
            <detail-list-item :title="$t('depot_balance_after')"><div slot="value"><i18n-n :value="preview.depot_balance_after/100"></i18n-n> €</div></detail-list-item>
            -->
        </div>
    </div>
</template>
<script >
import DetailListItem from '@/components/common/DetailListItem.vue';
import {formatDateToApiFormat} from '../../../helpers/helpers';
import {DatePicker} from 'element-ui';
export default {
    components:{
        DetailListItem,
        DatePicker,
    },
    props:{
        order:{
            type:Object
        }
    },
    data:function(){
        return {
            selectedDate:null,
            preview:null,
            isLoading:false,
            error:null,
        }
    },
    mounted:function(){
        const today = new Date();
        this.selectedDate = new Date(today);
        this.selectedDate.setDate(this.selectedDate.getDate()-1);
        this.getPreview();
    },
    methods:{
        getPreview:function()
        {
            const today = new Date();
            if(this.selectedDate>today)
            {
                this.error = 'select_right_preview_date';
                return;
            }
            this.error = null;
            this.isLoading = true;
            this.$emit('dateselected',formatDateToApiFormat(this.selectedDate));
            this.$store.dispatch('orders/getCompleteOrderPreview',{id:this.order.id,date:formatDateToApiFormat(this.selectedDate)}).then(res=>{
                this.preview = res;
            }).catch(err=>{
                this.error = 'cant_load_preview'
            }).finally(()=>{
                this.isLoading = false;
            })
        }
    }
}

</script>
<style scoped>

</style>
