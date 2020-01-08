<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <!--
        /////////////////
        Default Chips
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Default Chips
          <vs-button class="ml-auto p-0" @click="defaultchips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">Helps you represent simple data with colorful options.</p>
        <div class>
          <vs-chip>Basic Chip</vs-chip>
          <vs-chip>
            <vs-avatar text="LD" />Avatar Text
          </vs-chip>
          <vs-chip>
            <vs-avatar />Avatar Icon
          </vs-chip>
          <vs-chip>
            <vs-avatar src="https://randomuser.me/api/portraits/men/4.jpg" />Avatar Image
          </vs-chip>
          <vs-chip closable>Closable chip</vs-chip>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="defaultchips">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-chip&gt;
            Basic Chip
            &lt;/vs-chip&gt;
            &lt;vs-chip&gt;
            &lt;vs-avatar text=&quot;LD&quot;/&gt;
            Avatar Text
            &lt;/vs-chip&gt;
            &lt;vs-chip&gt;
            &lt;vs-avatar /&gt;
            Avatar Icon
            &lt;/vs-chip&gt;
            &lt;vs-chip&gt;
            &lt;vs-avatar src=&quot;https://randomuser.me/api/portraits/men/4.jpg&quot;/&gt;
            Avatar Image
            &lt;/vs-chip&gt;
            &lt;vs-chip closable&gt;
            Closable chip
            &lt;/vs-chip&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Color Chips
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Color Chips
          <vs-button class="ml-auto p-0" @click="colorchips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">Change the background color of the chip.</p>
        <div class>
          <vs-chip color="primary">Basic Chip</vs-chip>
          <vs-chip color="success">
            <vs-avatar text="LD" />Avatar Text
          </vs-chip>
          <vs-chip color="danger">
            <vs-avatar />Avatar Icon
          </vs-chip>
          <vs-chip color="warning">
            <vs-avatar src="https://randomuser.me/api/portraits/men/4.jpg" />Avatar Image
          </vs-chip>
          <vs-chip closable color="dark">Closable chip</vs-chip>
          <vs-chip closable color="#24c1a0" close-icon="close">
            <vs-avatar src="https://randomuser.me/api/portraits/men/16.jpg" />Closable chip
          </vs-chip>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="colorchips">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-chip color=&quot;primary&quot;&gt;
            Basic Chip
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;success&quot;&gt;
            &lt;vs-avatar text=&quot;LD&quot;/&gt;
            Avatar Text
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;danger&quot;&gt;
            &lt;vs-avatar /&gt;
            Avatar Icon
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;warning&quot;&gt;
            &lt;vs-avatar src=&quot;https://randomuser.me/api/portraits/men/4.jpg&quot;/&gt;
            Avatar Image
            &lt;/vs-chip &gt;
            &lt;vs-chip closable color=&quot;dark&quot;&gt;
            Closable chip
            &lt;/vs-chip&gt;
            &lt;vs-chip closable color=&quot;#24c1a0&quot; close-icon=&quot;close&quot;&gt;
            &lt;vs-avatar src=&quot;https://randomuser.me/api/portraits/men/16.jpg&quot;/&gt;
            Closable chip
            &lt;/vs-chip&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Icon Chips
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Icon Chips
          <vs-button class="ml-auto p-0" @click="iconchips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">Change the background color of the chip.</p>
        <div class>
          <vs-chip>
            <vs-avatar />Icon Default
          </vs-chip>
          <vs-chip color="primary">
            <vs-avatar icon="send" />Icon send
          </vs-chip>
          <vs-chip color="success">
            <vs-avatar icon="markunread" />Icon markunread
          </vs-chip>
          <vs-chip color="danger">
            <vs-avatar icon="link_off" />Icon link_off
          </vs-chip>
          <vs-chip color="warning">
            <vs-avatar icon="battery_alert" />Icon battery_alert
          </vs-chip>
          <vs-chip color="dark">
            <vs-avatar icon="edit" />Icon edit
          </vs-chip>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="iconchips">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-chip&gt;
            &lt;vs-avatar /&gt;
            Icon Default
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;primary&quot;&gt;
            &lt;vs-avatar icon=&quot;send&quot; /&gt;
            Icon send
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;success&quot;&gt;
            &lt;vs-avatar icon=&quot;markunread&quot; /&gt;
            Icon markunread
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;danger&quot;&gt;
            &lt;vs-avatar icon=&quot;link_off&quot; /&gt;
            Icon link_off
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;warning&quot;&gt;
            &lt;vs-avatar icon=&quot;battery_alert&quot; /&gt;
            Icon battery_alert
            &lt;/vs-chip&gt;
            &lt;vs-chip color=&quot;dark&quot;&gt;
            &lt;vs-avatar icon=&quot;edit&quot; /&gt;
            Icon edit
            &lt;/vs-chip&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Closable Chips
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Closable Chips
          <vs-button class="ml-auto p-0" @click="closablechips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">For making a chip closable.</p>
        <div class>
          <vs-button v-if="chips.length == 0" @click="reset" type="filled">Reset Chips</vs-button>
          <vs-chip @click="remove(chip)" :key="chip" v-for="chip in chips" closable>{{ chip }}</vs-chip>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="closablechips">
          <vs-prism>
            &lt;div class=&quot;&quot;&gt;
            &lt;vs-button v-if=&quot;chips.length == 0&quot; @click=&quot;reset&quot; type=&quot;filled&quot;&gt;Reset Chips&lt;/vs-button&gt;
            &lt;vs-chip @click=&quot;remove(chip)&quot; v-for=&quot;chip in chips&quot; closable&gt;
            {{ chip }}
            &lt;/vs-chip&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Add and Remove Items Chips
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Add and Remove Items
          <vs-button class="ml-auto p-0" @click="addremovechips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can add and remove chips with the
          <code>vs-chips</code> component. For the main parameter, pass the
          <code>items</code> property, which is an array representing each chip.
        </p>
        <div class="total">
          <div class="modelx p-2 shadow border-bottom border-primary mb-3">{{addchips}}</div>
          <vs-chips placeholder="New Element" v-model="addchips">
            <vs-chip
              :key="addchip"
              @click="addremove(addchip)"
              v-for="addchip in addchips"
              closable
            >{{ addchip }}</vs-chip>
          </vs-chips>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="addremovechips">
          <vs-prism>
            &lt;div class=&quot;modelx p-2 shadow border-bottom border-primary mb-3&quot;&gt;
            {{addchips}}
            &lt;/div&gt;
            &lt;vs-chips placeholder=&quot;New Element&quot; v-model=&quot;addchips&quot;&gt;
            &lt;vs-chip
            :key=&quot;addchip&quot;
            @click=&quot;addremove(addchip)&quot;
            v-for=&quot;addchip in addchips&quot; closable&gt;
            {{ addchip }}
            &lt;/vs-chip&gt;
            &lt;/vs-chips&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>

      <!--
        /////////////////
        Customize Close and Clear Chips Icons
        /////////////////
      -->
      <vs-card>
        <h3 class="card-title d-flex">
          With Customize Close and Clear Chips Icons
          <vs-button class="ml-auto p-0" @click="customiconchips=true" type="line">
            <vs-icon icon="code"></vs-icon>
          </vs-button>
        </h3>
        <p class="card-subtitle">
          You can change the icons used for the close button and the clear button when using multiple chips with the
          <code>vs-chips</code> component. For the main parameter, pass the
          <code>close-icon</code> property, which is the close icon that appears on each chip. You can change the Clear Chips button with the
          <code>remove-icon</code> property.
        </p>
        <div class="total">
          <div class="modelx p-2 shadow border-bottom border-primary mb-3">{{customchips}}</div>
          <vs-chips
            color="rgb(145, 32, 159)"
            placeholder="New Element"
            v-model="customchips"
            remove-icon="delete_forever"
          >
            <vs-chip
              :key="customchip"
              @click="remove(customchip)"
              v-for="customchip in customchips"
              closable
              close-icon="delete"
            >{{ customchip }}</vs-chip>
          </vs-chips>
        </div>
        <div class="clearfix"></div>
        <!-- Code -->
        <vs-popup class="holamundo" title="Code" :active.sync="customiconchips">
          <vs-prism>
            &lt;div class=&quot;total&quot;&gt;
            &lt;div class=&quot;modelx p-2 shadow border-bottom border-primary mb-3&quot;&gt;
            {{customchips}}
            &lt;/div&gt;
            &lt;vs-chips color=&quot;rgb(145, 32, 159)&quot; placeholder=&quot;New Element&quot; v-model=&quot;customchips&quot; remove-icon=&quot;delete_forever&quot;&gt;
            &lt;vs-chip
            :key=&quot;customchip&quot;
            @click=&quot;remove(customchip)&quot;
            v-for=&quot;customchip in customchips&quot; closable close-icon=&quot;delete&quot;&gt;
            {{ customchip }}
            &lt;/vs-chip&gt;
            &lt;/vs-chips&gt;
            &lt;/div&gt;
          </vs-prism>
        </vs-popup>
        <!-- Code -->
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  name: "checkbox",
  data: () => ({
    title: "Checkbox",
    defaultchips: false,
    colorchips: false,
    iconchips: false,
    closablechips: false,
    addremovechips: false,
    customiconchips: false,
    chip: [],
    addchip: [],
    customchip: [],
    chips: ["Dribbble", "GitHub", "Behance", "Vuejs", "Vuesax"],
    addchips: ["Dribbble", "GitHub", "Behance"],
    customchips: ["Behance", "Vuejs", "Vuesax"]
  }),
  methods: {
    reset() {
      this.chips = ["Dribbble", "GitHub", "Behance", "Vuejs", "Vuesax"];
      this.addchips = ["Dribbble", "GitHub", "Behance"];
      this.customchips = ["Behance", "Vuejs", "Vuesax"];
    },
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
    },
    addremove(additem) {
      this.addchips.splice(this.addchips.indexOf(additem), 1);
    },
    customremove(additem) {
      this.customchips.splice(this.customchips.indexOf(additem), 1);
    }
  }
};
</script>

<style lang="css">
.total {
  width: 100%;
}
</style>


