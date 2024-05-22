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
      <h5 class="modal-title">{{ $t("edit_mobile") }}</h5>
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
              :label="$t('country_code')"
              name="CountryCode"
              ref="countryCodeProvider"
              rules="required"
              #default="{ invalid, validated }"
            >
              <Select
                v-model="selectedCountryCode"
                :placeholder="$t('select_country_code')"
                :class="{
                  'el-select-invalidate-height': invalid && validated,
                  'form-control': invalid && validated,
                  'is-invalid': invalid && validated,
                }"
              >
                <Option
                  v-for="item in countryCodeOption"
                  :key="item.id"
                  :value="item.value"
                  :label="item.text"
                />
              </Select>
            </base-input>
          </div>
          <div class="col-md-1"></div>
          <div class="col-md-5">
            <base-input
              :label="$t('phone_number')"
              name="Phone number"
              v-model="phoneNumber"
              :placeholder="$t('phone_number')"
              rules="required"
              ref="phoneProvider"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <base-button
              type="secondary"
              native-type="button"
              @click="() => cancelEdit()"
              >{{ $t("cancel") }}</base-button
            >
            <base-button
              type="primary"
              native-type="submit"
              :disabled="isRequesting"
              >{{ $t("save") }}</base-button
            >
          </div>
        </div>
      </validation-observer>
    </div>
  </modal>
</template>
<script>
import { Select, Option } from "element-ui";
import { mapGetters } from "vuex";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { functionUpdateChannelAndGetObject } from "../../helpers/customer";
import {  extractCountryCode } from "../../helpers/helpers";
export default {
  setup() {},
  props: {
    customer: {
      type: Object,
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    phone:{
        type:String,
        default:""
    }
  },
  components: {
    ValidationObserver,
    ValidationProvider,
    Option,
    Select,
  },
  mounted() {
    if (this.countryCodeOption.length < 200) {
      this.initCountryList();
    }
    else
        ({phoneNumber:this.phoneNumber,countryCode:this.selectedCountryCode}=extractCountryCode(this.phone,this.countryCodeOption));
  },
  computed: {
    ...mapGetters({
      countryCodeOption: "clients/countryCodeList",
    }),
  },
  data() {
    return {
      selectedCountryCode: -1,
      isRequesting: false,
      failed: "",
      phoneNumber: "",
    };
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
    submitClient() {
      this.isRequesting = true;
      let data = functionUpdateChannelAndGetObject(this.customer,'mobile',this.selectedCountryCode+this.phoneNumber);
      if (data.customer.account && !data.customer.account.password) {
        // if empty then keep the account table intact
        delete data.customer["account"];
        // if empty then keep the old passowrd
        // delete data.customer.account['password']
      }

      this.$store
        .dispatch("clients/submitClient", data)
        .then((response) => {
          this.$store.commit("clients/updateChannels", data.customer.channels);
          this.$emit('updated');
          this.cancelEdit();
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("entry_updated_successfully"),
          });
        })
        .catch((err) => {
          this.failed = err.response.data.message;
          this.$refs.observer.setErrors(err.response.data.errors);
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("entry_updated_failed"),
          });
        })
        .finally(() => {
          this.isRequesting = false;
        });
    },
    cancelEdit() {
      this.showModal = false;
      this.$emit("cancelEdit");
    },
    initCountryList() {
      this.$store.dispatch("clients/initCountryList").then(()=>{
({phoneNumber:this.phoneNumber,countryCode:this.selectedCountryCode}=extractCountryCode(this.phone,this.countryCodeOption));
      });
    }
  },
};
</script>
<style scoped>
.el-select-invalidate-height {
  padding: 0 !important;
  height: 3.18em !important;
}
</style>