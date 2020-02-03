<template>
    <vs-row>
        <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <vs-card>
                <div slot="header">
                    <h3 class="card-title mb-0">Contact Form</h3>
                </div>

                <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="validate">
                    <h4 class>Personal Info</h4>
                    <hr class="custom-hr" />
                    <div v-if="failed && invalid" style="color: red">{{ failed }}</div>
                    <vs-row>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <ValidationProvider ref="firstNameProvider" vid="customer.name" name="First Name" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="First Name"
                                    placeholder="First Name"
                                    v-model="customer.name"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert First Name"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="lastNameProvider" vid="customer.person_data.surname" name="Last Name" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Last Name"
                                    placeholder="Last Name"
                                    v-model="customer.person_data.surname"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert Last Name"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="birthdateProvider" vid="customer.person_data.birthdate" name="Birth Date" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Date of Birth"
                                    type="date"
                                    v-model="customer.person_data.birthdate"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert your birth date"
                                />
                            </ValidationProvider>
                            <vs-select class="w-100 mt-4" label="Gender" v-model="customer.person_data.gender">
                            <vs-select-item
                                :key="index"
                                :value="item.value"
                                :text="item.text"
                                v-for="(item,index) in genderOptions"
                            />
                            </vs-select>
                        </vs-col>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <ValidationProvider ref="nationalityProvider"  vid="customer.person_data.nationality.id" name="Nationality" rules="required" v-slot="{ errors }">
                                <vs-select
                                    class="w-100 mt-4"
                                    label="Nationality"
                                    placeholder="Select nationality"
                                    v-model="customer.person_data.nationality.id"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please select your nationality"
                                >
                                <vs-select-item
                                    :key="index"
                                    :value="item.value"
                                    :text="item.text"
                                    v-for="(item,index) in nationalityOptions"
                                />
                                </vs-select>
                            </ValidationProvider>
                            <ValidationProvider ref="emailProvider" vid="customer.channels.email.value" name="Email" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Email"
                                    placeholder="example@email.com"
                                    v-model="customer.channels.email.value"
                                    class="w-100 mt-4"
                                    type="email"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert valid email address"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="telProvider" vid="customer.channels.mobile.value" name="Mobile Number" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Mobile number"
                                    placeholder="0123456789"
                                    v-model="customer.channels.mobile.value"
                                    class="w-100 mt-4"
                                    type="tel"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert valid Mobile Number"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="passwordProvider" vid="customer.account.password" name="Password" v-slot="{ errors }">
                                <vs-input
                                    label="Password"
                                    placeholder="*******"
                                    v-model="customer.account.password"
                                    class="w-100 mt-4"
                                    type="password"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert password"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                        </vs-col>
                    </vs-row>
                    <h4 class="mt-5 mb-4">Address</h4>
                    <hr class="custom-hr" />
                    <vs-row>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <ValidationProvider ref="addLine1Provider" vid="customer.address.line1" name="Address Line 1" v-slot="{ errors }">
                                <vs-input
                                    label="Address Line 1"
                                    placeholder="address line 1"
                                    v-model="customer.address.line1"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please enter Line 1 of your address"
                                />
                            </ValidationProvider>
                            <vs-input label="Address Line 2" placeholder="address line 2" v-model="customer.address.line2" class="w-100 mt-4" />
                            <ValidationProvider ref="postalCodeProvider" vid="customer.address.postal_code" name="Postal Code" v-slot="{ errors }">
                                <vs-input
                                    label="Postal Code"
                                    placeholder="postal code"
                                    v-model="customer.address.postal_code"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please enter postal code of your address"
                                />
                            </ValidationProvider>
                        </vs-col>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <ValidationProvider ref="cityProvider" vid="customer.address.city" name="City" v-slot="{ errors }">
                                <vs-input
                                    label="City"
                                    placeholder="city name"
                                    v-model="customer.address.city"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please enter city of your address"
                                />
                            </ValidationProvider>
                            <vs-input label="Region or State" placeholder="region or state" v-model="customer.address.region" class="w-100 mt-4" />
                            <ValidationProvider ref="cityProvider" vid="customer.address.country_id" name="City" v-slot="{ errors }">
                                <vs-select
                                    class="w-100 mt-4"
                                    label="Country"
                                    placeholder="Select country"
                                    v-model="customer.address.country_id"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please select your country"
                                >
                                <vs-select-item
                                    :key="i"
                                    :value="c.value"
                                    :text="c.text"
                                    v-for="(c,i) in countryOptions"
                                />
                                </vs-select>
                            </ValidationProvider>
                        </vs-col>
                    </vs-row>
                    <div class="btn-alignment mt-4">
                        <vs-button button="submit" color="success" type="filled" :disabled="isRequesting">Save</vs-button>
                        <vs-button color="dark" type="filled" @click="() => $router.push('/customers')">Cancel</vs-button>
                    </div>
                </ValidationObserver>
            </vs-card>
        </vs-col>
    </vs-row>
</template>

<script>
import { mapGetters } from "vuex"
import { ValidationObserver, ValidationProvider } from "vee-validate"

export default {
    components: {
        ValidationObserver,
        ValidationProvider
    },
    props: {
        singleClientData: {
            type: Object,
            default() {}
        }
    },
    data: () => ({
        customer: {
            type_id: 0,
            is_active: 1,
            account: {
                type_id: 0,
                is_active: 0,
            },
            person_data: {
                nationality: {}
            },
            address: {
                type_id: 0,
                is_primary: 1,
                is_active: 1,
            },
            channels: {
                email: {},
                mobile: {}
            }
        },
        // customerXname: '',
        // customerXtype_id: 18,
        // customerXis_active: 1,
        // customerXperson_dataXsurname: '',
        // customerXperson_dataXbirthdate: '',
        // customerXperson_dataXgender: '',
        // customerXperson_dataXnationalityXid: '',
        // customerXchannelsXemailXid: '',
        // customerXchannelsXemailXvalue: '',
        // customerXchannelsXmobileXid: '',
        // customerXchannelsXmobileXvalue: '',
        // customerXaccountXpassword: '',
        // customerXaccountXtype_id: 3,
        // customerXaccountXis_active: 0,
        // customerXaddressXline1: '',
        // customerXaddressXline2: '',
        // customerXaddressXpostal_code: '',
        // customerXaddressXcity: '',
        // customerXaddressXregion: '',
        // customerXaddressXcountry_id: '',
        // customerXaddressXtype_id: 7,
        // customerXaddressXis_primary: 1,
        // customerXaddressXis_active: 1,
        countryOptions: [],
        nationalityOptions: [],
        genderOptions: [
            { text: 'Select Gender', value: '' },
            { text: 'Male', value: 'Male' },
            { text: 'Female', value: 'Female' }
        ],
        failed: '',
        isRequesting: false
    }),
    computed: {
        ...mapGetters({
            countryList: "clients/countryList",
            countryListLoaded: "clients/countryListLoaded",
            types: "types/types"
        }),
        savedClientData() {
            return {
                customer: {
                    contact: {
                        name: this.customer.name,
                        type_id: this.customer.type_id,
                        is_active: this.customer.is_active
                    },
                    person_data: {
                        ...this.customer.person_data
                    },
                    address: {
                        ...this.customer.address
                    },
                    account: {
                        ...this.customer.account
                    },
                    channels: this.customer.channels
                }
            }
        },
        updatedClientData() {
            return {
                id: this.customer.id,
                customer: {
                    contact: {
                        id: this.customer.id,
                        name: this.customer.name,
                        type_id: this.customer.type_id,
                        is_active: this.customer.is_active
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
                        contact_id: this.customer.id
                    },
                    channels: this.customer.channels
                }
            }
        }
    },
    mounted() {
        if (!this.countryListLoaded || this.countryList.length < 200) {
            this.initCountryList();
        } else {
            this.constructCountryOptions(this.countryList);
        }
    },
    watch: {
        singleClientData: {
            handler(value) {
                if (this.singleClientData) {
                    // console.log('data', value)
                    // if (this.singleClientData && typeof this.singleClientData === 'object' && Object.keys(this.singleClientData).length !== 0) {
                    //     this.iterate(this.singleClientData)
                    // }
                    Object.keys(value).forEach(key => {
                        // console.log(key, typeof value[key] == 'object' ? {...value[key]} : value[key])
                        if (this[key] !== undefined) {
                            this.$set(this, key, JSON.parse(JSON.stringify(value[key])))
                        }
                    })
                    
                    if (!this.customer.account) {
                        this.customer.account = {
                            is_active: 0
                        }
                    }
                    if (!this.customer.address) {
                        this.customer.address = {
                            is_primary: 1,
                            is_active: 1
                        }
                    }
                    this.customer.channels  = this.filterChannels(this.customer.channels)
                    if (!this.customer.person_data) {
                        this.customer.person_data = {
                            nationality: {}
                        }
                    } else if (!this.customer.person_data.nationality) {
                        this.customer.person_data.nationality = {}
                    }
                    // console.log('channels2', this.customer)
                }
                // console.log('customer', {...this.customer})
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
    methods: {
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
            const isValid       = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.submitClient(this.customer.id ? this.updatedClientData : this.savedClientData)
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submitClient(data) {
            this.isRequesting   = true
            this.checkTypes(data)
            if (data.customer.account && !data.customer.account.password) {
                // if empty then keep the account table intact
                delete data.customer['account']
                // if empty then keep the old passowrd
                // delete data.customer.account['password']
            }

            this.$store
                .dispatch("clients/submitClient", data)
                .then(response => {
                    this.$router.push('/customers')
                }).catch( err => {
                    this.failed = err.response.data.message
                    this.$refs.observer.setErrors(err.response.data.errors)          
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
        checkTypes(data) {
            if (!data.customer.type_id) {
                data.customer.type_id   = this.types && this.types.person ? this.types.person : 0
            }
            if (data.customer.account && !data.customer.account.type_id) {
                data.customer.account.type_id   = this.types && this.types.customer ? this.types.customer : 0
            }
            if (data.customer.address && !data.customer.address.type_id) {
                data.customer.address.type_id   = this.types && this.types.main_address ? this.types.main_address : 0
            }
        },
        filterChannels(obj) {
            if (obj && Array.isArray(obj) && obj.length) {
                let channels  = {}
                obj.forEach(channel => {
                    channels[channel.type.value]  = channel
                    // let key = 'customerXchannelsX' + channel.type.value
                    // if (this[key + 'Xid'] !== undefined) {
                    //     this[key + 'Xid']   = channel.id
                    // }
                    // if (this[key + 'Xvalue'] !== undefined) {
                    //     this[key + 'Xvalue']   = channel.value
                    // }
                })
                // console.log('channels', channels);
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
        // },
        // iterate(obj, parentKey='') {
        //     Object.keys(obj).forEach(key => {
        //         let actualParentKey = parentKey ? parentKey + '.' + key : key
        //         console.log('key', actualParentKey, 'isObject', typeof obj[key])
        //         if (key === 'channels') {
        //             this.filterChannels(obj[key])
        //         } else if (obj[key] && typeof obj[key] === 'object' && Object.keys(obj[key]).length !== 0) {
        //             this.iterate(obj[key], actualParentKey)
        //         } else {
        //             let newKey  = actualParentKey.replace(/\./g, 'X')
        //             if (this[newKey] !== undefined) {
        //                 console.log('key', newKey, 'value', obj[key])
        //                 this.$set(this, newKey, JSON.parse(JSON.stringify(obj[key])))
        //             }
        //         }
        //     })
        }
    }
}
</script>

