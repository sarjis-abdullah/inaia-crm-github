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
                            <ValidationProvider ref="accountProvider" vid="account_id" name="Account Id" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Account Id"
                                    placeholder="Account ID"
                                    v-model="resource.short_name"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    :danger-text="errors ? errors[0] : 'Please insert the Short Name'"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <ValidationProvider ref="transKeyProvider" vid="name_translation_key" name="Translation Key" rules="required" v-slot="{ errors }">
                                <vs-input
                                    label="Translation Key"
                                    placeholder="translation_key"
                                    v-model="resource.name_translation_key"
                                    class="w-100 mt-4"
                                    :danger="errors && !!errors.length"
                                    :danger-text="errors ? errors[0] : 'Please insert the Translation Key'"
                                    val-icon-danger="clear"
                                />
                            </ValidationProvider>
                            <vs-select class="w-100 mt-4" label="Is Active?" v-model="resource.is_active">
                            <vs-select-item
                                :key="index"
                                :value="item.value"
                                :text="item.text"
                                v-for="(item,index) in statuses"
                            />
                            </vs-select>
                            <vs-select class="w-100 mt-4" label="Assigned Permissions?" multiple v-model="resource.permissionIds">
                            <vs-select-item
                                :key="index"
                                :value="item.id"
                                :text="item.short_name"
                                v-for="(item,index) in permissions"
                            />
                            </vs-select>
                        </vs-col>
                    </vs-row>
                    <div class="btn-alignment mt-4">
                        <vs-button button="submit" type="filled" :disabled="isRequesting">Save</vs-button>
                        <vs-button color="dark" type="filled" @click="() => $router.push('/roles')">Cancel</vs-button>
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
            short_name: '',
            name_translation_key: '',
            is_active: 0,
            permissionIds: []
        },
        statuses: [
            { text: 'Yes', value: 1 },
            { text: 'No', value: 0 }
        ],
        permissions: [],
        failed: '',
        isFetchingDetails: false,
        isFetchingPermissions: false,
        isRequesting: false
    }),
    async mounted() {
        if (this.$route.params.id && !this.isFetchingDetails) {
            this.isFetchingDetails  = true
            await this.$store.dispatch('roles/details', this.$route.params.id)
                .then(res => {
                    if (res.data && res.data.data) {
                        this.resource   = JSON.parse(JSON.stringify(res.data.data))
                    }
                    // console.error('resorce', {...this.resource})
                })
                .finally(() => this.isFetchingDetails = false)
        }
        if (!this.isFetchingPermissions) {
            this.isFetchingPermissions  = true
            await this.$store.dispatch('permissions/fetchList')
                .then(res => {
                    if (res.data && res.data.data) {
                        this.permissions   = res.data.data
                    }
                })
                .finally(() => this.isFetchingPermissions = false)
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
                .dispatch("roles/submit", data)
                .then(response => {
                    this.$router.push('/roles')
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

