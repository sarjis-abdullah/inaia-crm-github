import DropzoneCropper from '@/components/common/DropzoneCropper'
import ToggleModalMixin from '~/mixins/ToggleModalMixin'

export default {
    mixins: [
        ToggleModalMixin
    ],

    components: {
        DropzoneCropper,
    },

    model: {
        prop: 'value',
        event: 'change'
    },

    props: {
        modalTitle: {
            type: String,
            default: 'Select your avatar'
        },
        finalWidth: {
            type: Number,
            default: 250
        },
        finalHeight: {
            type: Number,
            default: 250
        }
    },

    data() {
        return {
            photo: ''
        }
    },

    beforeDestroy() {
        this.uploadCanceled();
    },

    methods: {
        fileSelected(file) {
            // this.$emit('change', file);
        },

        uploadProcessStarted(fileName) {
            if (fileName) {
                this.$emit('processing');
            } else {
                console.error('No file selected');
            }
        },

        uploadCanceled() {
            this.$emit('cancled');
            this.show   = false
            // this.$emit('change', null);
        },

        uploadSuccess(fileName) {
            this.$emit('change', fileName);
            this.show   = false
        },


        uploadFailed() {
            this.$emit('failed');
            this.show   = false
            // this.$notify({type: 'danger', timeout: 6000, message: 'Uploading depot avatar failed! Please try again.'});
        }
    }
    
}
