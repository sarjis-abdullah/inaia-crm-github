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
        <h5 class="modal-title" v-if="depot && depot.sales_advisor_id">{{ $t("sales_advisor") }}</h5>
        <h5 class="modal-title" v-else>{{ $t("edit_salesadvisor") }}</h5>
        <span></span>
      </template>
      <div>
            <div class="row m-auto pt-3 pb-5 d-flex justify-content-center">
                <Select
            :placeholder="$t('select_sales_advisor')"
            v-model="sales_advisor_id"
            :disabled="(depot && depot.sales_advisor_id) ? true : false"
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
          <div class="row" v-if="!(depot && depot.sales_advisor_id)">
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
                @click="assignSalesAdvivor"
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
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
  export default {
    props: {
      showModal: {
        type: Boolean,
        default: false,
      },
      depot: {
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
        depot:{
            handler(){
                if(this.depot ){
                    if (this.depot.sales_advisor_id == 0) {
                      this.sales_advisor_id = null
                      return
                    }
                    this.sales_advisor_id = this.depot.sales_advisor_id
                }
            },
            immediate:true
        }
    },
    methods: {
      
        assignSalesAdvivor() {
        this.isRequesting = true;
        let data ={
            id:this.depot.id,
            "sales_advisor_id": this.sales_advisor_id,
        }
        this.$store.dispatch('depots/submit',data)
          .then((response) => {
              
              this.cancelEdit();
            this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t('salesadvisor_updated_successfully'),
            });
          })
          .catch((err) => {
            apiErrorHandler(err,this.$notify);
          })
          .finally(() => {
            this.isRequesting = false;
          });
      },
      cancelEdit(){
          this.$emit('cancelEditAdvisor');
          this.sales_advisor_id = null
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
  