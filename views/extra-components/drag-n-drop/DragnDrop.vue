<template>
  <vs-row vs-justify="center">
    <vs-col type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-xs="12">
      <vs-card>
        <h3 class="card-title d-flex">Basic Drag & Drop</h3>
        <DragnDropBasic></DragnDropBasic>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Custom Drag n Drop</h3>
        <DragnDropCustom></DragnDropCustom>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Multiple Drag & Drop</h3>
        <DragnDropMultiple></DragnDropMultiple>
      </vs-card>
      <vs-card>
        <h3 class="card-title d-flex">Animation Drag & Drop</h3>
        <DragnDropAnimation></DragnDropAnimation>
      </vs-card>
    </vs-col>
  </vs-row>
</template>

<script>
import DragnDropAnimation from "./DragnDropAnimation";
import DragnDropBasic from "./DragnDropBasic";
import DragnDropMultiple from "./DragnDropMultiple";
import DragnDropCustom from "./DragnDropCustom";

export default {
  name: "DragnDrop",
  data: () => ({
    title: "DragnDrop"
  }),
  components: {
    DragnDropAnimation,
    DragnDropBasic,
    DragnDropMultiple,
    DragnDropCustom
  }
};
</script>
