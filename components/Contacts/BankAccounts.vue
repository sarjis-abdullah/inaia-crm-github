<template>
    <div class="row">
        <div class="col">
            
            <button type="button" class="btn base-button btn-icon btn-fab btn-primary btn-sm float-right mb-3" @click="showAddBank=true" v-if="haveEditRight">
                    <span class="btn-inner--icon"><i class="fas fa-plus"></i></span><span class="btn-inner--text">{{$t('add_bank_account')}}</span>
                </button>
            
                <el-table class="table-hover table-responsive table-flush"
                                header-row-class-name="thead-light"
                                :data="paymentAccounts"
                                :loading="isLoading">

                             <el-table-column label="#"
                                   
                                    prop="id"
                                    >
                                <template v-slot="{row}">
                                    <div class="media align-items-center">
                                        <div class="media-body">

                                            <div class="font-weight-300 name" >{{row.id}}</div>

                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column v-bind:label="$t('bank_name')"
                                    >
                                    <template v-slot="{row}">
                                        <span>{{getBankName(row.payment_account_specs)}}</span>
                                    </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('iban')"
                                    >
                                    <template v-slot="{row}">
                                        <span>{{getIban(row.payment_account_specs)}}</span>
                                    </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('bic')"
                                    >
                                    <template v-slot="{row}">
                                        <span>{{getBic(row.payment_account_specs)}}</span>
                                    </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('account_holder')"
                                    >
                                    <template v-slot="{row}">
                                        <span>{{getAccountHolder(row.payment_account_specs)}}</span>
                                    </template>
                    </el-table-column>
                    <el-table-column v-bind:label="$t('valide')"
                                    >
                                    <template v-slot="{row}">
                                        <span>{{getValidated(row.payment_account_specs)?$t('validated'):$t('not_validated')}}</span>
                                    </template>
                    </el-table-column>
                    <el-table-column>
                                <template v-slot="{row}">

                                  <icon-button type="delete" @click="()=>deleteBankAccount(row)" v-if="row.is_default == '0' && haveEditRight"></icon-button>
                                  <span v-else>{{$t('default')}}</span>


                                </template>
                            </el-table-column>
                </el-table>               
            
        </div>
        <modal
    :show.sync="showAddBank"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    :allowOutSideClose="false"
    @close="showAddBank=false"
  >
  <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("add_bank_account") }}</h5>
      <span></span>
    </template>
    <div>
        <base-input
              :label="$t('account_holder')"
              name="account_holder"
              v-model="newAccountHolder"
              :placeholder="$t('account_holder')"
            />
            <base-input
              :label="$t('iban')"
              name="iban"
              v-model="newIban"
              :placeholder="$t('iban')"
            />
    </div>
    <template slot="footer">
        <base-button type="primary" @click="() => saveNewBankAccount()"
                            
                            :disabled="isSubmitting || notValid">
                          {{$t('save')}}
                        </base-button>
    </template>
  </modal>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Table, TableColumn } from 'element-ui';
import IconButton from '@/components/common/Buttons/IconButton';
import { MessageBox } from "element-ui";
import {canEditCustomers} from '@/permissions'
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
export default {
    props:{
        account_id:{
            type:Number,
            default: -1
        }
    },
    components: {
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        IconButton
    },
    computed: {
        ...mapGetters({
            paymentAccounts: "payment-accounts/paymentAccounts"
        }),
        haveEditRight(){
            return canEditCustomers();
        }
    },
    mounted(){
        this.isLoading = true;
        this.$confirm = MessageBox.confirm
        this.$store.dispatch('payment-accounts/getPaymentAccountByUser',this.account_id).finally(()=>{
            this.isLoading = false;
        })
    },
    watch:{
        newIban:{
            handler(){
                if(this.newIban && this.newAccountHolder){
                    this.notValid = false;
                }
                else{
                    this.notValid = true;
                }
            },
            immediate:true
        },
        newAccountHolder:{
            handler(){
                if(this.newIban && this.newAccountHolder){
                    this.notValid = false;
                }
                else{
                    this.notValid = true;
                }
            },
            immediate:true
        }
    },
    data() {
        return {
            showAddBank:false,
            isLoading: false,
            newAccountHolder:null,
            newIban:null,
            isSubmitting:false,
            notValid: true
        }
    },
    methods:{
        getBankName(specs){
            let bank_name = ""
            specs.forEach(element => {
                if(element.name == "bank_name"){
                    bank_name =  element.value
                }
            });
            return bank_name;
        },
        getIban(specs){
            let iban = ""
            specs.forEach(element => {
                if(element.name == "iban"){
                    iban =  element.value
                }
            });
            return iban;
        },
        getBic(specs){
            let bic = ""
            specs.forEach(element => {
                if(element.name == "bic"){
                    bic =  element.value
                }
            });
            return bic;
        },
        getAccountHolder(specs){
            let accountHolder = ""
            specs.forEach(element => {
                if(element.name == "account_holder"){
                    accountHolder =  element.value
                }
            });
            return accountHolder;
        },
        getValidated(specs){
            let isValidated = false;
            specs.forEach(element => {
                if(element.name == "is_validated"){
                    isValidated =  element.value == '1';
                }
            });
            return isValidated;
        },
        deleteBankAccount(row){
            this.$confirm(this.$t('do_you_want_to_delete_bank_account'), 'Warning', {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
         this.$store.dispatch('payment-accounts/deletebankaccount',row.id).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("entry_deleted_successfully"),
          });
         }).catch((err)=>{
            apiErrorHandler(err,this.$notify)
            
         });
        }).catch((err) => {
            apiErrorHandler(err,this.$notify)
        });
        },
        saveNewBankAccount(){
            const data = {
                "payment_method": "bank_account",
                "account_id": this.account_id,
                "is_default": false,
                "iban": this.newIban,
                "account_holder": this.newAccountHolder,
                "confirmation_checked": true
            }
            this.$store.dispatch('payment-accounts/addbankaccount',data).then(()=>{
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("entry_added_successfully"),
          });
          this.newIban = null;
          this.newAccountHolder = null;
          this.showAddBank = false;
         }).catch((err)=>{
            apiErrorHandler(err,this.$notify)
         });

        }

    }
}
</script>

