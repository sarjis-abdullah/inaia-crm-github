<template>
     <modal :show.sync="show"  headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary" @close="onClose" :allowOutSideClose="false">
        <template slot="header" >
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
                <Select
                :placeholder="$t('transction_direction')"
                v-model="transactionType"
                class="mb-3"
                >
                    <Option
                    
                    :value="'CREDIT'"
                    :label="'CREDIT'"
                    :key="'CREDIT'"
                    >
                    </Option>
                    <Option
                    
                    :value="'DEBIT'"
                    :label="'DEBIT'"
                    :key="'DEBIT'"
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
                <div class="mt--1 mb-3 row">
                    <div v-if="fixingPriceGram > -1" class="col text-sm text-muted">
                        {{$t('fixing_price')}} : {{$n(fixingPriceGram)}} € / g
                    </div>
                    <div v-if="fixingPriceOunce > -1" class="col text-sm text-muted">
                        {{$n(fixingPriceOunce)}} € / Ounce
                    </div>
                    <div v-if="(fixingPriceGram == -1)" class="mt--1 my-3 text-sm text-danger">
                        {{$t('this_date_has_not_goldprice')}}
                    </div>
                </div>
                <span class=" text-sm-center text-muted mb-3" v-if="isCredit">{{ $t('stock_bought_amount_explanation') }}</span>
                <div class="row" v-if="isNewOperations() && isCredit">
                    <div class="col-3">
                        <Input v-model="amount" :placeholder="$t('stock_bought_amount')"/>
                    
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
                <Input v-model="amount" :placeholder="$t('stock_bought_amount')" v-else class="mb-3"/>

                <Input v-model="totalMoneyAmount" :placeholder="$t('total_buying_amount')"  v-if="isRefinerySource() && isCredit" />
                <div class="mb-3 text-sm text-muted" v-if="isRefinerySource() && isCredit">
                    {{ $t('buying_unit_price') }} : {{ unitPrice }} € / g
                </div>
                
                
                <SelectSuppliers v-if="isRefinerySource() && isCredit" @change="onSupplierChange"/>
                <Input v-model="reference" :placeholder="isCredit?$t('reference'):$t('comment')" v-if="isRefinerySource() || !isCredit" max="100"/>
                <span class="mb-3 text-sm text-muted" v-if="isCredit">Max length 100 chars</span>
                <div class="d-flex justify-content-center" v-if="isRefinerySource() && isCredit">
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
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
const REFINERY = 'refinery';
const credit = "CREDIT";
const debit = "DEBIT";
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
        },
        assetTypeId:{
            type: Number,
            default: -1
        },
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
        if(this.assetTypeId != -1 && this.depotTypes.length > 0){

        }
    },
    computed:{
        ...mapGetters({
            depotTypes : 'depots/depotTypes'
        }),
        isCredit(){
            return this.transactionType == credit;
        }
    },
    data(){
        return {
            selectedDepotType:null,
            disableDepotType:false,
            loadingTypes:false,
            fixingDate:new Date(),
            fixingPriceGram:-1,
            fixingPriceOunce:-1,
            stockTypesData:[{id:0,name_translation_key:stockTypes.inaiaStock.toString()},{id:1,name_translation_key:stockTypes.operationStock.toString()}],
            selectedStockType:null,
            disableStockType:false,
            sourcesData:[{id:0,name_translation_key:stockTypes.inaiaStock},{id:1,name_translation_key:REFINERY}],
            amount:null,
            selectedSource:REFINERY,
            reference:null,
            file:null,
            isSubmitting:false,
            supplierId:null,
            totalMoneyAmount:null,
            unitPrice:null,
            transactionType : credit
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
        },
        amount:{
            handler(){
                if(parseFloat(this.amount)> 0 && this.totalMoneyAmount!=null){
                    this.unitPrice = (parseFloat(this.totalMoneyAmount)/parseFloat(this.amount));
                }
                
            },
            immediate: true
        },
        totalMoneyAmount:{
            handler(){
                if(parseFloat(this.amount)> 0 && this.totalMoneyAmount!=null){
                    this.unitPrice = (parseFloat(this.totalMoneyAmount)/parseFloat(this.amount));
                }
                
            },
            immediate: true
        },
        show:{
            handler(){
                if(this.show==true && this.fixingPriceGram == -1 && this.fixingPriceOunce == -1){
                    
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
                }
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
            let theSelectedOne = null;
            if(this.assetTypeId > -1){
                theSelectedOne = this.depotTypes.find(x=>x.id == this.assetTypeId);
            }
            if(this.assetType){
                theSelectedOne = this.depotTypes.find(x=>x.name_translation_key == this.assetType);
            }
            if(theSelectedOne)
            {
                this.selectedDepotType = theSelectedOne.id;
                this.assetType = theSelectedOne.name_translation_key
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
                this.$store.dispatch('gold/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1)
                    {
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                    }
                    else{
                        this.fixingPriceGram = -1;
                        this.fixingPriceOunce = -1;
                    }
                    
                })
            }
            if(this.assetType == assetTypes.silver)
            {
                this.$store.dispatch('silver/getFullFixingPrice',dbDate).then(res=>{
                    if(res != -1){
                        this.fixingPriceGram = res.fixing_gram;
                        this.fixingPriceOunce = res.fixing_ounce;
                    }
                    else{
                        this.fixingPriceGram = -1;
                        this.fixingPriceOunce = -1;
                    }
                    
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
            
            let essentials = (this.selectedStockType && this.selectedDepotType && this.fixingPriceGram >0 && this.amount >0);
            if(!this.isCredit){
                return this.reference!=null;
            }
            else{
                    if(this.selectedSource != REFINERY && essentials)
                {
                    return true;
                }
                if(this.selectedSource == REFINERY && essentials)
                {
                    
                    return (this.reference!=null && this.unitPrice > 0 && this.totalMoneyAmount > 0);  
                }
            }
            
            return false;
        },
        onChange(file, fileList) {
            this.file = file;
        },
        submitNewStock(){
            this.isSubmitting = true;
            let depotType = this.depotTypes.find(x=>x.id == this.selectedDepotType);
            if(this.selectedSource == REFINERY)
            {
                let data = new FormData();
                data.append('stock_type',this.selectedStockType);
                data.append('depot_type_id',this.selectedDepotType);
                data.append('transaction_type',this.transactionType);
                data.append('amount',parseInt(this.amount*1000));
                data.append('fixing_price',parseInt(this.fixingPriceGram*100));
                data.append('fixing_date',formatDateToApiFormat(this.fixingDate));
                data.append('money_amount',(parseInt(this.totalMoneyAmount*100)));
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
                    this.selectedDepotType=null;
                    this.disableDepotType=false;
                    this.loadingTypes=false;
                    this.fixingDate=new Date();
                    this.fixingPriceGram=-1;
                    this.fixingPriceOunce=-1;
                    this.selectedStockType=null;
                    this.disableStockType=false;
                    this.amount=null;
                    this.selectedSource=REFINERY;
                    this.reference=null;
                    this.file=null,
                    this.isSubmitting=false;
                    this.supplierId=null;
                    this.totalMoneyAmount=null;
                    this.unitPrice=null;
                    this.transactionType = credit;
                this.$emit('added');
                    this.onClose();
                    this.$notify({
                    type:'success',
                    message:this.$t('success_adding_stock'),
                    duration:5000})
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
                }).finally(()=>{
                    this.isSubmitting =  false;
                })
            }
            else{
                let data = {
                    depot_type_id:this.selectedDepotType,
                    amount:parseInt(this.amount*1000),
                    fixing_price:parseInt(this.fixingPriceGram*100),
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
                }).catch((err)=>{
                    apiErrorHandler(err,this.$notify);
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
