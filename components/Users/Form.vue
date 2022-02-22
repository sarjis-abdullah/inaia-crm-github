<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} User</h6>
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
                                    :rules="{required: selectedAccountType == 'employee'}"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <base-input
                                    label="User Type"
                                    name="User Type"
                                    v-model="selectedAccountType"
                                    disabled
                                    hidden="true"
                                    rules="required"
                                />
                                <base-input
                                    label="Password"
                                    type="password"
                                    v-model="customer.account.password"
                                    placeholder="*******"
                                    name="Password"
                                    :rules="{required: !customer.id}"
                                />
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5" v-if="customer.id">
                                <base-input
                                    label="Old Password"
                                    type="password"
                                    v-model="customer.account.old_password"
                                    placeholder="*******"
                                    name="Old Password"
                                />
                                <!-- <base-input label="Nationality" name="Nationality" ref="nationalityProvider">
                                    <el-select filterable v-model="customer.person_data.nationality.id" placeholder="Select nationality">
                                        <el-option v-for="(n, idx) in nationalityOptions" :key="idx" :value="n.value" :label="$t(n.text)" />
                                    </el-select>
                                </base-input> -->
                            </div>
                        </div>
                        <div class="row" v-if="selectedAccountType == 'employee'">
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
                                <base-input label="Country" name="Country" ref="countryProvider">
                                    <template #default="slotProps">
                                        <el-select filterable v-model="customer.address.country_id" placeholder="Select country">
                                            <el-option v-for="(c, idx) in countryOptions" :key="idx" :value="c.value" :label="$t(c.text)" />
                                        </el-select>
                                    </template>
                                </base-input>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-5">
                                <base-input label="Nationality" name="Nationality" ref="nationalityProvider">
                                    <el-select filterable v-model="customer.person_data.nationality.id" placeholder="Select nationality">
                                        <el-option v-for="(n, idx) in nationalityOptions" :key="idx" :value="n.value" :label="$t(n.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-1">
                            </div>
                            <div class="col-md-5">
                                <base-input
                                    label="Assign Roles"
                                    name="Assign Roles"
                                >
                                    <el-select multiple filterable v-model="customer.account.roleIds" placeholder="Select roles">
                                        <el-option v-for="(r, idx) in roles" :key="idx" :value="r.id" :label="$t(r.short_name)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 align-self-center">
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/users')">Cancel</base-button>
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
        singleUserData: {
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
                is_active: 1,
                roleIds: []
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
            { text: 'Employee', value: 'employee' }
        ],
        roles: [],
        selectedAccountType: 'employee',
        failed: '',
        isFetchingRoles: false,
        isRequesting: false,
        sanitizedFormFieldName: {
          "customer.channels.mobile.value": "Mobile No",
          "customer.channels.email.value": "Email Address",
          "customer.account.password": "Password"
        },
        errors: {}
    }),
    computed: {
        ...mapGetters({
            countryList: "users/countryList",
            countryListLoaded: "users/countryListLoaded",
            types: "types/pairs"
        }),
        savedUserData() {
            return {
                customer: {
                    contact: {
                        name: this.customer.name,
                        type_id: this.types['person'] || 0,
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
                        type_id: this.types[this.selectedAccountType] || 0,
                    },
                    channels: this.customer.channels
                }
            }
        },
        updatedUserData() {
            return {
                id: this.customer.id,
                customer: {
                    contact: {
                        id: this.customer.id,
                        name: this.customer.name,
                        type_id: this.types['person'] || 0,
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
                        type_id:  this.types[this.selectedAccountType] || 0,
                    },
                    channels: this.customer.channels
                }
            }
        }
    },
    watch: {
        singleUserData: {
            handler(value) {
                if (this.singleUserData) {
                    Object.keys(value).forEach(key => {
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
                    if (this.customer.account.type_id && this.types) {
                        this.selectedAccountType = Object.keys(this.types).find( k => this.types[k] == this.customer.account.type_id )
                    }

                    if (this.customer.account.roles) {
                        let ids = []
                        this.customer.account.roles.forEach(r => {
                            ids[ids.length] = r.id
                        });
                        this.customer.account.roleIds   = ids
                    }

                    this.customer.channels  = this.filterChannels(this.customer.channels)
                    if (!this.customer.person_data) {
                        this.customer.person_data = {
                            nationality: {}
                        }
                    } else if (!this.customer.person_data.nationality) {
                        this.customer.person_data.nationality = {}
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
        if (!this.countryListLoaded || this.countryList.length < 200) {
            this.initCountryList()
        } else {
            this.constructCountryOptions(this.countryList)
        }
        this.fetchRoles()
    },
    methods: {
        initCountryList() {
            this.$store.dispatch("users/initCountryList");
        },
        constructCountryOptions(countries) {
            ( {countryList: this.countryOptions, nationalityList: this.nationalityOptions}  = mapCountriesNationalities(countries) )
        },
        fetchRoles() {
            if (!this.isFetchingRoles) {
                this.isFetchingRoles    = true
                this.$store.dispatch('roles/fetchList', '&is_active=1')
                    .then(res => {
                        if (res.data && res.data.data) {
                            this.roles  = res.data.data
                        }
                    })
                    .finally(() => this.isFetchingRoles = false)
            }
        },
        async validate() {
            const isValid  = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.submitUser(this.customer.id ? this.updatedUserData : this.savedUserData)
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submitUser(data) {
            this.isRequesting   = true
            this.manipulateBeforeSave(data)
            this.errors = {}
            this.$store
                .dispatch("users/submitUser", data)
                .then(response => {
                    this.$router.push('/users')
                    this.$notify({type: 'success', timeout: 5000, message: 'User information saved successfully!'})
                }).catch( err => {
                    this.failed = err.response.data.message
                    for (const [key, value] of Object.entries(err.response.data.errors)) {
                      this.errors[this.sanitizedFormFieldName[key]] = [value[0].replace(key, this.sanitizedFormFieldName[key])]
                    }
                    this.$refs.observer.setErrors(this.errors)
                    this.$notify({type: 'danger', timeout: 7000, message: this.failed})
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
        manipulateBeforeSave(data) {
            data.customer.account.type_id = this.types.employee
            let address = data.customer.address
            if (address && !address.line1 && !address.postal_code && !address.city && !address.country_id) {
                delete data.customer.address
            } else if (address && !address.type_id) {
                data.customer.address.type_id   = this.types && this.types.main_address ? this.types.main_address : 0
            }
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

<style scoped>
.el-select-invalidate-height {
    padding: 0 !important;
    height: 3.18em !important;
}
</style>
