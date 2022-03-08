<template>
    <div>
        <div class="text-center">
            <img :src="resource.avatar" class="logo"/>
            <h2 class="card-title mt-3 mb-0 title">{{resource.name}}</h2>
             <div class="list-group list-group-flush mt-3">
                 <DetailListItem :title="$t('status')"><div slot="value"><Status :row="resource"/></div></DetailListItem>
                <DetailListItem :title="$t('gold_amount')"><div slot="value">{{$n(resource.gold_amount/1000)}} g</div></DetailListItem>
                <DetailListItem :title="$t('course')"><div slot="value">{{$n(goldPrice)}} €</div></DetailListItem>
                <DetailListItem :title="$t('amount')"><div slot="value">{{$n((resource.gold_amount/1000)*goldPrice)}} €</div></DetailListItem>
                
             </div>
             <div class="list-group list-group-flush" v-if="resource.is_savings_plan==1">
                <h4 class="mt-4 text-center">{{$t('saving_plan')}}</h4>
                 <DetailListItem :title="$t('interval_amount')"><div slot="value">{{$n(resource.interval_amount/100)}} €</div></DetailListItem>
                 <DetailListItem :title="$t('interval_startdate')"><div slot="value">{{$d(new Date(resource.interval_startdate),'short')}}</div></DetailListItem>
                 <DetailListItem :title="$t('interval_enddate')"><div slot="value">{{$d(new Date(resource.interval_enddate),'short')}}</div></DetailListItem>
                 <DetailListItem :title="$t('last_saving_order_date')"><div slot="value">{{$d(new Date(resource.last_savings_order_date),'short')}}</div></DetailListItem>
                 <base-progress class="mt-3" show-label type="success" :height="8" :value="resource.progress/100" :label="$t('progress')"></base-progress>
             </div>
        </div>
    </div>
</template>

<script>
import DetailListItem from '@/components/common/DetailListItem.vue';
import { mapGetters } from "vuex";
import Status from '@/components/Depots/Status';
export default {
    props: {
        resource: {
            type: Object
        },
        productClasses: {
            type: Object
        }
    },
    computed:{
        ...mapGetters('depots',{
            goldPrice:"getGoldPrice"
        }),
    },
    components:{
        DetailListItem,
        Status
    },
    data: function(){
        return {
        }
    },
    mounted () {
        if(this.goldPrice==0)
        {
            this.$store.dispatch('depots/getCurrentGoldPrice').then(res=>{
                console.log(res);
                this.goldPrice = res;
            })
        }
        
    },
    methods: {
        getProductClass(cid) {
            if (this.productClasses) {
                let c   = Object.keys(this.productClasses).find(cl => this.productClasses[cl] == cid)
                return c || cid
            }
            return cid
        }
    }
}
</script>

<style scoped>
.capitalize {
    text-transform: capitalize
}
.logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}
</style>