<template>
      <form class="pt-4" v-if="showForm">
        <div class="row my-3">
          <div class="col">
           Do you confirm creation of batch process with those criteria ?
          </div>
            <div class="col">
           
            Total number : <i18n-n :value="parseInt(total)"></i18n-n>
            
          </div>
          <div class="col">
            Total amount : <i18n-n :value="parseInt(totalAmount) / 100"></i18n-n> €
          </div>
          
        </div>
        <div
          class="
            applyContainer
            displayFlex
            flex-row
            align-content-center
            justify-content-center
            mb-0
          "
        >
        <base-button type="secondary" @click="cancelCreation" :disabled="isSubmitting">{{
            $t("cancel")
          }}</base-button>
          <base-button type="primary" @click="createBtach" :disabled="isSubmitting || total==0">{{
            $t("create_Batch")
          }}</base-button>
        </div>
      </form>
  </template>
  <script>
  import {
    Select,
    Option,
    DatePicker,
    Form,
    FormItem,
  } from "element-ui";
  import { mapGetters } from "vuex";
  import { formatDateToApiFormat } from "../../helpers/helpers";
  import moment from "moment";
  import { apiErrorHandler } from '../../helpers/apiErrorHandler';
import { Theme } from '@fullcalendar/core';
  export default {
    props: {
        showForm: {
        type: Boolean,
        default: false,
      },
      metaData:{
        type:Object,
        default:null
      },
      query:{
        type:String,
        default:''
      }
    },
    components: {
      Select,
      Option,
      DatePicker,
      Form,
      FormItem,
    },
    data: function () {
      return {
        
        isSubmitting:false
      };
    },
    mounted() {
        if(this.status.length == 0){
            this.$store.dispatch("claims/getClaimStatuses", "");
        }
      this.$store.dispatch("claims/getClaimTypes", "");
    },
    computed: {
      ...mapGetters("claims", {
        loadingTypes: "loading",
        types: "claimTypes",
        status: "claimStatuses",
      }),
      totalAmount(){
        if(this.metaData){
          return this.metaData.total_amount
        }
        return 0
      },
      total(){
        if(this.metaData){
          return this.metaData.total
        }
        return 0
      }
    },
    methods: {
      _getQuaryValue(p){
        const keyValues= p.split('=');
        debugger;
        if(keyValues && keyValues.length==2){
          return keyValues[1];
        }
      },

      createBtach: function () {
        let data = {};
        let params = this.query.split('&');
        params.forEach(p=>{
          if(p.includes("claim_type_id")){
            const value = this._getQuaryValue(p);
            if(value){
              data.claim_type_id = value;
            }
          }
          if(p.includes("create_data_range_start")){
            const value = this._getQuaryValue(p);
            if(value){
              data.create_data_range_start = value;
            }
          }
          if(p.includes("create_data_range_end")){
            const value = this._getQuaryValue(p);
            if(value){
              data.create_data_range_end = value;
            }
          }
          if(p.includes("amount_eq")){
            const value = this._getQuaryValue(p);
            if(value){
              data.amount_eq = value;
            }
          }
          if(p.includes("amount_lte")){
            const value = this._getQuaryValue(p);
            if(value){
              data.amount_lte = value;
            }
          }
          if(p.includes("amount_gte")){
            const value = this._getQuaryValue(p);
            if(value){
              data.amount_gte = value;
            }
          }
          if(p.includes("depot_id")){
            const value = this._getQuaryValue(p);
            if(value){
              data.depot_id = value;
            }
          }
          if(p.includes("account_id")){
            const value = this._getQuaryValue(p);
            if(value){
              data.account_id = value;
            }
          }
          if(p.includes("payment_method")){
            const value = this._getQuaryValue(p);
            if(value){
              data.payment_method = value;
            }
          }
        })
        this.isSubmitting = true;
        this.$store.dispatch('batch-claims/createNewBatchProcess',data).then(()=>{
            this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("entry_added_successfully"),
          });
          this.selectedType = null;
          this.startDate = null;
          this.endDate = null;
          this.$emit("filter", "");
          this.$emit("done");
        }).catch((err)=>{
            apiErrorHandler(err,this.$notify);
        }).finally(()=>{
            this.isSubmitting = false;
        })
      },
      cancelCreation(){
        
        this.$emit("done");
      }
    },
  };
  </script>
  <style scoped>
  .container {
    min-height: 40px;
    margin-bottom: 2px;
  }
  .header {
    height: 40px;
    background-color: #fff;
    width: 100%;
  }
  .filter {
    height: 18px !important;
    width: 18px !important;
    color: #212529;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    padding: 2px;
  }
  .displayFlex {
    display: flex;
  }
  .badgeIcon {
    margin-left: 3px;
  }
  .filterElement {
    margin-bottom: 15px;
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .filterElement input {
    height: 40px !important;
    line-height: 40px !important;
    font-size: 0.875rem;
  }
  .applyContainer {
    margin-bottom: 15px;
  }
  
  .pointer {
    cursor: pointer;
  }
  </style>
  