<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Default Tooltip
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Default Tooltip
          <vs-button class="ml-auto p-0" @click="defaulttooltip=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          To add a tooltip we have the component
          <code>vs-tooltip</code>
        </p>

        <ul class="list-group list-group-horizontal-lg mb-3">
          <li class="list-group-item rounded-0 py-2 d-flex align-items-center">
            <vs-tooltip text="Tooltip Default">
              <vs-switch v-model="switch1" />
            </vs-tooltip>
          </li>
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip Default">
              <vs-input-number v-model="number1" />
            </vs-tooltip>
          </li>
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip Default">
              <vs-button color="primary" type="border">Button</vs-button>
            </vs-tooltip>
          </li>
        </ul>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaulttooltip">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-tooltip text=&quot;Tooltip Default&quot;&gt;
            &lt;vs-switch v-model=&quot;switch1&quot;/&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip text=&quot;Tooltip Default&quot;&gt;
            &lt;vs-input-number v-model=&quot;number1&quot;/&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip text=&quot;Tooltip Default&quot;&gt;
            &lt;vs-button color=&quot;primary&quot; type=&quot;border&quot;&gt;Button&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data(){
            return {
            switch1:true,
            number1:10,
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
        Position Tooltip
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Position Tooltip
          <vs-button class="ml-auto p-0" @click="postooltip=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can change the position at which the tooltip appears with the property
          <code>position</code>
        </p>

        <ul class="list-group list-group-horizontal-lg mb-3">
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip position Left" position="left">
              <vs-button type="gradient">Left</vs-button>
            </vs-tooltip>
          </li>
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip position Top" position="top">
              <vs-button type="gradient">Top</vs-button>
            </vs-tooltip>
          </li>
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip position Bottom" position="bottom">
              <vs-button type="gradient">Bottom</vs-button>
            </vs-tooltip>
          </li>
          <li class="list-group-item rounded-0 py-2">
            <vs-tooltip text="Tooltip position Right" position="right">
              <vs-button type="gradient">Right</vs-button>
            </vs-tooltip>
          </li>
        </ul>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="postooltip">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-tooltip text=&quot;Tooltip position Left&quot; position=&quot;left&quot; &gt;
            &lt;vs-button type=&quot;gradient&quot;&gt;Left&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip text=&quot;Tooltip position Top&quot; position=&quot;top&quot; &gt;
            &lt;vs-button type=&quot;gradient&quot;&gt;Top&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip text=&quot;Tooltip position Bottom&quot; position=&quot;bottom&quot; &gt;
            &lt;vs-button type=&quot;gradient&quot;&gt;Bottom&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip text=&quot;Tooltip position Right&quot; position=&quot;right&quot; &gt;
            &lt;vs-button type=&quot;gradient&quot;&gt;Right&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;/div&gt;
            &lt;/template&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Color Tooltip
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Color Tooltip
          <vs-button class="ml-auto p-0" @click="colortooltip=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          To change the color of the tooltip, use the property
          <code>color</code>. You are able to use the Main Colors or RGB and HEX colors.
        </p>

        <div class="btn-alignment d-flex">
          <vs-tooltip text="Tooltip default delay">
            <vs-button type="gradient">Default Color</vs-button>
          </vs-tooltip>
          <vs-tooltip color="primary" text="Tooltip default delay">
            <vs-button type="border">Color primary</vs-button>
          </vs-tooltip>
          <vs-tooltip color="success" text="Tooltip default delay">
            <vs-button color="success" type="border">Color success</vs-button>
          </vs-tooltip>
          <vs-tooltip color="danger" text="Tooltip default delay">
            <vs-button color="danger" type="border">Color danger</vs-button>
          </vs-tooltip>
          <vs-tooltip color="warning" text="Tooltip default delay">
            <vs-button color="warning" type="border">Color warning</vs-button>
          </vs-tooltip>
          <vs-tooltip color="dark" text="Tooltip default delay">
            <vs-button color="dark" type="border">Color dark</vs-button>
          </vs-tooltip>
          <vs-tooltip color="rgb(42, 207, 133)" text="Tooltip default delay">
            <vs-button color="rgb(42, 207, 133)" type="border">Color RGB</vs-button>
          </vs-tooltip>
          <vs-tooltip color="#4a0d6b" text="Tooltip default delay">
            <vs-button color="#4a0d6b" type="border">Color HEX</vs-button>
          </vs-tooltip>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="colortooltip">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-tooltip text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button type=&quot;gradient&quot;&gt;Default Color&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;primary&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button type=&quot;border&quot;&gt;Color primary&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;success&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;success&quot; type=&quot;border&quot;&gt;Color success&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;danger&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;danger&quot; type=&quot;border&quot;&gt;Color danger&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;warning&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;warning&quot; type=&quot;border&quot;&gt;Color warning&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;dark&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;dark&quot; type=&quot;border&quot;&gt;Color dark&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;rgb(42, 207, 133)&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;rgb(42, 207, 133)&quot; type=&quot;border&quot;&gt;Color RGB&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;vs-tooltip color=&quot;#4a0d6b&quot; text=&quot;Tooltip default delay&quot;&gt;
            &lt;vs-button color=&quot;#4a0d6b&quot; type=&quot;border&quot;&gt;Color HEX&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;/div&gt;
            &lt;/template&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Title Tooltip
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Title Tooltip
          <vs-button class="ml-auto p-0" @click="titletooltip=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          If necessary, you can add a title to the tooltip with the property
          <code>title</code>
        </p>

        <div class="btn-alignment">
          <vs-tooltip
            title="Are you sure?"
            color="warning"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras scelerisque non neque sed aliquet."
          >
            <vs-button color="warning" type="flat">Title Tooltip</vs-button>
          </vs-tooltip>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="titletooltip">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-tooltip
            title=&quot;Are you sure?&quot;
            color=&quot;warning&quot;
            text=&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras scelerisque non neque sed aliquet.&quot;&gt;
            &lt;vs-button color=&quot;warning&quot; type=&quot;flat&quot;&gt;Title Tooltip&lt;/vs-button&gt;
            &lt;/vs-tooltip&gt;
            &lt;/div&gt;
            &lt;/template&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "tooltip",
  data: () => ({
    title: "Tooltip",
    defaulttooltip: false,
    switch1: true,
    number1: 10,
    postooltip: false,
    titletooltip: false,
    colortooltip: false
  })
};
</script>