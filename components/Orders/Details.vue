<template>
    <div class="card">
        <img :src="resource.logo" class="logo"/>
        <h2 class="card-title mt-3 mb-0 title">{{resource.order_type ? $t(resource.order_type.name_translation_key) : resource.order_type_id}}</h2>
        <div style="margin-top:40px">
            <GoldSale :order="resource" v-if="resource.order_type.name_translation_key=='gold_sell'"></GoldSale>
            <GoldPurchase :order="resource" v-if="resource.order_type.name_translation_key=='gold_purchase' || resource.order_type.name_translation_key=='gold_purchase_interval'"></GoldPurchase>
            <GoldDelivery :order="resource" v-if="resource.order_type.name_translation_key=='gold_delivery'"></GoldDelivery>
            <GoldGift :order="resource" v-if="resource.order_type.name_translation_key=='gold_gift'"></GoldGift>
            <GoldTransfer :order="resource" v-if="resource.order_type.name_translation_key=='gold_transfer_in' || resource.order_type.name_translation_key=='gold_transfer_out'"></GoldTransfer>
            <GoldWithdrawal :order="resource" v-if="resource.order_type.name_translation_key=='gold_withdrawal'"></GoldWithdrawal>
        </div>
    </div>
</template>

<script>
import GoldSale from '@/components/Orders/goldDetails/GoldSale';
import GoldPurchase from '@/components/Orders/goldDetails/GoldPurchase';
import GoldDelivery from '@/components/Orders/goldDetails/GoldDelivery';
import GoldGift from '@/components/Orders/goldDetails/GoldGift';
import GoldTransfer from '@/components/Orders/goldDetails/GoldTransfer';
import GoldWithdrawal from '@/components/Orders/goldDetails/GoldWithdrawal';
export default {
    components:{
        GoldSale,
        GoldPurchase,
        GoldDelivery,
        GoldGift,
        GoldTransfer,
        GoldWithdrawal
    },
    props: {
        resource: {
            type: Object
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
    margin: auto;
    margin-top:20px
}
.title {
    margin-right:auto;
    margin-left: auto;
    margin-top: 10px;
    margin-bottom: 20px;
}


</style>