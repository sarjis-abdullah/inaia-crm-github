<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} Role</h6>
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
                            <div class="col-md-6">
                                <base-input
                                    label="Short Name"
                                    name="Short Name"
                                    v-model="resource.short_name"
                                    placeholder="short"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Translation Key"
                                    name="Translation Key"
                                    v-model="resource.name_translation_key"
                                    placeholder="translation_key"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Is active?"
                                    name="Activity"
                                >
                                    <el-select v-model="resource.is_active" placeholder="Is active?">
                                        <el-option v-for="(i, idx) in statuses" :key="idx" :value="i.value" :label="$t(i.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Assigned Permissions?"
                                    name="Assigned Permissions"
                                >
                                    <el-select multiple filterable v-model="resource.permissionIds" placeholder="Select permissions">
                                        <el-option v-for="(p, idx) in permissions" :key="idx" :value="p.id" :label="$t(p.short_name)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/roles')">Cancel</base-button>
                            </div>
                        </div>
                    </validation-observer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Select, Option } from 'element-ui'
import { holdingActivePermissionIds } from '~/helpers/auth'

export default {
    components: {
        [Select.name]: Select,
        [Option.name]: Option
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
                        // in case of existance of "permissions" in response
                        delete this.resource.permissions
                    }
                })
                .finally(() => this.isFetchingDetails = false)
        }
        if (!this.isFetchingPermissions) {
            this.isFetchingPermissions  = true
            await this.$store.dispatch('permissions/fetchList', '&is_active=1&per_page=200')
                .then(res => {
                    if (res.data && res.data.data) {
                        this.permissions   = res.data.data
                        // make sure Role has only available permissions
                        this.resource.permissionIds = holdingActivePermissionIds(this.resource.permissionIds, this.permissions)
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
                    this.$notify({type: 'success', timeout: 10000, message: 'Role information saved successfully!'})
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

