<template>
  <div class="dropzone mb-3 dz-clickable"
       :class="[multiple ? 'dropzone-multiple': 'dropzone-single']">
    <div class="fallback">
      <div class="custom-file">
        <input type="file"
               class="custom-file-input"
               id="projectCoverUploads"
               :multiple="multiple">
        <label class="custom-file-label" for="projectCoverUploads">Choose file</label>
      </div>
    </div>
    <div class="dz-preview dz-preview-single"
         v-if="!multiple"
         :class="previewClasses"
         ref="previewSingle">
      <div class="dz-preview-cover">
        <img class="dz-preview-img" data-dz-thumbnail>
      </div>
      <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
    </div>
    <ul v-else
        class="dz-preview dz-preview-multiple list-group list-group-lg list-group-flush"
        :class="previewClasses"
        ref="previewMultiple">
      <li class="list-group-item px-0">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="avatar">
              <img class="avatar-img rounded" data-dz-thumbnail>
            </div>
          </div>
          <div class="col ml--3">
            <h4 class="mb-1" data-dz-name>...</h4>
            <p class="small text-muted mb-0" data-dz-size>...</p>
          </div>
          <div class="col-auto">
            <button data-dz-remove="true" class="btn btn-danger btn-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <modal :show.sync="showCanvas" :show-close="true" modal-classes="modal-secondary">
      <template #header>
        <h5 class="modal-title">Edit Photo</h5>
      </template>
        <div class="img-container mt-2">
          <img ref="cropCanvas" :src="canvasImgSrc" style="width: 95%; max-height: 400px;" />
        </div>
      <template #footer>
        <button type="button" class="btn btn-primary" @click.prevent.stop="processCropp">Apply & Upload</button>
        <button type="button" class="btn btn-link  ml-auto" @click.prevent.stop="processCanceled">Cancel</button>
      </template>
    </modal>
  </div>
</template>
<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default {
    name: 'dropzone-cropper',
    components: {
        Cropper,
    },
    props: {
        options: {
            type: Object,
            default: () => ({})
        },
        value: [String, Object, Array],
        url: {
            type: String,
            default: '/'
        },
        multiple: Boolean,
        previewClasses: [String, Object, Array],
        autoStartUpload: {
            type: Boolean,
            default: false
        },
        storagePath: {
            type: String,
            default: ''
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data() {
        return {
            uploadUrl: null,
            currentFile: null,
            files: [],
            showList: false,
            dropzone: null,
            canvasImgSrc: null,
            showCanvas: false,
            cropImg: null
        }
    },
    computed: {
        selectedFileNames() {
            return this.storagePath + ( !this.multiple ? this.currentFile.upload.filename : this.files.map(f => f.upload.filename) );
        }
    },
    async mounted() {
      this.cropImg  = null;
      this.initDropzone();
    },
    methods: {
        async initDropzone() {
            let Dropzone = await import('dropzone')
            Dropzone = Dropzone.default || Dropzone
            Dropzone.autoDiscover = false
            let preview = this.multiple ? this.$refs.previewMultiple : this.$refs.previewSingle;
            let self = this

            let finalOptions = {
                ...this.options,
                autoProcessQueue: false,
                autoQueue: false,
                method: 'put',
                // parallelUploads: 1,
                url: this.url,
                createImageThumbnails: true,
                thumbnailWidth: 250,
                thumbnailHeight: 200,
                thumbnailMethod: 'contain',
                maxThumbnailFilesize: 20,
                resizeWidth: 250,
                resizeHeight: 200,
                resizeQuality: 1.0,
                resizeMethod: 'contain',
                previewsContainer: preview,
                previewTemplate: preview.innerHTML,
                maxFiles: (!this.multiple) ? 1 : null,
                maxFilesize: 20,
                acceptedFiles: 'image/*',

                accept(file, done) {
                    done()
                    // self.files.push(file);
                    self.currentFile    = file;
                    // self.$emit('change', self.selectedFileNames);
                    // self.$emit('file-selected', file);
                    // console.error('actual name:', file.name, '| new name:', file.upload.filename, '| files:', self.selectedFileNames);
                    self.fetchS3UploadUrl(file)
                    .then(s3Url => {
                        self.uploadUrl  = s3Url;
                        if (self.autoStartUpload) {
                            setTimeout(() => self.dropzone.processFile(self.currentFile));
                        }
                    });

                    if (!self.autoStartUpload) {
                        self.showCanvas = true;
                        self.initCanvas();
                        setTimeout(() => self.cropImg.replace(URL.createObjectURL(file)))
                    } else {
                        // done()
                    }
                },
                renameFile(file) {
                    return new Date().getTime() + '-' + file.name
                },
                sending(file, xhr) {
                    var _send = xhr.send;
                    xhr.send = function () {
                        _send.call(xhr, file);
                    };
                },
                // transformFile(file, done) {  // Create the image editor overlay
                //     var editor = document.createElement('div');
                //     editor.style.position = 'fixed';
                //     editor.style.left = 0;
                //     editor.style.right = 0;
                //     editor.style.top = 0;
                //     editor.style.bottom = 0;
                //     editor.style.zIndex = 9999;
                //     editor.style.backgroundColor = '#000';
                //     document.body.appendChild(editor);  // Create confirm button at the top left of the viewport
                //     var buttonConfirm = document.createElement('button');
                //     buttonConfirm.style.position = 'absolute';
                //     buttonConfirm.style.left = '10px';
                //     buttonConfirm.style.top = '10px';
                //     buttonConfirm.style.zIndex = 9999;
                //     buttonConfirm.textContent = 'Confirm';
                //     editor.appendChild(buttonConfirm);
                //     let myDropZone  = self.dropzone;
                //     buttonConfirm.addEventListener('click', function() {    // Remove the editor from the view
                //         // document.body.removeChild(editor);
                //         // Get the canvas with image data from Cropper.js
                //         var canvas = cropper.getCroppedCanvas({
                //             width: 256,
                //             height: 256
                //         });
                //         // Turn the canvas into a Blob (file object without a name)
                //         canvas.toBlob(function(blob) {
                //             // Create a new Dropzone file thumbnail
                //             myDropZone.createThumbnail(
                //                 blob,
                //                 myDropZone.options.thumbnailWidth,
                //                 myDropZone.options.thumbnailHeight,
                //                 myDropZone.options.thumbnailMethod,
                //                 false, 
                //                 function(dataURL) {
                                
                //                     // Update the Dropzone file thumbnail
                //                     myDropZone.emit('thumbnail', file, dataURL); // Return the file to Dropzone
                //                     done(blob);      
                //                 }
                //             );
                //         });
                //         // Remove the editor from the view
                //         document.body.removeChild(editor);                        
                //     });
                //     // Create an image node for Cropper.js
                //     var image = new Image();
                //     image.src = URL.createObjectURL(file);
                //     editor.appendChild(image);
                    
                //     // Create Cropper.js
                //     var cropper = new Cropper(image, { aspectRatio: 1 });
                // },                
                init() {
                    this.on('addedfile', origFile => {

                        if (self.currentFile) {
                            this.removeFile(self.currentFile);
                            self.files.pop()
                        }
                        self.currentFile    = origFile;

                        // self.resizeImg(origFile);
                    });

                    this.on('success', file => {
                        self.$emit('upload-success', self.selectedFileNames);
                        self.showCanvas = false;
                        setTimeout(() => {
                            // self.dropzone.removeAllFiles();
                            self.cropImg.destroy();
                        })
                    });

                    this.on('error', data => {
                        self.$emit('upload-failed');
                        // self.$notify({type: 'danger', timeout: 8000, message: 'Unfortunately profile picture upload failed! Please try again.'})
                        // self.$router.push('/profile')
                        console.error('file upload error')
                    });

                },
            }
            this.dropzone = new Dropzone(this.$el, finalOptions)
            preview.innerHTML = ''
            this.dropzone.on('processing', file => {
                this.dropzone.options.url = this.uploadUrl;
            })
        },

        initCanvas() {
            // var width   = window.innerWidth
            //             || document.documentElement.clientWidth
            //             || document.body.clientWidth;

            // var height  = window.innerHeight
            //             || document.documentElement.clientHeight
            //             || document.body.clientHeight;

            this.cropImg = new Cropper(this.$refs.cropCanvas, {
                initialAspectRatio: 1,
                aspectRatio: 1,
                cropBoxResizable: true,
                cropBoxMovable: true,
                dragMode: 'move',
                zoomable: true,
                viewMode: 1,
                autoCropArea: 0.6,
                maxCanvasWidth: 500,
                maxCanvasHeight: 500,
                minCropBoxWidth: 100,
                minCropBoxHeight: 100,
                // data: {
                //     width: 200,
                //     height: 200
                // }
            });
        },
        processCanceled() {
            this.$emit('process-canceled');
            this.dropzone.removeAllFiles();
            this.cropImg.destroy();
            this.showCanvas = false;
        },
        processCropp() {
            if (!this.cropImg.getData()) {
                return false;
            }
            this.$emit('upload-process-started', this.selectedFileNames);
            let croppedCanvas   = this.cropImg.getCroppedCanvas({
                width: 250,
                height: 250
            });
            let self            = this;
            croppedCanvas.toBlob(blob => {
                [ 
                    "name", "upload", "status", "previewElement", "previewTemplate", "accepted"
                ].forEach((p, i) => {
                    blob[p] = self.currentFile[p];
                });
                self.dropzone.removeAllFiles()
                // self.files.pop();
                // self.files.push(blob);
                // self.currentFile    = blob;
                setTimeout(() => self.dropzone.processFile(blob))
            })
            // this.dropzone.processFile(this.cropImg.getCroppedCanvas())
        },
        async fetchS3UploadUrl(file) {
            return await this.$axios.get('/s3-url?name=' + this.storagePath + file.upload.filename)
            .then(res => {
                return res.data.data.s3UploadUrl;
            })
        }
    }
  }
</script>
<style scoped>
.dropzone .dz-preview .dz-image-preview {
    text-align: center;
}
.dropzone .dz-preview .dz-image-preview .dz-preview-img {
  width: auto !important;
  height: auto !important;
}
</style>
