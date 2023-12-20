<template>
  <modal :show.sync="showModal" headerClasses="" bodyClasses="pt-0" footerClasses="border-top bg-secondary"
    @close="cancelUpload" :allowOutSideClose="false">
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("verify_identity") }}</h5>
      <span></span>
    </template>
    <div class="d-flex   flex-column justify-content-center align-items-center">
      <div v-if="client">
        <div class="row">
          <div class="col">
            <label>{{ $t('firstname') }}</label>
            <Input v-model="firstname" />
          </div>
          <div class="col">
            <label>{{ $t('middlename') }}</label>
            <Input v-model="middlename" />
          </div>
          <div class="col">
            <label>{{ $t('lastname') }}</label>
            <Input v-model="lastname" />
          </div>
        </div>
        <div class="row mt-3">
          <div class="col">
            <label>{{ $t('birthdate') }}</label>
            <DatePicker v-model="birthdate" />
          </div>
          <div class="col">

          </div>
          <div class="col">

          </div>
        </div>
      </div>
      <Input v-model="title" :placeholder="$t('document_title')" class="my-3" />
      <div class="text-danger text-sm-left" v-if="title && title.length < 5">{{ $t('title_must_be_at_least_five') }}</div>
      <Input v-model="description" :placeholder="$t('document_description')" class="my-3" />
      <Upload class="upload-demo" drag ref="upload" :auto-upload="false" accept=".jpeg,.png,.pdf" :limit="3"
        :multiple="false" :http-request="uploadFileRequest" :disabled="isSubmitting" :on-change="onChange"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">jpeg, png or pdf files under 1 MB of size</div>

      </Upload>
      <div class="text-danger text-sm-left mt-2">{{ errorText }}</div>
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelUpload()">
        {{ $t("cancel") }}
      </base-button>
      <base-button type="primary" @click="() => submitUpload()" :disabled="isSubmitting">
        {{ $t("verify") }}
      </base-button>
    </template>
  </modal>
</template> 
<script>
import { Upload, Input, DatePicker } from "element-ui";
import { apiErrorHandler } from "../../helpers/apiErrorHandler";
import { functionUpdatePersonDataAndGetObject } from "../../helpers/customer";
import { formatDateToApiFormat } from "../../helpers/helpers";
export default ({
  components: {
    Upload,
    Input,
    DatePicker
  },
  props: {
    account_id: {
      default: -1,
      type: Number
    },
    showModal: {
      type: Boolean,
      default: false,
    },
    client: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      title: null,
      description: null,
      isSubmitting: false,
      file: null,
      errorText: null,
      firstname: null,
      middlename: null,
      lastname: null,
      birthdate: null
    }
  },
  watch: {
    client: {
      handler() {
        if (this.client && this.client.person_data) {
          
          this.lastname = this.client.person_data.surname
          this.firstname = this.client.name
          this.middlename = this.client.person_data.middlename;
          this.birthdate = new Date(this.client.person_data.birthdate)
        }
      },
      immediate: true,
    }
  },
  methods: {
    cancelUpload() {
      this.$emit('closed');
    },
    onChange(file, fileList) {
      const maxSize = 1048576
      if (file.size <= maxSize)
        this.file= file;
      else {
        this.errorText = this.$t('file_is_too_big')
      }
    },
    onRemove(file, fileList) {
      let index = this.file.findIndex(f => f.name == file.name);
      if (index > -1) {
        this.file.splice(index, 1);
      }
    },
    uploadFileRequest(file) {
      var formData = new FormData();
      if (this.file)
        formData.append("document", this.file.raw);
      if (this.title)
        formData.append("title", this.title);
      if (this.description)
        formData.append("description", this.description);
      const url = process.env.productApiUrl + `/contacts/${this.client.id}/verify`;
      this.$axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        this.$notify({
          type: "success",
          timeout: 5000,
          message: this.$t("client_verified_successfully"),
        });

        this.cancelUpload();
        location.reload();
      }).catch((err) => {
        apiErrorHandler(err, this.$notify);
      }).finally(() => {
        this.isSubmitting = false;
      });

    },
    submitUpload() {
      this.isSubmitting = true;
      let data = functionUpdatePersonDataAndGetObject(this.client,this.lastname, this.middlename, this.firstname, formatDateToApiFormat(this.birthdate));
      this.$store
        .dispatch("clients/submitClient", data)
        .then((response) => {
          if(this.file){
            this.$refs.upload.submit();
          }
          else{
            const url = process.env.productApiUrl + `/contacts/${this.client.id}/verify`;
            var formData = new FormData();
          this.$axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((res) => {
            this.$notify({
              type: "success",
              timeout: 5000,
              message: this.$t("client_verified_successfully"),
            });

            this.cancelUpload();
            location.reload();
          }).catch((err) => {
            apiErrorHandler(err, this.$notify);
          }).finally(() => {
            this.isSubmitting = false;
          });
          }
          

        })
        .catch((err) => {

          this.isSubmitting = false;
          apiErrorHandler(err, this.$notify);
        })
        .finally(() => {

        });
    },
  }
})
</script>
