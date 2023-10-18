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
      <h5 class="modal-title">{{ $t("edit_address") }}</h5>
      <span></span>
    </template>
    <div>
      <validation-observer
        ref="observer"
        v-slot="{ invalid }"
        tag="form"
        @submit.prevent="validate"
      >
        <div class="row text-danger" v-if="failed && invalid">
          <div class="col-sm-2"></div>
          <div class="col-md-6">
            {{ failed }}
          </div>
        </div>
        <div class="row">
          <div class="col-md-5">
            <base-input
              :label="$t('address_line1')"
              name="Address Line1"
              v-model="line1"
              :placeholder="$t('address_line1')"
              rules="required"
              ref="addLine1Provider"
            />
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-5">
            <base-input
              :label="$t('address_line2')"
              v-model="line2"
              :placeholder="$t('address_line2')"
              ref="addLine2Provider"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-5">
            <base-input
              :label="$t('postal_code')"
              name="Postal Code"
              v-model="postal_code"
              :placeholder="$t('postal_code')"
              ref="postalProvider"
              rules="required"
            />
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-5">
            <base-input
              :label="$t('city')"
              name="City"
              v-model="city"
              :placeholder="$t('city')"
              ref="cityProvider"
              rules="required"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-5">
            <base-input
              :label="$t('region')"
              v-model="region"
              :placeholder="$t('region')"
              ref="regionProvider"
            />
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-5" v-if="customer.address.country">
            <base-input :label="$t('country')" name="Country" :placeholder="$t('country')" ref="countryProvider" rules="required">
                                    <template #default="slotProps">
                                        <select class="form-control" :class="[{'is-invalid': slotProps.invalid && slotProps.validated}]" v-model="country">
                                            <option v-for="(i, idx) in countryOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                        </select>
                                    </template>
                                </base-input>
          </div>
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
              :disabled="isRequesting"
              >{{$t('save')}}</base-button
            >
          </div>
        </div>
      </validation-observer>
    </div>
  </modal>
</template>
<script>
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { updateAddressAndGetObject } from '../../helpers/customer';
import { mapGetters } from "vuex"
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
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  computed: {
  ...mapGetters({
            countryList: "clients/countryList",
            countryListLoaded: "clients/countryListLoaded",
        }),
      },
  data() {
    return {
        isRequesting:false,
        failed:'',
        line1:'',
        line2:'',
        postal_code:'',
        city:'',
        region:'',
        country:-1,
        countryOptions: [],
    }
  },
  watch: {
        countryList: {
            handler(value) {
                if (this.countryList) {
                    this.constructCountryOptions(value)
                }
            }
        }
    },
  mounted(){
      if(this.customer && this.customer.address)
      {
          this.line1 = this.customer.address.line1;
          this.line2 = this.customer.address.line2;
          this.city = this.customer.address.city;
          this.region = this.customer.address.region;
          this.postal_code = this.customer.address.postal_code;
          this.country = this.customer.address ? this.customer.address.country_id:-1
      }
      if (this.countryList.length < 200) {
            this.initCountryList();
        } else {
            this.constructCountryOptions(this.countryList);
        }
  },
  methods: {
    async validate() {
      const isValid = await this.$refs.observer.validate();
      if (isValid && !this.isRequesting) {
        this.submitClient();
      } else {
        console.log("invalid request");
        this.isRequesting = false;
      }
    },
    constructCountryOptions(countries) {
            const countryList     = [];
            
            countries.forEach(item => {
                countryList[countryList.length] = {
                    text: item.name_translation_key,
                    value: item.id
                };
                
            });

            this.countryOptions     = countryList;
            debugger;
        },
        initCountryList() {
            this.$store.dispatch("clients/initCountryList");
        },
    submitClient() {
      this.isRequesting = true;
      let data = updateAddressAndGetObject(this.customer,{line1:this.line1,line2:this.line2,postal_code:this.postal_code,city:this.city,region:this.region})
      if (data.customer.account && !data.customer.account.password) {
        // if empty then keep the account table intact
        delete data.customer["account"];
        // if empty then keep the old passowrd
        // delete data.customer.account['password']
      }

      this.$store
        .dispatch("clients/submitClient", data)
        .then((response) => {
            this.$store.commit('clients/updateAddress',data.customer.address)
            this.cancelEdit();
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t('address_updated_successfully'),
          });
        })
        .catch((err) => {
          this.failed = err.response.data.message;
          this.$refs.observer.setErrors(err.response.data.errors);
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t('address_updated_unsuccessfully'),
          });
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },
    cancelEdit(){
        this.showModal = false;
        this.$emit('cancelEdit');
    }
  },
};
</script>
<style scoped>
</style>
