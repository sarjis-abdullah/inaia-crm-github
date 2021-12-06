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
  </div>
</template>
<script>
export default {
    name: 'dropzone-file-upload',
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
        },
        startProcess: {
            type: Boolean,
            default: false
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
            dropzone: null
        }
    },
    computed: {
        selectedFileNames() {
            return this.storagePath + ( !this.multiple ? this.currentFile.upload.filename : this.files.map(f => f.upload.filename) );
        }
    },
    watch: {
        startProcess: {
            handler(value) {
                if (value) {
                    if (!this.autoStartUpload) {
                        setTimeout(() => this.dropzone.processFile(this.currentFile));
                    }
                }
            }
        }
    },
    async mounted() {
      this.initDropzone()
    },
    methods: {
        async initDropzone() {
            let Dropzone = await import('dropzone')
            Dropzone = Dropzone.default || Dropzone
            // Dropzone.options.myAwesomeDropzone = false
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
                // headers: {
                //     'Content-Type': 'application/octet-stream'
                // },
                acceptedFiles: 'image/*',
                accept(file, done) {
                    // self.$nuxt.$loading.start()
                    // setTimeout(() => self.$nuxt.$loading.finish(), 5000)

                    done()
                    self.files.push(file);
                    self.$emit('change', self.selectedFileNames);
                    // console.error('actual name:', file.name, '| new name:', file.upload.filename, '| files:', self.selectedFileNames);
                    self.resizeImg(file);
                    self.fetchS3UploadUrl(file)
                    .then(s3Url => {
                        self.uploadUrl  = s3Url;
                        if (self.autoStartUpload) {
                            setTimeout(() => self.dropzone.processFile(self.currentFile));
                        }
                    });
                },
                renameFile(file) {
                    return new Date().getTime() + '-' + file.name
                },
                // resize: function(file) {
                //     var resizeInfo = {
                //         srcX: 0,
                //         srcY: 0,
                //         trgX: 0,
                //         trgY: 0,
                //         srcWidth: file.width,
                //         srcHeight: file.height,
                //         trgWidth: this.options.thumbnailWidth,
                //         trgHeight: this.options.thumbnailHeight
                //     };

                //     return resizeInfo;
                // },
                sending(file, xhr) {
                    var _send = xhr.send;
                    xhr.send = function () {
                        _send.call(xhr, file);
                    };
                },
                init() {
                    // this.on("addedfile", function (file) {
                    //     if (!self.multiple && self.currentFile) {
                    //         // this.removeFile(this.currentFile);
                    //     }

                    //     // fetch('/s3-url?&name=' + file.name, {
                    //     //     method: 'get'
                    //     // }).then(function (response) {
                    //     //     return response.json();
                    //     // }).then(function (res) {
                    //     self.$axios.get('/s3-url?&name=profile/' + file.name)
                    //     .then(res => {
                    //         console.error('data', res.data)
                    //         // self.dropzone.options.url = res.data.data.s3UploadUrl;
                    //         file.uploadUrl  = res.data.data.s3Url;
                    //         file.additionalData = res.data.data.additionalData;
                    //         self.dropzone.processFile(file);
                    //         // self.files.push(file)
                    //         // self.$emit('change', self.files);
                    //     });
                        
                    //     self.currentFile = file;
                    // })

                    // this.on('sending', function (file, xhr, formData) {
                    //     xhr.timeout = 99999999;
                    //     for (var field in file.additionalData) {
                    //         formData.append(field, file.additionalData[field]);
                    //     }
                    //     console.log('sending', file.size)
                    // })

                    this.on('addedfile', origFile => {

                        if (self.currentFile) {
                            this.removeFile(self.currentFile);
                            self.files.pop()
                        }
                        self.currentFile    = origFile;

                        // self.resizeImg(origFile);
                    });

                    this.on('success', file => {
                        // Let the Laravel application know the file was uploaded successfully
                        // self.files.push(file);
                        self.$emit('upload-success', self.selectedFileNames);
                        // console.error('uploaded file', file);
                        // file.previewElement.querySelector("img").src    = file.dataURL;
                        // self.$notify({type: 'success', timeout: 4000, message: 'Profile picture saved successfully!'})
                    });

                    // this.on('maxfilesreached', file => {
                    //     // Let the Laravel application know the file was uploaded successfully
                    //     self.$notify({type: 'warning', timeout: 4000, message: 'Limit of file upload reached!'})
                    // });

                    // this.on('maxfilesexceeded', data => {
                    //     // console.error('file upload S3 error:', data)
                    //     self.$notify({type: 'error', timeout: 8000, message: 'Max size of file upload exceeded!'})
                    //     // self.$router.push('/profile')
                    // });

                    this.on('error', data => {
                        self.$emit('upload-failed');
                        // self.$notify({type: 'danger', timeout: 8000, message: 'Unfortunately profile picture upload failed! Please try again.'})
                        // self.$router.push('/profile')
                        console.error('file upload S3 error:', data)
                    });

                },
            }
            this.dropzone = new Dropzone(this.$el, finalOptions)
            preview.innerHTML = ''
            // let evtList = [
            //     'drop', 'dragstart', 'dragend', 'dragenter', 'dragover', 'addedfile',
            //     'removedfile', 'thumbnail', 'error', 'processing', 'uploadprogress',
            //     'sending', 'success', 'complete', 'canceled', 'maxfilesreached', 
            //     'maxfilesexceeded', 'processingmultiple', 'sendingmultiple', 'successmultiple', 
            //     'completemultiple', 'canceledmultiple', 'totaluploadprogress', 'reset', 'queuecomplete'
            // ]
            // evtList.forEach(evt => {
            //     this.dropzone.on(evt, (data) => {
            //         this.$emit(evt, data);

            //         if (evt === 'addedfile') {
            //             this.files.push(data)
            //             this.$emit('change', this.files);
            //         } else if (evt === 'removedfile') {
            //             let index = this.files.findIndex(f => f.upload.uuid === data.upload.uuid)
            //             if (index !== -1) {
            //                 this.files.splice(index, 1);
            //             }
            //             this.$emit('change', this.files);
            //         }
            //     })
            // })
            // this.dropzone.on('thumbnail', (file, thumb) => {
            //     console.error('thumbnail ready')
            //     this.currentFile = thumb; // dataURI
            // })
            this.dropzone.on('processing', file => {
                // console.error('setting upload url', this.uploadUrl)
                this.dropzone.options.url = this.uploadUrl;
            })
        },
        async fetchS3UploadUrl(file) {
            // self.$axios.get('/s3-url?&name=profile/' + file.name)
            return await this.$axios.get('/s3-url?name=' + this.storagePath + file.upload.filename)
            .then(res => {
                // console.error('fetched S3 url:', res.data.data);
                // file.uploadUrl  = res.data.data.s3UploadUrl;
                // this.uploadUrl  = res.data.data.s3UploadUrl;
                // file.additionalData = res.data.data.additionalData;
                // setTimeout(() => this.dropzone.processFile(file));
                // setTimeout(() => this.dropzone.processQueue(), 1000);
                return res.data.data.s3UploadUrl;
            })
        },
        resizeImg(origFile) {
            // resize
            var MAX_WIDTH  = this.dropzone.options.resizeWidth;
            var MAX_HEIGHT = this.dropzone.options.resizeHeight;

            var reader = new FileReader();

            // Convert file to img

            reader.addEventListener("load", event => {

                let origImg = new Image();
                origImg.src = event.target.result;

                origImg.addEventListener("load", event => {

                    let width  = event.target.width;
                    let height = event.target.height;

                    // Don't resize if it's small enough
                    if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
                        this.dropzone.enqueueFile(origFile);
                        return;
                    }

                    // Calc new dims otherwise
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    // Resize
                    let canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(origImg, 0, 0, width, height);

                    let resizedFile = this.base64ToFile(canvas.toDataURL(), origFile);

                    // Replace original with resized
                    let origFileIndex = this.dropzone.files.indexOf(origFile);
                    this.dropzone.files[origFileIndex] = resizedFile;


                    // Enqueue added file manually making it available for
                    // further processing by dropzone
                    // this.dropzone.enqueueFile(resizedFile);
                    // setTimeout(() => this.dropzone.processFile(resizedFile));

                    this.currentFile    = resizedFile;
                });
            });

            reader.readAsDataURL(origFile);
        },
        base64ToFile(dataURI, origFile) {
            let byteString, mimestring;

            if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
                byteString = atob(dataURI.split(',')[1]);
            } else {
                byteString = decodeURI(dataURI.split(',')[1]);
            }

            mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

            let content = new Array();
            for (let i = 0; i < byteString.length; i++) {
                content[i] = byteString.charCodeAt(i);
            }

            let newFile = new File(
                [new Uint8Array(content)], origFile.name, {type: mimestring}
            );


            // Copy props set by the dropzone in the original file

            [ 
                "upload", "status", "previewElement", "previewTemplate", "accepted"
            ].forEach((p, i) => {
                newFile[p] = origFile[p];
            });

            return newFile;
        }
    }
  }
</script>
<style>
/* @import url('dropzone/dist/dropzone.css'); */

.dropzone .dz-preview .dz-image-preview {
    text-align: center;
}
.dropzone .dz-preview .dz-image-preview .dz-preview-img {
  width: auto !important;
  height: auto !important;
}
</style>
