<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">Assign Role</h6>
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
                                    label="Assign Roles"
                                    name="Assign Roles"
                                >
                                    <el-select multiple v-model="assignedRoleIds" placeholder="Select roles">
                                        <el-option v-for="(r, idx) in roles" :key="idx" :value="r.id" :label="$t(r.short_name)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">Save</base-button>
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
import { Select, Option } from 'element-ui'
import { holdingActiveRoleIds } from '~/helpers/auth'

export default {
    components: {
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
        accountId: null,
        assignedRoleIds: [],
        roles: [],
        failed: '',
        isFetchingRoles: false,
        isRequesting: false
    }),
    watch: {
        singleUserData: {
            handler(value) {
                if (value.customer && value.customer.account && value.customer.account.roles) {
                    this.accountId  = value.customer.account.id
                    let ids = []
                    value.customer.account.roles.forEach(r => {
                        ids[ids.length] = r.id
                    });
                    this.assignedRoleIds    = ids
                }
            }
        }
    },
    async mounted() {
        if (!this.isFetchingRoles) {
            this.isFetchingRoles    = true
            await this.$store.dispatch('roles/fetchList', '&is_active=1')
                .then(res => {
                    if (res.data && res.data.data) {
                        this.roles  = res.data.data
                    }
                })
                .finally(() => this.isFetchingRoles = false)
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
                .dispatch("users/assignRoles", {id: this.accountId, roleIds: this.assignedRoleIds})
                .then(response => {
                    this.$router.push('/users')
                    this.$notify({type: 'success', timeout: 10000, message: 'Roles assigned successfully!'})
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

