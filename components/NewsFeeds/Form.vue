<template>
    <div>

        <base-header class="pb-6">
            <div class="row align-items-center py-4">
                <div class="col-lg-6 col-7">
                    <h6 class="h2 text-white d-inline-block mb-0">{{ $route.params.id ? $t('edit') : $t('add') }} {{ $t('news_feed') }}</h6>
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
                                    :label="$t('title')"
                                    name="Title"
                                    v-model="resource.title"
                                    :placeholder="$t('title')"
                                    rules="required"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                :label="$t('locale')"
                                    name="Language"
                                >
                                    <el-select v-model="resource.language" :placeholder="$t('select_language')">
                                        <el-option v-for="(i, idx) in locales" :key="idx" :value="i.value" :label="$t(i.text)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                    :label="$t('start_at')"
                                    name="Start at"
                                    v-model="resource.start_at"
                                    :placeholder="$t('start_at')"
                                    rules="required"
                                    type="date"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                    :label="$t('end_at')"
                                    name="End at"
                                    v-model="resource.end_at"
                                    :placeholder="$t('end_at')"
                                    rules="required"
                                    type="date"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                :label="$t('product')"
                                    name="Product"
                                >
                                    <el-select v-model="resource.product_id" :placeholder="$t('select_product')">
                                        <el-option v-for="(i, idx) in products" :key="idx" :value="i.id" :label="$t(i.name_translation_key)" />
                                    </el-select>
                                </base-input>
                            </div>
                            <div class="col-md-6">
                                <base-input
                                :label="$t('plans')"
                                    name="Plans"
                                >
                                    <el-select v-model="resource.plan_id" :placeholder="$t('select_plan')">
                                        <el-option v-for="(i, idx) in plans" :key="idx" :value="i.id" :label="$t(i.name)" />
                                    </el-select>
                                </base-input>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <base-input
                                :label="$t('action')"
                                    name="Action"
                                    v-model="resource.action"
                                    :placeholder="$t('action')"
                                />
                            </div>
                            <div class="col-md-6">
                                <base-input
                                :label="$t('target_url')"
                                    name="Target URL"
                                    v-model="resource.target_url"
                                    :placeholder="$t('target_url')"
                                />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <el-input
                                :label="$t('message')"
                                    name="Message"
                                    type="textarea"
                                    v-model="resource.message"
                                    :placeholder="$t('message')"
                                    rules="required"
                                    :rows="3"
                                />
                            </div>
                            <div class="col-md-6">
                                <Checkbox v-model="resource.is_active" :value="resource.is_active==1">{{$t('is_active')}}?</Checkbox>
                            </div>
                        </div>
                       <div class="row mt-4" v-if="feed && (feed.image_thumbnail_url || feed.image_url)">
                            <div class="col-md-6">
                                <img :src="feed.image_thumbnail_url" alt="thumbnail" />
                            </div>
                            <div class="col-md-6">
                                <img :src="feed.image_url" alt="image" />
                            </div>
                       </div>
                            <div class="d-flex justify-content-center mt-4">
                                <Upload
                                    class="upload-demo mx-3"
                                    drag
                                    ref="imageUpload"
                                    :auto-upload="false"
                                    accept=".png,.jpeg,.jpg"
                                    :limit="1"
                                    :multiple="false"

                                    :disabled="isSubmitting"
                                    :on-change="saveImage"
                                >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                    {{ $t('drop_image_here') }} <em>{{ $t('click_to_upload') }}</em>
                                    </div>

                                </Upload>
                                <Upload
                                    class="upload-demo mx-3"
                                    drag
                                    ref="imageUpload"
                                    :auto-upload="false"
                                    accept=".png,.jpeg,.jpg"
                                    :limit="1"
                                    :multiple="false"

                                    :disabled="isSubmitting"
                                    :on-change="saveImageThumbnail"
                                >
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">
                                    {{ $t('drop_thumbnail_here') }} <em>{{ $t('click_to_upload') }}</em>
                                    </div>

                                </Upload>
                            </div>
                        <div class="row float-right">
                            <div class="pr-3">
                                <base-button type="secondary" native-type="button" @click="() => $router.push('/news-feeds')">{{ $t('cancel') }}</base-button>
                                <base-button type="primary" native-type="submit" :disabled="isRequesting">{{ $t('submit') }}</base-button>

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
import { Select, Option,Upload,Input,Checkbox } from 'element-ui'
import PhotoModal from '@/components/common/PhotoModal'
import FileInput from '@/components/common/Inputs/FileInput'

export default {
    components: {
        [Select.name]: Select,
        [Option.name]: Option,
        PhotoModal,
        FileInput,
        Upload,
        Input,
        Checkbox
    },
    computed: {
        ...mapGetters({
            feeds: "news-feeds/feeds",
            products: "products/list",
            plans: "plans/list"
        }),
    },
    data: () => ({
        resource: {
            title: '',
            message: '',
            language: null,
            start_at: null,
            end_at: null,
            product_id: null,
            plan_id: null,
            is_active: 0,
        },
        locales: [
            { text: 'Deutsch',  value: 'de' },
            { text: 'English',  value: 'en' }
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
    },
    async mounted() {
        let products = await this.$store.dispatch('products/fetchList', '')
        let plans = await this.$store.dispatch('plans/fetchList')
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
                plan_id: feed.plan_id,
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
            const reader = new FileReader();
                reader.onloadend = () => {
                    this.resource.image   = reader.result
                };
            reader.readAsDataURL(f.raw);
        },
        saveImageThumbnail(f) {
            // need to send BASE64 string of file
            // since php can't handle file in PUT method
            const reader = new FileReader();
                reader.onloadend = () => {
                    this.resource.image_thumbnail   = reader.result
                };
            reader.readAsDataURL(f.raw);

        }
    }
}
</script>
