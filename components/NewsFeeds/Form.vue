<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? 'Edit' : 'New' }} News Feed</h6>
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
                                    label="Title"
                                    name="Title"
                                    v-model="resource.title"
                                    placeholder="title"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Message"
                                    name="Message"
                                    v-model="resource.message"
                                    placeholder="message"
                                    rules="required"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Language"
                                    name="Language"
                                >
                                    <el-select v-model="resource.language" placeholder="Select language">
                                        <el-option v-for="(i, idx) in locales" :key="idx" :value="i.value" :label="$t(i.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Image"
                                    name="Image"
                                >

                                    <file-input type="base64" :preview="feed && feed.image_url" @change="saveImage" />

                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Thumbnail Image"
                                    name="Thumbnail image"
                                >

                                    <file-input type="base64" :preview="feed && feed.image_thumbnail_url" @change="saveImageThumbnail" />

                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Start at"
                                    name="Start at"
                                    v-model="resource.start_at"
                                    placeholder="start at"
                                    rules="required"
                                    type="date"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="End at"
                                    name="End at"
                                    v-model="resource.end_at"
                                    placeholder="end at"
                                    rules="required"
                                    type="date"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Product"
                                    name="Product"
                                >
                                    <el-select v-model="resource.product_id" placeholder="Select product">
                                        <el-option v-for="(i, idx) in products" :key="idx" :value="i.id" :label="$t(i.name_translation_key)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Product Class"
                                    name="Product Class"
                                >
                                    <el-select v-model="resource.product_class_id" placeholder="Select product class">
                                        <el-option v-for="(i, idx) in filteredProductClasses" :key="idx" :value="i.id" :label="$t(i.name_translation_key)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Target URL"
                                    name="Target URL"
                                    v-model="resource.target_url"
                                    placeholder="target_url"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Action"
                                    name="Action"
                                    v-model="resource.action"
                                    placeholder="action"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    label="Is active?"
                                    name="Is active"
                                >
                                    <el-select v-model="resource.is_active" placeholder="Select product">
                                        <el-option v-for="(p, idx) in statuses" :key="idx" :value="p.value" :label="$t(p.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">Submit</base-button>
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/news-feeds')">Cancel</base-button>
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
import { Select, Option } from 'element-ui'
import PhotoModal from '@/components/common/PhotoModal'
import FileInput from '@/components/common/Inputs/FileInput'

export default {
    components: {
        [Select.name]: Select,
        [Option.name]: Option,
        PhotoModal,
        FileInput
    },
    computed: {
        ...mapGetters({
            feeds: "news-feeds/feeds",
            products: "products/list",
            productClasses: "product-classes/list"
        }),
        filteredProductClasses() {
            if (this.resource.product_id && this.productClasses) {
                return this.productClasses.filter(pc => pc.product_id === this.resource.product_id)
            }
            return this.productClasses
        }
    },
    data: () => ({
        resource: {
            title: '',
            message: '',
            language: null,
            start_at: null,
            end_at: null,
            product_id: null,
            product_class_id: null,
            is_active: 0,
        },
        locales: [
            { text: 'Deutsch',  value: 'de' },
            { text: 'English',  value: 'en' },
            { text: 'Français', value: 'fr' },
            { text: 'Español',  value: 'es' },
        ],
        statuses: [
            { text: 'Yes', value: 1 },
            { text: 'No', value: 0 }
        ],
        feed: null,
        imageClicked: false,
        imageThumbnailClicked: false,
        failed: '',
        isFetchingDetails: false,
        isRequesting: false
    }),
    watch: {
        'resource.product_id': function (newVal, oldVal) {
            if (oldVal && newVal) {
                this.resource.product_class_id  = null
            }
        }
    },
    async mounted() {
        let products = await this.$store.dispatch('products/fetchList', '')
        let productClasses = await this.$store.dispatch('product-classes/fetchList', '')
        if (products.data.data && Array.isArray(products.data.data)) {
            // let productClasses = await this.$store.dispatch('product-classes/fetchList', '&product_id='+ products.data.data[0].id)
        }
        let feed = this.feeds && this.feeds.find(f => f.id === parseInt(this.$route.params.id))
        if (feed) {
            this.feed   = feed
            this.resource = {
                id: feed.id,
                title: feed.title,
                message: feed.message,
                language: feed.language,
                image: feed.image,
                image_thumbnail: feed.image_thumbnail,
                product_id: feed.product_id,
                product_class_id: feed.product_class_id,
                target_url: feed.target_url,
                action: feed.action,
                start_at: feed.start_at.substring(0, 10),
                end_at: feed.end_at.substring(0, 10),
                is_active: feed.is_active
            }
        }
        // return feed
    },
    methods: {
        async validate() {
            const isValid       = await this.$refs.observer.validate()
            if (isValid && !this.isRequesting) {
                this.isRequesting   = true
                await this.submit()
            } else {
                console.log('invalid request')
                this.isRequesting   = false
            }
        },
        submit() {
            // console.error('resource', this.resource)
            if (this.resource.start_at) {
                // this.resource.start_at  += '00:00:00'
            }
            if (this.resource.end_at) {
                // this.resource.end_at  += '23:59:59'
            }

            if (this.$route.params.id) {
                return this.$store
                    .dispatch("news-feeds/update", this.resource)
                    .then(response => {
                        this.$router.push('/news-feeds')
                        this.$notify({type: 'success', timeout: 10000, message: 'News Feed information saved successfully!'})
                    }).catch( err => {
                        this.failed = err.response.data.message
                        this.$refs.observer.setErrors(err.response.data.errors)          
                    }).finally(() => {
                        this.isRequesting   = false
                    })
            } else {
                return this.$store
                    .dispatch("news-feeds/create", this.resource)
                    .then(response => {
                        this.$router.push('/news-feeds')
                        this.$notify({type: 'success', timeout: 10000, message: 'News Feed information saved successfully!'})
                    }).catch( err => {
                        this.failed = err.response.data.message
                        this.$refs.observer.setErrors(err.response.data.errors)          
                    }).finally(() => {
                        this.isRequesting   = false
                    })
            }
        },
        saveImage(f) {
            // need to send BASE64 string of file
            // since php can't handle file in PUT method
            console.error('image', f)
            this.resource.image = f
            // this.resource.image_thumbnail   = null
        },
        saveImageThumbnail(f) {
            // need to send BASE64 string of file
            // since php can't handle file in PUT method
            this.resource.image_thumbnail   = f
        }
    }
}
</script>
