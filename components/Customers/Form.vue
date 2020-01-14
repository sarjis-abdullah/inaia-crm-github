<template>
    <vs-row>
        <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <vs-card>
                <div slot="header">
                    <h3 class="card-title mb-0">Other Sample Form</h3>
                </div>

                <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="validate">
                    <h4 class>Personal Info</h4>
                    <hr class="custom-hr" />
                    <div v-if="failed && invalid" style="color: red">{{ failed }}</div>
                    <vs-row>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <ValidationProvider ref="firstNameProvider" name="First Name" rules="required" v-slot="{ errors }">
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
                            <ValidationProvider ref="lastNameProvider" name="Last Name" rules="required" v-slot="{ errors }">
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
                            <vs-input label="Date of Birth" type="date" v-model="customer.person_data.birthdate" class="w-100 mt-4" />
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
                            <ValidationProvider ref="nationalityProvider" name="Telephone" rules="required">
                                <vs-select class="w-100 mt-4" label="Nationality" v-model="customer.person_data.nationality.id">
                                <vs-select-item
                                    :key="index"
                                    :value="item.value"
                                    :text="item.text"
                                    v-for="(item,index) in nationalityOptions"
                                />
                                </vs-select>
                            </ValidationProvider>
                            <ValidationProvider ref="telProvider" name="Telephone" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Telephone"
                                    placeholder="+8801345987654"
                                    v-model="customer.channels.tel.value"
                                    class="w-100 mt-4"
                                    type="tel"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert valid telephone"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="emailProvider" name="Email" rules="required|email" v-slot="{ errors }">
                                <vs-input
                                    label="Email"
                                    placeholder="example@email.com"
                                    v-model="customer.account.email"
                                    class="w-100 mt-4"
                                    type="email"
                                    :danger="errors && !!errors.length"
                                    danger-text="Please insert valid email address"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="passwordProvider" name="Password" v-slot="{ errors }">
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
                            <vs-input label="Street" placeholder="street name" v-model="customer.address.street" class="w-100 mt-4" />
                            <vs-input label="Street Number" placeholder="street number" v-model="customer.address.street_number" class="w-100 mt-4" />
                            <vs-input label="Postal Code" placeholder="postal code" v-model="customer.address.postal_code" class="w-100 mt-4" />
                        </vs-col>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">
                            <vs-input label="City" placeholder="city name" v-model="customer.address.city" class="w-100 mt-4" />
                            <vs-input label="Region or State" placeholder="region or state" v-model="customer.address.region" class="w-100 mt-4" />
                            <vs-select class="w-100 mt-4" label="Country" placeholder="select country" v-model="customer.address.country_id">
                            <vs-select-item
                                :key="i"
                                :value="c.value"
                                :text="c.text"
                                v-for="(c,i) in countryOptions"
                            />
                            </vs-select>
                        </vs-col>
                    </vs-row>
                    <div class="btn-alignment mt-4">
                        <vs-button button="submit" color="success" type="filled">Save</vs-button>
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
        message: "",
        date: null,
        // account_number_rule: "required|neq:$",
        // account_username_rule: "required|neq:$",
        // account_email_rule: "required|email",
        customer: {
            type_id: 3,
            is_active: 1,
            account: {
                is_active: 0,
            },
            person_data: {
                nationality: {}
            },
            address: {
                type_id: 7,
                is_primary: 1,
                is_active: 1,
            },
            channels: {
                tel: {}
            }
        },
        nominee: {
            type_id: 4,
            is_active: 1,
            person_data: {},
            address: {
                type_id: 7,
                is_primary: 1,
                is_active: 1
            }
        },
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dob: '',
        gender: '',
        tel: '',
        nationality: '',
        street: '',
        streetNumber: '',
        postalCode: '',
        city: '',
        region: '',
        country: '',
        countryOptions: [],
        nationalityOptions: [],
        genderOptions: [
            { text: 'Select Gender', value: '' },
            { text: 'Male', value: 'male' },
            { text: 'Female', value: 'female' }
        ],
        failed: '',
        isRequesting: false
    }),
    computed: {
        ...mapGetters({
            countryList: "clients/countryList",
        }),
        savedClientData() {
            const data  = {
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
                    channels: this.customer.channels,
                },
                nominee: {
                    contact: {
                        id: this.nominee.id,
                        name: this.nominee.name,
                        type_id: this.nominee.type_id,
                        is_active: this.nominee.is_active,
                        relation_type_id: 4
                    },
                    person_data: {
                        ...this.nominee.person_data,
                        contact_id: this.nominee.id,
                    },
                    address: {
                        ...this.nominee.address,
                        contact_id: this.nominee.id,
                    }
                }
            }
            if (!data.customer.account.password) {
                // if emprty then keep the old passowrd
                delete data.customer.account['password']
            }
            return data
        }
    },
    mounted() {
        if (this.countryList.length < 200) {
            this.initCountryList();
        } else {
            this.constructCountryOptions(this.countryList);
        }
        // this.$validator.extend('neq', {
        //     getMessage: fld => 'The '+ fld +' has already been taken.',
        //     validate: (newValue, [oldValue]) => {
        //         // console.log('new-value:', newValue, ', old-value: ', oldValue)
        //         return newValue != oldValue
        //     }
        // })
    },
    watch: {
        singleClientData: {
            handler(value) {
                if (this.singleClientData) {
                    console.log('data', value)
                    Object.keys(value).forEach(key => {
                        if (this[key] !== undefined) {
                            this.$set(this, key, JSON.parse(JSON.stringify(value[key])))
                        }
                    })
                    
                    this.customer.channels  = this.filterChannels(this.customer.channels)
                    if (!this.customer.person_data.nationality) {
                        this.customer.person_data.nationality = {}
                    }
                    // console.log('channels2', this.customer)
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
    // provide() {
    //     return {
    //     $validator: this.$validator,
    //     // errors: this.errors
    //     }
    // },
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
        validate() {
            this.isRequesting   = true
            const isValid       = this.$refs.observer.validate()
            if (isValid) {
                this.submitClient()
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submitClient() {
            // console.log(this.savedClientData)
            this.$store
                .dispatch("clients/submitClient", this.savedClientData)
                .then(response => {
                    console.log('clients', response.data)
                    // let data    = response.data.data
                    // if (data && (data.email || data.phone)) {
                    //     this.success    = true  
                    // }
                }).catch( err => {
                    this.failed = err.response.data.message
                    this.$refs.setErrors(err.response.data.errors)          
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
        filterChannels(obj) {
            if (obj && Array.isArray(obj) && obj.length) {
                let channels  = {}
                obj.forEach(channel => {
                    channels[channel.type.value]  = channel
                });
                // console.log('channels', channels);
                return {
                    tel: {},
                    ...channels
                }
            }
            return {
                tel: {}
            };  
        },
        toggleAlert(alertType = "info", message) {
            this.isBorder = true
            this.alertType = alertType
            this.message = message
            this.showAlert = true
        }
    }
}
</script>
