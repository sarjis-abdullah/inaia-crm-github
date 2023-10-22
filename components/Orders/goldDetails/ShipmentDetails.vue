<template>
    <div>
        <div v-if="isEditing || isNew"  class="d-flex flex-column align-items-center justify-content-center">
            <Input v-model="shippmentCompany" :placeholder="$t('shippment_company')" class="mt-4" @change="onCompanyNameChanged"/>
            <Input v-model="shippmentNumber" :placeholder="$t('shippment_number')" class="mt-4" @change="onCompanyNumberChanged"/>
            <Input v-model="trackingLink" :placeholder="$t('tracking_link')" class="mt-4" @change="onTrackingLinkChanged"/>
            <TextError :textError="linkError"/>
        </div>
        <div   class="list-group list-group-flush" v-if="!isEditing && !isNew">
            <detail-list-item :title="$t('shippment_company')" ><div slot="value">{{shippmentDetails ? shippmentDetails.shipping_company : ''}}</div></detail-list-item>
            <detail-list-item :title="$t('shippment_number')" ><div slot="value">{{shippmentDetails ? shippmentDetails.shipping_number : ''}}</div></detail-list-item>
            <detail-list-item :title="$t('tracking_link')" ><div slot="value">{{shippmentDetails ? shippmentDetails.tracking_link : ''}}</div></detail-list-item>
        </div>
        <div class="row justify-content-center">
             <base-button type="link" @click="() => cancelEdit()"
                v-if="isEditing || isNew">
                <span>{{$t('cancel')}}</span>
            </base-button>
            <base-button type="primary" @click="() => enableEdit()"
                v-if="!isEditing && shippmentDetails!=null"
                :disabled="shippmentCompany==null || shippmentNumber==null">
                <span>{{$t('edit')}}</span>
            </base-button>
            <base-button type="primary" @click="() => save()"
                v-if="isEditing"
                :disabled="shippmentCompany==null || shippmentNumber==null || (trackingLink && !validURL(trackingLink)) || isUploading">
                <span>{{$t('save')}}</span>
            </base-button>
        </div>
    </div>
</template>
<script>
import {Input,Button} from 'element-ui';
import { validURL } from '~/helpers/helpers';
import TextError from '@/components/common/Errors/TextError';
import DetailListItem from '@/components/common/DetailListItem.vue';
import { apiErrorHandler } from '../../../helpers/apiErrorHandler';
export default {
    components : {
        Input,
        TextError,
        DetailListItem
    },
    props:{
        shippmentDetails :{
            type: Object,
            default: null
        },
        isNew : {
            type: Boolean,
            default: false
        },
        order_id :{
            type: Number,
            default:-1
        }
    },
    data (){
        return {
            shippmentCompany:null,
            shippmentNumber:null,
            trackingLink:null,
            isEditing:false,
            linkError:null,
            isUploading:false,
            test:false
        }
    },
    mounted(){
        if(this.shippmentDetails)
        {
            this.shippmentCompany = this.shippmentDetails.shipping_company;
            this.trackingLink = this.shippmentDetails.tracking_link;
            this.shippmentNumber = this.shippmentDetails.shipping_number;
            this.trackingLink = this.shippmentDetails.tracking_link;
        }
    },
    methods:{
        validURL,
        cancelEdit(){
            this.isEditing = false;
            this.$emit('addShippmentCanceled');
        },
        enableEdit(){
            this.isEditing = true;
        },
        onTrackingLinkChanged(value){
            if(validURL(value) || value=="")
            {
                this.$emit('trackingLinkSet',value);
                this.linkError = null;
            }
            else
            {
                this.linkError = this.$t('enter_a_valid_url');
            }   
        },
        onCompanyNameChanged(value){
            this.$emit('companyNameSet',value);
        },
        onCompanyNumberChanged(value){
            this.$emit('companyNumberSet',value);
        },
        save(){
            this.$emit('addShipmentSaved',this.shippmentDetails);
            if(this.shippmentDetails && this.shippmentDetails.id)
            {
                let palyLoad = {id:this.shippmentDetails.id,order_id:this.order_id};
                palyLoad.data = {
                    shipping_company :  this.shippmentCompany,
                    shipping_number : this.shippmentNumber
                };
                if(this.trackingLink)
                {
                    palyLoad.data.tracking_link = this.trackingLink;
                }
                this.isUploading = true;
                this.$store.dispatch('orders/updateShippmentInfo',palyLoad).then(res=>{
                    this.$notify({type: 'success', timeout: 5000, message: this.$t('Shippment_details_changed_successfully')});
                    this.shippmentDetails = res;
                    this.isEditing = false;
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
                }).finally(()=>{
                    this.isUploading = false;
                })

            }
        }
    }
}
</script>
<style scoped>

</style>