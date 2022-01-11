<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} Product Class</h6>
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
                              <base-input label="Product" name="Product" placeholder="Select product" rules="required" ref="productProvider">
                                  <select class="form-control" v-model="resource.product_id">
                                      <option v-for="(i, idx) in productOptions" :key="idx" :value="i.value">{{i.text}}</option>
                                  </select>
                              </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/product-classes')">Cancel</base-button>
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
export default {
    components: {
        ValidationObserver,
        ValidationProvider
    },
    props: {
        productClassDetails: {
            type: Object,
            default() {}
        }
    },
    data: () => ({
        resource: {
            name_translation_key: '',
            product_id:''
        },
        failed: '',
        isFetchingDetails: false,
        isRequesting: false,
        sanitizedFormFieldName: {
          "name_translation_key": "Translation Key",
        },
        errors: {},
        selectedProductClass:"",
        productOptions: [],
    }),
    computed: {
      ...mapGetters({
          productList: "products/productList"
      }),
    },
    mounted() {
      if (!this.productList) {
          this.initProductList();
      } else {
          this.constructProductOptions(this.productList);
      }
    },
    watch: {
      productClassDetails: {
          handler(value) {
              if (this.productClassDetails) {
                this.resource   = JSON.parse(JSON.stringify(this.productClassDetails))
              }
          },
          immediate: true
      },
      productList: {
          handler(value) {
              if (this.productList) {
                  this.constructProductOptions(value)
              }
          }
      }
    },
    methods: {
        initProductList() {
            this.$store.dispatch("products/initProductList");
        },
        constructProductOptions(prodcuts) {
            const productList     = [];
            prodcuts.forEach(item => {
                productList[productList.length] = {
                    text: item.name_translation_key,
                    value: item.id
                };
            });

            this.productOptions     = productList;
        },
        async validate() {
            const isValid = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.isRequesting = true
                delete this.resource.product
                await this.submit(this.resource)
            } else {
                console.log('invalid request')
                this.isRequesting = false
            }
        },
        submit(data) {
            return this.$store
                .dispatch("product-classes/submit", data)
                .then(response => {
                    this.$router.push('/product-classes')
                    this.$notify({type: 'success', timeout: 10000, message: 'Product class information saved successfully!'})
                }).catch( err => {
                    this.failed = err.response.data.message
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
