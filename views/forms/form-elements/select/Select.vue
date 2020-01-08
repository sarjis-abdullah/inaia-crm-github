<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
		/////////////////
		Single Selection
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Single Selection
          <vs-button class="ml-auto p-0" @click="defaultsel=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          To add a select to the application we have the component
          <code>vs-select</code>. You can customize the arrow icon by passing an icon name to icon.
        </p>
        <vs-row>
          <vs-col vs-lg="4" vs-xs="12" class="mb-2">
            <vs-select class="selectExample" label="Figuras" v-model="select1">
              <vs-select-item
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options1"
                :key="index"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="4" vs-xs="12">
            <vs-select class="selectExample" label="Figuras" v-model="select2">
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options2"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="4" vs-xs="12">
            <vs-select disabled class="selectExample" label="Figuras" v-model="select3">
              <vs-select-item
                :key="index"
                :disabled="index==2"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options3"
              />
            </vs-select>
          </vs-col>
          <vs-col vs-lg="4" vs-xs="12">
            <vs-select
              class="selectExample"
              label="Figuras"
              v-model="select4"
              icon="arrow_downward"
            >
              <vs-select-item
                :key="index"
                :value="item.value"
                :text="item.text"
                v-for="(item,index) in options4"
              />
            </vs-select>
          </vs-col>
        </vs-row>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaultsel">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;con-select-example&quot;&gt;
            &lt;vs-select
            class=&quot;selectExample&quot;
            label=&quot;Figuras&quot;
            v-model=&quot;select1&quot;
            &gt;
            &lt;vs-select-item :key=&quot;index&quot; :value=&quot;item.value&quot; :text=&quot;item.text&quot; v-for=&quot;item,index in options1&quot; /&gt;
            &lt;/vs-select&gt;
            &lt;vs-select
            class=&quot;selectExample&quot;
            label=&quot;Figuras&quot;
            v-model=&quot;select2&quot;
            &gt;
            &lt;vs-select-item :key=&quot;index&quot; :value=&quot;item.value&quot; :text=&quot;item.text&quot; v-for=&quot;item,index in options2&quot; /&gt;
            &lt;/vs-select&gt;
            &lt;vs-select
            disabled
            class=&quot;selectExample&quot;
            label=&quot;Figuras&quot;
            v-model=&quot;select3&quot;
            &gt;
            &lt;vs-select-item :key=&quot;index&quot; :disabled=&quot;index==2&quot; :value=&quot;item.value&quot; :text=&quot;item.text&quot; v-for=&quot;item,index in options3&quot; /&gt;
            &lt;/vs-select&gt;
            &lt;vs-select
            class=&quot;selectExample&quot;
            label=&quot;Figuras&quot;
            v-model=&quot;select4&quot;
            icon=&quot;arrow_downward&quot;
            &gt;
            &lt;vs-select-item :key=&quot;index&quot; :value=&quot;item.value&quot; :text=&quot;item.text&quot; v-for=&quot;item,index in options4&quot; /&gt;
            &lt;/vs-select&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            data(){
            return {
            select1Normal:'',
            select1:2,
            select2:7,
            select3:2,
            select4:5,
            options1:[
            {text:'IT',value:0},
            {text:'Blade Runner',value:2},
            {text:'Thor Ragnarok',value:3},
            ],
            options2:[
            {text: 'Square', value: 1},
            {text: 'Rectangle', value: 2},
            {text: 'Rombo', value: 3},
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
            {text: 'Regular polygon', value: 8},
            {text: 'Circumference', value: 9},
            {text: 'Circle', value: 10},
            {text: 'Circular sector', value: 11},
            {text: 'Circular trapeze', value: 12},
            ],
            options3:[
            {text: 'Red', value: 1},
            {text: 'Green', value: 2},
            {text: 'Blue', value: 3},
            {text: 'Purple', value: 4},
            ],
            options4:[
            {text: 'Square', value: 1},
            {text: 'Rectangle', value: 2},
            {text: 'Rombo', value: 3},
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
            ],
            }
            },
            methods:{
            prueba(){
            console.log(&quot;prueba de focsu&quot;);
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
		Color Selection
		/////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          Color Selection
          <vs-button class="ml-auto p-0" @click="colorsel=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can change the color of the select with the property
          <code>color</code>
        </p>

        <div class="d-flex align-items-center">
          <input v-model="colorx" type="color" name value />
          <vs-select :color="colorx" class="selectExample ml-3" label="Figuras" v-model="select5">
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in options5"
            />
          </vs-select>
        </div>

        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="colorsel">
          <vs-prism>
            &lt;template lang=&quot;html&quot;&gt;
            &lt;div class=&quot;con-select-example&quot;&gt;
            &lt;input v-model=&quot;colorx&quot; type=&quot;color&quot; name=&quot;&quot; value=&quot;&quot;&gt;
            &lt;vs-select
            :color=&quot;colorx&quot;
            class=&quot;selectExample&quot;
            label=&quot;Figuras&quot;
            v-model=&quot;select1&quot;
            &gt;
            &lt;vs-select-item :key=&quot;index&quot; :value=&quot;item.value&quot; :text=&quot;item.text&quot; v-for=&quot;(item,index) in options1&quot; /&gt;
            &lt;/vs-select&gt;
            &lt;/div&gt;
            &lt;/template&gt;
            &lt;script&gt;
            export default {
            name:'',
            data(){
            return {
            colorx:'#103767',
            select1:3,
            select2:'primary',
            options1:[
            {text: 'Square', value: 1},
            {text: 'Rectangle', value: 2},
            {text: 'Rombo', value: 3},
            {text: 'Romboid', value: 4},
            {text: 'Trapeze', value: 5},
            {text: 'Triangle', value: 6},
            {text: 'Polygon', value: 7},
            {text: 'Regular polygon', value: 8},
            {text: 'Circumference', value: 9},
            {text: 'Circle', value: 10},
            {text: 'Circular sector', value: 11},
            {text: 'Circular trapeze', value: 12},
            ],
            options2:[
            {text: 'Primary', value: 'primary'},
            {text: 'Success', value: 'success'},
            {text: 'Danger', value: 'danger'},
            {text: 'Warning', value: 'warning'},
            {text: 'Dark', value: 'dark'},
            ],
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
		Autocomplete Selection
		/////////////////
      -->
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "select",
  data: () => ({
    title: "Select",
    defaultsel: false,
    select1Normal: "",
    select1: 2,
    select2: 7,
    select3: 2,
    select4: 5,
    select5: 2,
    colorx: "#103767",
    options1: [
      { text: "IT", value: 0 },
      { text: "Blade Runner", value: 2 },
      { text: "Thor Ragnarok", value: 3 }
    ],
    options2: [
      { text: "Square", value: 1 },
      { text: "Rectangle", value: 2 },
      { text: "Rombo", value: 3 },
      { text: "Romboid", value: 4 },
      { text: "Trapeze", value: 5 },
      { text: "Triangle", value: 6 },
      { text: "Polygon", value: 7 },
      { text: "Regular polygon", value: 8 },
      { text: "Circumference", value: 9 },
      { text: "Circle", value: 10 },
      { text: "Circular sector", value: 11 },
      { text: "Circular trapeze", value: 12 }
    ],
    options3: [
      { text: "Red", value: 1 },
      { text: "Green", value: 2 },
      { text: "Blue", value: 3 },
      { text: "Purple", value: 4 }
    ],
    options4: [
      { text: "Square", value: 1 },
      { text: "Rectangle", value: 2 },
      { text: "Rombo", value: 3 },
      { text: "Romboid", value: 4 },
      { text: "Trapeze", value: 5 },
      { text: "Triangle", value: 6 },
      { text: "Polygon", value: 7 }
    ],
    options5: [
      { text: "Square", value: 1 },
      { text: "Rectangle", value: 2 },
      { text: "Rombo", value: 3 },
      { text: "Romboid", value: 4 },
      { text: "Trapeze", value: 5 },
      { text: "Triangle", value: 6 },
      { text: "Polygon", value: 7 },
      { text: "Regular polygon", value: 8 },
      { text: "Circumference", value: 9 },
      { text: "Circle", value: 10 },
      { text: "Circular sector", value: 11 },
      { text: "Circular trapeze", value: 12 }
    ],
    colorsel: false,
    auto1: 3,
    auto2: 7,
    auto3: 2,
    optauto1: [
      { text: "IT", value: 0 },
      { text: "Blade Runner", value: 2 },
      { text: "Thor Ragnarok", value: 3 }
    ],
    optauto2: [
      { text: "Square", value: 1 },
      { text: "Rectangle", value: 2 },
      { text: "Rombo", value: 3 },
      { text: "Romboid", value: 4 },
      { text: "Trapeze", value: 5 },
      { text: "Triangle", value: 6 },
      { text: "Polygon", value: 7 },
      { text: "Regular polygon", value: 8 },
      { text: "Circumference", value: 9 },
      { text: "Circle", value: 10 },
      { text: "Circular sector", value: 11 },
      { text: "Circular trapeze", value: 12 }
    ],
    optauto3: [
      { text: "Red", value: 1 },
      { text: "Green", value: 2 },
      { text: "Blue", value: 3 },
      { text: "Purple", value: 4 }
    ]
  })
};
</script>

