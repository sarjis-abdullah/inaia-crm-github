<template>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <Checkbox v-model="includeDeliveryFee" :label="$t('include_delivery_fee')" border @change="onDeliveryFeeChargeChanged"></Checkbox>
        <base-button class="mt-4" type="secondary" @click="addShippmentDetails" v-if="!shippingDetailsAdded">{{$t('add_shippment_details')}}
        </base-button>
        <ShipmentDetails v-if="shippingDetailsAdded" 
            @addShippmentCanceled="cancelAddShipmentDetails"
            @addShipmentSaved="onShippmentDetailsAdded"
            @companyNameSet ="onCompanyNameSet"
            @companyNumberSet ="onCompanyNumberSet"
            @trackingLinkSet ="onTrackingLinkSet"
            :isNew="true"
        />
    </div>
    
</template>
<script>
import { Checkbox } from 'element-ui';
import { events } from '~/helpers/constans';
import ShipmentDetails from '@/components/Orders/goldDetails/ShipmentDetails';
import BaseButton from '../../argon-core/BaseButton.vue';
export default {
    components:{
        Checkbox,
        ShipmentDetails,
        BaseButton
    },
    props:{

    },
    data (){
        return{
            includeDeliveryFee:true,
            shippingDetailsAdded:false,
            shippmentDetails:{
                shippmentCompany:null,
                shippmentNumber:null,
                trackingLink:null,
                isValid(){
                    if(!this.shippmentCompany && !this.shippmentNumber)
                    {
                        return true;
                    }
                    if(this.shippmentCompany && this.shippmentNumber)
                    {
                        return true;
                    }
                    return false;
                }
            }
        }
    },
    methods:{
        onDeliveryFeeChargeChanged (value){
            this.$emit("shippmentFeeChargeChanged",value);
        },
        addShippmentDetails (){
            this.shippingDetailsAdded = true;
        },
        cancelAddShipmentDetails(){
            this.shippingDetailsAdded = false;
            this.shippmentDetails.shippmentCompany = null;
            this.shippmentDetails.shippmentNumber = null;
            this.shippmentDetails.trackingLink = null;
            
            this.$emit('shippmentDetailsChanged',this.shippmentDetails);
        },
        onCompanyNameSet(value){
            this.shippmentDetails.shippmentCompany = value;
            this.$emit('shippmentDetailsChanged',this.shippmentDetails);
        },
        onCompanyNumberSet(value){
            this.shippmentDetails.shippmentNumber = value;
            this.$emit('shippmentDetailsChanged',this.shippmentDetails);
        },
        onTrackingLinkSet(value){
            this.shippmentDetails.trackingLink = value;
            this.$emit('shippmentDetailsChanged',this.shippmentDetails);                                                                          
        },
    }
}
</script>
<style scoped>

</style>