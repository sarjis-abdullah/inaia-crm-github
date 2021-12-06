<template>
  <div>
    <div class="row">
        <div class="col-md-2">
        </div>
        <div class="col-md-8">
            <dropzone-cropper
                v-model="profilePic"
                storage-path="profile/"
                :multiple="false"
                :auto-start-upload="false"
                @file-selected="fileSelected"
                @upload-process-started="uploadProcessStarted"
                @process-canceled="processCanceled"
                @upload-success="uploadSuccess"
                @upload-failed="uploadFailed"
            />
        </div>
        <div class="col-md-2">
        </div>
    </div>
  </div>
</template>

<script>
import DropzoneCropper from '@/components/common/DropzoneCropper'

export default {
    components: {
        DropzoneCropper
    },

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        clicked: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            profilePic: null,
        };
    },

    beforeDestroy() {
        this.processCanceled();
    },

    methods: {
        fileSelected(file) {
            this.$emit('file-selected', file);
        },
        uploadSuccess(fileName) {
            this.$emit('change', fileName);
            // this.customer.avatar    = fileName;
            // this.submitClient(this.updatedClientData);
        },

        uploadProcessStarted(fileName) {
            this.$emit('upload-process-started', fileName);
        },

        processCanceled() {
            this.$emit('change', null);
        },

        uploadFailed() {
            this.$notify({type: 'danger', timeout: 8000, message: 'Unfortunately profile picture upload failed! Please try again.'});
        },
    }
};
</script>
