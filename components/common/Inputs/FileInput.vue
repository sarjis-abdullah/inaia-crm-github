<template>
  <div>
    <input 
      type="file"
      accept="image/*"
      lang="en"
      @change="fileChange($event)"
    />
    <div class="input-group my-3" v-if="showPreview">
      <img :src="preview" ref="imagePreview" class="img-thumbnail" />
    </div>
  </div>
</template>
<script>
  export default {
    name: 'file-input',
    inheritAttrs: false,
    props: {
      preview: {
        type: String,
        default: null
      },
      type: {
        type: String,
        default: 'file'
      }
    },
    data: () => ({
        selected: null,
    }),
    computed: {
        showPreview() {
            return this.selected || this.preview
        }
    },
    methods: {
      fileChange(evt) {
        let that = this
        let reader  = new FileReader()
        this.selected   = evt.target.files[0]
        reader.onload = function(ev) {
            that.$refs.imagePreview.src = ev.target.result
            that.$emit('change', that.type === 'file' ? evt.target.files[0] : ev.target.result)
        }
        reader.readAsDataURL(evt.target.files[0])
      }
    }
  }
</script>
<style>
</style>
