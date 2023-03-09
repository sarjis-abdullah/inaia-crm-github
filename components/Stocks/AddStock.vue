<template>
     <modal :show.sync="show"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" class="pb-0">
            <h5 class="modal-title">{{$t('add_stocks')}}</h5>
        </template>
        <form>
            <div class="col-md d-flex flex-column align-content-center">
                <Select
                :placeholder="$t('asset_type')"
                v-model="selectedDepotType"
                class="mb-3"
                :loading="loadingTypes"
                :disabled="disableDepotType"
                >
                    <Option
                    v-for="option in depotTypes"
                    :value="option.id"
                    :label="$t(option.name_translation_key)"
                    :key="option.id"
                    >
                    </Option>
                </Select>
                <date-picker
                    size="large"
                    class="my-2"
                    v-model="fixingDate"
                    type="date"
                    :placeholder="$t('select_gold_price_date')"
                    @change="getFixingPrice"
                >
                </date-picker>
                <div v-if="fixingPrice > -1" class="mt--1 mb-3 text-sm text-muted">
                    {{$t('gram_price')}} : {{fixingPrice}} €
                </div>
                <div v-else class="mt--1 mb-3 text-sm text-danger">
                    {{$t('this_date_has_not_goldprice')}}
                </div>
                <Select
                :placeholder="$t('stock_type')"
                v-model="selectedStockType"
                class="mb-3"
                :disabled="disableStockType"
                >
                    <Option
                    v-for="option in stockTypesData"
                    :value="option.name_translation_key"
                    :label="$t(option.name_translation_key)"
                    :key="option.id"
                    >
                    </Option>
                </Select>
                <div class="row" v-if="isNewOperations()">
                    <div class="col-3">
                        <Input v-model="amount" :placeholder="$t('amount')"/>
                    </div>
                    <div class="col-9 m-auto">
                        <span class="mr-2">{{ $t('from') }}</span>
                        <Select
                :placeholder="$t('source')"
                v-model="selectedSource"
                class="mb-3"
                >
                    <Option
                    v-for="option in sourcesData"
                    :value="option.name_translation_key"
                    :label="$t(option.name_translation_key)"
                    :key="option.id"
                    >
                    </Option>
                </Select>
                    </div>

                </div>
                <Input v-model="amount" :placeholder="$t('amount')" v-else class="mb-3"/>
                <SelectSuppliers v-if="isRefinerySource()" @change="onSupplierChange"/>
                <Input v-model="reference" :placeholder="$t('reference')" v-if="isRefinerySource()" class="mb-3"/>
                <div class="d-flex justify-content-center" v-if="isRefinerySource()">
                    <Upload
                        class="upload-demo"
                        drag
                        ref="upload"
                        :auto-upload="false"
                        :limit="1"
                        :multiple="false"
                        :disabled="isSubmitting"
                        :on-change="onChange"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                        {{$t('drop_file_here')}} <em>{{$t('click_to_upload')}}</em>
                        </div>
                        <div class="el-upload__tip" slot="tip">{{$t('proof_document')}}</div>
                    </Upload>
                </div>
            </div>
        </form>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose()">
                {{$t('cancel')}}
            </base-button>
            <base-button type="primary" @click="() => submitNewStock()"
            :disabled="isSubmitting || !isValid()">
                {{$t('submit')}}
            </base-button>
        </template>
    </modal>
</template>
<script>
import {
  Select,
  Option,
  DatePicker,
  Autocomplete,
  Form,
  FormItem,
  Input
} from "element-ui";
import { mapGetters } from "vuex";
import { assetTypes } from '@/helpers/depots';
import { stockTypes } from '@/helpers/stocks';
import { formatDateToApiFormat } from '@/helpers/helpers';
import { Upload } from "element-ui";
import SelectSuppliers from "@/components/Suppliers/SelectSuppliers";
const REFINERY = 'refinery';
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        target:{
            type : String,
            default: null
        },
        assetType:{
            type: String,
            default: null
        }
    },
    components: {
        Select,
        Option,
        DatePicker,
        Autocomplete,
        Form,
        FormItem,
        Input,
        Upload,
        SelectSuppliers
    },
    mounted(){
        if(this.depotTypes.length == 0)
        {
            this.loadingTypes =  true
            this.$store.dispatch('depots/getDepotTypes').then(()=>{
                this.initDepotType();
            }).finally(()=>{
                this.loadingTypes = false;
            })
        }
        else{
            this.initDepotType();
        }
        this.initDate();
        this.initStockType();
    },
    computed:{
        ...mapGetters({
            depotTypes : 'depots/depotTypes'
        })
    },
    data(){
        return {
            selectedDepotType:null,
            disableDepotType:false,
            loadingTypes:false,
            fixingDate:new Date(),
            fixingPrice:0,
            stockTypesData:[{id:0,name_translation_key:stockTypes.inaiaStock.toString()},{id:1,name_translation_key:stockTypes.operationStock.toString()}],
            selectedStockType:null,
            disableStockType:false,
            sourcesData:[{id:0,name_translation_key:stockTypes.inaiaStock},{id:1,name_translation_key:REFINERY}],
            amount:null,
            selectedSource:REFINERY,
            reference:null,
            file:null,
            isSubmitting:false,
            supplierId:null

        }
    },
    watch:{
        target:{
            handler(){
                this.initStockType()
            },
            immediate: true
        },
        assetType:{
            handler(){
                this.initDepotType()
            },
            immediate: true
        }
    },
    methods:{
        onClose(){
            this.show = false;
            this.$emit('closed');
        },
        initDepotType(){
            let theSelectedOne = this.depotTypes.find(x=>x.name_translation_key == this.assetType);
            if(theSelectedOne)
            {
                this.selectedDepotType = theSelectedOne.id;
                this.disableDepotType =  true;
            }
        },
        initDate()
        {
            const date = new Date();
            const previous = new Date(date.getTime());
            previous.setDate(date.getDate() - 1);
            this.fixingDate = previous;
            this.getFixingPrice();
        },
        onSupplierChange(supplierId){
            this.supplierId = supplierId;
        },
        getFixingPrice(){
            const dbDate = formatDateToApiFormat(this.fixingDate);
            if(this.assetType == assetTypes.gold)
            {
                this.$store.dispatch('gold/getFixingPrice',dbDate).then(res=>{
                    this.fixingPrice = res;
                })
            }
            if(this.assetType == assetTypes.silver)
            {
                this.$store.dispatch('silver/getFixingPrice',dbDate).then(res=>{
                    this.fixingPrice = res;
                })
            }
        },
        initStockType(){
            if(this.target)
            {
                this.selectedStockType = this.target;
                this.disableStockType = true;
            }
        },
        isNewOperations(){
            return this.target == stockTypes.operationStock
        },
        isRefinerySource(){
            return this.selectedSource == REFINERY;
        },
        isValid(){
            let essentials = (this.selectedStockType && this.selectedDepotType && this.fixingPrice >0 && this.amount >0);
            if(this.selectedSource != REFINERY && essentials)
            {
                return true;
            }
            if(this.selectedSource == REFINERY && essentials)
            {
                return (this.reference!=null);  
            }
            return false;
        },
        onChange(file, fileList) {
            this.file = file;
            console.log(file.raw);
        },
        submitNewStock(){
            this.isSubmitting = true;
            let depotType = this.depotTypes.find(x=>x.id == this.selectedDepotType);
            if(this.selectedSource == REFINERY)
            {
                let data = new FormData();
                data.append('stock_type',this.selectedStockType);
                data.append('depot_type_id',this.selectedDepotType);
                data.append('transaction_type','CREDIT');
                data.append('amount',this.amount*1000);
                data.append('fixing_price',parseInt(this.fixingPrice*100));
                data.append('fixing_date',formatDateToApiFormat(this.fixingDate));
                if(this.reference)
                    data.append('external_ref_number',this.reference);
                if(this.file)
                    data.append('document',this.file.raw);
                if(this.supplierId)
                {
                    data.append('supplier_id',this.supplierId)
                }
                
                let payload = {
                    data:data,
                    depoType:depotType.name_translation_key,
                    stockType : this.selectedStockType
                }
                this.$store.dispatch('stocks/createNewStock',payload).then((res)=>{
                    this.$emit('added');
                    this.onClose();
                    this.$notify({
                    type:'success',
                    message:this.$t('success_adding_stock'),
                    duration:5000})
                }).catch(()=>{
                    this.$notify({
                    type:'error',
                    message:this.$t('error_adding_stock'),
                    duration:5000})
                }).finally(()=>{
                    this.isSubmitting =  false;
                })
            }
            else{
                let data = {
                    depot_type_id:this.selectedDepotType,
                    amount:this.amount*1000,
                    fixing_price:parseInt(this.fixingPrice*100),
                    fixing_date:formatDateToApiFormat(this.fixingDate)
                }
                let payload = {
                    data:data,
                    depoType:depotType.name_translation_key,
                    stockType : this.selectedStockType
                }
                this.$store.dispatch('stocks/transferStock',payload).then((res)=>{
                    this.$emit('added');
                    this.onClose();
                    this.$notify({
                    type:'success',
                    message:this.$t('success_adding_stock'),
                    duration:5000})
                }).catch(()=>{
                    this.$notify({
                    type:'error',
                    message:this.$t('error_adding_stock'),
                    duration:5000})
                }).finally(()=>{
                    this.isSubmitting =  false;
                })
            }
        }
    }
}
</script>
<style scoped>

</style>
