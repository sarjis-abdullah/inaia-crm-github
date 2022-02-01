<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} Product Spec</h6>
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
                                    label="Name"
                                    name="Name"
                                    v-model="resource.name"
                                    placeholder="name"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Value"
                                    name="Value"
                                    v-model="resource.value"
                                    placeholder="value"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                              <base-input label="Product Class" name="Product Class" placeholder="Select product class" rules="required">
                                  <select class="form-control" v-model="resource.product_class_id">
                                      <option v-for="(i, idx) in productClassOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                  </select>
                              </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/product-specs')">Cancel</base-button>
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
export default {
    props: {
        productSpecDetails: {
            type: Object,
            default() {}
        }
    },
    data: () => ({
        resource: {
            name: '',
            value: '',
            product_class_id:''
        },
        failed: '',
        isFetchingDetails: false,
        isRequesting: false,
        sanitizedFormFieldName: {
          "name": "Name",
        },
        errors: {},
        productClassOptions:[],
    }),
    computed: {
      ...mapGetters({
          productClasses: "product-classes/productClasses"
      }),
    },
    mounted() {
      if (!this.productClasses) {
          this.initProductClassList();
      } else {
          this.constructProductClassOptions(this.productClasses);
      }
    },
    watch: {
      productSpecDetails: {
          handler(value) {
              if (this.productSpecDetails) {
                this.resource   = JSON.parse(JSON.stringify(this.productSpecDetails))
              }
          },
          immediate: true
      },
      productClasses: {
          handler(value) {
              if (this.productClasses) {
                  this.constructProductClassOptions(value)
              }
          }
      }
    },
    methods: {
        initProductClassList() {
            this.$store.dispatch("product-classes/productClasses");
        },
        constructProductClassOptions(prodcuts) {
            const productList     = [];
            prodcuts.forEach(item => {
                productList[productList.length] = {
                    text: item.name_translation_key,
                    value: item.id
                };
            });

            this.productClassOptions = productList;
        },
        async validate() {
            const isValid = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.isRequesting = true
                delete this.resource.productClass
                await this.submit(this.resource)
            } else {
                console.log('invalid request')
                this.isRequesting = false
            }
        },
        submit(data) {
            return this.$store
                .dispatch("product-specs/submit", data)
                .then(response => {
                    this.$router.push('/product-specs')
                    this.$notify({type: 'success', timeout: 10000, message: 'Product specs information saved successfully!'})
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
