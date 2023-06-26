<template>
    <vs-row>
        <vs-col vs-lg="12" vs-xs="12" vs-sm="12">
            <vs-card>
                <div slot="header">
                    <h3 class="card-title mb-0">Role Form</h3>
                </div>

                <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="validate">
                    <h4 class>Role Info</h4>
                    <hr class="custom-hr" />
                    <div v-if="failed && invalid" style="color: red">{{ failed }}</div>
                    <vs-row>
                        <vs-col vs-lg="6" vs-xs="12" vs-sm="6">

                            <vs-select class="w-100 mt-4" label="Transaction Type?" v-model="resource.transaction_type_id">
                            <vs-select-item
                                :key="index"
                                :value="item.id"
                                :text="item.name_translation_key"
                                v-for="(item,index) in transactionTypes"
                            />
                            </vs-select>

                            <ValidationProvider ref="feeProvider" vid="fee" name="Transaction Fee" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Transaction Fee"
                                    placeholder="fee"
                                    v-model="resource.fee"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    :danger-text="errors ? errors[0] : 'Please insert the Transaction Fee'"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>

                            <ValidationProvider ref="moneyAmountProvider" vid="money_amount" name="Money Amount" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Transaction Money Amount"
                                    placeholder="amount"
                                    v-model="resource.money_amount"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    :danger-text="errors ? errors[0] : 'Please insert the Transaction Money Amount'"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>

                            <ValidationProvider ref="goldAmountProvider" vid="gold_amount" name="Gold Amount" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Gold Money Amount"
                                    placeholder="amount"
                                    v-model="resource.gold_amount"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    :danger-text="errors ? errors[0] : 'Please insert the Transaction Gold Amount'"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>

                        </vs-col>
                    </vs-row>
                    <div class="btn-alignment mt-4">
                        <vs-button button="submit" type="filled" :disabled="isRequesting">Save</vs-button>
                        <vs-button color="dark" type="filled" @click="() => $router.push('/transactions')">Cancel</vs-button>
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
    data: () => ({
        resource: {
            order_id: '',
            transaction_type_id: '',
            fee: '',
            money_amount: 0,
            gold_amount: 0
        },
        transactionTypes: [],
        failed: '',
        isFetchingTypes: false,
        isFetchingDetails: false,
        isRequesting: false
    }),
    async mounted() {
        if (!this.isFetchingTypes) {
            this.isFetchingTypes  = true
            await this.$store.dispatch('transactionTypes/pairs')
                .then(res => {
                    if (res.data && res.data.data) {
                        this.transactionTypes   = res.data.data
                    }
                })
                .finally(() => this.isFetchingTypes = false)
        }
        if (this.$route.params.id && !this.isFetchingDetails) {
            this.isFetchingDetails  = true
            await this.$store.dispatch('transactions/details', this.$route.params.id)
                .then(res => {
                    if (res.data && res.data.data) {
                        this.resource   = JSON.parse(JSON.stringify(res.data.data))
                    }
                })
                .finally(() => this.isFetchingDetails = false)
        }
    },
    methods: {
        async validate() {
            const isValid       = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.isRequesting   = true
                await this.submit(this.resource)
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submit(data) {
            return this.$store
                .dispatch("transactions/submit", data)
                .then(response => {
                    this.$router.push('/transactions')
                }).catch( err => {
                    this.failed = err.response.data.message
                    this.$refs.observer.setErrors(err.response.data.errors)          
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
    }
}
</script>

