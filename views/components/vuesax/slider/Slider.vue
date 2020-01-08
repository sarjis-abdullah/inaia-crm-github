<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Default Slider
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Default Slider
          <vs-button class="ml-auto p-0" @click="defaultslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          To implement a Slider we have the
          <code>vs-slider</code> component.
        </p>

        <div class>
          <vs-slider v-model="value1" />
          <vs-slider disabled="true" v-model="value2" />
          <vs-slider max="200" v-model="value3" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaultslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-slider v-model=&quot;value1&quot;/&gt;
            &lt;vs-slider disabled=&quot;true&quot; v-model=&quot;value2&quot;/&gt;
            &lt;vs-slider max=200 v-model=&quot;value3&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Slider COlor
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Slider COlor
          <vs-button class="ml-auto p-0" @click="colorslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can change the slider's color with the property
          <code>color</code>. You can also add the main colors like:
          <code>primary, success,danger, warning,dark</code>.
        </p>

        <div class>
          <input type="color" v-model="colorx" name />
          <vs-slider :color="colorx" v-model="value4" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="colorslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;input type=&quot;color&quot; v-model=&quot;colorx&quot; name=&quot;&quot; &gt;
            &lt;vs-slider :color=&quot;colorx&quot; v-model=&quot;value4&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Slider Ticks
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Slider Ticks
          <vs-button class="ml-auto p-0" @click="tickslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p
          class="card-subtitle"
        >With Ticks you can allow the user to select a value inside a range of allowed values. With the property step you can change the distance between each Tick. If you want decimal steps, just set the property step-decimals to true.</p>

        <div class>
          <vs-slider step="10" v-model="tick1" />
          <vs-slider ticks step="25" v-model="tick2" />
          <vs-slider ticks step="0.5" :step-decimals="true" v-model="tick3" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="tickslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-slider step=10 v-model=&quot;tick1&quot;/&gt;
            &lt;vs-slider ticks step=25 v-model=&quot;tick2&quot;/&gt;
            &lt;vs-slider ticks step=0.5 :step-decimals=&quot;true&quot; v-model=&quot;tick3&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Range Slider
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Range Slider
          <vs-button class="ml-auto p-0" @click="rangeslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          With Range you can allow the user to select a range inside a range of allowed values. You can use the v-model property with Array and a minimum and maximum value as:
          <code>[min, max]</code>
        </p>

        <div class>
          <vs-slider step="10" v-model="range1" />
          <vs-slider ticks step="25" v-model="range2" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="rangeslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-slider step=10 v-model=&quot;range1&quot;/&gt;
            &lt;vs-slider ticks step=25 v-model=&quot;range2&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Icons Slider
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Icons Slider
          <vs-button class="ml-auto p-0" @click="iconslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can add an
          <code>icon</code> with the icon property to better representation the sliders to the user.
        </p>

        <div class>
          <vs-slider icon="volume_up" max="10" v-model="icon1" />
          <vs-slider icon="group_add" ticks step="25" v-model="icon2" />
          <vs-slider icon="star" ticks max="5" v-model="icon3" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="iconslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-slider icon=&quot;volume_up&quot; max=10 v-model=&quot;icon1&quot;/&gt;
            &lt;vs-slider icon=&quot;group_add&quot; ticks step=25 v-model=&quot;icon2&quot;/&gt;
            &lt;vs-slider icon=&quot;star&quot; ticks max=5 v-model=&quot;icon3&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Text Fixed Slider
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Text Fixed Slider
          <vs-button class="ml-auto p-0" @click="textslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          Determine the text that will be fixed next to the value with the property
          <code>text-fixed</code>
        </p>

        <div class>
          <vs-slider color="success" text-fixed="%" v-model="text1" />
          <vs-slider color="danger" text-fixed="Min" ticks step="25" v-model="text2" />
          <vs-slider color="dark" text-fixed="K" ticks max="5" v-model="text3" />
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="textslider">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-slider color=&quot;success&quot; text-fixed=% v-model=&quot;text1&quot;/&gt;
            &lt;vs-slider color=&quot;danger&quot; text-fixed=Min ticks step=25 v-model=&quot;text2&quot;/&gt;
            &lt;vs-slider color=&quot;dark&quot; text-fixed=K ticks max=5 v-model=&quot;text3&quot;/&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Change Method
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Change Method
          <vs-button class="ml-auto p-0" @click="methodslider=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can add a function that will be triggered every time the value changes with
          <code>@change="MyFunction"</code>
        </p>

        <div class>
          <vs-slider :min="50" @change="cambio" color="rgb(45, 208, 129)" v-model="method1" />
          <div :style="{'width':widthx+'px','height':heightx+'px'}" class="cuadrox">{{value1}}</div>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="methodslider">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;centerx&quot;&gt;
            &lt;vs-slider :min=&quot;50&quot; @change=&quot;cambio&quot; color=&quot;rgb(45, 208, 129)&quot; v-model=&quot;value1&quot;/&gt;
            &lt;div :style=&quot;{'width':widthx+'px','height':heightx+'px'}&quot; class=&quot;cuadrox&quot;&gt;
            {{value1}}
            &lt;/div&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data(){
            return {
            value1:55,
            widthx:55,
            heightx:55
            }
            },
            methods:{
            cambio(value){
            this.widthx = value
            this.heightx = value
            }
            }
            }
            &lt;/script&gt;
            &lt;style lang=&quot;css&quot;&gt;
            .cuadrox {
            padding: 10px;
            background: rgb(45, 208, 129);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgb(255, 255, 255);
            font-size: 20px;
            border-radius: 10px;
            }
            &lt;/style&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "slider",
  data: () => ({
    title: "Slider",
    defaultslider: false,
    value1: 67,
    value2: 34,
    value3: 60,
    colorslider: false,
    colorx: "#db7d12",
    value4: 24,
    tickslider: false,
    tick1: 34,
    tick2: 59,
    tick3: 78,
    rangeslider: false,
    range1: [60, 90],
    range2: [30, 40],
    iconslider: false,
    icon1: 2,
    icon2: 25,
    icon3: [2, 4],
    textslider: false,
    text1: 6,
    text2: 25,
    text3: [2, 4],
    methodslider: false,
    method1: 55,
    widthx: 55,
    heightx: 55
  }),
  methods: {
    cambio(value) {
      this.widthx = value;
      this.heightx = value;
    }
  }
};
</script>

<style lang="scss">
.cuadrox {
  padding: 10px;
  background: rgb(45, 208, 129);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  font-size: 20px;
  border-radius: 10px;
}
</style>

