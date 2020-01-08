<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Default Upload
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Default Upload
          <vs-button class="ml-auto p-0" @click="defaultupload=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can upload files to the server with the
          <code>vs-upload</code> component, the requested parameter is
          <code>action</code> which is the URL of the server
        </p>

        <div class>
          <vs-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            @on-success="successUpload"
          />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaultupload">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-upload action=&quot;https://jsonplaceholder.typicode.com/posts/&quot; @on-success=&quot;successUpload&quot; /&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            methods:{
            successUpload(){
            this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
            }
            }
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Multiple Upload
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Multiple Upload
          <vs-button class="ml-auto p-0" @click="multiupload=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can upload multiple files by adding the
          <code>multiple</code> property within the component.
        </p>

        <div class>
          <vs-upload
            multiple
            text="Upload Multiple"
            action="https://jsonplaceholder.typicode.com/posts/"
            @on-success="successUpload2"
          />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="multiupload">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-upload multiple text=&quot;Upload Multiple&quot; action=&quot;https://jsonplaceholder.typicode.com/posts/&quot; @on-success=&quot;successUpload&quot; /&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            methods:{
            successUpload(){
            this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
            }
            }
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Automatic Upload
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Automatic Upload
          <vs-button class="ml-auto p-0" @click="autoupload=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can enable automatic submission with the
          <code>Automatic</code> property that executes the shipment by changing the value of the
          <code>input</code>
        </p>

        <div class>
          <vs-upload
            automatic
            action="https://jsonplaceholder.typicode.com/posts/"
            @on-success="successUpload3"
          />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="autoupload">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-upload automatic action=&quot;https://jsonplaceholder.typicode.com/posts/&quot; @on-success=&quot;successUpload&quot; /&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            methods:{
            successUpload(){
            this.$vs.notify({color:'success',title:'Upload Success',text:'Lorem ipsum dolor sit amet, consectetur'})
            }
            }
            }
            &lt;/script&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "upload",
  data: () => ({
    title: "Upload",
    defaultupload: false,
    multiupload: false,
    autoupload: false
  }),
  methods: {
    successUpload() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Lorem ipsum dolor sit amet, consectetur"
      });
    },
    successUpload2() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Lorem ipsum dolor sit amet, consectetur"
      });
    },
    successUpload3() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Lorem ipsum dolor sit amet, consectetur"
      });
    }
  }
};
</script>