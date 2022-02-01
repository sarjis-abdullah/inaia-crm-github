<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} Product</h6>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="card mb-4">
                <div class="card-body">
                    <validation-observer ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="validate">
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
                                <base-button type="primary" native-type="submit">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/products')">Cancel</base-button>
                            </div>
                        </div>
                    </validation-observer>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        resource: {
            name_translation_key: '',
        },
        failed: '',
        isFetchingDetails: false,
        isRequesting: false,
        sanitizedFormFieldName: {
          "name_translation_key": "Translation Key",
        },
        errors: {}
    }),
    async mounted() {
        if (this.$route.params.id && !this.isFetchingDetails) {
            this.isFetchingDetails  = true
            await this.$store.dispatch('products/details', this.$route.params.id)
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
            const isValid = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.isRequesting = true
                await this.submit(this.resource)
            } else {
                console.log('invalid request')
                this.isRequesting = false
            }
        },
        submit(data) {
            return this.$store
                .dispatch("products/submit", data)
                .then(response => {
                    this.$router.push('/products')
                    this.$notify({type: 'success', timeout: 10000, message: 'Product information saved successfully!'})
                }).catch( err => {
                    this.failed = err.response.data.message
                    //this.$refs.observer.setErrors(err.response.data.errors)
                    for (const [key, value] of Object.entries(err.response.data.errors)) {
                      this.errors[this.sanitizedFormFieldName[key]] = [value[0].replace(key, this.sanitizedFormFieldName[key])]
                    }
                    this.$refs.observer.setErrors(this.errors)
                    this.$notify({type: 'danger', timeout: 10000, message: this.failed})
                }).finally(() => {
                    this.isRequesting   = false
                })
        },
    }
}
</script>
