<template>
    <modal :show.sync="show" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary"
        @close="onClose" :allowOutSideClose="false">
        <template slot="header">
            <h5 class="modal-title">{{ $t('create_claim') }}</h5>
        </template>
        <form>
            <div class="d-flex flex-row align-content-center">
                <div class="col-4">
                    {{ $t('claim_type') }}
                </div>
                <div class="col-8">
                    <Select :placeholder="$t('claim_type')" v-model="selectedClaimType">
                        <Option v-for="option in claimTypes" :value="option.name_translation_key" :label="$t(option.name_translation_key)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>

            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('claim_status') }}
                </div>
                <div class="col-8">
                    <Select :placeholder="$t('claim_status')" v-model="selectedClaimStatus">
                        <Option v-for="option in claimStatus" :value="option.value" :label="option.text"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>

            </div>
            <div class="d-flex flex-row align-content-center mt-3" v-if="account_id == -1">
                <div class="col-4">
                    {{ $t('customer') }}
                </div>
                <div class="col-8">
                    <Select v-model="selectedCustomer" remote filterable reserve-keyword class="filterElement"
                        :placeholder="$t('customer_filter_placeholder')" :loading="loadingCustomers"
                        :remote-method="loadCustomers" @change="customerSelected" @clear="clearCustomer" clearable>
                        <Option v-for="option in customers" :value="option.id" :label="formatClientLabel(option)"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('depot') }}
                </div>
                <div class="col-8">
                    <Select :placeholder="$t('depots')" v-model="selectedDepot" filterable
                        :disabled="account_id == -1 && !selectedCustomer">
                        <Option v-for="option in depots" :value="option.depot_number" :label="option.name"
                            :key="option.id">
                        </Option>
                    </Select>
                </div>
            </div>
            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('amount') }}
                </div>
                <div class="col-8">
                    <Input v-model="amount" :placeholder="$t('amount')" type="numeric" />
                </div>
            </div>

            <div class="d-flex flex-row align-content-center mt-3">
                <div class="col-4">
                    {{ $t('comment') }}
                </div>
                <div class="col-8">
                    <Input v-model="comment" :placeholder="$t('comment')" />
                </div>
            </div>
        </form>
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="onClose()">
                {{ $t('cancel') }}
            </base-button>
            <base-button type="primary" @click="() => createNewClaim()" :disabled="isSubmitting || notValid">
                {{ $t('save') }}
            </base-button>
        </template>
    </modal>
</template>
<script>
import { Select, Option, Input } from 'element-ui';
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
import { mapGetters } from "vuex";
import moment from "moment";
export default {
    components: {
        Select, Option, Input
    },
    props: {
        account_id: {
            type: Number,
            default: -1
        },
        show: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        show: {
            handler() {
                if (!this.show) {
                    this.selectedClaimType = null;
                    this.amount = null;

                    this.comment = null;
                    this.isSubmitting = false;
                    this.notValid = true;
                } else {
                    if (this.account_id > -1)
                        this.$store
                            .dispatch("depots/fetchDepotsByAccount", this.account_id)
                            .then((data) => console.log(data));
                }

            },

        },
        selectedCustomer: {
            handler() {
                if (this.selectedCustomer != null) {
                    this.selectedDepots = null;
                    this.$store
                        .dispatch("depots/fetchDepotsByAccount", this.selectedCustomer)
                        .then((data) => console.log(data));
                }
            },
            immediate: true,
        },
        selectedClaimType: {
            handler() {
                if (this.amount && !isNaN(this.amount) && this.selectedClaimType && this.selectedDepot) {
                    this.notValid = false
                } else {
                    this.notValid = true
                }
            },
            immediate: true
        },
        amount: {
            handler() {
                if (this.amount && this.selectedClaimType && this.selectedDepot && !isNaN(this.amount)) {
                    this.notValid = false
                } else {
                    this.notValid = true
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            selectedClaimType: null,
            selectedClaimStatus: 'pending',
            customers: [],

            claimStatus: [
                {
                    id: 1,
                    value: 'pending',
                    text: this.$t('pending')
                },
                {
                    id: 2,
                    value: 'paid',
                    text: this.$t('paid')
                },
                {
                    id: 3,
                    value: 'payment_failed',
                    text: this.$t('payment_failed')
                },
            ],
            amount: null,
            reference: null,
            comment: null,
            isSubmitting: false,
            notValid: true,
            selectedDepot: null,
            selectedOrder: null,
            selectedCustomer: null,
            lastRequest: null,
            timer: null,
            customerQuery: "",
        }
    },
    mounted() {
      if(!this.claimTypes || this.claimTypes.length ==0)
            this.$store.dispatch("claims/getClaimTypes", "");
    },
    computed: {
        ...mapGetters("depots", {
            depots: "orderFilterList",
        }),
        ...mapGetters("claims", {
            loadingTypes: "loading",
            claimTypes: "claimTypes",
        }),
    },
    methods: {
        onClose() {
            this.$emit('closed');
        },
        clearCustomer: function () {
            this.selectedCustomer = null;
            this.selectedCustomerInfo = null;
            this.selectedDepots = null;
            this.applyFilter();
        },
        loadCustomers: function (query) {
            if (this.timer) {
                clearTimeout(this.timer);
            }
            if (query.length >= 3) {
                let update = true;
                this.customerQuery = query;
                if (this.lastRequest != null) {
                    let now = moment();
                    if (now.diff(this.lastRequest, "second") < 2) {
                        update = false;
                    }
                }
                if (update) {
                    this._getClients();
                } else {
                    this.timer = setTimeout(this._getClients, 1000);
                }
            } else {
                this.customers = [];
                this.customerQuery = "";
            }
        },
        _getClients() {
            this.loadingCustomers = true;
            this.lastRequest = moment();
            this.$store
                .dispatch("clients/getClientListBySurname", this.customerQuery)
                .then((data) => {
                    this.customers = data.data.data
                    this.loadingCustomers = false;
                })
                .finally(() => {

                    this.loadingCustomers = false;
                });
        },
        customerSelected: function (id) {
            let client = this.customers.find((x) => x.id == id);
            if (client) {
                this.selectedCustomerInfo = client;
            }
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
        createNewClaim() {
            let data = {
                'amount': this.amount * 100,
                'claim_type': this.selectedClaimType,
                'depot_number': this.selectedDepot,
                'claim_status': this.selectedClaimStatus
            }
            if (this.comment) {
                data.comment = this.comment;
            }

            this.isSubmitting = true;
            this.$store.dispatch('claims/createNewClaim', data).then(() => {
                this.$notify({
                    type: 'success',
                    message: this.$t('success_creating_claim'),
                    duration: 5000
                })
                this.onClose();
            }).catch(err => {
                apiErrorHandler(err, this.$notify);
            }).finally(() => {
                this.isSubmitting = false;
            })
        }
    }
}
</script>