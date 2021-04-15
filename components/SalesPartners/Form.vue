<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} Sales Partner</h6>
                    <!--
                    <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
                        <route-breadcrumb/>
                    </nav>
                    -->
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="card mb-4">
                <div class="card-body">
                    <validation-observer ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="validate">
                        <div class="row text-danger" v-if="failed && invalid">
                            <div class="col-sm-2"></div>
                            <div class="col-md-6">
                                {{ failed }}
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-5">
                                <base-input label="Sales Partner Type" name="Sales Partner Type">
                                    <el-select v-model="selectedContactType" placeholder="Select partner type">
                                        <el-option v-for="(ct, idx) in contactTypes" :key="idx" :value="ct.value" :label="$t(ct.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5" v-if="selectedContactType == 'person'">
                                <base-input label="Nationality" name="Nationality" ref="nationalityProvider">
                                    <el-select filterable v-model="customer.person_data.nationality.id" placeholder="Select nationality">
                                        <el-option v-for="(n, idx) in nationalityOptions" :key="idx" :value="n.value" :label="$t(n.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <base-input
                                    label="First Name"
                                    name="First Name"
                                    v-model="customer.name"
                                    placeholder="First Name"
                                    rules="required"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
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
                            <div class="col-md-5">
                                <base-input
                                    label="Birth Date"
                                    name="Birth Date"
                                    v-model="customer.person_data.birthdate"
                                    placeholder="Birth Date"
                                    type="date"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
                                <base-input label="Gender" name="Gender" rules="required" #default="{invalid, validated}">
                                    <el-select v-model="customer.person_data.gender" placeholder="Select gender" :class="{'el-select-invalidate-height': invalid && validated, 'form-control': invalid && validated, 'is-invalid': invalid && validated}">
                                        <el-option v-for="(g, idx) in genderOptions" :key="idx" :value="g.value" :label="$t(g.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <base-input
                                    label="Email Address"
                                    name="Email Address"
                                    v-model="customer.channels.email.value"
                                    placeholder="email@address.com"
                                    rules="required|email"
                                    ref="emailProvider"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
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
                            <div class="col-md-5">
                                <base-input
                                    label="Address Line1"
                                    name="Address Line1"
                                    v-model="customer.address.line1"
                                    placeholder="Address Line1"
                                    rules="required"
                                    ref="addLine1Provider"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
                                <base-input
                                    label="Address Line2"
                                    v-model="customer.address.line2"
                                    placeholder="Address Line2"
                                    ref="addLine2Provider"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <base-input
                                    label="Postal Code"
                                    name="Postal Code"
                                    v-model="customer.address.postal_code"
                                    placeholder="postal code"
                                    ref="postalProvider"
                                    rules="required"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
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
                            <div class="col-md-5">
                                <base-input
                                    label="Region or State"
                                    v-model="customer.address.region"
                                    placeholder="Region"
                                    ref="regionProvider"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
                                <base-input label="Country" name="Country" placeholder="Select country" ref="countryProvider" rules="required" #default="{invalid, validated}">
                                    <el-select v-model="customer.address.country_id" placeholder="Select country" :class="{'el-select-invalidate-height': invalid && validated, 'form-control': invalid && validated, 'is-invalid': invalid && validated}">
                                        <el-option v-for="(c, idx) in countryOptions" :key="idx" :value="c.value" :label="$t(c.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                            </div>
                            <div class="col-md-4">
                                <base-input
                                    label="Password"
                                    type="password"
                                    v-model="customer.account.password"
                                    placeholder="*******"
                                />
                            </div>
                        </div>
                        
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/sales-partners')">Cancel</base-button>
                            </div>
                        </div>
                    </validation-observer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import { ValidationObserver, ValidationProvider } from "vee-validate"
import { Select, Option } from 'element-ui'
import { mapCountriesNationalities } from '@/helpers/helpers'

export default {
    components: {
        ValidationObserver,
        ValidationProvider,
        [Select.name]: Select,
        [Option.name]: Option
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
        countryOptions: [],
        nationalityOptions: [],
        genderOptions: [
            { text: 'Male', value: 'Male' },
            { text: 'Female', value: 'Female' }
        ],
        contactTypes: [
            { text: 'Person', value: 'person' },
            { text: 'Company', value: 'company' }
        ],
        selectedContactType: 'person',
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
                        type_id: this.types[this.selectedContactType] || 0,
                        is_active: this.customer.is_active
                    },
                    person_data: {
                        ...this.customer.person_data
                    },
                    address: {
                        ...this.customer.address
                    },
                    account: {
                        ...this.customer.account,
                        type_id: this.types.partner
                            ? this.types.partner
                            : this.customer.account && this.customer.account.type_id
                                ? this.customer.account.type_id
                                : 0
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
                        type_id: this.types[this.selectedContactType] || 0,
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
                        contact_id: this.customer.id,
                        type_id: this.customer.account && this.customer.account.type_id
                            ? this.customer.account.type_id
                            : this.types.partner
                                ? this.types.partner
                                : 0
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
                    if (this.customer.type_id && this.types) {
                        this.selectedContactType    = Object.keys(this.types).find( k => this.types[k] == this.customer.type_id )
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
            ( {countryList: this.countryOptions, nationalityList: this.nationalityOptions}  = mapCountriesNationalities(countries) )
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
                    this.$router.push('/sales-partners')
                    this.$notify({type: 'success', timeout: 10000, message: 'Sales Partner information saved successfully!'})
                }).catch( err => {
                    this.failed = err.response.data.message
                    this.$refs.observer.setErrors(err.response.data.errors)          
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
        checkTypes(data) {
            if (!data.customer.contact.type_id) {
                data.customer.contact.type_id   = this.types && this.types[this.selectedContactType] ? this.types[this.selectedContactType] : 0
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

<style scoped>
.el-select-invalidate-height {
    padding: 0 !important;
    height: 3.18em !important;
}
</style>

