<template>
  <modal
    :show.sync="showDownloadDialog"
    headerClasses=""
    bodyClasses="pt-0"
    footerClasses="border-top bg-secondary"
    @close="cancelDownload"
    :allowOutSideClose="false"
  >
    <template slot="header" class="pb-0">
      <h5 class="modal-title">{{ $t("download_csv_file") }}</h5>
      <span></span>
    </template>
    <div
      class="d-flex align-align-items-center justify-content-center"
      v-if="selectedOrderProcess"
    >
      {{ $t("download_csv_file_text") }}
    </div>
    <template slot="footer">
      <base-button type="link" class="ml-auto" @click="cancelDownload()">
        {{ $t("cancel") }}
      </base-button>
      <base-button
        type="primary"
        @click="() => downloadFile()"
        :disabled="isSubmitting"
      >
        {{ $t("download") }}
      </base-button>
    </template>
  </modal>
</template>
<script>
export default {
  props: {
    showDownloadDialog: {
      type: Boolean,
      default: false,
    },
    selectedOrderProcess: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isSubmitting: false,
    };
  },
  methods: {
    cancelDownload() {
      this.showDownloadDialog = false;
      this.selectedOrderProcess = null;
      this.$emit("canceled");
    },
    downloadFile() {
      this.isSubmitting = true;
      const data = {
          order_process_id:this.selectedOrderProcess.id,
      }
      this.$store
        .dispatch(
          "csv-file/downloadCsv",
          this.selectedOrderProcess.id
        )
        .then(() => {
          this.$notify({
            type: "success",
            timeout: 5000,
            message: this.$t("csv_file_downloaded_successfully"),
          });
          this.cancelDownload();
          this.$emit("downloaded");
        })
        .catch(() => {
          this.$notify({
            type: "danger",
            timeout: 5000,
            message: this.$t("csv_file_downloaded_unsuccessfully"),
          });
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>