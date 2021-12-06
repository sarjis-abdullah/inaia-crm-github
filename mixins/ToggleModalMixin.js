export default {
    props: {
        clicked: {
            type: [Boolean, String],
            default: false
        }
    },

    data() {
        return {
            show: false,
        }
    },

    watch: {
        clicked: {
            handler() {
                if (this.clicked) {
                    this.show   = true
                }
            },
        },
        show: {
            handler() {
                if (!this.show) {
                    this.$emit('update:clicked', false)
                    // this.$emit('closing')
                }
            }
        }
    }
}