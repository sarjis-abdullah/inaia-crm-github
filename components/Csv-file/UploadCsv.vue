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
      <h5 class="modal-title">{{ $t("upload_csv_file") }}</h5>
      <span></span>
    </template>
    <div class="d-flex justify-content-center">
      <Upload
        class="upload-demo"
        drag
        ref="upload"
        :auto-upload="false"
        accept=".csv"
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
        <div class="el-upload__tip" slot="tip">CSV files</div>
      </Upload>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelUpload()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => submitUpload()"
        :disabled="isSubmitting || !file"
      >
        {{ $t("upload") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
import { Upload } from "element-ui";
export default {
  components: {
    Upload,
  },
  props: {
    showUploadDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isSubmitting: false,
      uploadUrl: process.env.golddinarApiUrl + "/orders/savings-plan/paid",
      file: null,
    };
  },
  methods: {
    cancelUpload() {
      this.showUploadDialog = false;
      this.$emit("canceled");
    },
    onChange(file, fileList) {
      this.file = file;
    },
    uploadFileRequest(file) {
      this.isSubmitting = true;
      //console.log(file);
      console.log(this.file);
      var formData = new FormData();
      formData.append("paid_orders", this.file.raw);
      this.$axios.post(this.uploadUrl,formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }}).then((res)=>{
      this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("csv_file_Uploaded_successfully"),
          });
          this.cancelUpload();
    }).catch(()=>{
      this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("csv_file_uploaded_unsuccessfully"),
          });
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