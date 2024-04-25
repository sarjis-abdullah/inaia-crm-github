<template>
  <div class="vld-parent">
    <loading
        loader="dots"
        :active.sync="isRequesting"
        :is-full-page="fullPage"
    />
    <!-- Header -->
    <div class="header bg-gradient-info py-7 py-lg-8 mb-0">

        <!--
        <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-secondary" points="2560 0 2560 100 0 100"></polygon>
        </svg>
        </div>
        -->

    </div>

    <!-- Page content -->
      <div class="container mt--100  mb-2">

      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="card border-0">

            <div class="card-body px-lg-5">

              <div class="display-4 my-4">Edit Profile</div>

              <validation-observer ref="observer" v-slot="{ invalid, handleSubmit }">
                <form class="needs-validation" @submit.prevent="handleSubmit(validate)">

                  <div v-if="failed" class="text-center text-danger">{{ failed }}</div>

                  <!-- <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="fas fa-user"
                    mode="lazy"
                    placeholder="username"
                    id="Username"
                    name="Username"
                    rules="required"
                    v-model="customer.account.account_number"
                  />

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="example@email.com"
                    type="email"
                    name="Email"
                    rules="required|email"
                    v-model="customer.channels.email.value"
                  /> -->
                  <div class="row">
                            <div class="col-md-6">
                                <base-input label="Nationality" name="Nationality" placeholder="Select nationality" ref="nationalityProvider" rules="required">
                                    <template #default="slotProps">  
                                        <select class="form-control" :class="[{'is-invalid': slotProps.invalid && slotProps.validated}]" v-model="customer.person_data.nationality.id">
                                            <option v-for="(i, idx) in nationalityOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                        </select>
                                    </template>  
                                </base-input>
                            </div>
                            <div class="col-md-6" v-if="selectedContactType == 'person'">
                               
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="First Name"
                                    name="First Name"
                                    v-model="customer.name"
                                    placeholder="First Name"
                                    rules="required"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                    label="Last Name"
                                    name="Last Name"
                                    v-model="customer.person_data.surname"
                                    placeholder="Last Name"
                                    :rules="{required: selectedContactType == 'person'}"
                                />
                            </div>
                        </div>
                        <div class="row" v-if="selectedContactType == 'person'">
                            <div class="col-md-6">
                                <base-input
                                    label="Birth Date"
                                    name="Birth Date"
                                    v-model="customer.person_data.birthdate"
                                    placeholder="Birth Date"
                                    type="date"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input label="Gender" name="Gender" placeholder="Select gender" rules="required">
                                    <select class="form-control" v-model="customer.person_data.gender">
                                        <option v-for="(i, idx) in genderOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                    </select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Email Address"
                                    name="Email Address"
                                    v-model="customer.channels.email.value"
                                    placeholder="email@address.com"
                                    rules="required|email"
                                    ref="emailProvider"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                    label="Mobile No"
                                    name="Mobile No"
                                    v-model="customer.channels.mobile.value"
                                    placeholder="0049 1010101010"
                                    rules="required"
                                    ref="telProvider"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Address Line1"
                                    name="Address Line1"
                                    v-model="customer.address.line1"
                                    placeholder="Address Line1"
                                    rules="required"
                                    ref="addLine1Provider"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                    label="Address Line2"
                                    v-model="customer.address.line2"
                                    placeholder="Address Line2"
                                    ref="addLine2Provider"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Postal Code"
                                    name="Postal Code"
                                    v-model="customer.address.postal_code"
                                    placeholder="postal code"
                                    ref="postalProvider"
                                    rules="required"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                    label="City"
                                    name="City"
                                    v-model="customer.address.city"
                                    placeholder="City"
                                    ref="cityProvider"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Region or State"
                                    v-model="customer.address.region"
                                    placeholder="Region"
                                    ref="regionProvider"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input label="Country" name="Country" placeholder="Select country" ref="countryProvider" rules="required">
                                    <template #default="slotProps">
                                        <select class="form-control" :class="[{'is-invalid': slotProps.invalid && slotProps.validated}]" v-model="customer.address.country_id">
                                            <option v-for="(i, idx) in countryOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                        </select>
                                    </template>
                                </base-input>
                            </div>
                        </div>


                  <div class="text-center">
                    <button type="submit" class="btn btn-primary mt-4" :disabled="isRequesting">Save</button>
                    <button class="btn btn-default mt-4" @click.prevent="() => $router.push('/profile')">Cancel</button>
                  </div>
                </form>
              </validation-observer>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
const defaultAddress = {
    type_id: 0,
    is_primary: 1,
    is_active: 1,
    line1: '',
    line2: '',
    country_id: null
}
export default {
    components: {
        Loading
    },
    data() {
        return {
            customer: {
                type_id: 0,
                is_active: 1,
                account: {
                    type_id: 0,
                    is_active: 0,
                },
                person_data: {
                    nationality: {
                        id: null
                    }
                },
                address: defaultAddress,
                channels: {
                    email: {},
                    mobile: {}
                }
            },


            countryOptions: [],
            nationalityOptions: [],
            genderOptions: [
                { text: 'Select Gender', value: '' },
                { text: 'Male', value: 'Male' },
                { text: 'Female', value: 'Female' }
            ],
            contactTypes: [
                { text: 'Person', value: 'person' },
                { text: 'Company', value: 'company' }
            ],
            selectedContactType: 'person',


            failed: '',
            isRequesting: false,
            fullPage: true
        }
    },
    computed: {
        ...mapGetters({
            auth: "auth/auth",
            account: "auth/user",
            client: "clients/singleClientData",
            countryList: "clients/countryList",
            countryListLoaded: "clients/countryListLoaded",
            types: "types/pairs",
            typesLoaded: "types/loading"
        }),
        singleClientData(){
            return this.client(this.account.id);
        },
        updatedClientData() {
            const obj = {
                id: this.customer.id,
                customer: {
                    contact: {
                        id: this.customer.id,
                        name: this.customer.name,
                        type_id: this.customer.type_id,
                        is_active: this.customer.is_active,
                        // avatar: this.customer.avatar
                    },
                    person_data: {
                        ...this.customer.person_data,
                        contact_id: this.customer.id
                    },
                    address: {
                        ...this.customer.address,
                        contact_id: this.customer.id
                    },
                    account: {
                        ...this.customer.account,
                    },
                    channels: this.customer.channels
                }
            }
            if(!this.customer.address.type_id){
                delete obj.customer.address.type_id
            }
            return obj
        }
    },
    watch: {
        singleClientData: {
            handler(value) {
                if (this.singleClientData) {
                    Object.keys(value).forEach(key => {
                        if (this[key] !== undefined) {
                            this.$set(this, key, JSON.parse(JSON.stringify(value[key])))
                        }
                    })
                    // initialize customer object with compound-data
                    if (!this.customer.account) {
                        this.customer.account = {
                            is_active: 0
                        }
                    }
                    if (!this.customer.address) {
                        this.customer.address = {
                            ...defaultAddress,
                            is_primary: 1,
                            is_active: 1
                        }
                    }
                    if (this.customer.type_id && this.types) {
                        this.selectedContactType    = Object.keys(this.types).find( k => this.types[k] == this.customer.type_id )
                    }
                    this.customer.channels  = this.filterChannels(this.customer.channels)
                    if (!this.customer.person_data) {
                        this.customer.person_data = {
                            nationality: {
                                id: null
                            }
                        }
                    } else if (!this.customer.person_data.nationality) {
                        this.customer.person_data.nationality = {
                            id: null
                        }
                    }
                }
            },
            immediate: true
        },
        countryList: {
            handler(value) {
                if (this.countryList) {
                    this.constructCountryOptions(value)
                }
            }
        }
    },
    mounted() {
        if (!this.auth || !this.account) {
            this.$router.push('/logout')
        }
        else{
            console.log(this.account);
            const accountData = JSON.parse(JSON.stringify(this.account));
            //this.customer = this.account;
            this.customer.id = accountData.id;
            this.customer.type_id = accountData.account.type_id;
            this.customer.account = accountData.account;
            this.customer.person_data = accountData.person_data;
            if(!accountData.person_data.nationality){
                this.customer.person_data.nationality = {
                    id: null
                }
            }
            this.customer.name = accountData.name;
            if (accountData.address) {
                this.customer.address = {...defaultAddress, ...accountData.address};
            }
            accountData.channels.forEach(channel=>{
                if(channel && channel.type){
                    if(channel.type.name_translation_key == 'email_channel_type'){
                        this.customer.channels.email = channel;
                    }
                    if(channel.type.name_translation_key == 'mobile_channel_type'){
                        this.customer.channels.mobile = channel;
                    }
                }
            });
        }
        this.initTypes();
        if (!this.countryListLoaded || this.countryList.length < 200) {
            this.initCountryList();
        } else {
            this.constructCountryOptions(this.countryList);
        }
    },
    methods: {
        initTypes() {
            if (this.typesLoaded < 1) {
                this.$store.dispatch("types/fetchTypes");
            }
        },
        initCountryList() {
            this.$store.dispatch("clients/initCountryList");
        },
        constructCountryOptions(countries) {
            const countryList     = [];
            const nationalityList = [];
            countries.forEach(item => {
                countryList[countryList.length] = {
                    text: item.name_translation_key,
                    value: item.id
                };
                nationalityList[nationalityList.length] = {
                    text: item.nationality_translation_key,
                    value: item.id
                };
            });

            this.countryOptions     = countryList;
            this.nationalityOptions = nationalityList;
        },
        async validate() {
            this.isRequesting   = true
            const isValid       = await this.$refs.observer.validate()
            if (isValid) {
                this.submitClient(this.updatedClientData)
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submitClient(data) {
            this.isRequesting   = true

            this.$store
            .dispatch("clients/submitClient", data)
            .then(response => {
                // location.href   = document.referrer
                this.$notify({type: 'success', timeout: 5000, message: 'Profile information saved successfully!'})
                this.$store.dispatch('auth/fetchLoggedIn')
                .then(res => {
                    // this.isRequesting   = false
                    this.$router.push('/profile')
                })
            }).catch( err => {
                this.failed = err.response.data.message
                this.$refs.observer.setErrors(err.response.data.errors)
                this.isRequesting   = false
            }).finally(() => {
            })
        },
        filterChannels(obj) {
            if (obj && Array.isArray(obj) && obj.length) {
                let channels  = {}
                obj.forEach(channel => {
                    channels[channel.type.value]  = channel
                })
                return {
                    email:{},
                    mobile: {},
                    ...channels
                }
            }
            return {
                email:{},
                mobile: {}
            }
        }
    }
}
</script>

<style>
  .profile-header {
      /*
      background-image: url(/img/theme/profile-cover.jpg);
      background-size: cover;
      background-position: center top;
       */
      min-height: 580px;
  }
</style>
