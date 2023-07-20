<template>
     <modal
    :show.sync="showModal"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelUpload"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("verify_identity") }}</h5>
      <span></span>
    </template>
    <div class="d-flex   flex-column justify-content-center align-items-center">
        <Input v-model="title" :placeholder="$t('title')" class="my-3"/>
        <div class="text-danger text-sm-left" v-if="title && title.length<5">{{ $t('title_must_be_at_least_five') }}</div>
        <Input v-model="description" :placeholder="$t('description')" class="my-3"/>
      <Upload
        class="upload-demo"
        drag
        ref="upload"
        :auto-upload="false"
        accept=".jpeg,.png,.pdf"
        :limit="1"
        :multiple="false"
        :http-request="uploadFileRequest"
        :disabled="isSubmitting"
        :on-change="onChange"
        
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">jpeg, png or pdf files under 4 MB of size</div>
        
      </Upload>
      <div class="text-danger text-sm-left mt-2">{{ errorText }}</div>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelUpload()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => submitUpload()"
        :disabled="isSubmitting || !title || !description || title.length<5" 
      >
        {{ $t("verify") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { Upload, Input } from "element-ui";
export default ({
    components: {
        Upload,
        Input
    },
    props:{
        account_id:{
            default: -1,
            type: Number
        },
        showModal: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        return{
            title:null,
            description:null,
            isSubmitting: false,
            file: null,
            errorText:null
        }
    },
    methods:{
        cancelUpload(){
            this.$emit('closed');
        },
        onChange(file, fileList) {
            const maxSize = 4194304
            if(file.size<= maxSize)
                this.file = file;
                else{
                    this.errorText = this.$t('file_is_too_big')
                }
        },
        uploadFileRequest(file) {
            this.isSubmitting = true;
            var formData = new FormData();
            formData.append("document", this.file.raw);
            formData.append("title", this.title);
            formData.append("description", this.title);
            const url = process.env.productApiUrl+`/contacts/${this.account_id}/verify`;
            this.$axios.post(url,formData,{
            headers: {
            'Content-Type': 'multipart/form-data'
            }}).then((res)=>{
                this.$notify({
                        type: "success",
                        timeout: 5000,
                        message: this.$t("client_verified_successfully"),
                    });
                    
                this.cancelUpload();
                location.reload();
            }).catch(()=>{
            this.$notify({
                    type: "danger",
                    timeout: 5000,
                    message: this.$t("client_verified_unsuccessfully"),
                });
            }).finally(()=>{
            this.isSubmitting = false;
        });
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    }
})
</script>
