<template>
      <form class="pt-4" v-if="showForm">
        <div class="row">
            <div class="col">
           
            <Select
              :placeholder="$t('types')"
              v-model="selectedType"
              filterable
              @change="onFilterChange"
             
              clearable
              :loading="loadingTypes"
              
            >
              <Option
                v-for="option in types"
                :value="option.id"
                :label="$t(option.name_translation_key)"
                :key="option.id"
              >
              </Option>
            </Select>
            
          </div>
          <div class="col">
            <date-picker
            size="large"
            class="filterElement"
            v-model="startDate"
            @change="onFilterChange"
            type="date"
            :placeholder="$t('select_start_date_placeholder')"
          >
          </date-picker>

          </div>
          <div class="col">
            <date-picker
            class="filterElement"
            v-model="endDate"
            @change="onFilterChange"
            type="date"
            :placeholder="$t('select_end_date_placeholder')"
          >
          </date-picker>
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
          <base-button type="primary" @click="createBtach" :disabled="(!selectedType && !startDate && !endDate) || startDate>endDate || isSubmitting">{{
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
        selectedType: null,
        startDate:null,
        endDate:null,
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
    },
    methods: {
      quiryBuilder: function () {
        let pendingStatus = this.status.find(x=>x.name_translation_key == 'pending');

        let query = "&is_part_of_a_process=0";
        if(pendingStatus){
            query+="&claim_status_id="+pendingStatus.id
        }
        if (this.selectedType) {
          query += "&claim_type_id=" + this.selectedType;
        }
        if (this.startDate) {
          query += "&create_data_range_start=" + formatDateToApiFormat(this.startDate);
        }
        if (this.endDate) {
          query += "&create_data_range_end=" + formatDateToApiFormat(this.endDate);
        }
        return query;
      },
      onFilterChange(){
        const query = this.quiryBuilder();
  
        this.$emit("filter", query);
      },
      createBtach: function () {
        let data = {};
        if(this.selectedType){
            data.claim_type_id = this.selectedType;
        }
        if(this.startDate){
            data.create_data_range_start = formatDateToApiFormat(this.startDate)
        }
        if(this.endDate){
            data.create_data_range_end = formatDateToApiFormat(this.endDate)
        }
        this.isSubmitting = true;
        this.$store.dispatch('batch-claims/createNewBatchProcess',data).then(()=>{
            this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("batch_claim_created_successfully"),
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
        this.selectedType = null;
        this.startDate = null;
        this.endDate = null;
        this.$emit("filter", "");
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
  