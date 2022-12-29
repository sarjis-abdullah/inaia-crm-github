<template>
    <div>
        <form class="card-header border-0" v-if="showFilter">
            <div class="row">
                <div class="col">
                    <Select v-model="transactionType"
                        clearable
                        @clear="clearTransactionType"
                        :placeholder="$t('transaction_type')"
                    >
                    <Option
                        v-for="option in transactionTypes"
                        :value="option.name_translation_key"
                        :label="$t(option.name_translation_key)"
                        :key="option.id"
                        >

                        </Option>
                    </Select>
                </div>
                <div class="col">
                    <Select v-model="selectedTransactionDirection"
                        clearable
                        @clear="clearTransactionDirection"
                        :placeholder="$t('transaction_direction')"
                    >
                    <Option
                        v-for="option in transactionDirections"
                        :value="option.name_translation_key"
                        :label="$t(option.name_translation_key)"
                        :key="option.id"
                        >

                        </Option>
                    </Select>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <Select v-model="selectedSupplier"
                        clearable
                        @clear="clearSupplier"
                        :placeholder="$t('supplier')"
                    >
                    <Option
                        v-for="option in suppliers"
                        :value="option.id"
                        :label="$t(option.name)"
                        :key="option.id"
                        >

                        </Option>
                    </Select>
                </div>
            </div>
            <div
        class="
          d-flex
          flex-row
          align-content-center
          justify-content-center
          mb-0
        "
      >
        <base-button type="primary" @click="applyFilter">{{
          $t("apply_filter")
        }}</base-button>
      </div>
        </form>
        <div class="card-header border-0 border-top" v-if="filterIsActive">
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="transactionType"
        >{{ $t(transactionType) }}
        <a class="pointer badgeIcon" @click.prevent="clearTransactionType()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedTransactionDirection"
        >{{ $t(selectedTransactionDirection) }}
        <a class="pointer badgeIcon" @click.prevent="clearTransactionDirection()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <Badge
        type="secondary"
        size="md"
        style="margin-right: 10px"
        v-if="selectedSupplier"
        >{{ displaySupplier() }}
        <a class="pointer badgeIcon" @click.prevent="clearSupplier()"
          ><i class="fas fa-window-close"></i></a
      ></Badge>
      <ClearFilter @cleared="clearFilter" />
    </div>
    </div>
</template>
<script>
import ClearFilter from "@/components/common/ClearFilter";
import { Badge } from "@/components/argon-core";
import {
  Select,
  Option,
  Form,
  FormItem,
} from "element-ui";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
    props:{
        showFilter: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        Badge,
        Select,
        Option,
        Form,
        FormItem,
        ClearFilter,
        filterIsActive:false
    },
    computed:{
        ...mapGetters({
            suppliers:'suppliers/list'
        })
    },
    mounted(){
        if(this.suppliers.length == 0)
        {
            this.$store.dispatch('suppliers/getList');
        }
    },
    data(){
        return {
            transactionType:null,
            transactionTypes:[
                {id:0,name_translation_key:'CREDIT'},
                {id:1,name_translation_key:'DEBIT'}
            ],
            selectedTransactionDirection:null,
            transactionDirections:[
                {id:0,name_translation_key:'external_transactions'},
                {id:1,name_translation_key:'internal_transactions'}
            ],
            selectedSupplier:null
        }
    },
    methods:{
        clearTransactionType(){
            this.transactionType = null;
            if(this.filterIsActive){
                this.applyFilter();
            }
        },
        clearTransactionDirection(){
            this.selectedTransactionDirection = null;
            if(this.filterIsActive){
                this.applyFilter();
            }
        },
        clearSupplier(){
            this.selectedSupplier = null;
            if(this.filterIsActive){
                this.applyFilter();
            }
        },
        clearFilter(){
            this.selectedSupplier = null;
            this.selectedTransactionDirection = null;
            this.transactionType = null;
            this.filterIsActive = false;
            this.$emit("filter", "");
        },
        quiryBuilder(){
            let query = '';
            if(this.transactionType){
                query += '&transaction_type='+this.transactionType;
            }
            if(this.selectedTransactionDirection){
                if(this.selectedTransactionDirection =='external_transactions'){
                    query += '&external_transactions=1';
                }
                if(this.selectedTransactionDirection =='internal_transactions'){
                    query += '&internal_transactions=1';
                }
            }
            if(this.selectedSupplier){
                query += "&supplier_id="+this.selectedSupplier;
            }
            if (query == "") {
                this.filterIsActive = false;
            } else this.filterIsActive = true;
            return query;
        },
        applyFilter: function () {
            const query = this.quiryBuilder();

            this.$emit("filter", query);
            },
        displaySupplier(){
            let sup = this.suppliers.find(s=>s.id == this.selectedSupplier);
            if(sup)
            {
                return sup.name;
            }
            else
            {

                return '';
            }
        }
    }
}
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