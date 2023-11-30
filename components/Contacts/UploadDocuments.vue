<template>
    <modal
      :show.sync="showUploadDialog"
      headerClasses=""
      bodyClasses="pt-0"
      footerClasses="border-top bg-secondary"
      @close="cancelUpload"
      :allowOutSideClose="false"
    >
      <template slot="header" class="pb-0">
        <h5 class="modal-title">{{ $t("upload_document") }}</h5>
        <span></span>
      </template>
      <div class="d-flex   flex-column justify-content-center align-items-center">
        <Input v-model="title" :placeholder="$t('document_title')" class="my-3"/>
        <div class="text-danger text-sm-left" v-if="title && title.length<5">{{ $t('title_must_be_at_least_five') }}</div>
        <Input v-model="description" :placeholder="$t('document_description')" class="my-3"/>
        <Upload
          class="upload-demo"
          drag
          ref="upload"
          :auto-upload="false"
          :on-remove="onRemove"
          :limit="3"
          :multiple="true"
          :http-request="uploadFileRequest"
          :disabled="isSubmitting"
          :on-change="onChange"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <div class="el-upload__tip" slot="tip">CSV,pdf,images files...</div>
        </Upload>
      </div>
      <template slot="footer">
        <base-button type="link" class="ml-auto" @click="cancelUpload()">
          {{ $t("cancel") }}
        </base-button>
        <base-button
          type="primary"
          @click="() => submitUpload()"
          :disabled="isSubmitting || files.length == 0 || !title || title.length<5 || !description"
        >
          {{ $t("upload") }}
        </base-button>
      </template>
    </modal>
  </template>
  <script>
  import { Upload,Input } from "element-ui";
import { apiErrorHandler } from '../../helpers/apiErrorHandler';
  export default {
    components: {
      Upload,
      Input
    },
    props: {
      showUploadDialog: {
        type: Boolean,
        default: false,
      },
      contactId:{
        type:Number,
        default:-1
      }
    },
    data() {
      return {
        isSubmitting: false,
        uploadUrl: process.env.productApiUrl + "/documents",
        files: [],
        title:'',
        description:''
      };
    },
    methods: {
      cancelUpload() {
        this.showUploadDialog = false;
        this.$emit("canceled");
      },
      onChange(file, fileList) {
        this.files.push(file);
      },
      onRemove(file,fileList){
        let index = this.files.findIndex(f=>f.name==file.name);
        if(index>-1){
            this.files.splice(index,1);
        }
      },
      uploadFileRequest(file) {
        this.isSubmitting = true;
        var formData = new FormData();
        formData.append("title", this.title);
        formData.append("type", 'customer_document');
        formData.append("contact_id", this.contactId);
        if(this.description){
            formData.append("description", this.description);
        }
        this.files.forEach(f=>{
            formData.append("document", f.raw);
        })
        
        this.$axios.post(this.uploadUrl,formData,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }}).then((res)=>{
        this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t("file_Uploaded_successfully"),
            });
            this.cancelUpload();
      }).catch((err)=>{
        apiErrorHandler(err,this.$notify);
      }).finally(()=>{
        this.isSubmitting = false;
      });
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
    },
  };
  </script>