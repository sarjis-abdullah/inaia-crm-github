<template>
    <modal
        :show.sync="show"
        :show-close="true"
        body-classes="p-0 "
        modal-classes="modal-dialog-centered modal-sm"
    >
        <template #header>
            <h6 class="modal-title">{{ modalTitle }}</h6>
        </template>
        <div class="row">
            <div class="col-md-2">
            </div>
            <div class="col-md-8">
                <dropzone-cropper
                    v-model="photo"
                    storage-path="profile/"
                    :multiple="false"
                    :auto-start-upload="false"
                    :final-width="finalWidth"
                    :final-height="finalHeight"
                    @file-selected="fileSelected"
                    @upload-process-started="uploadProcessStarted"
                    @process-canceled="uploadCanceled"
                    @upload-success="uploadSuccess"
                    @upload-failed="uploadFailed"
                />
            </div>
            <div class="col-md-2">
            </div>
        </div>
    </modal>
</template>

<script>
import PhotoModalMixin from '~/mixins/PhotoModalMixin'

export default {
    mixins: [PhotoModalMixin]
}
</script>