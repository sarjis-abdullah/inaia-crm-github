<template>
    <modal
      :show.sync="showModal"
      headerClasses=""
      bodyClasses="pt-0"
      footerClasses="border-top bg-secondary"
      :allowOutSideClose="false"
      @close="cancelEdit"
    >
      <template slot="header" class="pb-0">
        <h5 class="modal-title">{{ $t("edit_salesadvisor") }}</h5>
        <span></span>
      </template>
      <div>
            <div class="row m-auto pt-3 pb-5 d-flex justify-content-center">
                <Select
            :placeholder="$t('sales_advisor')"
            v-model="sales_advisor_id"
          >
            <Option
              v-for="option in advisors"
              :value="option.id"
              :label="formatClientLabel(option)"
              :key="option.id"
            >
            </Option>
          </Select>
            </div>
          <div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-6">
              <base-button
                type="secondary"
                native-type="button"
                @click="() => cancelEdit()"
                >{{$t('cancel')}}</base-button
              >
              <base-button
                type="primary"
                native-type="submit"
                :disabled="isRequesting || sales_advisor_id==null"
                @click="submitClient"
                >{{$t('save')}}</base-button
              >
            </div>
          </div>
       
      </div>
    </modal>
  </template>
  <script>
  import { updateSalesAdvisorAndGetObject } from '../../helpers/customer';
  import { Select,Option } from 'element-ui';
  import { mapGetters } from "vuex";
  export default {
    props: {
      showModal: {
        type: Boolean,
        default: false,
      },
      customer: {
        type: Object,
        default: {},
      },
    },
    components:{
        Select,
        Option
    },
    computed: {
        ...mapGetters("salesCommission", {
            advisors: "salesAdvisors",
        }),
    },
    data() {
      return {
          sales_advisor_id:null,
          isRequesting:false
      };
    },
    watch:{
        showModal:{
            handler(){
                if(this.showModal && this.advisors.length ==0){
                    this.$store
                    .dispatch("salesCommission/fetchSalesAdvisors")
                }
            }
        },
        customer:{
            handler(){
                if(this.customer && this.customer.account ){
                    this.sales_advisor_id = this.customer.account.sales_advisor_id
                }
            },
            immediate:true
        }
    },
    methods: {
      
      submitClient() {
        this.isRequesting = true;
        let data ={
            id:this.customer.account.id,
            data:{
                "id": this.customer.account.id,
                "contact_id": this.customer.account.contact_id,
                "account_number": this.customer.account.account_number,
                "email": this.customer.account.email,
                "username": this.customer.account.username,
                "is_active": this.customer.account.is_active,
                "sales_advisor_id": this.sales_advisor_id,
            }
        }
        this.$store
          .dispatch("clients/updateAccountInformation", data)
          .then((response) => {
              
              this.cancelEdit();
            this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t('salesadvisor_updated_successfully'),
            });
          })
          .catch((err) => {
            this.$notify({
              type: "danger",
              timeout: 5000,
              message: this.$t('salesadvisor_updated_unsuccessfully'),
            });
          })
          .finally(() => {
            this.isRequesting = false;
          });
      },
      cancelEdit(){
          this.showModal = false;
          this.$emit('cancelEditAdvisor');
      },
      formatClientLabel: function (client) {
            if (client) {
                let email = null;
                if (client.contact.channels) {
                    client.contact.channels.forEach((element) => {
                        if (element.type == "email") {
                            email = element.value;
                        }
                    });
                }
                let label =
                    client.contact.name + " " + client.contact.person_data.surname;
                if (email) {
                    label += ` (${email})`;
                }
                return label;
            }
        },
    },
  };
  </script>
  <style scoped>
  </style>
  